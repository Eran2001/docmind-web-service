import type { CreateEvalQuestionInput, CreateEvalSetInput } from "@/schemas";
import type { EvalQuestion, EvalRun, EvalRunDetail, EvalSetDetail, EvalSetSummary } from "@/types";

import { privateApi } from "@/lib/api/private.api";

export const evalsService = {
  async listSets(): Promise<EvalSetSummary[]> {
    const { data } = await privateApi.get<{ items: EvalSetSummary[] }>("/evals/sets");
    return data.items;
  },
  async createSet(input: CreateEvalSetInput): Promise<EvalSetSummary> {
    const { data } = await privateApi.post<EvalSetSummary>("/evals/sets", input);
    return data;
  },
  async getSet(id: string): Promise<EvalSetDetail> {
    const { data } = await privateApi.get<EvalSetDetail>(`/evals/sets/${id}`);
    return data;
  },
  async removeSet(id: string): Promise<void> {
    await privateApi.delete(`/evals/sets/${id}`);
  },
  async addQuestion(
    setId: string,
    input: CreateEvalQuestionInput,
  ): Promise<EvalQuestion> {
    const { data } = await privateApi.post<EvalQuestion>(
      `/evals/sets/${setId}/questions`,
      input,
    );
    return data;
  },
  async removeQuestion(questionId: string): Promise<void> {
    await privateApi.delete(`/evals/questions/${questionId}`);
  },
  async startRun(setId: string): Promise<EvalRun> {
    const { data } = await privateApi.post<EvalRun>(`/evals/sets/${setId}/runs`, {});
    return data;
  },
  async getRun(runId: string): Promise<EvalRunDetail> {
    const { data } = await privateApi.get<EvalRunDetail>(`/evals/runs/${runId}`);
    return data;
  },
};
