import type { CreateEvalQuestionInput, CreateEvalSetInput } from "@/schemas";
import type {
  ApiEnvelope,
  EvalQuestion,
  EvalRun,
  EvalRunDetail,
  EvalSetDetail,
  EvalSetSummary,
} from "@/types";

import { privateApi } from "@/lib/api/private.api";

type EvalSetDto = Omit<EvalSetSummary, "id"> & { resourceId: string };
type EvalQuestionDto = Omit<EvalQuestion, "id"> & { resourceId: string };
type EvalRunDto = Omit<EvalRun, "id"> & { resourceId: string };
type EvalSetDetailDto = Omit<EvalSetDetail, "id" | "questions" | "runs"> & {
  resourceId: string;
  questions: EvalQuestionDto[];
  runs: EvalRunDto[];
};
type EvalRunDetailDto = Omit<EvalRunDetail, "id"> & { resourceId: string };

export const evalsService = {
  async listSets(): Promise<EvalSetSummary[]> {
    const { data } = await privateApi.get<
      { result: EvalSetDto[] } | { items: EvalSetSummary[] }
    >("/evals/sets");
    return "result" in data
      ? data.result.map((set) => ({ ...set, id: set.resourceId }))
      : data.items;
  },
  async createSet(input: CreateEvalSetInput): Promise<EvalSetSummary> {
    const { data: envelope } = await privateApi.post<
      ApiEnvelope<{ result: true }>
    >("/evals/sets", input, {
      preserveEnvelope: true,
    });
    if (!envelope.resourceId)
      throw new Error("Eval set creation returned no resourceId.");
    const { data } = await privateApi.get<EvalSetDetailDto>(
      `/evals/sets/${envelope.resourceId}`,
    );
    return mapSetSummary(data);
  },
  async getSet(id: string): Promise<EvalSetDetail> {
    const { data } = await privateApi.get<EvalSetDetailDto | EvalSetDetail>(
      `/evals/sets/${id}`,
    );
    return "resourceId" in data ? mapSetDetail(data) : data;
  },
  async removeSet(id: string): Promise<void> {
    await privateApi.delete(`/evals/sets/${id}`);
  },
  async addQuestion(
    setId: string,
    input: CreateEvalQuestionInput,
  ): Promise<EvalQuestion> {
    const { data: envelope } = await privateApi.post<
      ApiEnvelope<{ result: true }>
    >(`/evals/sets/${setId}/questions`, input, { preserveEnvelope: true });
    if (!envelope.resourceId)
      throw new Error("Eval question creation returned no resourceId.");
    const set = await this.getSet(setId);
    const question = set.questions.find(
      (item) => item.id === envelope.resourceId,
    );
    if (!question)
      throw new Error("Created eval question could not be loaded.");
    return question;
  },
  async removeQuestion(questionId: string): Promise<void> {
    await privateApi.delete(`/evals/questions/${questionId}`);
  },
  async startRun(setId: string): Promise<EvalRun> {
    const { data: envelope } = await privateApi.post<
      ApiEnvelope<{ result: true }>
    >(`/evals/sets/${setId}/runs`, {}, { preserveEnvelope: true });
    if (!envelope.resourceId)
      throw new Error("Eval run creation returned no resourceId.");
    const { data } = await privateApi.get<EvalRunDetailDto>(
      `/evals/runs/${envelope.resourceId}`,
    );
    return mapRun(data);
  },
  async getRun(runId: string): Promise<EvalRunDetail> {
    const { data } = await privateApi.get<EvalRunDetailDto | EvalRunDetail>(
      `/evals/runs/${runId}`,
    );
    return "resourceId" in data ? { ...data, id: data.resourceId } : data;
  },
};

function mapSetSummary(set: EvalSetDto): EvalSetSummary {
  const { resourceId, ...fields } = set;
  return { ...fields, id: resourceId };
}

function mapQuestion(question: EvalQuestionDto): EvalQuestion {
  const { resourceId, ...fields } = question;
  return { ...fields, id: resourceId };
}

function mapRun(run: EvalRunDto): EvalRun {
  const { resourceId, ...fields } = run;
  return { ...fields, id: resourceId };
}

function mapSetDetail(set: EvalSetDetailDto): EvalSetDetail {
  return {
    ...mapSetSummary(set),
    questions: set.questions.map(mapQuestion),
    runs: set.runs.map(mapRun),
  };
}
