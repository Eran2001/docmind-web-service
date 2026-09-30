import type { Citation, MessageRetrieval, MessageUsage } from "./types";

// Node -> browser events for POST /conversations/:id/messages (spec 8.3).
export type SseEvent =
  | {
      event: "meta";
      data: { userMessageId: string; assistantMessageId: string };
    }
  | { event: "status"; data: { stage: "searching" | "generating" } }
  | { event: "token"; data: { text: string } }
  | {
      event: "done";
      data: {
        citations: Citation[];
        usage: MessageUsage;
        latencyMs: number;
        retrieval?: MessageRetrieval;
      };
    }
  | { event: "error"; data: { code: string; message: string } };

export type SseEventName = SseEvent["event"];
