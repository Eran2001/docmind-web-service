// Content ported from docmind-design/05-Chat.html (mock data), used only by the in-browser mock API.

export const DOC_IDS = {
  handbook: "doc-handbook",
  parental: "doc-parental",
  remote: "doc-remote",
  benefits: "doc-benefits",
  travel: "doc-travel",
  conduct: "doc-conduct",
  it: "doc-it",
  holiday: "doc-holiday",
} as const;

export const HANDBOOK_COLLECTION_ID = "col-handbook";

export interface ChunkSeed {
  docId: string;
  page: number | null;
  heading: string;
  before: string;
  hl: string;
  after: string;
  score: number;
  index: number;
  count: number;
}

const hb = DOC_IDS.handbook;
const pl = DOC_IDS.parental;
const rw = DOC_IDS.remote;

export const CHUNKS: Record<string, ChunkSeed> = {
  hb5: {
    docId: hb,
    page: 5,
    heading: "1.3 Using this handbook",
    before:
      "Policies in this handbook apply to all employees of Acme Inc. and its subsidiaries. ",
    hl: "Where this handbook does not address a situation, employees should contact People Operations for guidance.",
    after: " Local addenda take precedence where required by law.",
    score: 0.62,
    index: 3,
    count: 312,
  },
  hb12: {
    docId: hb,
    page: 12,
    heading: "3.4 Manager onboarding",
    before: "",
    hl: "Managers must complete the new-hire checklist, including equipment, access requests and a 30-60-90 day plan, before the employee's first day.",
    after: " The checklist lives in the People Ops portal.",
    score: 0.88,
    index: 30,
    count: 312,
  },
  hb31: {
    docId: hb,
    page: 31,
    heading: "6.1 Paid time off",
    before: "PTO covers vacation, personal days and short-term illness. ",
    hl: "New full-time employees accrue 20 days of paid time off per year, prorated from their start date.",
    after:
      " Accrual increases to 25 days after five years of continuous service.",
    score: 0.93,
    index: 81,
    count: 312,
  },
  hb33: {
    docId: hb,
    page: 33,
    heading: "6.3 Carryover",
    before: "",
    hl: "Up to 5 unused PTO days may be carried into the following year and must be used by March 31.",
    after:
      " Unused days above this limit are forfeited and are not paid out, except where required by law.",
    score: 0.94,
    index: 86,
    count: 312,
  },
  hb42: {
    docId: hb,
    page: 42,
    heading: "7.2 Parental leave",
    before:
      "Acme supports employees welcoming a new child through birth, adoption or foster placement. ",
    hl: "Full-time employees who have completed 90 days of continuous employment are eligible for up to sixteen (16) weeks of paid parental leave at 100% of base salary.",
    after:
      " Part-time employees regularly scheduled for 20 or more hours per week receive a prorated benefit.",
    score: 0.91,
    index: 117,
    count: 312,
  },
  hb58: {
    docId: hb,
    page: 58,
    heading: "9.4 Bonus eligibility",
    before: "Annual bonuses are discretionary and paid in March. ",
    hl: "Periods of approved protected leave, including parental leave, are treated as active service for the purposes of bonus eligibility.",
    after:
      " Bonuses are calculated on the full annual base salary provided the employee is employed on the payout date.",
    score: 0.9,
    index: 150,
    count: 312,
  },
  hb61: {
    docId: hb,
    page: 61,
    heading: "9.6 Reviews during leave",
    before: "",
    hl: "Where an employee's leave overlaps the review cycle, the manager will assess performance based on the period of active work.",
    after:
      " Ratings may not be lowered because of time spent on protected leave.",
    score: 0.82,
    index: 159,
    count: 312,
  },
  hb72: {
    docId: hb,
    page: 72,
    heading: "11.2 Expense reports",
    before: "",
    hl: "Expense reports must be submitted in Expensify within 30 days of the expense date, with itemized receipts for any item over $25.",
    after:
      " Reports submitted more than 90 days after the expense require VP approval.",
    score: 0.92,
    index: 187,
    count: 312,
  },
  pl3: {
    docId: pl,
    page: 3,
    heading: "2. Eligibility and scheduling",
    before:
      "This policy applies to all eligible employees regardless of gender or how they become a parent. ",
    hl: "Leave may be taken continuously or in up to three separate blocks within twelve months of the birth or placement.",
    after: " Each block must be at least two weeks long.",
    score: 0.88,
    index: 8,
    count: 48,
  },
  pl7: {
    docId: pl,
    page: 7,
    heading: "5. Notice requirements",
    before: "",
    hl: "Employees should provide at least 30 days' written notice to their manager and People Operations before the anticipated start of leave, where foreseeable.",
    after:
      " Where advance notice is not possible, notice should be given as soon as practicable.",
    score: 0.84,
    index: 26,
    count: 48,
  },
  rw4: {
    docId: rw,
    page: 4,
    heading: "3. Home office stipend",
    before: "",
    hl: "Remote and hybrid employees receive a one-time home office stipend of $750 and a monthly connectivity allowance of $50.",
    after: " Receipts must be submitted within 60 days of purchase.",
    score: 0.89,
    index: 11,
    count: 58,
  },
  rw9: {
    docId: rw,
    page: 9,
    heading: "6. Working from another country",
    before: "",
    hl: "Employees may work from outside their country of employment for up to 20 working days per calendar year with prior approval from their manager and People Operations.",
    after: " Longer stays require a tax and immigration review.",
    score: 0.87,
    index: 28,
    count: 58,
  },
  cc4: {
    docId: DOC_IDS.conduct,
    page: 4,
    heading: "4. Reporting concerns",
    before: "",
    hl: "Concerns can be reported to your manager, to People Operations, or anonymously through the Ethics Hotline at any time.",
    after:
      " Acme prohibits retaliation against anyone who raises a concern in good faith.",
    score: 0.9,
    index: 10,
    count: 22,
  },
  bn: {
    docId: DOC_IDS.benefits,
    page: null,
    heading: "Retirement",
    before: "Eligible employees are auto-enrolled at a 3% contribution rate. ",
    hl: "Acme matches 100% of the first 4% of eligible pay you contribute to the 401(k), with immediate vesting.",
    after: "",
    score: 0.91,
    index: 20,
    count: 36,
  },
};

