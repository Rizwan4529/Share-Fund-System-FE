import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === "object" && error !== null && "message" in error;
}

function messageFromData(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return null;
}

/** First machine-readable `errors[].code` the API sent, if any. */
export function getApiErrorCode(error: unknown): string | undefined {
  if (!isFetchBaseQueryError(error)) return undefined;
  const data = error.data as { errors?: unknown } | undefined;
  if (!Array.isArray(data?.errors)) return undefined;
  const first = data.errors[0] as { code?: unknown } | undefined;
  return typeof first?.code === "string" ? first.code : undefined;
}

/** 404, or 400 from a malformed id in the URL — both mean "nothing here". */
export function isNotFoundError(error: unknown): boolean {
  return (
    isFetchBaseQueryError(error) &&
    (error.status === 404 || error.status === 400)
  );
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;
  if (isFetchBaseQueryError(error)) {
    return messageFromData(error.data) ?? fallback;
  }
  if (isSerializedError(error) && error.message) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
