import type {
  Collection,
  Conversation,
  DocumentDto,
  DocumentStatus,
  EvalQuestion,
  Message,
  User,
} from "@docmind/shared";

import {
  ANSWERS,
  CHUNKS,
  DOC_IDS,
  HANDBOOK_COLLECTION_ID,
  SEED_THREADS,
} from "@/lib/mock/answers";

const STORAGE_KEY = "docmind.mock.v2";
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export interface MockPipeline {
  startedAt: number;
  queuedMs: number;
  processingMs: number;
  outcome: {
    status: "ready" | "failed";
    chunkCount: number;
    pageCount: number | null;
    errorMessage: string | null;
  };
}

export interface MockDocument extends DocumentDto {
  contentHash: string;
  pipeline?: MockPipeline;
}

export interface MockQuestion extends EvalQuestion {
  evalSetId: string;
  // Canned judge output for the seeded handbook questions.
  base?: {
    generated: string;
    correctness: number;
    faithfulness: number;
    hit: boolean;
    reasoning: string;
  };
}

export interface MockRun {
  id: string;
  evalSetId: string;
  number: number;
  startedAt: number;
  total: number;
  judgeModel: string;
  // Seeded runs keep fixed metrics; new runs derive them from their results.
  fixed?: {
    correctness: number;
    faithfulness: number;
    hitRate: number;
    costUsd: number;
    durationMs: number;
    tokens: number;
  };
}

export interface MockEvalSet {
  id: string;
  name: string;
  description: string | null;
  collectionId: string;
  createdAt: string;
}

export interface MockDb {
  user: User | null;
  collections: Collection[];
  documents: MockDocument[];
  conversations: Conversation[];
  messages: Message[];
  evalSets: MockEvalSet[];
  evalQuestions: MockQuestion[];
  evalRuns: MockRun[];
}

