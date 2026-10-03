// A stand-in for the Python AI service, so the end-to-end tests need no model, no API key and no money. It speaks the same
// internal API (same paths, same JSON), but its "embeddings" are word-count vectors and its "answers" quote the best sentence
// of the first retrieved passage. Deterministic, instant, and good enough to exercise upload -> index -> ask -> cite.
import { createServer } from "node:http";
import { Readable } from "node:stream";

const PORT = Number(process.env.FAKE_AI_PORT ?? 8100);
const KEY = process.env.INTERNAL_API_KEY ?? "e2e-internal-key-123456";
const DIMENSIONS = 1536;

const words = (text) => text.toLowerCase().match(/[a-z0-9$]+/g) ?? [];
const usage = (input = 10, output = 5) => ({
  model: "fake-ai",
  input_tokens: Math.round(input),
  output_tokens: Math.round(output),
  latency_ms: 1,
});

/** FNV-1a hash of a word, mapped to a vector position: similar words in two texts give similar vectors. */
function embed(text) {
  const vector = new Array(DIMENSIONS).fill(0);
  for (const word of words(text)) {
    let hash = 2166136261;
    for (const ch of word)
      hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619) >>> 0;
    vector[hash % DIMENSIONS] += 1;
  }
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / norm);
}

function bestSentence(question, passage) {
  const wanted = new Set(words(question));
  const sentences = passage.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/);
  let best = sentences[0] ?? passage;
  let bestScore = -1;
  for (const sentence of sentences) {
    const score = words(sentence).filter((w) => wanted.has(w)).length;
    if (score > bestScore) [best, bestScore] = [sentence, score];
  }
  return best;
}

/** Splits a text file into paragraph chunks (headings stay with the paragraph that follows). */
function chunk(text) {
  const parts = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const chunks = [];
  let heading = null;
  for (const part of parts) {
    if (/^#{1,6}\s/.test(part)) {
      heading = part.replace(/^#+\s*/, "");
      continue;
    }
    chunks.push({
      index: chunks.length,
      content: heading ? `${heading}\n\n${part}` : part,
      page_number: null,
      heading,
      token_count: words(part).length + 2,
    });
  }
  return chunks.map((c) => ({ ...c, embedding: embed(c.content) }));
}

const readJson = async (req) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString() || "{}");
};
const send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  if (req.method === "GET" && url.pathname === "/health")
    return send(res, 200, { status: "ok" });
  if (req.headers["x-internal-key"] !== KEY)
    return send(res, 401, {
      error: {
        code: "UNAUTHORIZED",
        message: "Missing or invalid internal key.",
      },
    });
  try {
    if (url.pathname === "/embed") {
      const { texts } = await readJson(req);
      return send(res, 200, {
        embeddings: texts.map(embed),
        usage: usage(texts.join(" ").length / 4),
      });
    }
    if (url.pathname === "/ingest/file") {
      const form = await new Request("http://x", {
        method: "POST",
        headers: req.headers,
        body: Readable.toWeb(req),
        duplex: "half",
      }).formData();
      const text = Buffer.from(await form.get("file").arrayBuffer()).toString(
        "utf8",
      );
      const chunks = chunk(text);
      if (chunks.length === 0)
        return send(res, 422, {
          error: {
            code: "EMPTY_DOCUMENT",
            message: "This document has too little text to index.",
          },
        });
      return send(res, 200, {
        title: null,
        page_count: null,
        chunks,
        usage: usage(text.length / 4, 0),
      });
    }
    if (url.pathname === "/rewrite-query") {
      const { question } = await readJson(req);
      return send(res, 200, { query: question, usage: usage() });
    }
    if (url.pathname === "/title") {
      const { question } = await readJson(req);
      return send(res, 200, {
        title: question.split(/\s+/).slice(0, 6).join(" "),
        usage: usage(),
      });
    }
    if (url.pathname === "/answer") {
      const body = await readJson(req);
      const first = body.chunks?.[0]?.content;
      const text = first
        ? `${bestSentence(body.question, first)} [1]`
        : "I couldn't find that in your documents.";
      if (!body.stream)
        return send(res, 200, { answer: text, usage: usage(100, 20) });
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      });
      for (const word of text.split(/(?<= )/))
        res.write(`event: token\ndata: ${JSON.stringify({ text: word })}\n\n`);
      res.write(
        `event: done\ndata: ${JSON.stringify({ usage: usage(100, 20) })}\n\n`,
      );
      return res.end();
    }
    if (url.pathname === "/evals/judge")
      return send(res, 200, {
        correctness: 1,
        faithfulness: 1,
        reasoning: "fake judge",
        usage: usage(),
      });
    if (url.pathname === "/rerank") {
      const { passages, top_n } = await readJson(req);
      return send(res, 200, {
        ids: passages.slice(0, top_n).map((p) => p.id),
        usage: usage(),
      });
    }
    return send(res, 404, {
      error: {
        code: "NOT_FOUND",
        message: "No such route in the fake AI service.",
      },
    });
  } catch (error) {
    return send(res, 500, {
      error: { code: "INTERNAL_ERROR", message: String(error) },
    });
  }
}).listen(PORT, () => console.log(`[fake-ai] listening on :${PORT}`));
