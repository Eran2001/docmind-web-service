import axios from "axios";

import { AUTH_ROUTES, routes } from "@/configs/routes";
import { createApiClient } from "@/lib/api/base";
import { normalizeError } from "@/lib/api/errors";
import { clearSession, getAccessToken } from "@/lib/api/session";

/** For every call that needs a signed-in user. Adds `Authorization: Bearer <access token>`. */
export const privateApi = createApiClient();

privateApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (AUTH_ROUTES.includes(pathname)) return;
  // A full page load on purpose (it also wipes any in-memory state of the old session), so not router.push.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `${routes.login}?next=${encodeURIComponent(pathname + search)}`;
}

privateApi.interceptors.response.use(undefined, (error: unknown) => {
  // A 401 means the token is missing, expired or invalid: drop it and send the user to sign in.
  // (Silent refresh with the httpOnly refresh cookie comes with POST /auth/refresh in the API.)
  if (axios.isAxiosError(error) && error.response?.status === 401 && !error.config?.skipAuthRedirect) {
    clearSession();
    redirectToLogin();
  }
  throw normalizeError(error);
});
