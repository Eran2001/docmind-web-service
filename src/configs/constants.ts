export const ACCESS_COOKIE = "dm_access";
export const REFRESH_COOKIE = "dm_refresh";

// How long the access-token cookie is kept (the JWT inside expires after ~15 minutes, and refreshing swaps it for a new one).
// This matches the refresh token's lifetime: while the cookie exists the session may still be refreshable, so the route
// guard lets the page load and the API decides. Once the refresh token is gone or revoked the next request signs the user out.
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const UPLOAD_ACCEPT = ".pdf,.doc,.docx,.txt,.md";
export const UPLOAD_EXTENSIONS = ["pdf", "doc", "docx", "txt", "md"] as const;
export const UPLOAD_MAX_BYTES = 20 * 1024 * 1024;

// How long fetched data counts as fresh: navigating back to a screen within this time shows the cached data without asking the API again.
// Writes still refresh what they change (the mutation hooks invalidate their queries), and polling (documents, eval runs) ignores it.
export const QUERY_STALE_TIME_MS = 5 * 60_000;

export const DOCUMENT_POLL_MS = 3000;
export const EVAL_RUN_POLL_MS = 1500;

export const USAGE_RANGES = [7, 30, 90] as const;
export type UsageRange = (typeof USAGE_RANGES)[number];

export const CHAT_MAX_CHARS = 4000;
export const CHAT_SUGGESTIONS = [
  "How many PTO days do new hires get?",
  "Can I work remotely from another country?",
  "When are expense reports due?",
];
export const FEEDBACK_REASONS = [
  "Inaccurate",
  "Missing information",
  "Wrong source",
  "Not relevant",
] as const;
