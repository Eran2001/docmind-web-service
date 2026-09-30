"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { UsageDailyPoint } from "@docmind/shared";

import { Bone } from "@/components/common/Skeletons";
import { formatUsd } from "@/utils/format-cost";
import { formatChartDate } from "@/utils/format-date";

const tick = { fill: "var(--faint)", fontSize: 11, fontFamily: "var(--font-mono)" };

function ChartTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> }) {
  const point = payload?.[0]?.payload as UsageDailyPoint | undefined;
  if (!active || !point) return null;
  return (
    <div className="rounded-[10px] border bg-background px-2.5 py-2 text-xs whitespace-nowrap shadow-pop">
      <div className="text-muted-foreground">{formatChartDate(point.date, true)}</div>
      <div className="text-sm font-semibold tabular-nums">{formatUsd(point.costUsd)}</div>
      <div className="font-mono text-[11px] text-faint">{point.requests.toLocaleString("en-US")} requests</div>
    </div>
  );
}

export function DailyCostChart({ data, loading }: { data: UsageDailyPoint[]; loading: boolean }) {
  const peak = data.reduce((m, p) => Math.max(m, p.costUsd), 0);

  return (
    <div className="mt-4 rounded-xl border px-5 pt-5 pb-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">Daily cost</h2>
        <span className="text-[13px] whitespace-nowrap text-muted-foreground">USD · peak {formatUsd(peak)}</span>
      </div>
      <div className="mt-5 h-[220px]">
        {loading ? (
          <Bone className="h-full animate-dmpulse rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 4, left: 0, bottom: 0 }} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" tickFormatter={(d: string) => formatChartDate(d)} axisLine={false} tickLine={false} tick={tick} tickMargin={8} minTickGap={48} />
              <YAxis tickFormatter={(v: number) => `$${v}`} axisLine={false} tickLine={false} tick={tick} width={44} domain={[0, "auto"]} />
              <Tooltip content={(p) => <ChartTooltip active={p.active} payload={p.payload} />} cursor={{ stroke: "var(--border2)" }} isAnimationActive={false} />
              <Area
                type="linear"
                dataKey="costUsd"
                stroke="var(--foreground)"
                strokeWidth={1.5}
                fill="var(--foreground)"
                fillOpacity={0.045}
                activeDot={{ r: 4.5, fill: "var(--background)", stroke: "var(--foreground)", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
