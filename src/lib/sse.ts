import type { SseEvent, SseEventName } from "@/types";

import { env } from "@/configs/env";
import { reportDemoLimit } from "@/lib/api/demo-limit";
import { ApiError, normalizeError } from "@/lib/api/errors";
import { refreshSession } from "@/lib/api/refresh";
import {
  endSession,
  getAccessToken,
  hasStoredSession,
} from "@/lib/api/session";

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
  const path = `/conversations/${args.conversationId}/messages`;
  const { content, signal, onEvent } = args;
  const url = `${env.NEXT_PUBLIC_API_URL}${path}`;
  const request = () =>
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(getAccessToken()
          ? { Authorization: `Bearer ${getAccessToken()}` }
          : {}),
      },
      body: JSON.stringify({ content }),
      signal,
    });

  if (!getAccessToken() && hasStoredSession())
    await refreshSession().catch(() => undefined);
  let res = await request();
  if (res.status === 401) {
    // Expired mid-flight: renew once and repeat the request; if that fails the session is over.
    const renewed = await refreshSession().then(
      () => true,
      () => false,
    );
    if (renewed) res = await request();
  }
  if (res.status === 401) endSession();
  if (!res.ok || !res.body) {
    // Failure envelope: { code, error, message, ... }
    const body = (await res.json().catch(() => null)) as {
      code?: string;
      message?: string;
    } | null;
    const failure = new ApiError(
      body?.code ?? "InternalError",
      body?.message ?? "Couldn't send your message.",
      res.status,
    );
    reportDemoLimit(failure);
    throw failure;
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
