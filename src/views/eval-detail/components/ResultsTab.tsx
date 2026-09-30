"use client";

import { Play } from "lucide-react";
import type { EvalRunDetail } from "@/types";

import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { ResultsTable } from "@/views/eval-detail/components/ResultsTable";

interface Props {
  hasRuns: boolean;
  loading: boolean;
  run: EvalRunDetail | undefined;
  runLoading: boolean;
  running: boolean;
  onRun: () => void;
  /** Rows to show as placeholders while results load. */
  questionCount?: number;
}

export function ResultsTab({
  hasRuns,
  loading,
  run,
  runLoading,
  running,
  onRun,
  questionCount,
}: Props) {
  if (!loading && !hasRuns) {
    return (
      <EmptyState
        className="mt-4 py-14"
        icon={Play}
        title="No runs yet"
        description="Add questions, then run the eval to score correctness, faithfulness and retrieval."
        action={
          <Button size="lg" onClick={onRun} disabled={running}>
            <Play className="size-3.5" />
            Run eval
          </Button>
        }
      />
    );
  }
  return <ResultsTable run={run} loading={loading || runLoading} questionCount={questionCount} />;
}
