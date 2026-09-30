export const ACCESS_COOKIE = "dm_access";
export const REFRESH_COOKIE = "dm_refresh";

export const DEMO_EMAIL = "demo@docmind.dev";
export const DEMO_PASSWORD = "demo-password-1";

export const UPLOAD_ACCEPT = ".pdf,.docx,.txt,.md";
export const UPLOAD_EXTENSIONS = ["pdf", "docx", "txt", "md"] as const;
export const UPLOAD_MAX_BYTES = 20 * 1024 * 1024;

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
