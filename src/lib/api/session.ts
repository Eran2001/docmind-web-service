import { ACCESS_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/configs/constants";
import { isProtectedPath, routes } from "@/configs/routes";
import { isExpired } from "@/lib/api/jwt";

// The access token lives in a cookie (readable by JavaScript and by the Next proxy, which needs it to guard routes).
// The JWT inside is short-lived (~15 min); the long-lived refresh token is an httpOnly cookie set by the API, which
// JavaScript never sees. The cookie itself is kept for the refresh token's lifetime so an expired JWT can be refreshed.

function readStoredToken(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${ACCESS_COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(ACCESS_COOKIE.length + 1)) : null;
}

/** A usable access token, or null when there is none or it has expired. */
export function getAccessToken(): string | null {
  const token = readStoredToken();
  return token && !isExpired(token) ? token : null;
}

/** There is a stored session (maybe with an expired JWT) that a refresh could revive. */
export function hasStoredSession(): boolean {
  return readStoredToken() !== null;
}

export function setAccessToken(token: string): void {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}

export function clearSession(): void {
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0`;
}

/** The session is over (refresh refused, token invalid): forget it and go to /login, remembering where the user was. */
export function endSession(): void {
  clearSession();
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  // Public pages (landing, login, register) stay where they are; only pages that need a user send you to /login.
  if (!isProtectedPath(pathname)) return;
  // A full page load on purpose (it also wipes any in-memory state of the old session), so not router.push.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `${routes.login}?next=${encodeURIComponent(pathname + search)}`;
}
