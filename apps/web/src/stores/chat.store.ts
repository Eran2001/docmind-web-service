import { create } from "zustand";

export type StreamPhase = "searching" | "generating";

export interface StreamingState {
  conversationId: string;
  question: string;
  userMessageId: string | null;
  assistantMessageId: string | null;
  phase: StreamPhase;
  text: string;
  controller: AbortController;
}

interface ChatState {
  streaming: StreamingState | null;
  // Assistant messages the user stopped mid-stream, with the token count shown in the footer.
  stopped: Record<string, number>;
  start: (
    s: Pick<StreamingState, "conversationId" | "question" | "controller">,
  ) => void;
  setMeta: (userMessageId: string, assistantMessageId: string) => void;
  setPhase: (phase: StreamPhase) => void;
  appendToken: (text: string) => void;
  markStopped: (messageId: string, tokens: number) => void;
  clear: () => void;
  stop: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  streaming: null,
  stopped: {},
  start: (s) =>
    set({
      streaming: {
        ...s,
        userMessageId: null,
        assistantMessageId: null,
        phase: "searching",
        text: "",
      },
    }),
  setMeta: (userMessageId, assistantMessageId) =>
    set((st) =>
      st.streaming
        ? { streaming: { ...st.streaming, userMessageId, assistantMessageId } }
        : st,
    ),
  setPhase: (phase) =>
    set((st) =>
      st.streaming ? { streaming: { ...st.streaming, phase } } : st,
    ),
  appendToken: (text) =>
    set((st) =>
      st.streaming
        ? { streaming: { ...st.streaming, text: st.streaming.text + text } }
        : st,
    ),
  markStopped: (messageId, tokens) =>
    set((st) => ({ stopped: { ...st.stopped, [messageId]: tokens } })),
  clear: () => set({ streaming: null }),
  stop: () => get().streaming?.controller.abort(),
}));
