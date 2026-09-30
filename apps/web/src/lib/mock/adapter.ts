import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  ChunkDetail,
  Collection,
  ConversationDetail,
  User,
} from "@docmind/shared";
import {
  addUrlSchema,
  createCollectionSchema,
  createEvalQuestionSchema,
  createEvalSetSchema,
  feedbackSchema,
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "@docmind/shared";

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  UPLOAD_EXTENSIONS,
  UPLOAD_MAX_BYTES,
} from "@/configs/constants";
import { CHUNKS } from "@/lib/mock/answers";
import {
  docTitle,
  getDb,
  resolveDocument,
  saveDb,
  uid,
  type MockDocument,
  type MockPipeline,
} from "@/lib/mock/db";
import {
  detailForSet,
  resolveRun,
  resolveRunDetail,
  summarizeSet,
} from "@/lib/mock/evals";
import { buildAdminUsage, buildUsage } from "@/lib/mock/usage";

class MockHttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

interface Ctx {
  params: string[];
  query: Record<string, unknown>;
  body: unknown;
}
type Result = { status?: number; data?: unknown };
type Handler = (ctx: Ctx) => Result | Promise<Result>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

function hasCookie(name: string): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${name}=`));
}

function setSession() {
  document.cookie = `${ACCESS_COOKIE}=mock; path=/; max-age=${ACCESS_MAX_AGE}; samesite=lax`;
  document.cookie = `${REFRESH_COOKIE}=mock; path=/; max-age=${REFRESH_MAX_AGE}; samesite=lax`;
}

function clearSession() {
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_COOKIE}=; path=/; max-age=0`;
}

function validate<T>(
  schema: {
    safeParse: (
      v: unknown,
    ) =>
      | { success: true; data: T }
      | { success: false; error: { issues: { message: string }[] } };
  },
  body: unknown,
): T {
  const res = schema.safeParse(body);
  if (!res.success)
    throw new MockHttpError(
      400,
      "VALIDATION_ERROR",
      res.error.issues[0]?.message ?? "Invalid request.",
    );
  return res.data;
}

const notFound = (what: string) =>
  new MockHttpError(404, "NOT_FOUND", `${what} not found.`);

