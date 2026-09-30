import type { SseEvent } from "@/types";
import type { Citation } from "@/types";

import {
  ANSWERS,
  CHUNKS,
  HANDBOOK_COLLECTION_ID,
  pickAnswerKey,
} from "@/lib/mock/answers";
import { docTitle, getDb, resolveDocument, saveDb, uid } from "@/lib/mock/db";
import { ApiError } from "@/lib/api/errors";
import type { StreamChatArgs } from "@/lib/sse";

const SEARCH_MS = 1300;
const TOKEN_MS = 32;
const TOKENS_PER_TICK = 3;

function abortError() {
  return new DOMException("Aborted", "AbortError");
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(abortError());
    const t = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(abortError());
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

interface BuiltAnswer {
  content: string;
  citations: Citation[];
  tokens: number;
  costUsd: number;
  latencyMs: number;
  passages: number;
  documents: number;
}

function buildAnswer(collectionId: string, question: string): BuiltAnswer {
  const db = getDb();
  const ready = db.documents
    .map((d) => resolveDocument(d))
    .filter((d) => d.collectionId === collectionId && d.status === "ready");

  if (collectionId === HANDBOOK_COLLECTION_ID) {
    const seed = ANSWERS[pickAnswerKey(question)] ?? ANSWERS.fallback;
    if (seed) {
      return {
        content: seed.content,
        citations: seed.cites.map((key, i) => {
          const c = CHUNKS[key];
          return {
            marker: i + 1,
            chunkId: key,
            documentId: c?.docId ?? "",
            documentTitle: docTitle(c?.docId),
            pageNumber: c?.page ?? null,
            snippet: (c?.hl ?? "").slice(0, 240),
            score: c?.score,
          };
        }),
        tokens: seed.tokens,
        costUsd: seed.costUsd,
        latencyMs: seed.latencyMs,
        passages: seed.passages,
        documents: ready.length,
      };
    }
  }

  const source = ready[0];
  const topic = question.length > 80 ? `${question.slice(0, 77)}…` : question;
  return {
    content: `Here's what the collection says about “${topic}”. This is a mocked answer, so it isn't drawn from your file's text [1].`,
    citations: source
      ? [
          {
            marker: 1,
            chunkId: `gen-${source.resourceId}`,
            documentId: source.resourceId,
            documentTitle: source.title,
            pageNumber: source.pageCount ? 1 : null,
            snippet: "Mock passage generated for the demo.",
            score: 0.71,
          },
        ]
      : [],
    tokens: 640,
    costUsd: 0.0021,
    latencyMs: 1500,
    passages: 1,
    documents: ready.length,
  };
}

export async function mockChatStream({
  conversationId,
  content,
  signal,
  onEvent,
}: StreamChatArgs): Promise<void> {
  const db = getDb();
  const conv = db.conversations.find((c) => c.id === conversationId);
  if (!conv) throw new ApiError("NOT_FOUND", "Conversation not found.", 404);

  const userMessageId = uid("msg");
  const assistantMessageId = uid("msg");
  const answer = buildAnswer(conv.collectionId, content);
  const emit = (e: SseEvent) => onEvent(e);

  const persist = (text: string, complete: boolean) => {
    const now = new Date().toISOString();
    const base = { conversationId, feedback: null, createdAt: now };
    db.messages.push({
      ...base,
      id: userMessageId,
      role: "user",
      content,
      citations: [],
      status: "complete",
      latencyMs: null,
      usage: null,
    });
    db.messages.push({
      ...base,
      id: assistantMessageId,
      role: "assistant",
      content: text,
      citations: complete ? answer.citations : [],
      status: "complete",
      latencyMs: complete ? answer.latencyMs : null,
      usage: complete
        ? {
            inputTokens: Math.round(answer.tokens * 0.82),
            outputTokens: Math.round(answer.tokens * 0.18),
            costUsd: answer.costUsd,
          }
        : null,
      retrieval: complete
        ? { documents: answer.documents, passages: answer.passages }
        : null,
    });
    if (conv.title === "New chat")
      conv.title =
        content.length > 42 ? `${content.slice(0, 40).trim()}…` : content;
    conv.updatedAt = now;
    saveDb();
  };

  emit({ event: "meta", data: { userMessageId, assistantMessageId } });
  emit({ event: "status", data: { stage: "searching" } });

  let sent = "";
  try {
    await wait(SEARCH_MS, signal);
    emit({ event: "status", data: { stage: "generating" } });
    for (let i = 0; i < answer.content.length; i += TOKENS_PER_TICK) {
      await wait(TOKEN_MS, signal);
      const text = answer.content.slice(i, i + TOKENS_PER_TICK);
      sent += text;
      emit({ event: "token", data: { text } });
    }
  } catch (err) {
    if (signal.aborted) persist(sent, false);
    throw err;
  }

  persist(answer.content, true);
  emit({
    event: "done",
    data: {
      citations: answer.citations,
      usage: {
        inputTokens: Math.round(answer.tokens * 0.82),
        outputTokens: Math.round(answer.tokens * 0.18),
        costUsd: answer.costUsd,
      },
      latencyMs: answer.latencyMs,
      retrieval: { documents: answer.documents, passages: answer.passages },
    },
  });
}
