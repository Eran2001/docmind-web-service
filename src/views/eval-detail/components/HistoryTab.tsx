"use client";

import type { EvalRun } from "@/types";

import { DataGrid, type DataGridColumn } from "@/components/common/DataGrid";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/utils/format-cost";
import { formatDateTime, formatDuration } from "@/utils/format-date";

const mono = "font-mono text-[13px]";
const n2 = (v: number | null) => (v === null ? "—" : v.toFixed(2));

interface Props {
  runs: EvalRun[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

export function HistoryTab({ runs, selectedId, onSelect }: Props) {
  const columns: DataGridColumn<EvalRun>[] = [
    {
      key: "run",
      header: "Run",
      primary: true,
      cellClassName: "font-medium",
      cell: (r) => (
        <span className="inline-flex items-center gap-2">
          Run #{r.number}
          {r.id === runs[0]?.id && (
            <span className="inline-flex h-5 items-center rounded-full border px-2 text-[11px] font-medium text-muted-foreground">
              Latest
            </span>
          )}
          {(r.status === "queued" || r.status === "running") && (
            <span className="inline-flex h-5 items-center rounded-full bg-warn-bg px-2 text-[11px] font-medium text-warn">
              Running {r.progress.done}/{r.progress.total}
            </span>
          )}
        </span>
      ),
    },
    {
      key: "started",
      header: "Started",
      cellClassName: "whitespace-nowrap text-muted-foreground",
      cell: (r) => (r.startedAt ? formatDateTime(r.startedAt) : "—"),
    },
    { key: "correctness", header: "Correctness", align: "right", cellClassName: mono, cell: (r) => n2(r.avgCorrectness) },
    { key: "faithfulness", header: "Faithfulness", align: "right", cellClassName: mono, cell: (r) => n2(r.avgFaithfulness) },
    { key: "hit", header: "Hit rate", align: "right", cellClassName: mono, cell: (r) => n2(r.retrievalHitRate) },
    {
      key: "cost",
      header: "Cost",
      align: "right",
      cellClassName: mono,
      cell: (r) => (r.totalCostUsd === null ? "—" : formatUsd(r.totalCostUsd, 3)),
    },
    {
      key: "duration",
      header: "Duration",
      align: "right",
      cellClassName: cn("text-muted-foreground", mono),
      cell: (r) => (r.durationMs === null ? "—" : formatDuration(r.durationMs)),
    },
  ];

  return (
    <div className="mt-4">
      <DataGrid
        columns={columns}
        rows={runs}
        rowKey={(r) => r.id}
        onRowClick={(r) => onSelect(r.id)}
        rowClassName={(r) => (r.id === selectedId ? "bg-surface2" : undefined)}
        tableClassName="min-w-[780px] tabular-nums"
        empty={<div className="py-12 text-center text-muted-foreground">No runs yet.</div>}
      />
    </div>
  );
}
