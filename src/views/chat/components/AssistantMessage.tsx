"use client";

import { CircleStop, Search } from "lucide-react";
import type { Message } from "@/types";

import { Spinner } from "@/components/common/Spinner";
import { cn } from "@/lib/utils";
import type { StreamPhase } from "@/stores/chat.store";
import { pageLabel } from "@/utils/documents";
import { usedMarkers } from "@/utils/citations";
import { MarkdownContent } from "@/views/chat/components/Markdown";
import { MessageActions } from "@/views/chat/components/MessageActions";

export function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex animate-dmin justify-end">
      <div className="max-w-[min(560px,85%)] rounded-[20px] bg-secondary px-4 py-2.5 text-[15px] leading-[1.55] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

interface Props {
  message: Message;
  conversationId: string;
  activeMarker: number | null;
  stoppedTokens?: number;
  live?: { phase: StreamPhase };
  onCite: (messageId: string, marker: number) => void;
}

export function AssistantMessage({
  message,
  conversationId,
  activeMarker,
  stoppedTokens,
  live,
  onCite,
}: Props) {
  const streaming = !!live;
  const searching = live?.phase === "searching";
  const writing = live?.phase === "generating" && !message.content;
  const stopped = stoppedTokens !== undefined;
  const sources = streaming
    ? []
    : usedMarkers(message.content, message.citations);

  return (
    <article className="flex flex-col gap-3">
      {(searching || writing) && (
        <div
          role="status"
          className="flex h-[26px] items-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner className="size-[15px]" />
          {searching ? "Searching your documents…" : "Writing answer…"}
        </div>
      )}

      {!streaming && message.retrieval && (
        <div className="flex items-center gap-1.5 text-xs text-faint">
          <Search className="size-3" />
          Searched {message.retrieval.documents} documents ·{" "}
          {message.retrieval.passages} passages
        </div>
      )}

      {!searching && !writing && (
        <MarkdownContent
          content={message.content}
          citations={message.citations}
          streaming={streaming}
          activeMarker={activeMarker}
          onCite={(marker) => onCite(message.id, marker)}
        />
      )}

      {stopped && !streaming && (
        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <CircleStop className="size-3.5" />
          Response stopped
        </div>
      )}

      {sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sources.map((c) => (
            <button
              key={c.marker}
              onClick={() => onCite(message.id, c.marker)}
              className={cn(
                "inline-flex h-7 max-w-full items-center gap-1.5 rounded-full border bg-background pr-2.5 pl-[5px] text-xs hover:bg-secondary",
                activeMarker === c.marker && "border-accent-bd",
              )}
            >
              <span className="inline-grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-bg px-[5px] font-mono text-[11px] font-semibold text-link">
                {c.marker}
              </span>
              <span className="max-w-[220px] truncate text-fg2">
                {c.documentTitle}
              </span>
              <span className="whitespace-nowrap text-faint">
                {pageLabel(c)}
              </span>
            </button>
          ))}
        </div>
      )}

      {!streaming && (
        <MessageActions
          message={message}
          conversationId={conversationId}
          stoppedTokens={stoppedTokens}
        />
      )}
    </article>
  );
}