let cache: MockDb | null = null;

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function iso(msAgo: number): string {
  return new Date(Date.now() - msAgo).toISOString();
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function doc(
  id: string,
  collectionId: string,
  title: string,
  type: "pdf" | "docx" | "md" | "txt" | "url",
  status: DocumentStatus,
  chunkCount: number,
  pageCount: number | null,
  agoMs: number,
  errorMessage: string | null = null,
): MockDocument {
  const isUrl = type === "url";
  const at = iso(agoMs);
  return {
    id,
    collectionId,
    sourceType: isUrl ? "url" : "file",
    title,
    originalFilename: isUrl ? null : title,
    sourceUrl: isUrl ? `https://${title}` : null,
    mimeType: isUrl ? "text/html" : type === "pdf" ? "application/pdf" : null,
    sizeBytes: isUrl ? null : (pageCount ?? 4) * 41_000,
    pageCount,
    status,
    errorMessage,
    chunkCount,
    createdAt: at,
    updatedAt: at,
    contentHash: `${title}:${id}`,
  };
}

function seedDocuments(): MockDocument[] {
  const h = HANDBOOK_COLLECTION_ID;
  const docs: MockDocument[] = [
    doc(
      DOC_IDS.handbook,
      h,
      "Employee_Handbook_2026.pdf",
      "pdf",
      "ready",
      312,
      86,
      6 * DAY + 3 * HOUR,
    ),
    doc(
      DOC_IDS.parental,
      h,
      "Parental_Leave_Policy.docx",
      "docx",
      "ready",
      48,
      12,
      6 * DAY + 2 * HOUR,
    ),
    doc(
      DOC_IDS.remote,
      h,
      "Remote_Work_Guidelines.pdf",
      "pdf",
      "ready",
      58,
      18,
      5 * HOUR,
    ),
    doc(
      DOC_IDS.benefits,
      h,
      "benefits.acme.com/2026-open-enrollment",
      "url",
      "ready",
      36,
      null,
      7 * DAY,
    ),
    doc(
      DOC_IDS.travel,
      h,
      "Travel_and_Expense_Policy.pdf",
      "pdf",
      "failed",
      0,
      null,
      8 * DAY,
      "Text extraction failed: the PDF is password-protected. Remove the password and upload again.",
    ),
    doc(
      DOC_IDS.conduct,
      h,
      "Code_of_Conduct.md",
      "md",
      "ready",
      22,
      6,
      10 * DAY,
    ),
    doc(
      DOC_IDS.it,
      h,
      "IT_Acceptable_Use.txt",
      "txt",
      "ready",
      14,
      null,
      4 * HOUR,
    ),
    doc(
      DOC_IDS.holiday,
      h,
      "Holiday_Calendar_2026.pdf",
      "pdf",
      "ready",
      4,
      2,
      12 * DAY,
    ),
  ];
  // Make the last two seeded docs visibly move through the pipeline on first load.
  const remote = docs[2];
  const it = docs[6];
  if (remote)
    remote.pipeline = {
      startedAt: Date.now() - 1200,
      queuedMs: 0,
      processingMs: 6000,
      outcome: {
        status: "ready",
        chunkCount: 58,
        pageCount: 18,
        errorMessage: null,
      },
    };
  if (it)
    it.pipeline = {
      startedAt: Date.now(),
      queuedMs: 4000,
      processingMs: 4000,
      outcome: {
        status: "ready",
        chunkCount: 14,
        pageCount: null,
        errorMessage: null,
      },
    };

  const rand = rng(7);
  const generated: [string, string, number, string[]][] = [
    [
      "col-board",
      "Board",
      9,
      [
        "Q3_Board_Deck",
        "Financial_Statements_Q3",
        "Board_Minutes",
        "CFO_Report",
        "Audit_Committee_Notes",
      ],
    ],
    [
      "col-api",
      "API",
      42,
      [
        "Auth_Reference",
        "Webhooks_Guide",
        "SDK_Node",
        "SDK_Python",
        "Errors_and_Status_Codes",
        "Rate_Limits",
        "Changelog_v4",
      ],
    ],
    [
      "col-vendor",
      "Vendor",
      27,
      [
        "MSA_Acme_Cloud",
        "DPA_Analytics_Co",
        "Order_Form_Q3",
        "SLA_Support_Partner",
        "NDA_Contractor",
      ],
    ],
    [
      "col-security",
      "Security",
      18,
      [
        "SOC2_Type_II_Report",
        "ISO27001_Policies",
        "Pentest_Summary",
        "Incident_Response_Plan",
        "Access_Control_Policy",
      ],
    ],
    [
      "col-support",
      "Support",
      11,
      [
        "Escalation_Paths",
        "Refund_Policy",
        "Macros_Tier1",
        "Macros_Tier2",
        "Tone_Guide",
      ],
    ],
  ];
  for (const [colId, , count, names] of generated) {
    for (let i = 0; i < count; i++) {
      const base = names[i % names.length] ?? "Document";
      const pages = 2 + Math.floor(rand() * 40);
      docs.push(
        doc(
          `${colId}-d${i}`,
          colId,
          `${base}${i >= names.length ? `_${Math.floor(i / names.length) + 1}` : ""}.pdf`,
          "pdf",
          "ready",
          Math.round(pages * 3.6),
          pages,
          (2 + i) * DAY,
        ),
      );
    }
  }
  return docs;
}

function seedCollections(): Collection[] {
  const mk = (
    id: string,
    name: string,
    description: string,
    agoMs: number,
  ): Collection => ({
    id,
    name,
    description,
    documentCount: 0,
    createdAt: iso(agoMs + 30 * DAY),
    updatedAt: iso(agoMs),
  });
  return [
    mk(
      HANDBOOK_COLLECTION_ID,
      "Employee Handbook 2026",
      "Policies, benefits, leave and code of conduct for all full-time and part-time staff.",
      2 * HOUR,
    ),
    mk(
      "col-board",
      "Q3 Board Reports",
      "Board decks, financial statements and minutes from the Q3 2026 board meeting.",
      DAY,
    ),
    mk(
      "col-api",
      "API Documentation",
      "Public REST API reference, SDK guides and changelog for platform v4.",
      3 * DAY,
    ),
    mk(
      "col-vendor",
      "Vendor Contracts",
      "Signed MSAs, DPAs and order forms with active suppliers.",
      12 * DAY,
    ),
    mk(
      "col-security",
      "Security & Compliance",
      "SOC 2 Type II report, ISO 27001 policies and penetration test summaries.",
      18 * DAY,
    ),
    mk(
      "col-support",
      "Customer Support Playbooks",
      "Escalation paths, refund policy and response macros for tier 1–3 agents.",
      31 * DAY,
    ),
  ];
}

function seedConversations(): {
  conversations: Conversation[];
  messages: Message[];
} {
  const conversations: Conversation[] = [];
  const messages: Message[] = [];
  for (const t of SEED_THREADS) {
    const created = iso(t.agoMs + 5 * MIN);
    conversations.push({
      id: t.id,
      collectionId: HANDBOOK_COLLECTION_ID,
      title: t.title,
      createdAt: created,
      updatedAt: iso(t.agoMs),
    });
    t.exchanges.forEach((ex, i) => {
      const ans = ANSWERS[ex.a];
      if (!ans) return;
      const at = iso(t.agoMs + (t.exchanges.length - i) * 20_000);
      messages.push({
        id: `${t.id}-m${i}u`,
        conversationId: t.id,
        role: "user",
        content: ex.q,
        citations: [],
        status: "complete",
        latencyMs: null,
        usage: null,
        feedback: null,
        createdAt: at,
      });
      messages.push({
        id: `${t.id}-m${i}a`,
        conversationId: t.id,
        role: "assistant",
        content: ans.content,
        citations: ans.cites.map((key, n) => {
          const c = CHUNKS[key];
          return {
            marker: n + 1,
            chunkId: key,
            documentId: c?.docId ?? DOC_IDS.handbook,
            documentTitle: docTitle(c?.docId),
            pageNumber: c?.page ?? null,
            snippet: (c?.hl ?? "").slice(0, 240),
            score: c?.score,
          };
        }),
        status: "complete",
        latencyMs: ans.latencyMs,
        usage: {
          inputTokens: Math.round(ans.tokens * 0.82),
          outputTokens: Math.round(ans.tokens * 0.18),
          costUsd: ans.costUsd,
        },
        retrieval: { documents: 8, passages: ans.passages },
        feedback: null,
        createdAt: at,
      });
    });
  }
  return { conversations, messages };
}

const DOC_TITLES: Record<string, string> = {
  [DOC_IDS.handbook]: "Employee_Handbook_2026.pdf",
  [DOC_IDS.parental]: "Parental_Leave_Policy.docx",
  [DOC_IDS.remote]: "Remote_Work_Guidelines.pdf",
  [DOC_IDS.benefits]: "benefits.acme.com/2026-open-enrollment",
  [DOC_IDS.conduct]: "Code_of_Conduct.md",
};

export function docTitle(id: string | undefined): string {
  return (id && DOC_TITLES[id]) || "Document";
}

function seedEvals(): Pick<MockDb, "evalSets" | "evalQuestions" | "evalRuns"> {
  const h = HANDBOOK_COLLECTION_ID;
  const sets: MockEvalSet[] = [
    {
      id: "eval-handbook",
      name: "Handbook regression",
      description: "HR policy questions checked after every upload",
      collectionId: h,
      createdAt: iso(20 * DAY),
    },
    {
      id: "eval-board",
      name: "Board report Q&A",
      description: "Financial figures and decisions from Q3",
      collectionId: "col-board",
      createdAt: iso(20 * DAY),
    },
    {
      id: "eval-api",
      name: "API reference coverage",
      description: "Endpoint, parameter and error-code lookups",
      collectionId: "col-api",
      createdAt: iso(20 * DAY),
    },
    {
      id: "eval-vendor",
      name: "Contract clause lookup",
      description: "Termination, liability and renewal terms",
      collectionId: "col-vendor",
      createdAt: iso(20 * DAY),
    },
    {
      id: "eval-soc2",
      name: "SOC 2 control questions",
      description: "Security questionnaire answers",
      collectionId: "col-security",
      createdAt: iso(20 * DAY),
    },
  ];
  const q = (
    id: string,
    question: string,
    expectedAnswer: string,
    docId: string,
    base: MockQuestion["base"],
  ): MockQuestion => ({
    id,
    evalSetId: "eval-handbook",
    question,
    expectedAnswer,
    expectedDocumentId: docId,
    expectedDocumentTitle: docTitle(docId),
    base,
  });
  const questions: MockQuestion[] = [
    q(
      "q1",
      "How many weeks of parental leave do full-time employees get?",
      "16 weeks at 100% of base salary, after 90 days of continuous employment.",
      DOC_IDS.handbook,
      {
        generated:
          "Full-time employees receive 16 weeks of fully paid parental leave once they have completed 90 days of continuous employment.",
        correctness: 1,
        faithfulness: 1,
        hit: true,
        reasoning:
          "The answer matches the expected answer on duration (16 weeks), pay (100% of base) and the 90-day eligibility condition. Every claim is supported by the retrieved passage on p. 42.",
      },
    ),
    q(
      "q2",
      "Can unused PTO be carried over to next year?",
      "Yes, up to 5 days, which must be used by March 31.",
      DOC_IDS.handbook,
      {
        generated:
          "Yes. Up to 5 unused PTO days carry into the next year and must be used by March 31; anything above that is lost.",
        correctness: 1,
        faithfulness: 0.95,
        hit: true,
        reasoning:
          "Correct and complete. “Lost” paraphrases “forfeited” in the source; acceptable, with a small faithfulness deduction for the looser wording.",
      },
    ),
    q(
      "q3",
      "What is the home office stipend for remote employees?",
      "$750 one-time, plus a $50 monthly connectivity allowance.",
      DOC_IDS.remote,
      {
        generated:
          "Remote employees receive a one-time home office stipend of $750.",
        correctness: 0.6,
        faithfulness: 1,
        hit: true,
        reasoning:
          "Partially correct. The $750 stipend is stated, but the $50 monthly connectivity allowance from the expected answer is missing. No unsupported claims.",
      },
    ),
    q(
      "q4",
      "How long can I work from another country?",
      "Up to 20 working days per calendar year, with prior approval.",
      DOC_IDS.remote,
      {
        generated:
          "You can work abroad for up to 30 days per year with approval from your manager.",
        correctness: 0.2,
        faithfulness: 0.4,
        hit: false,
        reasoning:
          "Incorrect duration (30 days vs. 20 working days). The expected passage on p. 9 was not retrieved; the answer relies on a chunk from a superseded 2025 travel memo. Consider removing the outdated document or boosting recency.",
      },
    ),
    q(
      "q5",
      "When must expense reports be submitted?",
      "Within 30 days of the expense, with itemized receipts over $25.",
      DOC_IDS.handbook,
      {
        generated:
          "Within 30 days of the expense date, in Expensify, with itemized receipts for anything over $25.",
        correctness: 1,
        faithfulness: 1,
        hit: true,
        reasoning:
          "Fully correct and grounded in the retrieved passage on p. 72.",
      },
    ),
    q(
      "q6",
      "Who approves expense reports submitted late?",
      "A VP, for reports submitted more than 90 days after the expense.",
      DOC_IDS.handbook,
      {
        generated:
          "Reports submitted more than 90 days after the expense require VP approval.",
        correctness: 1,
        faithfulness: 1,
        hit: true,
        reasoning:
          "Correct. Matches the expected answer and cites the right section.",
      },
    ),
    q(
      "q7",
      "Does the 401(k) match vest immediately?",
      "Yes, the match vests immediately.",
      DOC_IDS.benefits,
      {
        generated: "Yes. The company 401(k) match vests immediately.",
        correctness: 1,
        faithfulness: 0.9,
        hit: false,
        reasoning:
          "Correct, but retrieval missed the expected benefits page. The answer was grounded in a handbook summary on p. 47 that restates the policy, so it is faithful to what was retrieved.",
      },
    ),
    q(
      "q8",
      "How much notice is required before parental leave?",
      "At least 30 days' written notice, where foreseeable.",
      DOC_IDS.parental,
      {
        generated:
          "Give your manager and People Ops at least 30 days' notice before your planned start date.",
        correctness: 0.9,
        faithfulness: 1,
        hit: true,
        reasoning:
          "Mostly correct. Omits that the notice must be in writing; otherwise matches the expected answer.",
      },
    ),
  ];
  const filler: [string, string, number][] = [
    ["eval-board", "Board", 25],
    ["eval-api", "API", 120],
    ["eval-vendor", "Contract", 32],
    ["eval-soc2", "SOC 2", 58],
  ];
  for (const [setId, label, n] of filler) {
    for (let i = 1; i <= n; i++) {
      questions.push({
        id: `${setId}-q${i}`,
        evalSetId: setId,
        question: `${label} question ${i}: what does the documentation say about topic ${i}?`,
        expectedAnswer: `Expected answer for ${label.toLowerCase()} topic ${i}.`,
        expectedDocumentId: null,
        expectedDocumentTitle: null,
      });
    }
  }
  const run = (
    id: string,
    setId: string,
    number: number,
    agoMs: number,
    total: number,
    c: number,
    f: number,
    hit: number,
    cost: number,
    dur: number,
    tokens: number,
  ): MockRun => ({
    id,
    evalSetId: setId,
    number,
    startedAt: Date.now() - agoMs,
    total,
    judgeModel: "claude-sonnet-4.5",
    fixed: {
      correctness: c,
      faithfulness: f,
      hitRate: hit,
      costUsd: cost,
      durationMs: dur,
      tokens,
    },
  });
  const runs: MockRun[] = [
    run(
      "run-14",
      "eval-handbook",
      14,
      2 * HOUR,
      8,
      0.86,
      0.92,
      0.8,
      0.042,
      192_000,
      212_480,
    ),
    run(
      "run-13",
      "eval-handbook",
      13,
      2 * DAY,
      8,
      0.83,
      0.91,
      0.75,
      0.046,
      210_000,
      220_100,
    ),
    run(
      "run-12",
      "eval-handbook",
      12,
      7 * DAY,
      8,
      0.79,
      0.88,
      0.78,
      0.044,
      201_000,
      216_900,
    ),
    run(
      "run-11",
      "eval-handbook",
      11,
      14 * DAY,
      8,
      0.74,
      0.85,
      0.7,
      0.051,
      228_000,
      231_400,
    ),
    run(
      "run-b1",
      "eval-board",
      1,
      DAY,
      25,
      0.78,
      0.86,
      0.72,
      0.09,
      310_000,
      420_000,
    ),
    run(
      "run-a1",
      "eval-api",
      1,
      4 * DAY,
      120,
      0.91,
      0.94,
      0.9,
      0.31,
      900_000,
      1_100_000,
    ),
    run(
      "run-v1",
      "eval-vendor",
      1,
      11 * DAY,
      32,
      0.64,
      0.8,
      0.6,
      0.11,
      340_000,
      470_000,
    ),
  ];
  return { evalSets: sets, evalQuestions: questions, evalRuns: runs };
}

function seed(): MockDb {
  const { conversations, messages } = seedConversations();
  return {
    user: null,
    collections: seedCollections(),
    documents: seedDocuments(),
    conversations,
    messages,
    ...seedEvals(),
  };
}

export function getDb(): MockDb {
  if (cache) return cache;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        cache = JSON.parse(raw) as MockDb;
        return cache;
      }
    } catch {
      // fall through to a fresh seed
    }
  }
  cache = seed();
  saveDb();
  return cache;
}

export function saveDb() {
  if (typeof window === "undefined" || !cache) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or disabled; the mock keeps working in memory
  }
}

export function resetDb() {
  cache = null;
  if (typeof window !== "undefined")
    window.localStorage.removeItem(STORAGE_KEY);
}

// Status is derived from elapsed time so no timers are needed to animate ingestion.
export function resolveDocument(
  d: MockDocument,
  now = Date.now(),
): DocumentDto {
  const { contentHash: _hash, pipeline, ...dto } = d;
  void _hash;
  if (!pipeline) return dto;
  const elapsed = now - pipeline.startedAt;
  if (elapsed < pipeline.queuedMs)
    return { ...dto, status: "queued", chunkCount: 0, errorMessage: null };
  if (elapsed < pipeline.queuedMs + pipeline.processingMs)
    return { ...dto, status: "processing", chunkCount: 0, errorMessage: null };
  return { ...dto, ...pipeline.outcome };
}

export function getUserId(): string {
  return getDb().user?.id ?? "user-1";
}
