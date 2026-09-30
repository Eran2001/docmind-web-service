import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateEvalQuestionInput,
  CreateEvalSetInput,
} from "@docmind/shared";

import { EVAL_RUN_POLL_MS } from "@/configs/constants";
import { queryKeys } from "@/configs/query-keys";
import { evalsService } from "@/services/evals.service";

export function useEvalSets() {
  return useQuery({
    queryKey: queryKeys.evals.sets(),
    queryFn: evalsService.listSets,
  });
}

export function useEvalSet(id: string) {
  return useQuery({
    queryKey: queryKeys.evals.set(id),
    queryFn: () => evalsService.getSet(id),
    // Keep the header button and history current while any run is in flight.
    refetchInterval: (q) =>
      q.state.data?.runs.some(
        (r) => r.status === "queued" || r.status === "running",
      )
        ? EVAL_RUN_POLL_MS
        : false,
  });
}

export function useEvalRun(runId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.evals.run(runId ?? ""),
    queryFn: () => evalsService.getRun(runId as string),
    enabled: !!runId,
    refetchInterval: (q) =>
      q.state.data?.status === "queued" || q.state.data?.status === "running"
        ? EVAL_RUN_POLL_MS
        : false,
  });
}

export function useCreateEvalSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEvalSetInput) => evalsService.createSet(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.evals.sets() }),
  });
}

export function useAddEvalQuestion(setId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEvalQuestionInput) =>
      evalsService.addQuestion(setId, input),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.evals.set(setId) }),
        qc.invalidateQueries({ queryKey: queryKeys.evals.sets() }),
      ]),
  });
}

export function useDeleteEvalQuestion(setId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => evalsService.removeQuestion(questionId),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.evals.set(setId) }),
        qc.invalidateQueries({ queryKey: queryKeys.evals.sets() }),
      ]),
  });
}

export function useStartEvalRun(setId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => evalsService.startRun(setId),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.evals.set(setId) }),
        qc.invalidateQueries({ queryKey: queryKeys.evals.sets() }),
      ]),
  });
}
