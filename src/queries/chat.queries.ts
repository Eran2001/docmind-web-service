import { useCallback } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { FeedbackInput } from "@/schemas";
import type { Conversation, ConversationDetail, Message, User } from "@/types";

import { routes } from "@/configs/routes";
import { queryKeys } from "@/configs/query-keys";
import { getErrorMessage } from "@/lib/api/errors";
import { streamChat } from "@/lib/sse";
import { chatService } from "@/services/chat.service";
import { useChatStore } from "@/stores/chat.store";
import { useDemoStore } from "@/stores/demo.store";

const DEMO_QUESTIONS_USED_MESSAGE =
  "You've used your demo questions. Create a free account to keep chatting.";

export function useConversations(collectionId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.list(collectionId),
    queryFn: () => chatService.listConversations(collectionId),
  });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(id ?? ""),
    queryFn: () => chatService.getConversation(id as string),
    enabled: !!id,
  });
}

export function useSendFeedback(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      ...input
    }: FeedbackInput & { messageId: string }) =>
      chatService.sendFeedback(messageId, input),
    onSuccess: (feedback, { messageId }) => {
      qc.setQueryData<ConversationDetail>(
        queryKeys.conversations.detail(conversationId),
        (old) =>
          old
            ? {
                ...old,
                messages: old.messages.map((m) =>
                  m.id === messageId ? { ...m, feedback } : m,
                ),
              }
            : old,
      );
    },
  });
}

const approxTokens = (text: string) => Math.max(0, Math.round(text.length / 4));

// Appends the finished exchange to the cached conversation so the thread doesn't flicker
// between the stream ending and the refetch landing.
function appendExchange(
  qc: QueryClient,
  conversationId: string,
  question: string,
  ids: { userMessageId: string | null; assistantMessageId: string | null },
  assistant: Partial<Message> & { content: string },
): Message {
  const createdAt = new Date().toISOString();
  const base = {
    conversationId,
    citations: [],
    status: "complete" as const,
    latencyMs: null,
    usage: null,
    feedback: null,
    createdAt,
  };
  const userMsg: Message = {
    ...base,
    id: ids.userMessageId ?? `local-u-${Date.now()}`,
    role: "user",
    content: question,
  };
  const assistantMsg: Message = {
    ...base,
    id: ids.assistantMessageId ?? `local-a-${Date.now()}`,
    role: "assistant",
    ...assistant,
  };
  qc.setQueryData<ConversationDetail>(
    queryKeys.conversations.detail(conversationId),
    (old) =>
      old
        ? { ...old, messages: [...old.messages, userMsg, assistantMsg] }
        : old,
  );
  return assistantMsg;
}

// Runs the SSE stream; state lives in chat.store so it survives the view remounting.
export function useSendMessage(collectionId: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useCallback(
    async (content: string, conversationId?: string) => {
      const chat = useChatStore.getState();
      const question = content.trim();
      if (!question || chat.streaming) return;
      // A demo visitor with no questions left: say so right away instead of calling the API.
      if (qc.getQueryData<User>(queryKeys.auth.me)?.demo?.questionsLeft === 0) {
        useDemoStore.getState().showLimit(DEMO_QUESTIONS_USED_MESSAGE);
        return;
      }

      const controller = new AbortController();
      chat.start({
        conversationId: conversationId ?? "",
        question,
        controller,
      });
      let convId = conversationId;
      let finished = false;

      try {
        if (!convId) {
          const conv = await chatService.createConversation(collectionId);
          convId = conv.id;
          qc.setQueryData<Conversation[]>(
            queryKeys.conversations.list(collectionId),
            (old) => [conv, ...(old ?? [])],
          );
          qc.setQueryData<ConversationDetail>(
            queryKeys.conversations.detail(conv.id),
            { ...conv, messages: [] },
          );
          useChatStore.setState((s) =>
            s.streaming
              ? { streaming: { ...s.streaming, conversationId: conv.id } }
              : s,
          );
          router.replace(routes.chat(collectionId, conv.id));
        }
        const activeId = convId;

        await streamChat({
          conversationId: activeId,
          content: question,
          signal: controller.signal,
          onEvent: (e) => {
            const s = useChatStore.getState();
            switch (e.event) {
              case "meta":
                s.setMeta(e.data.userMessageId, e.data.assistantMessageId);
                break;
              case "status":
                s.setPhase(e.data.stage);
                break;
              case "token":
                s.appendToken(e.data.text);
                break;
              case "done": {
                finished = true;
                const streaming = s.streaming;
                appendExchange(
                  qc,
                  activeId,
                  question,
                  streaming ?? {
                    userMessageId: null,
                    assistantMessageId: null,
                  },
                  {
                    content: streaming?.text ?? "",
                    citations: e.data.citations,
                    usage: e.data.usage,
                    latencyMs: e.data.latencyMs,
                    retrieval: e.data.retrieval ?? null,
                  },
                );
                s.clear();
                break;
              }
              case "error":
                finished = true;
                s.clear();
                toast.error("Something went wrong", {
                  description: e.data.message,
                });
                break;
            }
          },
        });
      } catch (err) {
        // A demo limit already opened its own dialog; everything else is a toast.
        if (
          !controller.signal.aborted &&
          (err as { code?: string }).code !== "DemoLimitReached"
        ) {
          finished = true;
          toast.error("Something went wrong", {
            description: getErrorMessage(err),
          });
        } else if (!controller.signal.aborted) {
          finished = true;
        }
      }

      const streaming = useChatStore.getState().streaming;
      if (!finished && streaming && convId && streaming.assistantMessageId) {
        const msg = appendExchange(qc, convId, question, streaming, {
          content: streaming.text,
        });
        useChatStore
          .getState()
          .markStopped(msg.id, approxTokens(streaming.text));
      }
      useChatStore.getState().clear();

      if (convId) {
        void qc.invalidateQueries({
          queryKey: queryKeys.conversations.detail(convId),
        });
        void qc.invalidateQueries({
          queryKey: queryKeys.conversations.list(collectionId),
        });
      }
      void qc.invalidateQueries({ queryKey: queryKeys.usage.all });
      void qc.invalidateQueries({ queryKey: queryKeys.auth.me }); // demo visitors: questions left
    },
    [collectionId, qc, router],
  );
}
