import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SseEvent } from "@/types";

const session = vi.hoisted(() => ({
  getAccessToken: vi.fn<() => string | null>(),
  hasStoredSession: vi.fn<() => boolean>(),
  endSession: vi.fn(),
}));
const refresh = vi.hoisted(() => ({ refreshSession: vi.fn() }));
vi.mock("@/lib/api/session", () => session);
vi.mock("@/lib/api/refresh", () => refresh);

import { ApiError } from "@/lib/api/errors";
import { parseSseFrame, streamChat } from "@/lib/sse";
import { useDemoStore } from "@/stores/demo.store";

describe("parseSseFrame", () => {
  it("reads the event name and its JSON data", () => {
    expect(parseSseFrame('event: token\ndata: {"text":"Hel"}')).toEqual({
      event: "token",
      data: { text: "Hel" },
    });
  });

  it("joins data split over several lines before parsing", () => {
    expect(
      parseSseFrame('event: status\ndata: {"stage":\ndata: "searching"}'),
    ).toEqual({ event: "status", data: { stage: "searching" } });
  });

  it("accepts data without a space after the colon", () => {
    expect(parseSseFrame('event: meta\ndata:{"userMessageId":"u"}')).toEqual({
      event: "meta",
      data: { userMessageId: "u" },
    });
  });

  it("ignores comments, unknown events, frames without data, and broken JSON", () => {
    expect(parseSseFrame(": keep-alive")).toBeNull();
    expect(parseSseFrame('event: banana\ndata: {"a":1}')).toBeNull();
    expect(parseSseFrame("event: token")).toBeNull();
    expect(parseSseFrame("event: token\ndata: {oops")).toBeNull();
  });
});

const encoder = new TextEncoder();

/** A fetch Response whose body arrives in the given pieces, like a real network stream. */
function streamResponse(
  pieces: string[],
  init: ResponseInit = { status: 200 },
) {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const piece of pieces) controller.enqueue(encoder.encode(piece));
      controller.close();
    },
  });
  return new Response(body, init);
}

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function collect(args: Partial<Parameters<typeof streamChat>[0]> = {}) {
  const events: SseEvent[] = [];
  await streamChat({
    conversationId: "conv-1",
    content: "hello",
    signal: new AbortController().signal,
    onEvent: (e) => events.push(e),
    ...args,
  });
  return events;
}

describe("streamChat", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    session.getAccessToken.mockReturnValue("token-abc");
    session.hasStoredSession.mockReturnValue(true);
    useDemoStore.getState().closeLimit();
  });

  it("posts the message with the access token and cookies", async () => {
    fetchMock.mockResolvedValue(streamResponse([]));

    await collect({ content: "What is PTO?" });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/conversations\/conv-1\/messages$/);
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("include");
    expect(init.body).toBe(JSON.stringify({ content: "What is PTO?" }));
    expect(init.headers).toMatchObject({
      Authorization: "Bearer token-abc",
      Accept: "text/event-stream",
    });
  });

  it("delivers events in order, even when a frame is cut across network chunks and uses CRLF", async () => {
    fetchMock.mockResolvedValue(
      streamResponse([
        'event: meta\r\ndata: {"userMessageId":"u1","assistantMessageId":"a1"}\r\n\r\nevent: tok',
        'en\r\ndata: {"text":"Hel"}\r\n\r\nevent: token\r\ndata: {"text":"lo"}\r\n\r\n',
        'event: done\ndata: {"citations":[],"usage":{"inputTokens":1,"outputTokens":2,"costUsd":0},"latencyMs":5}\n\n',
      ]),
    );

    const events = await collect();

    expect(events.map((e) => e.event)).toEqual([
      "meta",
      "token",
      "token",
      "done",
    ]);
    expect(
      events
        .filter((e) => e.event === "token")
        .map((e) => (e.data as { text: string }).text)
        .join(""),
    ).toBe("Hello");
  });

  it("turns an error response into an ApiError with the API's code and message", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ code: "RateLimited", message: "Slow down." }, 429),
    );

    const failure = await collect().catch((e: unknown) => e);

    expect(failure).toBeInstanceOf(ApiError);
    expect(failure).toMatchObject({
      code: "RateLimited",
      message: "Slow down.",
      status: 429,
    });
  });

  it("opens the demo-limit dialog when the API says the demo is used up", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { code: "DemoLimitReached", message: "Demo questions used." },
        403,
      ),
    );

    await collect().catch(() => undefined);

    expect(useDemoStore.getState().limitMessage).toBe("Demo questions used.");
  });

  it("renews an expired token once and repeats the request", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        streamResponse(['event: token\ndata: {"text":"ok"}\n\n']),
      );
    refresh.refreshSession.mockResolvedValue(undefined);

    const events = await collect();

    expect(refresh.refreshSession).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(events).toHaveLength(1);
    expect(session.endSession).not.toHaveBeenCalled();
  });

  it("ends the session when the token cannot be renewed", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ code: "Unauthorized", message: "Session expired." }, 401),
    );
    refresh.refreshSession.mockRejectedValue(new Error("refresh refused"));

    const failure = await collect().catch((e: unknown) => e);

    expect(session.endSession).toHaveBeenCalledTimes(1);
    expect(failure).toMatchObject({ code: "Unauthorized", status: 401 });
  });

  it("falls back to a generic error when the failure body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("Bad gateway", { status: 502 }));

    const failure = await collect().catch((e: unknown) => e);

    expect(failure).toMatchObject({
      code: "InternalError",
      message: "Couldn't send your message.",
      status: 502,
    });
  });
});
