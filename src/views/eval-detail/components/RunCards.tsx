"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { EvalRun } from "@/types";

import { cn } from "@/lib/utils";
import { formatSigned, formatUsd, percentChange } from "@/utils/format-cost";

interface CardSpec {
  label: string;
  value: number | null;
  previous: number | null | undefined;
  format: (v: number) => string;
  lowerIsBetter?: boolean;
  note: string;
}

function Card({
  label,
  value,
  previous,
  format,
  lowerIsBetter,
  note,
  loading,
}: CardSpec & { loading: boolean }) {
  const delta =
    value !== null && previous != null ? percentChange(value, previous) : null;
  const good = delta === null ? null : lowerIsBetter ? delta < 0 : delta > 0;
  return (
    <div
      className={cn(
        "rounded-xl border px-[18px] py-4",
        loading && "animate-dmpulse",
      )}
    >
      <div className="text-[13px] text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-[28px] font-semibold tracking-[-0.03em] tabular-nums">
          {value === null || loading ? "—" : format(value)}
        </span>
        {delta !== null && !loading && (
          <span
            className={cn(
              "inline-flex h-[22px] items-center gap-[3px] rounded-full px-2 text-xs font-medium",
              delta === 0
                ? "bg-secondary text-muted-foreground"
                : good
                  ? "bg-ok-bg text-ok"
                  : "bg-err-bg text-destructive",
            )}
          >
            {delta >= 0 ? (
              <ArrowUpRight className="size-3" strokeWidth={2} />
            ) : (
              <ArrowDownRight className="size-3" strokeWidth={2} />
            )}
            {formatSigned(delta)}
          </span>
        )}
      </div>
      <div className="mt-1 text-xs text-faint">{note}</div>
    </div>
  );
}

// `previous` is the next-older finished run, used for the trend chips.
export function RunCards({
  run,
  previous,
}: {
  run: EvalRun | undefined;
  previous: EvalRun | undefined;
}) {
  const loading = !run || run.status !== "done";
  const note = previous ? `vs run #${previous.number}` : "first run";
  const n2 = (v: number) => v.toFixed(2);
  const specs: CardSpec[] = [
    {
      label: "Correctness",
      value: run?.avgCorrectness ?? null,
      previous: previous?.avgCorrectness,
      format: n2,
      note,
    },
    {
      label: "Faithfulness",
      value: run?.avgFaithfulness ?? null,
      previous: previous?.avgFaithfulness,
      format: n2,
      note,
    },
    {
      label: "Retrieval hit rate",
      value: run?.retrievalHitRate ?? null,
      previous: previous?.retrievalHitRate,
      format: n2,
      note,
    },
    {
      label: "Cost",
      value: run?.totalCostUsd ?? null,
      previous: previous?.totalCostUsd,
      format: (v) => formatUsd(v, 3),
      lowerIsBetter: true,
      note: "judge + answer tokens",
    },
  ];
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
      {specs.map((s) => (
        <Card key={s.label} {...s} loading={loading} />
      ))}
    </div>
  );
}
