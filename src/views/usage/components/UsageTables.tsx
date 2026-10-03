"use client";

import type { AdminTopUser, UsageByKind, UsageKind } from "@/types";

import { DataGrid, type DataGridColumn } from "@/components/common/DataGrid";
import { Bone, SkeletonLine } from "@/components/common/Skeletons";
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
  rerank: { name: "Rerank", desc: "Ordering search results", opacity: 0.24 },
  rewrite: { name: "Rewrite", desc: "Query rewriting", opacity: 0.16 },
};
const KIND_ORDER: UsageKind[] = [
  "answer",
  "embed",
  "judge",
  "rerank",
  "rewrite",
];

function KindCell({ kind }: { kind: UsageKind }) {
  const meta = KIND_META[kind];
  return (
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
  );
}

export function BreakdownCard({
  byKind,
  totalCost,
  loading = false,
}: {
  byKind: UsageByKind[];
  totalCost: number;
  loading?: boolean;
}) {
  const rows = [...byKind].sort((a, b) => b.costUsd - a.costUsd);

  const columns: DataGridColumn<UsageByKind>[] = [
    {
      key: "type",
      header: "Type",
      primary: true,
      headClassName: "px-0",
      cellClassName: "px-0",
      // The type names are static, so the placeholder row shows them for real.
      skeleton: (i) => <KindCell kind={KIND_ORDER[i] ?? "answer"} />,
      cell: (r) => <KindCell kind={r.kind} />,
    },
    {
      key: "requests",
      header: "Requests",
      align: "right",
      cellClassName: mono,
      skeletonClassName: "w-14",
      cell: (r) => formatNumber(r.requests),
    },
    {
      key: "tokens",
      header: "Tokens",
      align: "right",
      cellClassName: mono,
      skeletonClassName: "w-14",
      cell: (r) => formatCompact(r.tokens),
    },
    {
      key: "share",
      header: "Share",
      align: "right",
      cellClassName: cn("text-muted-foreground", mono),
      skeletonClassName: "w-14",
      cell: (r) => formatPercent(totalCost ? r.costUsd / totalCost : 0),
    },
    {
      key: "cost",
      header: "Cost",
      align: "right",
      headClassName: "pr-0",
      cellClassName: cn("pr-0 font-medium", mono),
      skeletonClassName: "w-14",
      cell: (r) => formatUsd(r.costUsd),
    },
  ];

  return (
    <div
      className={cn("mt-4 rounded-xl border p-5", loading && "animate-dmpulse")}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
          Breakdown by type
        </h2>
        {loading ? (
          <Bone className="h-3.5 w-24" />
        ) : (
          <span className="text-[13px] text-muted-foreground">
            {formatUsd(totalCost)} total
          </span>
        )}
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
        <DataGrid
          bare
          columns={columns}
          rows={rows}
          rowKey={(r) => r.kind}
          loading={loading}
          skeletonCount={KIND_ORDER.length}
          tableClassName="min-w-[560px] tabular-nums"
        />
      </div>
    </div>
  );
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

export function TopUsersCard({
  users,
  loading = false,
}: {
  users: AdminTopUser[];
  loading?: boolean;
}) {
  const top = users.reduce((m, u) => Math.max(m, u.costUsd), 0);
  const rows = users.slice(0, 10);

  const columns: DataGridColumn<AdminTopUser>[] = [
    {
      key: "user",
      header: "User",
      primary: true,
      headClassName: "px-5",
      cellClassName: "px-5 py-2.5",
      skeleton: (i) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="w-5 font-mono text-xs text-faint">{i + 1}</span>
          <Bone className="size-7 flex-none rounded-full" />
          <div className="min-w-0">
            <div className="leading-[1.3]">
              <SkeletonLine className="w-28" />
            </div>
            <div className="text-xs leading-[1.3]">
              <SkeletonLine className="w-40" />
            </div>
          </div>
        </div>
      ),
      cell: (u) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="w-5 font-mono text-xs text-faint">
            {rows.indexOf(u) + 1}
          </span>
          <div className="grid size-7 flex-none place-items-center rounded-full border bg-secondary text-[11px] font-medium">
            {initialsOf(u.name)}
          </div>
          <div className="min-w-0">
            <div className="leading-[1.3] font-medium">{u.name}</div>
            <div className="text-xs leading-[1.3] text-muted-foreground">
              {u.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "requests",
      header: "Requests",
      align: "right",
      cellClassName: cn("py-2.5", mono),
      skeletonClassName: "w-14",
      cell: (u) => formatNumber(u.requests),
    },
    {
      key: "tokens",
      header: "Tokens",
      align: "right",
      cellClassName: cn("py-2.5", mono),
      skeletonClassName: "w-14",
      cell: (u) => formatCompact(u.tokens),
    },
    {
      key: "cost",
      header: "Cost",
      align: "right",
      headClassName: "w-[200px] pr-5",
      cellClassName: "py-2.5 pr-5",
      skeleton: () => (
        <div className="flex items-center justify-end gap-3">
          <span className="block h-1 w-[72px] rounded-full bg-secondary" />
          <SkeletonLine className="w-16" />
        </div>
      ),
      cell: (u) => (
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
      ),
    },
  ];

  return (
    <div
      className={cn(
        "mt-4 overflow-hidden rounded-xl border",
        loading && "animate-dmpulse",
      )}
    >
      <div className="flex items-baseline justify-between gap-3 px-5 pt-5 pb-2">
        <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
          Top 10 users
        </h2>
        <span className="text-[13px] text-muted-foreground">by cost</span>
      </div>
      <DataGrid
        bare
        columns={columns}
        rows={rows}
        rowKey={(u) => u.resourceId}
        loading={loading}
        skeletonCount={10}
        tableClassName="min-w-[640px] tabular-nums"
        cardsClassName="px-5 pb-2"
      />
    </div>
  );
}
