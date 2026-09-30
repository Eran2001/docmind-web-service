"use client";

import Link from "next/link";
import { ArrowUpRight, Quote, X } from "lucide-react";
import type { Citation } from "@/types";

import { DocIcon } from "@/components/common/DocIcon";
import { Bone } from "@/components/common/Skeletons";
import { routes } from "@/configs/routes";
import { cn } from "@/lib/utils";
import { useChunk } from "@/queries/documents.queries";
import { docTypeFromTitle, pageLabel } from "@/utils/documents";

interface Props {
  collectionId: string;
  citation: Citation | null;
  citations: Citation[];
  onSelect: (marker: number) => void;
  onClose: () => void;
}

const chipBase =
  "inline-grid place-items-center rounded-full font-mono text-[11px] font-semibold";

export function CitationPanel({
  collectionId,
  citation,
  citations,
  onSelect,
  onClose,
}: Props) {
  const chunk = useChunk(citation?.documentId, citation?.chunkId);
  const type = citation
    ? docTypeFromTitle(citation.documentTitle, citation.pageNumber == null)
    : "PDF";

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-[52px] flex-none items-center justify-between border-b pr-3 pl-5">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          Source
          {citation && (
            <span
              className={cn(
                chipBase,
                "h-5 min-w-5 bg-link px-1.5 text-background",
              )}
            >
              {citation.marker}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close sources"
          className="grid size-[30px] place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      {!citation ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-8 text-center text-muted-foreground">
          <Quote className="size-[18px]" />
          <p className="m-0 max-w-[220px] text-[13px]">
            Select a citation in an answer to read the source passage here.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-8 flex-none place-items-center rounded-lg bg-secondary text-fg2">
              <DocIcon type={type} className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm leading-[1.4] font-medium break-words">
                {citation.documentTitle}
              </div>
              <div className="mt-0.5 text-[13px] text-muted-foreground">
                {citation.pageNumber
                  ? `Page ${citation.pageNumber}`
                  : "Web page"}
                {chunk.data?.heading ? ` · ${chunk.data.heading}` : ""}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-secondary px-[18px] py-4 text-sm leading-[1.7] text-muted-foreground">
            {chunk.isPending ? (
              <div className="flex animate-dmpulse flex-col gap-2">
                <Bone className="h-3 w-full bg-border" />
                <Bone className="h-3 w-[92%] bg-border" />
                <Bone className="h-3 w-[60%] bg-border" />
              </div>
            ) : chunk.data ? (
              <>
                {chunk.data.contextBefore}
                <mark className="rounded-[2px] bg-accent-bg px-0 py-px text-foreground shadow-[inset_0_-1.5px_0_var(--link)]">
                  {chunk.data.content}
                </mark>
                {chunk.data.contextAfter}
              </>
            ) : (
              <mark className="rounded-[2px] bg-accent-bg text-foreground">
                {citation.snippet}
              </mark>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-faint">
              {citation.score !== undefined &&
                `relevance ${citation.score.toFixed(2)}`}
              {citation.score !== undefined && chunk.data && " · "}
              {chunk.data &&
                `chunk ${chunk.data.chunkIndex + 1} / ${chunk.data.chunkCount}`}
            </span>
            <Link
              href={routes.collection(collectionId)}
              className="inline-flex items-center gap-1 text-[13px] font-medium whitespace-nowrap text-link hover:underline"
            >
              Open document
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-7 border-t pt-4">
            <div className="mb-2 text-xs font-medium text-faint">
              All sources in this answer
            </div>
            <div className="flex flex-col gap-0.5">
              {citations.map((c) => {
                const on = c.marker === citation.marker;
                return (
                  <button
                    key={c.marker}
                    onClick={() => onSelect(c.marker)}
                    className={cn(
                      "-mx-2 flex items-center gap-2.5 rounded-lg p-2 text-left text-[13px] hover:bg-secondary",
                      on && "bg-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        chipBase,
                        "h-5 min-w-5 px-1.5",
                        on
                          ? "bg-link text-background"
                          : "bg-accent-bg text-link",
                      )}
                    >
                      {c.marker}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-fg2">
                      {c.documentTitle}
                    </span>
                    <span className="text-xs whitespace-nowrap text-faint">
                      {pageLabel(c)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
