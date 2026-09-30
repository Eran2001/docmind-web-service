"use client";

import { useState } from "react";
import Link from "next/link";
import { ChartLine, Download } from "lucide-react";
import type { UsageSummary } from "@docmind/shared";

import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer, PageHeader, PageTitle } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { USAGE_RANGES, type UsageRange } from "@/configs/constants";
import { routes } from "@/configs/routes";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useAdminUsage, useUsage } from "@/queries/usage.queries";
import { downloadCsv } from "@/utils/download-csv";
import { formatCompact, formatNumber, formatSigned, formatUsd, percentChange } from "@/utils/format-cost";
import { DailyCostChart } from "@/views/usage/components/DailyCostChart";
import { BreakdownCard, TopUsersCard } from "@/views/usage/components/UsageTables";

const RANGE_LONG: Record<UsageRange, string> = { 7: "last 7 days", 30: "last 30 days", 90: "last 90 days" };

interface StatSpec {
  label: string;
  value: string;
  delta: string | null;
  good?: boolean;
}

function buildStats(data: UsageSummary | undefined, range: UsageRange): StatSpec[] {
  const t = data?.totals;
  const p = data?.previous;
  const pct = (cur: number | undefined, prev: number | undefined) => {
    if (cur === undefined) return null;
    const d = percentChange(cur, prev);
    return d === null ? null : formatSigned(d);
  };
  const latencyDelta = t && p ? (t.avgLatencyMs - p.avgLatencyMs) / 1000 : null;
  return [
    { label: `Total cost · ${range}d`, value: t ? formatUsd(t.costUsd) : "—", delta: pct(t?.costUsd, p?.costUsd) },
    { label: "Tokens", value: t ? formatCompact(t.tokens) : "—", delta: pct(t?.tokens, p?.tokens) },
    { label: "Requests", value: t ? formatNumber(t.requests) : "—", delta: pct(t?.requests, p?.requests) },
    {
      label: "Avg latency",
      value: t ? `${(t.avgLatencyMs / 1000).toFixed(1)}s` : "—",
      delta: latencyDelta === null ? null : formatSigned(Number(latencyDelta.toFixed(1)), "s"),
      good: latencyDelta !== null && latencyDelta < 0,
    },
  ];
}

export function UsageView({ admin = false }: { admin?: boolean }) {
  const [range, setRange] = useState<UsageRange>(30);
  const mine = useUsage(range);
  const global = useAdminUsage(range, admin);
  const query = admin ? global : mine;
  const data: UsageSummary | undefined = query.data;
  const loading = query.isPending;
  const empty = !!data && data.totals.requests === 0;
  const stats = buildStats(data, range);

  const exportCsv = () => {
    if (!data) return;
    downloadCsv(`usage-${range}d.csv`, [["date", "cost_usd", "requests"], ...data.daily.map((d) => [d.date, d.costUsd.toFixed(4), d.requests])]);
  };

  const title = admin ? "Admin usage" : "Usage";
  const actions = (
    <>
      <div role="radiogroup" aria-label="Range" className="flex flex-none gap-0.5 rounded-full bg-secondary p-[3px]">
        {USAGE_RANGES.map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={range === n}
            onClick={() => setRange(n)}
            className={cn(
              "h-7 rounded-full px-3 text-[13px] font-medium",
              range === n ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,.08)]" : "text-muted-foreground"
            )}
          >
            {n}d
          </button>
        ))}
      </div>
      <Button variant="outline" onClick={exportCsv} disabled={!data} aria-label="Export CSV" className="flex-none">
        <Download className="size-[15px]" />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </>
  );

  return (
    <div className="min-h-screen">
      <PageHeader crumbs={admin ? [{ label: "Admin" }, { label: "Usage" }] : [{ label: "Usage" }]} actions={actions} />
      <PageContainer>
        <PageTitle title={title} description={admin ? `All users · ${RANGE_LONG[range]}` : `Your requests across all collections · ${RANGE_LONG[range]}`} />

        {query.isError && (
          <div className="mt-7">
            <EmptyState icon={ChartLine} title="Couldn't load usage" description={getErrorMessage(query.error)} action={<Button onClick={() => query.refetch()}>Try again</Button>} />
          </div>
        )}

        {empty && (
          <div className="mt-7">
            <EmptyState
              icon={ChartLine}
              title="No usage in this period"
              description="Costs and tokens appear here once you ask questions or upload documents."
              action={
                <Button asChild size="lg">
                  <Link href={routes.collections}>Go to collections</Link>
                </Button>
              }
            />
          </div>
        )}

        {!empty && !query.isError && (
          <>
            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              {stats.map((s) => (
                <div key={s.label} className={cn("rounded-xl border px-[18px] py-4", loading && "animate-dmpulse")}>
                  <div className="text-[13px] text-muted-foreground">{s.label}</div>
                  <div className="mt-2 text-[28px] font-semibold tracking-[-0.03em] tabular-nums">{s.value}</div>
                  {s.delta && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                      <span className={cn("font-medium", s.good ? "text-ok" : "text-fg2")}>{s.delta}</span>
                      <span className="text-faint">vs previous period</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <DailyCostChart data={data?.daily ?? []} loading={loading} />
            {data && <BreakdownCard byKind={data.byKind} totalCost={data.totals.costUsd} />}
            {admin && global.data && <TopUsersCard users={global.data.topUsers} />}
          </>
        )}
      </PageContainer>
    </div>
  );
}
