import type { SseEvent, SseEventName } from "@/types";

import { env } from "@/configs/env";
import { ApiError, normalizeError, refreshSession } from "@/lib/axios";

export interface StreamChatArgs {
  conversationId: string;
  content: string;
  signal: AbortSignal;
  onEvent: (event: SseEvent) => void;
}

const EVENT_NAMES: readonly SseEventName[] = [
  "meta",
  "status",
  "token",
  "done",
  "error",
];

function isEventName(v: string): v is SseEventName {
  return (EVENT_NAMES as readonly string[]).includes(v);
}

// Parses one "event: x\ndata: {...}" frame; returns null for comments/unknown events.
export function parseSseFrame(frame: string): SseEvent | null {
  let name = "message";
  const data: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) name = line.slice(6).trim();
    else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
  }
  if (!isEventName(name) || data.length === 0) return null;
  try {
    return { event: name, data: JSON.parse(data.join("\n")) } as SseEvent;
  } catch {
    return null;
  }
}

// fetch + ReadableStream because the endpoint is a POST (EventSource can't do that).
export async function streamChat(args: StreamChatArgs): Promise<void> {
  if (env.NEXT_PUBLIC_USE_MOCKS) {
    const { mockChatStream } = await import("@/lib/mock/chat-stream");
    return mockChatStream(args);
  }

  const { conversationId, content, signal, onEvent } = args;
  const url = `${env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/messages`;
  const request = () =>
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ content }),
      signal,
    });

  let res = await request();
  if (res.status === 401) {
    await refreshSession();
    res = await request();
  }
  if (!res.ok || !res.body) {
    const body = (await res.json().catch(() => null)) as {
      error?: { code?: string; message?: string };
    } | null;
    throw new ApiError(
      body?.error?.code ?? "INTERNAL_ERROR",
      body?.error?.message ?? "Couldn't send your message.",
      res.status,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const parsed = parseSseFrame(buffer.slice(0, idx));
        buffer = buffer.slice(idx + 2);
        if (parsed) onEvent(parsed);
      }
    }
  } catch (err) {
    throw normalizeError(err);
  }
}
