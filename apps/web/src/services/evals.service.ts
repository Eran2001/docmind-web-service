import type {
  CreateEvalQuestionInput,
  CreateEvalSetInput,
  EvalQuestion,
  EvalRun,
  EvalRunDetail,
  EvalSetDetail,
  EvalSetSummary,
} from "@docmind/shared";

import { api } from "@/lib/axios";

export const evalsService = {
  async listSets(): Promise<EvalSetSummary[]> {
    const { data } = await api.get<{ items: EvalSetSummary[] }>("/evals/sets");
    return data.items;
  },
  async createSet(input: CreateEvalSetInput): Promise<EvalSetSummary> {
    const { data } = await api.post<EvalSetSummary>("/evals/sets", input);
    return data;
  },
  async getSet(id: string): Promise<EvalSetDetail> {
    const { data } = await api.get<EvalSetDetail>(`/evals/sets/${id}`);
    return data;
  },
  async removeSet(id: string): Promise<void> {
    await api.delete(`/evals/sets/${id}`);
  },
  async addQuestion(
    setId: string,
    input: CreateEvalQuestionInput,
  ): Promise<EvalQuestion> {
    const { data } = await api.post<EvalQuestion>(
      `/evals/sets/${setId}/questions`,
      input,
    );
    return data;
  },
  async removeQuestion(questionId: string): Promise<void> {
    await api.delete(`/evals/questions/${questionId}`);
  },
  async startRun(setId: string): Promise<EvalRun> {
    const { data } = await api.post<EvalRun>(`/evals/sets/${setId}/runs`, {});
    return data;
  },
  async getRun(runId: string): Promise<EvalRunDetail> {
    const { data } = await api.get<EvalRunDetail>(`/evals/runs/${runId}`);
    return data;
  },
};
