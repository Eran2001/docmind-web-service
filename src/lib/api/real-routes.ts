import type { InternalAxiosRequestConfig } from "axios";

// While NEXT_PUBLIC_USE_MOCKS=true, only these calls go to the real API; everything else is still answered by the mock.
// Add a line here as each endpoint is built in the API. With NEXT_PUBLIC_USE_MOCKS=false everything is real.
const REAL_ROUTES: readonly { method: string; path: string }[] = [
  { method: "POST", path: "/auth/register" },
  { method: "POST", path: "/auth/login" },
  { method: "GET", path: "/auth/me" },
  { method: "POST", path: "/auth/refresh" },
  { method: "POST", path: "/auth/logout" },
  { method: "PATCH", path: "/auth/me" },
  { method: "POST", path: "/auth/change-password" },
  { method: "DELETE", path: "/auth/me" },
  { method: "GET", path: "/collections" },
  { method: "POST", path: "/collections" },
  { method: "PATCH", path: "/collections/:resourceId" },
  { method: "DELETE", path: "/collections/:resourceId" },
  { method: "GET", path: "/collections/:resourceId" },
  { method: "GET", path: "/collections/:resourceId/documents" },
  { method: "POST", path: "/collections/:resourceId/documents" },
  { method: "POST", path: "/collections/:resourceId/documents/url" },
  { method: "POST", path: "/documents/:resourceId/reprocess" },
  { method: "DELETE", path: "/documents/:resourceId" },
  { method: "GET", path: "/documents/:resourceId/chunks/:chunkId" },
  { method: "GET", path: "/collections/:resourceId/conversations" },
  { method: "POST", path: "/collections/:resourceId/conversations" },
  { method: "GET", path: "/conversations/:resourceId" },
  { method: "DELETE", path: "/conversations/:resourceId" },
  { method: "POST", path: "/conversations/:resourceId/messages" },
  { method: "PUT", path: "/messages/:resourceId/feedback" },
  { method: "GET", path: "/evals/sets" },
  { method: "POST", path: "/evals/sets" },
  { method: "GET", path: "/evals/sets/:resourceId" },
  { method: "DELETE", path: "/evals/sets/:resourceId" },
  { method: "POST", path: "/evals/sets/:resourceId/questions" },
  { method: "DELETE", path: "/evals/questions/:resourceId" },
  { method: "POST", path: "/evals/sets/:resourceId/runs" },
  { method: "GET", path: "/evals/runs/:resourceId" },
];

// ":resourceId" matches exactly one path segment, so "/collections/:resourceId" does not catch "/collections/:resourceId/documents".
const toRegExp = (path: string) =>
  new RegExp(`^${path.replace(/:[a-zA-Z]+/g, "[^/]+")}$`);
const COMPILED = REAL_ROUTES.map((r) => ({
  method: r.method,
  re: toRegExp(r.path),
}));

export function isRealApiRoute(config: InternalAxiosRequestConfig): boolean {
  const method = (config.method ?? "get").toUpperCase();
  const path = (config.url ?? "").split("?")[0] ?? "";
  return isRealApiPath(method, path);
}

export function isRealApiPath(method: string, path: string): boolean {
  const normalizedPath = path.split("?")[0] ?? "";
  return COMPILED.some(
    (r) => r.method === method.toUpperCase() && r.re.test(normalizedPath),
  );
}
