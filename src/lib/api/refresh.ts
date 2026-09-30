import type { AuthSession } from "@/types";

import { publicApi } from "@/lib/api/public.api";
import { getAccessToken, setAccessToken } from "@/lib/api/session";

let inFlight: Promise<void> | null = null;

/**
 * Gets a new access token using the httpOnly refresh cookie (the browser sends it, we never touch it).
 * One refresh at a time: every caller that needs it while one is running shares it, because each refresh token works only once.
 */
export function refreshSession(): Promise<void> {
  inFlight ??= publicApi
    .post<AuthSession>("/auth/refresh")
    .then((res) => setAccessToken(res.data.accessToken))
    .catch((err: unknown) => {
      // Another tab may have refreshed first (cookies are shared across tabs): if there is a valid token now, we're fine.
      if (getAccessToken()) return;
      throw err;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}
