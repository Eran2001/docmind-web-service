import axios, {
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiErrorBody } from "@/types";

import { env } from "@/configs/env";
import { AUTH_ROUTES, routes } from "@/configs/routes";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retried?: boolean;
  }
}

// Spec 8.1 error shape, normalized so callers never touch AxiosError.
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: string, message: string, status = 0, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function normalizeError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (axios.isAxiosError<Partial<ApiErrorBody>>(err)) {
    const body = err.response?.data?.error;
    if (body?.message)
      return new ApiError(
        body.code ?? "INTERNAL_ERROR",
        body.message,
        err.response?.status,
        body.details,
      );
    if (!err.response)
      return new ApiError(
        "NETWORK_ERROR",
        "Can't reach the server. Check your connection and try again.",
      );
    return new ApiError(
      "INTERNAL_ERROR",
      "Something went wrong. Please try again.",
      err.response.status,
    );
  }
  if (err instanceof Error && err.name === "AbortError")
    return new ApiError("ABORTED", "Request cancelled.");
  return new ApiError(
    "INTERNAL_ERROR",
    err instanceof Error ? err.message : "Something went wrong.",
  );
}

export function getErrorMessage(err: unknown): string {
  return normalizeError(err).message;
}

const mockAdapter: AxiosAdapter = async (config) => {
  const { handleMockRequest } = await import("@/lib/mock/adapter");
  return handleMockRequest(config);
};

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  ...(env.NEXT_PUBLIC_USE_MOCKS ? { adapter: mockAdapter } : {}),
});

let refreshing: Promise<void> | null = null;

// One in-flight refresh shared by every concurrent 401.
export function refreshSession(): Promise<void> {
  refreshing ??= api
    .post("/auth/refresh", null, { skipAuthRefresh: true })
    .then(() => undefined)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (AUTH_ROUTES.includes(window.location.pathname)) return;
  window.location.assign(routes.login);
}

api.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config
    ) {
      const config: InternalAxiosRequestConfig = error.config;
      if (!config.skipAuthRefresh && !config._retried) {
        config._retried = true;
        try {
          await refreshSession();
          return await api(config);
        } catch (retryError) {
          const normalized = normalizeError(retryError);
          if (normalized.status === 401) redirectToLogin();
          throw normalized;
        }
      }
    }
    throw normalizeError(error);
  },
);
