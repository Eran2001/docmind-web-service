"use client";

import { useState } from "react";
import { Check, ChevronRight, FileText, Gavel, X } from "lucide-react";
import type { EvalRunDetail } from "@/types";

import { DataGrid, type DataGridColumn } from "@/components/common/DataGrid";
import { Bone, SkeletonLine } from "@/components/common/Skeletons";
import { Spinner } from "@/components/common/Spinner";
import { cn } from "@/lib/utils";

const mono = "font-mono text-[13px]";
const scoreColor = (v: number) =>
  v < 0.5 ? "text-destructive" : v < 0.8 ? "text-warn" : "text-foreground";

type Result = EvalRunDetail["results"][number];

// Two-line placeholder: questions and answers usually wrap to two lines.
const twoLines = () => (
  <>
    <SkeletonLine className="w-4/5" />
    <SkeletonLine className="w-3/5" />
  </>
);

export function ResultsTable({
  run,
  loading,
  questionCount = 5,
}: {
  run: EvalRunDetail | undefined;
  loading: boolean;
  questionCount?: number;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (
    !loading &&
    run &&
    (run.status === "queued" || run.status === "running")
  ) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2.5 rounded-xl border p-10 text-muted-foreground">
        <Spinner />
        Grading questions… {run.progress.done}/{run.progress.total}
      </div>
    );
  }
  if (!loading && run?.status === "failed") {
    return (
      <div className="mt-4 rounded-xl border p-10 text-center text-destructive">
        This run failed. Start a new run to try again.
      </div>
    );
  }

  const columns: DataGridColumn<Result>[] = [
    {
      key: "toggle",
      header: "",
      hideInGrid: true,
      headClassName: "w-10 px-0",
      cellClassName: "py-3.5 pr-0 pl-3.5 align-top text-muted-foreground",
      skeleton: () => <div className="size-4" />,
      cell: (r) => (
        // Same height as one line of the question text, so the arrow centres on the first line.
        <span className="flex h-[1.45em] items-center">
          <ChevronRight
            className={cn(
              "size-4 transition-transform",
              open.has(r.questionId) && "rotate-90",
            )}
          />
        </span>
      ),
    },
    {
      key: "question",
      header: "Question",
      primary: true,
      headClassName: "w-[30%] px-3",
      cellClassName: "px-3 py-3.5 align-top whitespace-normal",
      skeleton: twoLines,
      cell: (r) => (
        <span className="leading-[1.45] font-medium">{r.question}</span>
      ),
    },
    {
      key: "answer",
      header: "Generated answer",
      wide: true,
      headClassName: "px-3",
      cellClassName: "px-3 py-3.5 align-top whitespace-normal text-fg2",
      skeleton: twoLines,
      cell: (r) => (
        <span className="line-clamp-2 leading-[1.45]">{r.generatedAnswer}</span>
      ),
    },
    {
      key: "correctness",
      header: "Correctness",
      align: "right",
      headClassName: "w-[100px] px-3",
      cellClassName: "px-3 py-3.5 align-top",
      cell: (r) => (
        <span className={cn(mono, scoreColor(r.correctness))}>
          {r.correctness.toFixed(2)}
        </span>
      ),
    },
    {
      key: "faithfulness",
      header: "Faithfulness",
      align: "right",
      headClassName: "w-[104px] px-3",
      cellClassName: "px-3 py-3.5 align-top",
      cell: (r) => (
        <span className={cn(mono, scoreColor(r.faithfulness))}>
          {r.faithfulness.toFixed(2)}
        </span>
      ),
    },
    {
      key: "retrieval",
      header: "Retrieval",
      align: "center",
      headClassName: "w-[90px] pr-4 pl-3",
      cellClassName: "py-3.5 pr-4 pl-3 align-top",
      skeleton: () => <Bone className="mx-auto size-[22px] rounded-full" />,
      cell: (r) => (
        <span
          aria-label={
            r.retrievalHit
              ? "Expected document retrieved"
              : "Expected document missed"
          }
          className={cn(
            "inline-grid size-[22px] place-items-center rounded-full",
            r.retrievalHit ? "bg-ok-bg text-ok" : "bg-err-bg text-destructive",
          )}
        >
          {r.retrievalHit ? (
            <Check className="size-[13px]" strokeWidth={2} />
          ) : (
            <X className="size-[13px]" strokeWidth={2} />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border">
      <DataGrid
        bare
        columns={columns}
        loading={loading || !run}
        skeletonCount={questionCount}
        rows={run?.results ?? []}
        rowKey={(r) => r.questionId}
        onRowClick={(r) => toggle(r.questionId)}
        rowClassName={(r) =>
          cn("align-top", open.has(r.questionId) && "bg-surface2")
        }
        tableClassName="min-w-[880px]"
        cardsClassName="p-4"
        expanded={{
          isOpen: (r) => open.has(r.questionId),
          render: (r, layout) => <ResultDetail result={r} layout={layout} />,
        }}
      />
      <div className="flex flex-wrap justify-between gap-3 px-4 py-3 text-[13px] text-muted-foreground">
        {run && !loading ? (
          <>
            <span>
              Showing {run.results.length} of {run.results.length} questions
            </span>
            <span className="font-mono text-xs">
              run #{run.number} · {run.results.length} questions
              {run.totalTokens
                ? ` · ${run.totalTokens.toLocaleString()} tokens`
                : ""}
            </span>
          </>
        ) : (
          <>
            <div className="w-44">
              <SkeletonLine className="w-full" />
            </div>
            <div className="w-56">
              <SkeletonLine className="w-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ResultDetail({
  result: r,
  layout,
}: {
  result: EvalRunDetail["results"][number];
  layout: "table" | "grid";
}) {
  return (
    <div
      className={cn(
        layout === "table" ? "pt-1 pr-4 pb-[18px] pl-[54px]" : "pt-1",
      )}
    >
      <div className="grid animate-dmin grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            Expected answer
          </div>
          <div className="text-sm leading-[1.55]">{r.expectedAnswer}</div>
          {r.expectedDocumentTitle && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-[13px]" />
              <span className="font-mono">{r.expectedDocumentTitle}</span>
            </div>
          )}
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            Generated answer
          </div>
          <div className="text-sm leading-[1.55]">{r.generatedAnswer}</div>
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
    </div>
  );
}
