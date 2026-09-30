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
];

// ":resourceId" matches exactly one path segment, so "/collections/:resourceId" does not catch "/collections/:resourceId/documents".
const toRegExp = (path: string) => new RegExp(`^${path.replace(/:[a-zA-Z]+/g, "[^/]+")}$`);
const COMPILED = REAL_ROUTES.map((r) => ({ method: r.method, re: toRegExp(r.path) }));

export function isRealApiRoute(config: InternalAxiosRequestConfig): boolean {
  const method = (config.method ?? "get").toUpperCase();
  const path = (config.url ?? "").split("?")[0] ?? "";
  return COMPILED.some((r) => r.method === method && r.re.test(path));
}
