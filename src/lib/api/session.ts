import { ACCESS_COOKIE } from "@/configs/constants";
import { isExpired } from "@/lib/api/jwt";

// The access token lives in a cookie (readable by JavaScript and by the Next proxy, which needs it to guard routes).
// It is short-lived (15 min). The long-lived refresh token is an httpOnly cookie set by the API; JavaScript never sees it.

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${ACCESS_COOKIE}=`));
  const token = entry ? decodeURIComponent(entry.slice(ACCESS_COOKIE.length + 1)) : null;
  return token && !isExpired(token) ? token : null;
}

export function setAccessToken(token: string, expiresInSeconds: number): void {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${expiresInSeconds}; samesite=lax${secure}`;
}

export function clearSession(): void {
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0`;
}
