import axios from "axios";
import type { ApiErrorBody } from "@/types";

// The API's failure envelope, normalized so callers never touch AxiosError.
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

  /** Field messages from a ValidationFailed / EmailAlreadyRegistered response: `{ email: ["..."] }`. */
  get fieldErrors(): Record<string, string[]> {
    const fe = (this.details as { fieldErrors?: unknown } | undefined)?.fieldErrors;
    return fe && typeof fe === "object" ? (fe as Record<string, string[]>) : {};
  }
}

export function normalizeError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (axios.isAxiosError<Partial<ApiErrorBody> & { error?: { details?: unknown } }>(err)) {
    const body = err.response?.data;
    const status = err.response?.status;
    // Real API: { code, error: { status, details? }, message, requestId }
    if (body && typeof body.code === "string" && typeof body.message === "string") {
      return new ApiError(body.code, body.message, status, (body.error as { details?: unknown } | undefined)?.details);
    }
    // Mock API (old shape): { error: { code, message, details? } }
    const legacy = (body as { error?: { code?: string; message?: string; details?: unknown } } | undefined)?.error;
    if (legacy?.message) return new ApiError(legacy.code ?? "InternalError", legacy.message, status, legacy.details);
    if (!err.response)
      return new ApiError("NetworkError", "Can't reach the server. Check your connection and try again.");
    return new ApiError("InternalError", "Something went wrong. Please try again.", status);
  }
  if (err instanceof Error && err.name === "AbortError") return new ApiError("Aborted", "Request cancelled.");
  return new ApiError("InternalError", err instanceof Error ? err.message : "Something went wrong.");
}

export function getErrorMessage(err: unknown): string {
  return normalizeError(err).message;
}
