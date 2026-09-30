import axios, { type AxiosAdapter, type AxiosInstance } from "axios";
import type { ApiEnvelope } from "@/types";

import { env } from "@/configs/env";
import { isRealApiRoute } from "@/lib/api/real-routes";
import { normalizeError } from "@/lib/api/errors";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Don't sign the user out / redirect to /login when this request gets a 401 (used while checking a session). */
    skipAuthRedirect?: boolean;
    /** Set once a request has been retried after a silent refresh, so it is never retried twice. */
    _retried?: boolean;
  }
}

const realAdapter = axios.getAdapter(axios.defaults.adapter);

// In mock mode, calls listed in real-routes.ts still go over the network; the rest are answered in the browser.
const mockOrReal: AxiosAdapter = async (config) => {
  if (isRealApiRoute(config)) return realAdapter(config);
  const { handleMockRequest } = await import("@/lib/mock/adapter");
  return handleMockRequest(config);
};

function isEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as ApiEnvelope<unknown>).code === "string" &&
    typeof (body as ApiEnvelope<unknown>).requestId === "string" &&
    "data" in body
  );
}

/** Shared setup for both instances: base URL, cookies, mock routing, and `{ code, data, ... }` unwrapping. */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // sends the httpOnly refresh cookie to the API
    ...(env.NEXT_PUBLIC_USE_MOCKS ? { adapter: mockOrReal } : {}),
  });

  // Success envelope -> hand callers just `data` (the object, or `{ result: [...] }` for lists).
  client.interceptors.response.use((res) => {
    if (isEnvelope(res.data)) res.data = res.data.data;
    return res;
  });
  return client;
}

export { normalizeError };
