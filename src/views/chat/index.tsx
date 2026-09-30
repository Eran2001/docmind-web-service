"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { History, MessageSquareOff, PanelRight } from "lucide-react";
import type { Message } from "@/types";

import { EmptyState } from "@/components/common/EmptyState";
import { Bone } from "@/components/common/Skeletons";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { routes } from "@/configs/routes";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useElementWidth } from "@/hooks/useElementWidth";
import { cn } from "@/lib/utils";
import {
  useConversation,
  useConversations,
  useSendMessage,
} from "@/queries/chat.queries";
import { useCollection } from "@/queries/collections.queries";
import { useDocuments } from "@/queries/documents.queries";
import { useChatStore } from "@/stores/chat.store";
import { useCitationStore } from "@/stores/citation.store";
import {
  AssistantMessage,
  UserMessage,
} from "@/views/chat/components/AssistantMessage";
import { ChatEmpty } from "@/views/chat/components/ChatEmpty";
import { CitationPanel } from "@/views/chat/components/CitationPanel";
import { Composer } from "@/views/chat/components/Composer";
import { ConversationList } from "@/views/chat/components/ConversationList";

const LEFT_INLINE_MIN = 860;
const PANEL_INLINE_MIN = 1020;

interface Props {
  collectionId: string;
  conversationId?: string;
}

