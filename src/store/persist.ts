import type { PersistedAuth } from "@/types/auth";

export const AUTH_STORAGE_KEY = "sfs-auth";

function readFrom(storage: Storage): PersistedAuth | null {
  try {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedAuth;
    if (parsed?.user && parsed?.token) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function loadAuth(): PersistedAuth | null {
  return readFrom(sessionStorage) ?? readFrom(localStorage);
}

export function isRememberedAuth(): boolean {
  return Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
}

export function saveAuth(session: PersistedAuth, remember: boolean): void {
  const raw = JSON.stringify(session);
  clearAuth();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_STORAGE_KEY, raw);
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
