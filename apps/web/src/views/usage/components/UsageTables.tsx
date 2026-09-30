"use client";

import type { AdminTopUser, UsageByKind, UsageKind } from "@docmind/shared";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  formatCompact,
  formatNumber,
  formatPercent,
  formatUsd,
} from "@/utils/format-cost";

const mono = "font-mono text-[13px]";

const KIND_META: Record<
  UsageKind,
  { name: string; desc: string; opacity: number }
> = {
  answer: { name: "Answer", desc: "Generating responses", opacity: 1 },
  embed: { name: "Embed", desc: "Indexing chunks & queries", opacity: 0.55 },
  judge: { name: "Judge", desc: "Eval grading", opacity: 0.32 },
  rewrite: { name: "Rewrite", desc: "Query rewriting", opacity: 0.16 },
};

export function BreakdownCard({
  byKind,
  totalCost,
}: {
  byKind: UsageByKind[];
  totalCost: number;
}) {
  const rows = [...byKind].sort((a, b) => b.costUsd - a.costUsd);
  return (
    <div className="mt-4 rounded-xl border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
          Breakdown by type
        </h2>
        <span className="text-[13px] text-muted-foreground">
          {formatUsd(totalCost)} total
        </span>
      </div>
      <div className="mt-4 flex h-2 gap-0.5 overflow-hidden rounded-full bg-secondary">
        {rows.map((r) => (
          <div
            key={r.kind}
            className="h-full bg-foreground"
            style={{
              width: `${totalCost ? (r.costUsd / totalCost) * 100 : 0}%`,
              opacity: KIND_META[r.kind].opacity,
            }}
          />
        ))}
      </div>
      <div className="mt-3">
        <Table className="min-w-[560px] tabular-nums">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-0">Type</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Share</TableHead>
              <TableHead className="pr-0 text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const meta = KIND_META[r.kind];
              return (
                <TableRow key={r.kind} className="hover:bg-transparent">
                  <TableCell className="px-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-2 flex-none rounded-[2px] bg-foreground"
                        style={{ opacity: meta.opacity }}
                      />
                      <span className="font-medium">{meta.name}</span>
                      <span className="text-[13px] font-normal text-muted-foreground">
                        {meta.desc}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("text-right", mono)}>
                    {formatNumber(r.requests)}
                  </TableCell>
                  <TableCell className={cn("text-right", mono)}>
                    {formatCompact(r.tokens)}
                  </TableCell>
                  <TableCell
                    className={cn("text-right text-muted-foreground", mono)}
                  >
                    {formatPercent(totalCost ? r.costUsd / totalCost : 0)}
                  </TableCell>
                  <TableCell
                    className={cn("pr-0 text-right font-medium", mono)}
                  >
                    {formatUsd(r.costUsd)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function TopUsersCard({ users }: { users: AdminTopUser[] }) {
  const top = users.reduce((m, u) => Math.max(m, u.costUsd), 0);
  return (
    <div className="mt-4 overflow-hidden rounded-xl border">
      <div className="flex items-baseline justify-between gap-3 px-5 pt-5 pb-2">
        <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
          Top 10 users
        </h2>
        <span className="text-[13px] text-muted-foreground">by cost</span>
      </div>
      <Table className="min-w-[640px] tabular-nums">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5">User</TableHead>
            <TableHead className="text-right">Requests</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
            <TableHead className="w-[200px] pr-5 text-right">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.slice(0, 10).map((u, i) => (
            <TableRow key={u.id}>
              <TableCell className="px-5 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="w-5 font-mono text-xs text-faint">
                    {i + 1}
                  </span>
                  <div className="grid size-7 flex-none place-items-center rounded-full border bg-secondary text-[11px] font-medium">
                    {u.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="leading-[1.3] font-medium">{u.name}</div>
                    <div className="text-xs leading-[1.3] text-muted-foreground">
                      {u.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className={cn("py-2.5 text-right", mono)}>
                {formatNumber(u.requests)}
              </TableCell>
              <TableCell className={cn("py-2.5 text-right", mono)}>
                {formatCompact(u.tokens)}
              </TableCell>
              <TableCell className="py-2.5 pr-5">
                <div className="flex items-center justify-end gap-3">
                  <span className="block h-1 w-[72px] overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full rounded-full bg-foreground"
                      style={{
                        width: `${top ? Math.round((u.costUsd / top) * 100) : 0}%`,
                      }}
                    />
                  </span>
                  <span className={cn("min-w-16 text-right font-medium", mono)}>
                    {formatUsd(u.costUsd)}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