export function ChatView({ collectionId, conversationId }: Props) {
  const [rootRef, width] = useElementWidth<HTMLDivElement>();
  const w = width ?? 1280;
  const leftInline = w >= LEFT_INLINE_MIN;
  const panelInline = w >= PANEL_INLINE_MIN;

  const collection = useCollection(collectionId);
  const documents = useDocuments(collectionId);
  const conversations = useConversations(collectionId);
  const conversation = useConversation(conversationId);
  const send = useSendMessage(collectionId);

  const streaming = useChatStore((s) => s.streaming);
  const stopped = useChatStore((s) => s.stopped);
  const stop = useChatStore((s) => s.stop);
  const selected = useCitationStore((s) => s.selected);
  const panelOpenPref = useCitationStore((s) => s.panelOpen);
  const [leftOpen, setLeftOpen] = useState(false);

  const panelOpen = panelOpenPref ?? panelInline;
  const messages: Message[] = useMemo(
    () => conversation.data?.messages ?? [],
    [conversation.data?.messages],
  );
  const showPending =
    !!streaming &&
    (!conversationId ||
      streaming.conversationId === conversationId ||
      streaming.conversationId === "");

  const {
    ref: scrollRef,
    onScroll,
    scrollToBottom,
  } = useAutoScroll<HTMLDivElement>([
    messages.length,
    showPending ? streaming?.text : null,
    showPending ? streaming?.phase : null,
  ]);

  useEffect(() => {
    scrollToBottom(true);
    const t = setTimeout(() => scrollToBottom(true), 80);
    return () => clearTimeout(t);
  }, [conversationId, conversation.data?.id, scrollToBottom]);

  // Keep the source panel pointing at a message from the open conversation.
  useEffect(() => {
    const { selected: current } = useCitationStore.getState();
    if (!conversationId) {
      if (current) useCitationStore.getState().reset();
      return;
    }
    if (
      !conversation.data ||
      (current && messages.some((m) => m.id === current.messageId))
    )
      return;
    const first = messages.find(
      (m) => m.role === "assistant" && m.citations.length > 0,
    );
    useCitationStore.setState({
      selected: first?.citations[0]
        ? { messageId: first.id, marker: first.citations[0].marker }
        : null,
    });
  }, [conversationId, conversation.data, messages]);

  const selectCitation = useCallback((messageId: string, marker: number) => {
    setLeftOpen(false);
    useCitationStore.getState().select(messageId, marker);
  }, []);

  const handleSend = (text: string) => {
    scrollToBottom(true);
    void send(text, conversationId);
  };

  const selectedMessage = selected
    ? messages.find((m) => m.id === selected.messageId)
    : undefined;
  const selectedCitation =
    selectedMessage?.citations.find((c) => c.marker === selected?.marker) ??
    null;

  const name = collection.data?.name ?? "this collection";
  const readyDocuments =
    documents.data?.filter((d) => d.status === "ready").length ?? 0;
  const noReady = documents.isSuccess && readyDocuments === 0;
  const isEmpty =
    !showPending &&
    (conversationId ? conversation.isSuccess && messages.length === 0 : true);
  const threadLoading = !!conversationId && conversation.isPending;
  const notFound = !!conversationId && conversation.isError;
  const title = conversationId
    ? (conversation.data?.title ?? "Chat")
    : "New chat";

  const crumbs = [
    ...(w >= 640 ? [{ label: "Collections", href: routes.collections }] : []),
    ...(w >= 520
      ? [
          {
            label: collection.data?.name ?? "…",
            href: routes.collection(collectionId),
          },
        ]
      : []),
    { label: title },
  ];

  const list = (onNavigate?: () => void, onClose?: () => void) => (
    <ConversationList
      collectionId={collectionId}
      conversations={conversations.data}
      loading={conversations.isPending}
      activeId={conversationId}
      onNavigate={onNavigate}
      onClose={onClose}
    />
  );

  const panel = (
    <CitationPanel
      collectionId={collectionId}
      citation={selectedCitation}
      citations={selectedMessage?.citations ?? []}
      onSelect={(marker) =>
        selected && selectCitation(selected.messageId, marker)
      }
      onClose={() => useCitationStore.getState().closePanel()}
    />
  );

  return (
    <div
      ref={rootRef}
      className="flex h-dvh flex-col overflow-hidden bg-background"
    >
      <PageHeader
        sticky={false}
        className="gap-2"
        crumbs={crumbs}
        actions={
          <>
            {!leftInline && (
              <button
                onClick={() => setLeftOpen(true)}
                aria-label="Conversations"
                className="grid size-8 flex-none place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <History className="size-4" />
              </button>
            )}
            <button
              onClick={() => useCitationStore.getState().togglePanel(panelOpen)}
              aria-pressed={panelOpen}
              className={cn(
                "inline-flex h-8 flex-none items-center gap-1.5 rounded-full border pr-3 pl-2.5 text-[13px] font-medium hover:bg-secondary",
                panelOpen
                  ? "bg-secondary text-foreground"
                  : "bg-background text-muted-foreground",
              )}
            >
              <PanelRight className="size-[15px]" />
              {w >= 520 && "Sources"}
            </button>
          </>
        }
      />

      <div className="relative flex min-h-0 flex-1">
        {leftInline && (
          <aside
            aria-label="Conversations"
            className="w-[248px] flex-none border-r"
          >
            {list()}
          </aside>
        )}

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            {threadLoading && (
              <div className="mx-auto flex max-w-[760px] animate-dmpulse flex-col gap-7 px-6 py-8">
                <Bone className="h-10 w-[52%] self-end rounded-[18px]" />
                <div className="flex flex-col gap-2.5">
                  <Bone className="h-3 w-[96%]" />
                  <Bone className="h-3 w-[88%]" />
                  <Bone className="h-3 w-[92%]" />
                  <Bone className="h-3 w-2/5" />
                </div>
                <Bone className="h-10 w-[38%] self-end rounded-[18px]" />
              </div>
            )}

            {notFound && (
              <EmptyState
                icon={MessageSquareOff}
                title="Conversation not found"
                description="It may have been deleted."
                dashed={false}
                className="min-h-full justify-center"
                action={
                  <Button asChild size="lg">
                    <Link href={routes.chat(collectionId)}>
                      Start a new chat
                    </Link>
                  </Button>
                }
              />
            )}

            {isEmpty && !threadLoading && !notFound && (
              <ChatEmpty
                collectionId={collectionId}
                collectionName={name}
                readyDocuments={documents.isPending ? 1 : readyDocuments}
                onAsk={handleSend}
              />
            )}

            {(messages.length > 0 || showPending) && (
              <div className="mx-auto flex max-w-[760px] flex-col gap-8 px-[clamp(16px,3vw,24px)] pt-8 pb-6">
                {messages.map((m) =>
                  m.role === "user" ? (
                    <UserMessage key={m.id} text={m.content} />
                  ) : (
                    <AssistantMessage
                      key={m.id}
                      message={m}
                      conversationId={conversationId ?? m.conversationId}
                      activeMarker={
                        selected?.messageId === m.id ? selected.marker : null
                      }
                      stoppedTokens={stopped[m.id]}
                      onCite={selectCitation}
                    />
                  ),
                )}
                {showPending && streaming && (
                  <>
                    <UserMessage text={streaming.question} />
                    <AssistantMessage
                      message={{
                        id: streaming.assistantMessageId ?? "pending",
                        conversationId: streaming.conversationId,
                        role: "assistant",
                        content: streaming.text,
                        citations: [],
                        status: "streaming",
                        latencyMs: null,
                        usage: null,
                        feedback: null,
                        createdAt: "",
                      }}
                      conversationId={streaming.conversationId}
                      activeMarker={null}
                      live={{ phase: streaming.phase }}
                      onCite={selectCitation}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          <Composer
            streaming={!!streaming}
            disabled={noReady || threadLoading || notFound}
            placeholder={
              noReady
                ? "Upload a document to start chatting"
                : w >= 520
                  ? `Ask anything about ${name}…`
                  : "Ask about this collection…"
            }
            onSend={handleSend}
            onStop={stop}
          />
        </section>

        {panelInline && panelOpen && (
          <aside aria-label="Source" className="w-80 flex-none border-l">
            {panel}
          </aside>
        )}
      </div>

      {!leftInline && (
        <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-[min(300px,86vw)] gap-0 p-0"
          >
            <SheetTitle className="sr-only">Conversations</SheetTitle>
            <SheetDescription className="sr-only">
              Previous conversations in this collection
            </SheetDescription>
            {list(
              () => setLeftOpen(false),
              () => setLeftOpen(false),
            )}
          </SheetContent>
        </Sheet>
      )}

      {!panelInline && (
        <Sheet
          open={panelOpen}
          onOpenChange={(open) =>
            !open && useCitationStore.getState().closePanel()
          }
        >
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-[min(380px,100vw)] gap-0 p-0 sm:max-w-[380px]"
          >
            <SheetTitle className="sr-only">Source</SheetTitle>
            <SheetDescription className="sr-only">
              The passage a citation came from
            </SheetDescription>
            {panel}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