export interface AnswerSeed {
  content: string;
  cites: string[];
  tokens: number;
  costUsd: number;
  latencyMs: number;
  passages: number;
}

export const ANSWERS: Record<string, AnswerSeed> = {
  c1a: {
    content:
      "Full-time employees are eligible for **16 weeks of fully paid parental leave** once they've completed 90 days of continuous employment [1]. The policy applies equally to birthing and non-birthing parents, including adoption and foster placement [2].\n\nA few details worth knowing:\n\n- Leave can be taken all at once or in up to **three blocks** within 12 months of the birth or placement [2].\n- Part-time employees scheduled for 20+ hours a week receive a prorated benefit [1].\n- Give your manager and People Ops at least **30 days' notice** before your planned start date, where possible [3].",
    cites: ["hb42", "pl3", "pl7"],
    tokens: 1240,
    costUsd: 0.0041,
    latencyMs: 2300,
    passages: 6,
  },
  c1b: {
    content:
      "No. Approved parental leave counts as active service for bonus eligibility, so you won't lose your bonus for taking it [1]. The bonus is calculated on your **full annual base salary**, not prorated for time on leave, as long as you're employed on the payout date [1].\n\nIf your leave overlaps the review cycle, your manager rates you on the months you were actively working, and your rating can't be lowered because of the leave [2].",
    cites: ["hb58", "hb61"],
    tokens: 1086,
    costUsd: 0.0036,
    latencyMs: 2100,
    passages: 5,
  },
  c2a: {
    content:
      "Remote and hybrid employees get a one-time **$750 home office stipend** plus a **$50 monthly** connectivity allowance [1]. Submit receipts within 60 days of purchase to be reimbursed [1].",
    cites: ["rw4"],
    tokens: 702,
    costUsd: 0.0023,
    latencyMs: 1600,
    passages: 3,
  },
  c3a: {
    content:
      "You can carry up to **5 unused PTO days** into the next year, and they must be used by March 31 [1]. Anything above that is forfeited and is not paid out, unless local law requires it [1].",
    cites: ["hb33"],
    tokens: 688,
    costUsd: 0.0022,
    latencyMs: 1400,
    passages: 4,
  },
  c4a: {
    content:
      "Within **30 days** of the expense date, submitted in Expensify with itemized receipts for anything over $25 [1]. Reports filed more than 90 days after the expense need VP approval [1].",
    cites: ["hb72"],
    tokens: 654,
    costUsd: 0.0021,
    latencyMs: 1500,
    passages: 3,
  },
  c5a: {
    content:
      "You can report to your manager, to People Operations, or anonymously through the **Ethics Hotline** at any time [1]. Retaliation against anyone who reports a concern in good faith is prohibited [1].",
    cites: ["cc4"],
    tokens: 612,
    costUsd: 0.002,
    latencyMs: 1300,
    passages: 2,
  },
  c6a: {
    content:
      "Acme matches **100% of the first 4%** of eligible pay you contribute, and the match vests immediately [1]. New employees are auto-enrolled at 3%, so raise your contribution to get the full match [1].",
    cites: ["bn"],
    tokens: 640,
    costUsd: 0.0021,
    latencyMs: 1400,
    passages: 2,
  },
  c7a: {
    content:
      "Complete the new-hire checklist before the employee's first day: equipment, access requests, and a **30-60-90 day plan** [1].",
    cites: ["hb12"],
    tokens: 590,
    costUsd: 0.0019,
    latencyMs: 1200,
    passages: 3,
  },
  pto: {
    content:
      "New full-time employees accrue **20 days of PTO** per year, prorated from their start date [1]. This increases to 25 days after five years of continuous service [1].",
    cites: ["hb31"],
    tokens: 674,
    costUsd: 0.0022,
    latencyMs: 1500,
    passages: 4,
  },
  abroad: {
    content:
      "Yes, for up to **20 working days per calendar year**, with prior approval from your manager and People Operations [1]. Longer stays need a tax and immigration review before you travel [1].",
    cites: ["rw9"],
    tokens: 718,
    costUsd: 0.0024,
    latencyMs: 1700,
    passages: 4,
  },
  fallback: {
    content:
      "I couldn't find a passage in this collection that answers that directly. For situations the handbook doesn't cover, it directs employees to contact **People Operations** [1].",
    cites: ["hb5"],
    tokens: 802,
    costUsd: 0.0026,
    latencyMs: 1900,
    passages: 1,
  },
};

