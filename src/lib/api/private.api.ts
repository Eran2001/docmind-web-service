import axios from "axios";

import { createApiClient } from "@/lib/api/base";
import { reportDemoLimit } from "@/lib/api/demo-limit";
import { normalizeError } from "@/lib/api/errors";
import { refreshSession } from "@/lib/api/refresh";
import {
  endSession,
  getAccessToken,
  hasStoredSession,
} from "@/lib/api/session";

/** For every call that needs a signed-in user. Adds `Authorization: Bearer <access token>` and renews it when it has expired. */
export const privateApi = createApiClient();

const isUnauthorized = (err: unknown) =>
  (err as { status?: number } | null)?.status === 401;

privateApi.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  // The JWT expired but the session may still be alive: renew it first instead of sending a request that would 401.
  if (!token && hasStoredSession()) {
    try {
      await refreshSession();
    } catch (err) {
      // The API refused the refresh token (expired, revoked, signed out elsewhere): the session is over, whatever this request was.
      if (isUnauthorized(err)) endSession();
    }
    token = getAccessToken();
  }
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

privateApi.interceptors.response.use(undefined, async (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    error.config &&
    !error.config.skipAuthRedirect
  ) {
    // Token rejected (expired mid-flight, revoked, or invalid): try one silent refresh, then repeat the request once.
    if (!error.config._retried) {
      error.config._retried = true;
      try {
        await refreshSession();
        return await privateApi(error.config);
      } catch (retryError) {
        if (
          !isUnauthorized(retryError) &&
          !(
            axios.isAxiosError(retryError) &&
            retryError.response?.status === 401
          )
        )
          throw normalizeError(retryError);
        // still 401 (or the refresh itself was refused): the session is over
      }
    }
    endSession();
  }
  const apiError = normalizeError(error);
  reportDemoLimit(apiError);
  throw apiError;
});
