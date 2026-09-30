"use client";

import type { EvalRun } from "@docmind/shared";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  return (
    <div className="mt-4 overflow-hidden rounded-xl border">
      <Table className="min-w-[780px] tabular-nums">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Run</TableHead>
            <TableHead>Started</TableHead>
            <TableHead className="text-right">Correctness</TableHead>
            <TableHead className="text-right">Faithfulness</TableHead>
            <TableHead className="text-right">Hit rate</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={7}
                className="py-12 text-center text-muted-foreground"
              >
                No runs yet.
              </TableCell>
            </TableRow>
          )}
          {runs.map((r, i) => (
            <TableRow
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={cn(
                "cursor-pointer",
                r.id === selectedId && "bg-surface2",
              )}
            >
              <TableCell className="font-medium">
                <span className="inline-flex items-center gap-2">
                  Run #{r.number}
                  {i === 0 && (
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
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {r.startedAt ? formatDateTime(r.startedAt) : "—"}
              </TableCell>
              <TableCell className={cn("text-right", mono)}>
                {n2(r.avgCorrectness)}
              </TableCell>
              <TableCell className={cn("text-right", mono)}>
                {n2(r.avgFaithfulness)}
              </TableCell>
              <TableCell className={cn("text-right", mono)}>
                {n2(r.retrievalHitRate)}
              </TableCell>
              <TableCell className={cn("text-right", mono)}>
                {r.totalCostUsd === null ? "—" : formatUsd(r.totalCostUsd, 3)}
              </TableCell>
              <TableCell
                className={cn("text-right text-muted-foreground", mono)}
              >
                {r.durationMs === null ? "—" : formatDuration(r.durationMs)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
