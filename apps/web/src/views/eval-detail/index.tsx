"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FlaskConical, Folder, Gavel, ListChecks, Play } from "lucide-react";
import { toast } from "sonner";
import type { EvalRun } from "@docmind/shared";

import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import {
  PageContainer,
  PageHeader,
  PageTitle,
} from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  useEvalRun,
  useEvalSet,
  useStartEvalRun,
} from "@/queries/evals.queries";
import { formatDateTime, formatDuration } from "@/utils/format-date";
import { HistoryTab } from "@/views/eval-detail/components/HistoryTab";
import { QuestionsTab } from "@/views/eval-detail/components/QuestionsTab";
import { ResultsTab } from "@/views/eval-detail/components/ResultsTab";
import { RunCards } from "@/views/eval-detail/components/RunCards";

type Tab = "results" | "questions" | "history";

const NO_RUNS: EvalRun[] = [];

export function EvalDetailView({ setId }: { setId: string }) {
  const set = useEvalSet(setId);
  const start = useStartEvalRun(setId);
  const [tab, setTab] = useState<Tab>("results");
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const runs = set.data?.runs ?? NO_RUNS;
  const activeRun = runs.find(
    (r) => r.status === "queued" || r.status === "running",
  );
  const runId =
    selectedRunId ?? runs.find((r) => r.status === "done")?.id ?? runs[0]?.id;
  const run = runs.find((r) => r.id === runId);
  const previous = run
    ? runs.find((r) => r.number < run.number && r.status === "done")
    : undefined;
  const runDetail = useEvalRun(runId);

  // Toast once when a run we watched while running flips to done.
  const watching = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const r of runs) {
      if (r.status === "queued" || r.status === "running")
        watching.current.add(r.id);
      else if (
        watching.current.delete(r.id) &&
        r.status === "done" &&
        r.avgCorrectness !== null &&
        r.avgFaithfulness !== null
      ) {
        toast.success("Eval complete", {
          description: `Run #${r.number} finished · correctness ${r.avgCorrectness.toFixed(2)}, faithfulness ${r.avgFaithfulness.toFixed(2)}.`,
        });
        setSelectedRunId(r.id);
        setTab("results");
      }
    }
  }, [runs]);

  if (set.isError || (set.isSuccess && !set.data)) {
    return (
      <div className="min-h-screen">
        <PageHeader
          crumbs={[
            { label: "Evals", href: routes.evals },
            { label: "Not found" },
          ]}
        />
        <PageContainer>
          <EmptyState
            icon={FlaskConical}
            title="Eval set not found"
            description={
              set.isError
                ? getErrorMessage(set.error)
                : "It may have been deleted."
            }
            action={
              <Button asChild size="lg">
                <Link href={routes.evals}>Back to evals</Link>
              </Button>
            }
          />
        </PageContainer>
      </div>
    );
  }

  const data = set.data;
  const judge = (activeRun ?? run ?? runs[0])?.judgeModel;

  const onRun = () =>
    start.mutate(undefined, {
      onSuccess: (r) => {
        setSelectedRunId(r.id);
        setTab("results");
      },
      onError: (err) =>
        toast.error("Couldn't start the run", {
          description: getErrorMessage(err),
        }),
    });

  const running = !!activeRun || start.isPending;
  const runLabel = activeRun
    ? `Running ${activeRun.progress.done}/${activeRun.progress.total}`
    : "Run eval";

  const tabs: { id: Tab; label: string }[] = [
    { id: "results", label: run ? `Run #${run.number} results` : "Results" },
    { id: "questions", label: `Questions (${data?.questionCount ?? 0})` },
    { id: "history", label: `Run history (${runs.length})` },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        crumbs={[
          { label: "Evals", href: routes.evals },
          { label: data?.name ?? "…" },
        ]}
        actions={
          <Button
            onClick={onRun}
            disabled={running || !data}
            className="flex-none"
          >
            {running ? <Spinner /> : <Play className="size-3.5" />}
            <span className="tabular-nums">{runLabel}</span>
          </Button>
        }
      />
      <PageContainer>
        <PageTitle title={data?.name ?? " "} description={data?.description} />
        <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-muted-foreground">
          {data && (
            <Link
              href={routes.collection(data.collectionId)}
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Folder className="size-3.5" />
              {data.collectionName}
            </Link>
          )}
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="size-3.5" />
            {data?.questionCount ?? 0} questions
          </span>
          {judge && (
            <span className="inline-flex items-center gap-1.5">
              <Gavel className="size-3.5" />
              Judge: {judge}
            </span>
          )}
        </div>

        {runs.length > 0 && run && (
          <>
            <div className="mt-8 mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
                {run.id === runs[0]?.id
                  ? `Latest run · #${run.number}`
                  : `Run #${run.number}`}
              </h2>
              <span className="text-[13px] text-muted-foreground">
                {run.startedAt ? formatDateTime(run.startedAt) : ""}
                {run.durationMs ? ` · ${formatDuration(run.durationMs)}` : ""}
              </span>
            </div>
            <RunCards run={run} previous={previous} />
          </>
        )}

        <div
          role="tablist"
          className={cn(
            "flex gap-1 overflow-x-auto border-b",
            runs.length > 0 ? "mt-9" : "mt-8",
          )}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px h-10 border-b-2 px-3 text-sm whitespace-nowrap hover:text-foreground",
                tab === t.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "results" && (
          <ResultsTab
            hasRuns={runs.length > 0}
            loading={set.isPending}
            run={runDetail.data}
            runLoading={runDetail.isPending}
            onRun={onRun}
            running={running}
          />
        )}
        {tab === "questions" && data && (
          <QuestionsTab
            setId={setId}
            collectionId={data.collectionId}
            questions={data.questions}
          />
        )}
        {tab === "history" && (
          <HistoryTab
            runs={runs}
            selectedId={runId}
            onSelect={(id) => {
              setSelectedRunId(id);
              setTab("results");
            }}
          />
        )}
      </PageContainer>
    </div>
  );
}
