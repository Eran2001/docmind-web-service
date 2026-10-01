"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, FlaskConical, Folder, Plus, Search } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { DataGrid, type DataGridColumn } from "@/components/common/DataGrid";
import { SkeletonLine } from "@/components/common/Skeletons";
import { TruncatedText } from "@/components/common/TruncatedText";
import {
  PageContainer,
  PageHeader,
  PageTitle,
  HEADER_BUTTON,
  HeaderButtonLabel,
} from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useEvalSets } from "@/queries/evals.queries";
import { formatRelative } from "@/utils/format-date";
import type { EvalSetSummary } from "@/types";
import { NewEvalSetDialog } from "@/views/evals/components/NewEvalSetDialog";

const mono = "font-mono text-[13px]";

const columns: DataGridColumn<EvalSetSummary>[] = [
  {
    key: "name",
    header: "Name",
    primary: true,
    headClassName: "min-w-65",
    cellClassName: "max-w-90 py-3.5",
    skeleton: () => (
      <>
        <SkeletonLine className="w-1/2" />
        <div className="mt-px text-xs">
          <SkeletonLine className="w-4/5" />
        </div>
      </>
    ),
    cell: (s) => (
      <>
        <Link
          href={routes.evalSet(s.id)}
          onClick={(e) => e.stopPropagation()}
          className="block font-medium hover:underline"
        >
          <TruncatedText focusable={false}>{s.name}</TruncatedText>
        </Link>
        <TruncatedText className="mt-px text-xs text-muted-foreground">
          {s.description ?? "No description"}
        </TruncatedText>
      </>
    ),
  },
  {
    key: "collection",
    header: "Collection",
    cellClassName: "whitespace-nowrap text-fg2",
    skeletonClassName: "w-35",
    cell: (s) => (
      <span className="flex items-center gap-1.5">
        <Folder className="size-3.5 flex-none text-faint" />
        <TruncatedText>{s.collectionName}</TruncatedText>
      </span>
    ),
  },
  {
    key: "questions",
    header: "Questions",
    align: "right",
    gridAlign: "right",
    headClassName: "w-25",
    cellClassName: mono,
    skeletonClassName: "w-7",
    cell: (s) => s.questionCount,
  },
  {
    key: "score",
    header: "Last run score",
    headClassName: "w-42.5",
    cell: (s) => <ScoreCell score={s.lastRun?.avgCorrectness} />,
  },
  {
    key: "lastRun",
    header: "Last run",
    gridAlign: "right",
    headClassName: "w-32.5",
    cellClassName: "whitespace-nowrap text-muted-foreground",
    skeletonClassName: "w-17.5",
    cell: (s) =>
      s.lastRun ? formatRelative(s.lastRun.finishedAt) : "Never run",
  },
  {
    key: "open",
    header: "",
    hideInGrid: true,
    headClassName: "w-11",
    cellClassName: "px-3 text-faint",
    cell: () => <ChevronRight className="size-4" />,
  },
];

function ScoreCell({ score }: { score?: number }) {
  if (score === undefined) return <span className="text-faint">—</span>;
  const low = score < 0.7;
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={cn(mono, "font-medium", low && "text-warn")}>
        {score.toFixed(2)}
      </span>
      <span className="block h-1 w-16 overflow-hidden rounded-full bg-secondary">
        <span
          className={cn(
            "block h-full rounded-full",
            low ? "bg-warn" : "bg-foreground",
          )}
          style={{ width: `${Math.round(score * 100)}%` }}
        />
      </span>
    </span>
  );
}

export function EvalsView() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = useEvalSets();
  const [dialog, setDialog] = useState(false);
  const [q, setQ] = useState("");
  const all = data ?? [];
  const filter = q.trim().toLowerCase();
  const sets = all.filter(
    (s) =>
      !filter ||
      [s.name, s.description ?? "", s.collectionName].some((t) =>
        t.toLowerCase().includes(filter),
      ),
  );

  const newButton = (
    <Button
      onClick={() => setDialog(true)}
      aria-label="New eval set"
      className={HEADER_BUTTON}
    >
      <Plus />
      <HeaderButtonLabel>New eval set</HeaderButtonLabel>
    </Button>
  );

  return (
    <div className="min-h-screen">
      <PageHeader crumbs={[{ label: "Evals" }]} actions={newButton} />
      <PageContainer>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <PageTitle
            title="Evals"
            description="Test questions with known answers. Run them after changing documents or retrieval settings to catch regressions."
          />
          {!isPending && all.length > 0 && (
            <label className="relative flex w-full sm:w-65">
              <Search className="absolute top-3 left-3.5 size-3.5 text-faint" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter eval sets"
                aria-label="Filter eval sets"
                className="h-9.5 min-w-0 flex-1 rounded-full border border-transparent bg-secondary pr-3.5 pl-9 text-sm outline-none focus:border-ring focus:bg-background focus:ring-[3px] focus:ring-ring/15"
              />
            </label>
          )}
        </div>
        <div>
          {isError && (
            <EmptyState
              icon={FlaskConical}
              title="Couldn't load eval sets"
              description={getErrorMessage(error)}
              action={<Button onClick={() => refetch()}>Try again</Button>}
            />
          )}

          {!isPending && !isError && all.length === 0 && (
            <EmptyState
              icon={FlaskConical}
              title="No eval sets yet"
              description="Create an eval set to measure answer quality for a collection."
              action={
                <Button size="lg" onClick={() => setDialog(true)}>
                  <Plus />
                  New eval set
                </Button>
              }
            />
          )}

          {(isPending || all.length > 0) && (
            <DataGrid
              columns={columns}
              rows={sets}
              rowKey={(s) => s.id}
              loading={isPending}
              skeletonCount={5}
              onRowClick={(s) => router.push(routes.evalSet(s.id))}
              tableClassName="min-w-190"
              empty={
                <div className="py-12 text-center text-muted-foreground">
                  No eval sets match “{q}”.
                </div>
              }
            />
          )}
        </div>
      </PageContainer>

      <NewEvalSetDialog
        open={dialog}
        onOpenChange={setDialog}
        onCreated={(id) => router.push(routes.evalSet(id))}
      />
    </div>
  );
}
