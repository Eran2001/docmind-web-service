import type {
  EvalResult,
  EvalRun,
  EvalRunDetail,
  EvalSetDetail,
  EvalSetSummary,
} from "@docmind/shared";

import { getDb, type MockQuestion, type MockRun } from "@/lib/mock/db";

const PER_QUESTION_MS = 450;
const QUEUED_MS = 600;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

const round2 = (n: number) =>
  Math.round(Math.min(1, Math.max(0, n)) * 100) / 100;

function resultFor(q: MockQuestion, run: MockRun): EvalResult {
  const jitter = (key: string) =>
    (hash(`${run.id}:${q.id}:${key}`) - 0.5) * 0.16;
  const b = q.base;
  const correctness = b
    ? run.fixed
      ? round2(b.correctness + (run.number === 14 ? 0 : jitter("c")))
      : b.correctness
    : round2(0.55 + hash(`${q.id}:c`) * 0.45 + jitter("c"));
  const faithfulness = b
    ? b.faithfulness
    : round2(0.7 + hash(`${q.id}:f`) * 0.3);
  return {
    questionId: q.id,
    question: q.question,
    expectedAnswer: q.expectedAnswer,
    expectedDocumentTitle: q.expectedDocumentTitle,
    generatedAnswer: b?.generated ?? `Generated answer for “${q.question}”.`,
    correctness,
    faithfulness,
    retrievalHit: b ? b.hit : hash(`${q.id}:h`) > 0.2,
    judgeReasoning:
      b?.reasoning ??
      "Answer is consistent with the expected answer and grounded in the retrieved passages.",
  };
}

function setQuestions(setId: string): MockQuestion[] {
  return getDb().evalQuestions.filter((q) => q.evalSetId === setId);
}

function progressOf(run: MockRun, now: number) {
  if (run.fixed) return { status: "done" as const, done: run.total };
  const elapsed = now - run.startedAt;
  if (elapsed < QUEUED_MS) return { status: "queued" as const, done: 0 };
  const done = Math.min(
    run.total,
    Math.floor((elapsed - QUEUED_MS) / PER_QUESTION_MS),
  );
  return {
    status: done >= run.total ? ("done" as const) : ("running" as const),
    done,
  };
}

export function resolveRun(run: MockRun, now = Date.now()): EvalRun {
  const { status, done } = progressOf(run, now);
  const base = {
    id: run.id,
    evalSetId: run.evalSetId,
    number: run.number,
    judgeModel: run.judgeModel,
    progress: { done, total: run.total },
    startedAt: new Date(run.startedAt).toISOString(),
    createdAt: new Date(run.startedAt).toISOString(),
  };
  if (status !== "done") {
    return {
      ...base,
      status,
      avgCorrectness: null,
      avgFaithfulness: null,
      retrievalHitRate: null,
      totalCostUsd: null,
      totalTokens: null,
      finishedAt: null,
      durationMs: null,
    };
  }
  if (run.fixed) {
    const f = run.fixed;
    return {
      ...base,
      status,
      avgCorrectness: f.correctness,
      avgFaithfulness: f.faithfulness,
      retrievalHitRate: f.hitRate,
      totalCostUsd: f.costUsd,
      totalTokens: f.tokens,
      durationMs: f.durationMs,
      finishedAt: new Date(run.startedAt + f.durationMs).toISOString(),
    };
  }
  const results = setQuestions(run.evalSetId).map((q) => resultFor(q, run));
  const avg = (pick: (r: EvalResult) => number) =>
    results.length
      ? results.reduce((a, r) => a + pick(r), 0) / results.length
      : 0;
  const durationMs = QUEUED_MS + run.total * PER_QUESTION_MS;
  return {
    ...base,
    status,
    avgCorrectness: round2(avg((r) => r.correctness)),
    avgFaithfulness: round2(avg((r) => r.faithfulness)),
    retrievalHitRate: round2(avg((r) => (r.retrievalHit ? 1 : 0))),
    totalCostUsd: Math.round(run.total * 0.0052 * 1000) / 1000,
    totalTokens: run.total * 5300,
    durationMs,
    finishedAt: new Date(run.startedAt + durationMs).toISOString(),
  };
}

export function resolveRunDetail(run: MockRun): EvalRunDetail {
  const resolved = resolveRun(run);
  const results =
    resolved.status === "done"
      ? setQuestions(run.evalSetId).map((q) => resultFor(q, run))
      : [];
  return { ...resolved, results };
}

export function summarizeSet(setId: string): EvalSetSummary | null {
  const db = getDb();
  const set = db.evalSets.find((s) => s.id === setId);
  if (!set) return null;
  const runs = db.evalRuns
    .filter((r) => r.evalSetId === setId)
    .map((r) => resolveRun(r));
  const last = runs
    .filter((r) => r.status === "done")
    .sort((a, b) => b.number - a.number)[0];
  return {
    id: set.id,
    name: set.name,
    description: set.description,
    collectionId: set.collectionId,
    collectionName:
      db.collections.find((c) => c.id === set.collectionId)?.name ??
      "Unknown collection",
    questionCount: setQuestions(setId).length,
    lastRun:
      last?.finishedAt && last.avgCorrectness != null
        ? { avgCorrectness: last.avgCorrectness, finishedAt: last.finishedAt }
        : null,
  };
}

export function detailForSet(setId: string): EvalSetDetail | null {
  const summary = summarizeSet(setId);
  if (!summary) return null;
  const db = getDb();
  return {
    ...summary,
    questions: setQuestions(setId).map(({ evalSetId: _s, base: _b, ...q }) => {
      void _s;
      void _b;
      return q;
    }),
    runs: db.evalRuns
      .filter((r) => r.evalSetId === setId)
      .map((r) => resolveRun(r))
      .sort((a, b) => b.number - a.number),
  };
}
