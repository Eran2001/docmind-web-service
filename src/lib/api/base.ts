import axios, { type AxiosInstance } from "axios";
import type { ApiEnvelope } from "@/types";

import { env } from "@/configs/env";
import { normalizeError } from "@/lib/api/errors";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Don't sign the user out / redirect to /login when this request gets a 401 (used while checking a session). */
    skipAuthRedirect?: boolean;
    /** Set once a request has been retried after a silent refresh, so it is never retried twice. */
    _retried?: boolean;
    /** Preserve the API envelope when a caller needs top-level metadata such as a created resourceId. */
    preserveEnvelope?: boolean;
  }
}

function isEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as ApiEnvelope<unknown>).code === "string" &&
    typeof (body as ApiEnvelope<unknown>).requestId === "string" &&
    "data" in body
  );
}

/** Shared setup for both instances: base URL, cookies, and `{ code, data, ... }` unwrapping. */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // sends the httpOnly refresh cookie to the API
  });

  // Success envelope -> hand callers just `data` (the object, or `{ result: [...] }` for lists).
  client.interceptors.response.use((res) => {
    if (isEnvelope(res.data) && !res.config.preserveEnvelope)
      res.data = res.data.data;
    return res;
  });
  return client;
}

export { normalizeError };
