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
];

export function isRealApiRoute(config: InternalAxiosRequestConfig): boolean {
  const method = (config.method ?? "get").toUpperCase();
  const path = (config.url ?? "").split("?")[0];
  return REAL_ROUTES.some((r) => r.method === method && r.path === path);
}
