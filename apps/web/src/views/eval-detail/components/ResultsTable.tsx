"use client";

import { Fragment, useState } from "react";
import { Check, ChevronRight, FileText, Gavel, X } from "lucide-react";
import type { EvalRunDetail } from "@docmind/shared";

import { Spinner } from "@/components/common/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mono = "font-mono text-[13px]";
const scoreColor = (v: number) =>
  v < 0.5 ? "text-destructive" : v < 0.8 ? "text-warn" : "text-foreground";

export function ResultsTable({
  run,
  loading,
}: {
  run: EvalRunDetail | undefined;
  loading: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (loading || !run) {
    return (
      <div className="mt-4 animate-dmpulse rounded-xl border p-10 text-center text-muted-foreground">
        Loading results…
      </div>
    );
  }
  if (run.status === "queued" || run.status === "running") {
    return (
      <div className="mt-4 flex items-center justify-center gap-2.5 rounded-xl border p-10 text-muted-foreground">
        <Spinner />
        Grading questions… {run.progress.done}/{run.progress.total}
      </div>
    );
  }
  if (run.status === "failed") {
    return (
      <div className="mt-4 rounded-xl border p-10 text-center text-destructive">
        This run failed. Start a new run to try again.
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border">
      <Table className="min-w-[880px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 px-0" />
            <TableHead className="w-[30%] px-3">Question</TableHead>
            <TableHead className="px-3">Generated answer</TableHead>
            <TableHead className="w-[100px] px-3 text-right">
              Correctness
            </TableHead>
            <TableHead className="w-[104px] px-3 text-right">
              Faithfulness
            </TableHead>
            <TableHead className="w-[90px] pr-4 pl-3 text-center">
              Retrieval
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {run.results.map((r) => {
            const expanded = open.has(r.questionId);
            return (
              <Fragment key={r.questionId}>
                <TableRow
                  onClick={() => toggle(r.questionId)}
                  aria-expanded={expanded}
                  className={cn(
                    "cursor-pointer align-top",
                    expanded && "bg-surface2",
                  )}
                >
                  <TableCell className="py-3.5 pr-0 pl-3.5 align-top text-muted-foreground">
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform",
                        expanded && "rotate-90",
                      )}
                    />
                  </TableCell>
                  <TableCell className="px-3 py-3.5 align-top leading-[1.45] font-medium whitespace-normal">
                    {r.question}
                  </TableCell>
                  <TableCell className="px-3 py-3.5 align-top leading-[1.45] whitespace-normal text-fg2">
                    <span className="line-clamp-2">{r.generatedAnswer}</span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "px-3 py-3.5 text-right align-top",
                      mono,
                      scoreColor(r.correctness),
                    )}
                  >
                    {r.correctness.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "px-3 py-3.5 text-right align-top",
                      mono,
                      scoreColor(r.faithfulness),
                    )}
                  >
                    {r.faithfulness.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 pl-3 text-center align-top">
                    <span
                      aria-label={
                        r.retrievalHit
                          ? "Expected document retrieved"
                          : "Expected document missed"
                      }
                      className={cn(
                        "inline-grid size-[22px] place-items-center rounded-full",
                        r.retrievalHit
                          ? "bg-ok-bg text-ok"
                          : "bg-err-bg text-destructive",
                      )}
                    >
                      {r.retrievalHit ? (
                        <Check className="size-[13px]" strokeWidth={2} />
                      ) : (
                        <X className="size-[13px]" strokeWidth={2} />
                      )}
                    </span>
                  </TableCell>
                </TableRow>
                {expanded && (
                  <TableRow className="bg-surface2 hover:bg-surface2">
                    <TableCell
                      colSpan={6}
                      className="pt-1 pr-4 pb-[18px] pl-[54px] whitespace-normal"
                    >
                      <div className="grid animate-dmin grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                        <div>
                          <div className="mb-1 text-xs font-medium text-muted-foreground">
                            Expected answer
                          </div>
                          <div className="text-sm leading-[1.55]">
                            {r.expectedAnswer}
                          </div>
                          {r.expectedDocumentTitle && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <FileText className="size-[13px]" />
                              <span className="font-mono">
                                {r.expectedDocumentTitle}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="mb-1 text-xs font-medium text-muted-foreground">
                            Generated answer
                          </div>
                          <div className="text-sm leading-[1.55]">
                            {r.generatedAnswer}
                          </div>
                        </div>
                      </div>
                      {r.judgeReasoning && (
                        <div className="mt-3.5 rounded-[10px] border bg-background px-3.5 py-3">
                          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Gavel className="size-[13px]" />
                            Judge reasoning
                          </div>
                          <div className="text-[13px] leading-[1.6] text-fg2">
                            {r.judgeReasoning}
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex flex-wrap justify-between gap-3 px-4 py-3 text-[13px] text-muted-foreground">
        <span>
          Showing {run.results.length} of {run.results.length} questions
        </span>
        <span className="font-mono text-xs">
          run #{run.number} · {run.results.length} questions
          {run.totalTokens
            ? ` · ${run.totalTokens.toLocaleString()} tokens`
            : ""}
        </span>
      </div>
    </div>
  );
}