function titleCase(handle: string): string {
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function userFor(email: string, name?: string): User {
  // Every mock user is an admin so all screens are reachable during UI work.
  return {
    id: "user-1",
    email,
    name: name ?? (titleCase(email.split("@")[0] ?? "") || "DocMind User"),
    role: "admin",
  };
}

function collectionView(c: Collection): Collection {
  const documentCount = getDb().documents.filter(
    (d) => d.collectionId === c.id,
  ).length;
  return { ...c, documentCount };
}

function findCollection(id: string): Collection {
  const c = getDb().collections.find((x) => x.id === id);
  if (!c) throw notFound("Collection");
  return c;
}

function findDocument(id: string): MockDocument {
  const d = getDb().documents.find((x) => x.id === id);
  if (!d) throw notFound("Document");
  return d;
}

function touch(collectionId: string) {
  const c = getDb().collections.find((x) => x.id === collectionId);
  if (c) c.updatedAt = new Date().toISOString();
}

function startPipeline(d: MockDocument, outcome: MockPipeline["outcome"]) {
  d.pipeline = {
    startedAt: Date.now(),
    queuedMs: 900,
    processingMs: 2700,
    outcome,
  };
  d.updatedAt = new Date().toISOString();
}

function newDocument(
  collectionId: string,
  fields: Partial<MockDocument> &
    Pick<MockDocument, "title" | "sourceType" | "contentHash">,
): MockDocument {
  const at = new Date().toISOString();
  return {
    id: uid("doc"),
    collectionId,
    originalFilename: null,
    sourceUrl: null,
    mimeType: null,
    sizeBytes: null,
    pageCount: null,
    status: "queued",
    errorMessage: null,
    chunkCount: 0,
    createdAt: at,
    updatedAt: at,
    ...fields,
  };
}

function chunkDetail(documentId: string, chunkId: string): ChunkDetail {
  const seed = CHUNKS[chunkId];
  if (seed) {
    return {
      id: chunkId,
      documentId: seed.docId,
      documentTitle: docTitle(seed.docId),
      sourceType: seed.page == null ? "url" : "file",
      pageNumber: seed.page,
      heading: seed.heading,
      content: seed.hl,
      contextBefore: seed.before,
      contextAfter: seed.after,
      chunkIndex: seed.index,
      chunkCount: seed.count,
    };
  }
  const d = findDocument(documentId);
  return {
    id: chunkId,
    documentId,
    documentTitle: d.title,
    sourceType: d.sourceType,
    pageNumber: d.pageCount ? 1 : null,
    heading: null,
    content:
      "Mock passage generated for the demo. Connect the API to see real text from your document.",
    chunkIndex: 0,
    chunkCount: Math.max(1, d.chunkCount),
  };
}

const routes: {
  method: string;
  re: RegExp;
  auth: boolean;
  handler: Handler;
}[] = [];
function route(method: string, path: string, handler: Handler, auth = true) {
  routes.push({
    method,
    re: new RegExp(`^${path.replace(/:[a-zA-Z]+/g, "([^/]+)")}$`),
    auth,
    handler,
  });
}

// ---- auth ----
route(
  "POST",
  "/auth/register",
  ({ body }) => {
    const input = validate(registerSchema, body);
    const user = userFor(input.email, input.name);
    getDb().user = user;
    saveDb();
    setSession();
    return { status: 201, data: { user } };
  },
  false,
);
route(
  "POST",
  "/auth/login",
  ({ body }) => {
    const input = validate(loginSchema, body);
    if (input.password === "wrong-password")
      throw new MockHttpError(
        401,
        "UNAUTHORIZED",
        "Invalid email or password.",
      );
    const db = getDb();
    const user =
      db.user?.email === input.email ? db.user : userFor(input.email);
    db.user = user;
    saveDb();
    setSession();
    return { data: { user } };
  },
  false,
);
route(
  "POST",
  "/auth/refresh",
  () => {
    if (!hasCookie(REFRESH_COOKIE))
      throw new MockHttpError(
        401,
        "UNAUTHORIZED",
        "Session expired. Please sign in again.",
      );
    setSession();
    return { status: 204 };
  },
  false,
);
route(
  "POST",
  "/auth/logout",
  () => {
    clearSession();
    return { status: 204 };
  },
  false,
);
route("GET", "/auth/me", () => {
  const db = getDb();
  db.user ??= userFor("maya.chen@acme.com");
  return { data: { user: db.user } };
});

route("PATCH", "/auth/me", ({ body }) => {
  const input = validate(updateProfileSchema, body);
  const db = getDb();
  db.user = { ...(db.user ?? userFor(input.email)), ...input };
  saveDb();
  return { data: { user: db.user } };
});
route("POST", "/auth/change-password", ({ body }) => {
  const input = validate(changePasswordSchema, body);
  if (input.currentPassword === "wrong-password")
    throw new MockHttpError(400, "INVALID_PASSWORD", "Current password is incorrect");
  return { status: 204 };
});
route("DELETE", "/auth/me", () => {
  const db = getDb();
  db.user = null;
  saveDb();
  clearSession();
  return { status: 204 };
});

// ---- collections ----
route("GET", "/collections", () => ({
  data: {
    items: [...getDb().collections]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(collectionView),
  },
}));
route("POST", "/collections", ({ body }) => {
  const input = validate(createCollectionSchema, body);
  const now = new Date().toISOString();
  const c: Collection = {
    id: uid("col"),
    name: input.name,
    description: input.description || null,
    documentCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  getDb().collections.unshift(c);
  saveDb();
  return { status: 201, data: c };
});
route("PATCH", "/collections/:id", ({ params, body }) => {
  const c = findCollection(params[0] as string);
  const input = validate(createCollectionSchema.partial(), body);
  if (input.name) c.name = input.name;
  if (input.description !== undefined)
    c.description = input.description || null;
  c.updatedAt = new Date().toISOString();
  saveDb();
  return { data: collectionView(c) };
});
route("DELETE", "/collections/:id", ({ params }) => {
  const db = getDb();
  const id = findCollection(params[0] as string).id;
  db.collections = db.collections.filter((c) => c.id !== id);
  db.documents = db.documents.filter((d) => d.collectionId !== id);
  saveDb();
  return { status: 204 };
});

// ---- documents ----
route("GET", "/collections/:id/documents", ({ params }) => {
  const id = findCollection(params[0] as string).id;
  const items = getDb()
    .documents.filter((d) => d.collectionId === id)
    .map((d) => resolveDocument(d))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { data: { items } };
});
route("POST", "/collections/:id/documents", ({ params, body }) => {
  const collection = findCollection(params[0] as string);
  const db = getDb();
  const file = body instanceof FormData ? body.get("file") : null;
  if (!(file instanceof File))
    throw new MockHttpError(
      400,
      "VALIDATION_ERROR",
      "Attach a file to upload.",
    );
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(UPLOAD_EXTENSIONS as readonly string[]).includes(ext))
    throw new MockHttpError(
      400,
      "VALIDATION_ERROR",
      `${file.name} isn't supported. Upload PDF, DOCX, TXT or MD.`,
    );
  if (file.size > UPLOAD_MAX_BYTES)
    throw new MockHttpError(
      400,
      "VALIDATION_ERROR",
      `${file.name} is larger than 20 MB.`,
    );
  if (db.documents.filter((d) => d.collectionId === collection.id).length >= 50)
    throw new MockHttpError(
      422,
      "LIMIT_REACHED",
      "A collection can hold up to 50 documents.",
    );
  const hash = `${file.name}:${file.size}`;
  if (
    db.documents.some(
      (d) => d.collectionId === collection.id && d.contentHash === hash,
    )
  ) {
    throw new MockHttpError(
      409,
      "DUPLICATE_DOCUMENT",
      `${file.name} is already in this collection.`,
    );
  }
  const pages = Math.max(1, Math.round(file.size / 40_000));
  const paged = ext === "pdf" || ext === "docx";
  const doc = newDocument(collection.id, {
    title: file.name,
    sourceType: "file",
    originalFilename: file.name,
    mimeType: file.type || null,
    sizeBytes: file.size,
    contentHash: hash,
  });
  startPipeline(doc, {
    status: "ready",
    chunkCount: Math.max(2, Math.round(pages * 3.4)),
    pageCount: paged ? pages : null,
    errorMessage: null,
  });
  db.documents.push(doc);
  touch(collection.id);
  saveDb();
  return { status: 202, data: resolveDocument(doc) };
});
route("POST", "/collections/:id/documents/url", ({ params, body }) => {
  const collection = findCollection(params[0] as string);
  const { url } = validate(addUrlSchema, body);
  if (/intranet|internal|localhost/i.test(url)) {
    throw new MockHttpError(
      422,
      "URL_FETCH_FAILED",
      "The server returned 403 Forbidden. Check that the page is publicly reachable.",
    );
  }
  const db = getDb();
  if (
    db.documents.some(
      (d) => d.collectionId === collection.id && d.contentHash === url,
    )
  ) {
    throw new MockHttpError(
      409,
      "DUPLICATE_DOCUMENT",
      "This URL is already in the collection.",
    );
  }
  const doc = newDocument(collection.id, {
    title: url.replace(/^https?:\/\//i, ""),
    sourceType: "url",
    sourceUrl: url,
    mimeType: "text/html",
    contentHash: url,
  });
  startPipeline(doc, {
    status: "ready",
    chunkCount: 18,
    pageCount: null,
    errorMessage: null,
  });
  db.documents.push(doc);
  touch(collection.id);
  saveDb();
  return { status: 202, data: resolveDocument(doc) };
});
route("POST", "/documents/:id/reprocess", ({ params }) => {
  const doc = findDocument(params[0] as string);
  const previous = resolveDocument(doc);
  startPipeline(
    doc,
    previous.status === "failed"
      ? {
          status: "failed",
          chunkCount: 0,
          pageCount: null,
          errorMessage: previous.errorMessage,
        }
      : {
          status: "ready",
          chunkCount: previous.chunkCount || 24,
          pageCount: previous.pageCount,
          errorMessage: null,
        },
  );
  saveDb();
  return { status: 202, data: resolveDocument(doc) };
});
route("DELETE", "/documents/:id", ({ params }) => {
  const doc = findDocument(params[0] as string);
  const db = getDb();
  db.documents = db.documents.filter((d) => d.id !== doc.id);
  touch(doc.collectionId);
  saveDb();
  return { status: 204 };
});
route("GET", "/documents/:id/chunks/:chunkId", ({ params }) => ({
  data: chunkDetail(params[0] as string, params[1] as string),
}));

// ---- conversations & messages ----
route("GET", "/collections/:id/conversations", ({ params }) => {
  const id = findCollection(params[0] as string).id;
  const items = getDb()
    .conversations.filter((c) => c.collectionId === id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { data: { items, nextCursor: null } };
});
route("POST", "/collections/:id/conversations", ({ params }) => {
  const id = findCollection(params[0] as string).id;
  const now = new Date().toISOString();
  const conv = {
    id: uid("conv"),
    collectionId: id,
    title: "New chat",
    createdAt: now,
    updatedAt: now,
  };
  getDb().conversations.unshift(conv);
  saveDb();
  return { status: 201, data: conv };
});
route("GET", "/conversations/:id", ({ params }) => {
  const db = getDb();
  const conv = db.conversations.find((c) => c.id === params[0]);
  if (!conv) throw notFound("Conversation");
  const messages = db.messages
    .filter((m) => m.conversationId === conv.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const detail: ConversationDetail = { ...conv, messages };
  return { data: detail };
});
route("DELETE", "/conversations/:id", ({ params }) => {
  const db = getDb();
  db.conversations = db.conversations.filter((c) => c.id !== params[0]);
  db.messages = db.messages.filter((m) => m.conversationId !== params[0]);
  saveDb();
  return { status: 204 };
});
route("PUT", "/messages/:id/feedback", ({ params, body }) => {
  const msg = getDb().messages.find(
    (m) => m.id === params[0] && m.role === "assistant",
  );
  if (!msg) throw notFound("Message");
  const input = validate(feedbackSchema, body);
  msg.feedback = { rating: input.rating, comment: input.comment ?? null };
  saveDb();
  return { data: msg.feedback };
});

// ---- usage ----
const daysParam = (q: Record<string, unknown>) => {
  const n = Number(q.days ?? 30);
  return [7, 30, 90].includes(n) ? n : 30;
};
route("GET", "/usage/me", ({ query }) => ({
  data: buildUsage(daysParam(query), false),
}));
route("GET", "/admin/usage", ({ query }) => {
  if (getDb().user?.role !== "admin")
    throw new MockHttpError(404, "NOT_FOUND", "Not found.");
  return { data: buildAdminUsage(daysParam(query)) };
});

// ---- evals ----
route("GET", "/evals/sets", () => ({
  data: {
    items: getDb()
      .evalSets.map((s) => summarizeSet(s.id))
      .filter((s) => s !== null),
  },
}));
route("POST", "/evals/sets", ({ body }) => {
  const input = validate(createEvalSetSchema, body);
  findCollection(input.collectionId);
  const set = {
    id: uid("eval"),
    name: input.name,
    description: input.description || null,
    collectionId: input.collectionId,
    createdAt: new Date().toISOString(),
  };
  getDb().evalSets.unshift(set);
  saveDb();
  return { status: 201, data: summarizeSet(set.id) };
});
route("GET", "/evals/sets/:id", ({ params }) => {
  const detail = detailForSet(params[0] as string);
  if (!detail) throw notFound("Eval set");
  return { data: detail };
});
route("DELETE", "/evals/sets/:id", ({ params }) => {
  const db = getDb();
  db.evalSets = db.evalSets.filter((s) => s.id !== params[0]);
  db.evalQuestions = db.evalQuestions.filter((q) => q.evalSetId !== params[0]);
  db.evalRuns = db.evalRuns.filter((r) => r.evalSetId !== params[0]);
  saveDb();
  return { status: 204 };
});
route("POST", "/evals/sets/:id/questions", ({ params, body }) => {
  const db = getDb();
  const set = db.evalSets.find((s) => s.id === params[0]);
  if (!set) throw notFound("Eval set");
  const input = validate(createEvalQuestionSchema, body);
  const q = {
    id: uid("q"),
    evalSetId: set.id,
    question: input.question,
    expectedAnswer: input.expectedAnswer,
    expectedDocumentId: input.expectedDocumentId ?? null,
    expectedDocumentTitle: input.expectedDocumentId
      ? (db.documents.find((d) => d.id === input.expectedDocumentId)?.title ??
        null)
      : null,
  };
  db.evalQuestions.unshift(q);
  saveDb();
  const { evalSetId: _s, ...dto } = q;
  void _s;
  return { status: 201, data: dto };
});
route("DELETE", "/evals/questions/:id", ({ params }) => {
  const db = getDb();
  db.evalQuestions = db.evalQuestions.filter((q) => q.id !== params[0]);
  saveDb();
  return { status: 204 };
});
route("POST", "/evals/sets/:id/runs", ({ params }) => {
  const db = getDb();
  const set = db.evalSets.find((s) => s.id === params[0]);
  if (!set) throw notFound("Eval set");
  const total = db.evalQuestions.filter((q) => q.evalSetId === set.id).length;
  if (total === 0)
    throw new MockHttpError(
      422,
      "LIMIT_REACHED",
      "Add at least one question before running an eval.",
    );
  const number =
    Math.max(
      0,
      ...db.evalRuns.filter((r) => r.evalSetId === set.id).map((r) => r.number),
    ) + 1;
  const run = {
    id: uid("run"),
    evalSetId: set.id,
    number,
    startedAt: Date.now(),
    total,
    judgeModel: "claude-sonnet-4.5",
  };
  db.evalRuns.push(run);
  saveDb();
  return { status: 202, data: resolveRun(run) };
});
route("GET", "/evals/runs/:id", ({ params }) => {
  const run = getDb().evalRuns.find((r) => r.id === params[0]);
  if (!run) throw notFound("Eval run");
  return { data: resolveRunDetail(run) };
});

function parseBody(config: InternalAxiosRequestConfig): unknown {
  const raw = config.data;
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function respond(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): AxiosResponse {
  return {
    data,
    status,
    statusText: String(status),
    headers: {},
    config,
    request: {},
  };
}

function fail(config: InternalAxiosRequestConfig, err: MockHttpError): never {
  const response = respond(config, err.status, {
    error: { code: err.code, message: err.message },
  });
  throw new AxiosError(err.message, String(err.status), config, {}, response);
}

// Stand-in for the Node API (spec 8.2) so the web app runs before apps/api exists.
export async function handleMockRequest(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  await sleep(120 + Math.random() * 180);
  const method = (config.method ?? "get").toUpperCase();
  const path = (config.url ?? "").split("?")[0] ?? "";
  const match = routes.find((r) => r.method === method && r.re.test(path));

  try {
    if (!match)
      throw new MockHttpError(
        404,
        "NOT_FOUND",
        `No mock route for ${method} ${path}`,
      );
    if (match.auth && !hasCookie(ACCESS_COOKIE))
      throw new MockHttpError(
        401,
        "UNAUTHORIZED",
        "Please sign in to continue.",
      );
    const params = (path.match(match.re) ?? [])
      .slice(1)
      .map(decodeURIComponent);
    const result = await match.handler({
      params,
      query: (config.params as Record<string, unknown> | undefined) ?? {},
      body: parseBody(config),
    });
    return respond(config, result.status ?? 200, result.data);
  } catch (err) {
    if (err instanceof MockHttpError) fail(config, err);
    throw err;
  }
}
