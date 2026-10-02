"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CHAT_SUGGESTIONS } from "@/configs/constants";
import { routes } from "@/configs/routes";

interface Props {
  collectionId: string;
  collectionName: string;
  readyDocuments: number;
  onAsk: (question: string) => void;
}

export function ChatEmpty({
  collectionId,
  collectionName,
  readyDocuments,
  onAsk,
}: Props) {
  if (readyDocuments === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-5 py-12 text-center">
        <div className="grid size-10 place-items-center rounded-full border text-fg2">
          <FileText className="size-[18px]" />
        </div>
        <h2 className="mt-4 mb-0 text-[22px] font-semibold tracking-[-0.025em]">
          Upload a document to start chatting
        </h2>
        <p className="mt-1.5 mb-5 max-w-[420px] text-pretty text-muted-foreground">
          There are no processed documents in {collectionName} yet. Answers are
          drawn from documents once they finish processing.
        </p>
        <Button asChild size="lg">
          <Link href={routes.collection(collectionId)}>Go to documents</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-5 py-12 text-center">
      <div className="grid size-10 place-items-center rounded-full border text-fg2">
        <MessageSquare className="size-[18px]" />
      </div>
      <h2 className="mt-4 mb-0 text-[22px] font-semibold tracking-[-0.025em]">
        Ask {collectionName}
      </h2>
      <p className="mt-1.5 mb-0 max-w-[420px] text-pretty text-muted-foreground">
        Answers are drawn from {readyDocuments}{" "}
        {readyDocuments === 1 ? "document" : "documents"} and cite the exact
        page they come from.
      </p>
      <div className="mt-7 flex w-[min(420px,100%)] flex-col gap-2">
        {CHAT_SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onAsk(q)}
            className="flex min-h-[42px] items-center justify-between gap-3 rounded-full border bg-background py-2 pr-4 pl-[18px] text-left text-sm hover:border-border2 hover:bg-secondary"
          >
            <span>{q}</span>
            <ArrowUpRight className="size-[15px] flex-none text-faint" />
          </button>
        ))}
      </div>
    </div>
  );
}