export const SEED_THREADS: {
  id: string;
  title: string;
  agoMs: number;
  exchanges: { q: string; a: keyof typeof ANSWERS }[];
}[] = [
  {
    id: "conv-1",
    title: "Parental leave eligibility",
    agoMs: 2 * 60_000,
    exchanges: [
      { q: "How long is parental leave, and who is eligible?", a: "c1a" },
      { q: "Does taking leave affect my annual bonus?", a: "c1b" },
    ],
  },
  {
    id: "conv-2",
    title: "Remote work stipend limits",
    agoMs: 60 * 60_000,
    exchanges: [
      { q: "What's the home office stipend for remote employees?", a: "c2a" },
    ],
  },
  {
    id: "conv-3",
    title: "PTO carryover rules",
    agoMs: 3 * 60 * 60_000,
    exchanges: [{ q: "How many PTO days can I carry over?", a: "c3a" }],
  },
  {
    id: "conv-4",
    title: "Expense reimbursement deadlines",
    agoMs: 2 * 86_400_000,
    exchanges: [{ q: "When are expense reports due?", a: "c4a" }],
  },
  {
    id: "conv-5",
    title: "Harassment reporting process",
    agoMs: 3 * 86_400_000,
    exchanges: [{ q: "How do I report harassment?", a: "c5a" }],
  },
  {
    id: "conv-6",
    title: "401(k) matching schedule",
    agoMs: 5 * 86_400_000,
    exchanges: [{ q: "How does the 401(k) match work?", a: "c6a" }],
  },
  {
    id: "conv-7",
    title: "Onboarding checklist for managers",
    agoMs: 6 * 86_400_000,
    exchanges: [
      { q: "What do managers need to do before a new hire starts?", a: "c7a" },
    ],
  },
];

export function pickAnswerKey(text: string): keyof typeof ANSWERS {
  const t = text.toLowerCase();
  if (/pto|vacation|time off|days off/.test(t)) return "pto";
  if (/abroad|country|remote|travel/.test(t))
    return /stipend|office/.test(t) ? "c2a" : "abroad";
  if (/expense|reimburse|receipt/.test(t)) return "c4a";
  if (/bonus/.test(t)) return "c1b";
  if (/parental|maternity|paternity/.test(t)) return "c1a";
  if (/401|retire/.test(t)) return "c6a";
  if (/harass|report|ethic/.test(t)) return "c5a";
  if (/onboard|new hire|checklist/.test(t)) return "c7a";
  return "fallback";
}
