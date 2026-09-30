// API DTOs shared between web and api. Dates are ISO strings on the wire.

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** ISO date; only present on users that come from the real API. */
  createdAt?: string;
}

/** `data` of a successful register / login (the API also sets the httpOnly refresh cookie). */
export interface AuthSession {
  accessToken: string;
  tokenType: "Bearer";
  /** Seconds until the access token expires. */
  expiresIn: number;
  user: User;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export type DocumentStatus = "queued" | "processing" | "ready" | "failed";
export type DocumentSourceType = "file" | "url";

export interface DocumentDto {
  id: string;
  collectionId: string;
  sourceType: DocumentSourceType;
  title: string;
  originalFilename: string | null;
  sourceUrl: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  pageCount: number | null;
  status: DocumentStatus;
  errorMessage: string | null;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  marker: number;
  chunkId: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number | null;
  snippet: string;
  score?: number;
}

export interface ChunkDetail {
  id: string;
  documentId: string;
  documentTitle: string;
  sourceType: DocumentSourceType;
  pageNumber: number | null;
  heading: string | null;
  content: string;
  contextBefore?: string;
  contextAfter?: string;
  chunkIndex: number;
  chunkCount: number;
}

export interface Conversation {
  id: string;
  collectionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageRole = "user" | "assistant";
export type MessageStatus = "streaming" | "complete" | "error";

export interface MessageUsage {
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export interface MessageFeedback {
  rating: 1 | -1;
  comment: string | null;
}

export interface MessageRetrieval {
  documents: number;
  passages: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  citations: Citation[];
  status: MessageStatus;
  latencyMs: number | null;
  usage: MessageUsage | null;
  retrieval?: MessageRetrieval | null;
  feedback: MessageFeedback | null;
  createdAt: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

export type UsageKind = "embed" | "answer" | "rewrite" | "judge";

export interface UsageTotals {
  costUsd: number;
  tokens: number;
  requests: number;
  avgLatencyMs: number;
}

export interface UsageDailyPoint {
  date: string;
  costUsd: number;
  requests: number;
}

export interface UsageByKind {
  kind: UsageKind;
  requests: number;
  tokens: number;
  costUsd: number;
}

export interface UsageSummary {
  days: number;
  totals: UsageTotals;
  previous: UsageTotals | null;
  daily: UsageDailyPoint[];
  byKind: UsageByKind[];
}

export interface AdminTopUser {
  id: string;
  name: string;
  email: string;
  requests: number;
  tokens: number;
  costUsd: number;
}

export interface AdminUsageSummary extends UsageSummary {
  topUsers: AdminTopUser[];
}

export interface EvalSetSummary {
  id: string;
  name: string;
  description: string | null;
  collectionId: string;
  collectionName: string;
  questionCount: number;
  lastRun: { avgCorrectness: number; finishedAt: string } | null;
}

export interface EvalQuestion {
  id: string;
  question: string;
  expectedAnswer: string;
  expectedDocumentId: string | null;
  expectedDocumentTitle: string | null;
}

export type EvalRunStatus = "queued" | "running" | "done" | "failed";

export interface EvalRun {
  id: string;
  evalSetId: string;
  number: number;
  status: EvalRunStatus;
  avgCorrectness: number | null;
  avgFaithfulness: number | null;
  retrievalHitRate: number | null;
  totalCostUsd: number | null;
  totalTokens: number | null;
  judgeModel: string;
  progress: { done: number; total: number };
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  createdAt: string;
}

export interface EvalResult {
  questionId: string;
  question: string;
  expectedAnswer: string;
  expectedDocumentTitle: string | null;
  generatedAnswer: string;
  correctness: number;
  faithfulness: number;
  retrievalHit: boolean;
  judgeReasoning: string | null;
}

export interface EvalRunDetail extends EvalRun {
  results: EvalResult[];
}

export interface EvalSetDetail extends EvalSetSummary {
  questions: EvalQuestion[];
  runs: EvalRun[];
}

/** Every success response from the real API. The axios instances unwrap it, so callers only see `data`. */
export interface ApiEnvelope<T> {
  code: string; // "OK" for every success
  data: T;
  message: string;
  resourceId: string | null;
  requestId: string;
}

/** Codes the real API returns on failure (see docmind-api-service/src/common/errors/error-codes.ts). */
export type ApiErrorCode =
  | "ValidationFailed"
  | "Unauthorized"
  | "NotFound"
  | "ApiRouteFailed"
  | "DuplicateDocument"
  | "EmailAlreadyRegistered"
  | "LimitReached"
  | "RateLimited"
  | "InternalError"
  | "AiServiceFailed"
  | "ServiceUnavailable";

/** Real API failure: no `data`; `message` is outside `error`; `debug` only outside production. */
export interface ApiErrorBody {
  code: ApiErrorCode | (string & {});
  error: { status: number; details?: unknown };
  debug?: unknown;
  message: string;
  resourceId: string | null;
  requestId: string;
}
