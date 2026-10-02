import { normalizeError } from "@/lib/api/errors";
import { createApiClient } from "@/lib/api/base";

/** For calls that need no sign-in: register and login. Sends no Authorization header. */
export const publicApi = createApiClient();

publicApi.interceptors.response.use(undefined, (error: unknown) => {
  throw normalizeError(error);
});
