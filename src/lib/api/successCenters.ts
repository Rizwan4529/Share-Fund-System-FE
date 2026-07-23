import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type { SuccessCenter } from "@/types";

export async function listSuccessCenters(opts?: {
  activeOnly?: boolean;
}): Promise<SuccessCenter[]> {
  await delay(150);
  const centers = getStore().successCenters;
  if (opts?.activeOnly) return centers.filter((c) => c.active);
  return structuredClone(centers);
}

export async function getSuccessCenter(
  id: string,
): Promise<SuccessCenter | null> {
  await delay(100);
  return getStore().successCenters.find((c) => c.id === id) ?? null;
}

export async function saveSuccessCenter(
  center: SuccessCenter,
  actor = "Admin",
): Promise<SuccessCenter> {
  await delay(200);
  const store = getStore();
  const exists = store.successCenters.some((c) => c.id === center.id);
  const successCenters = exists
    ? store.successCenters.map((c) => (c.id === center.id ? center : c))
    : [...store.successCenters, center];
  setStore({ successCenters });
  appendAudit(
    actor,
    exists
      ? `Updated Success Center “${center.name}”`
      : `Created Success Center “${center.name}”`,
  );
  return center;
}

export async function setSuccessCenterActive(
  id: string,
  active: boolean,
  actor = "Admin",
): Promise<SuccessCenter | null> {
  await delay(150);
  const store = getStore();
  const target = store.successCenters.find((c) => c.id === id);
  if (!target) return null;
  const updated = { ...target, active };
  setStore({
    successCenters: store.successCenters.map((c) =>
      c.id === id ? updated : c,
    ),
  });
  appendAudit(
    actor,
    `${active ? "Activated" : "Deactivated"} Success Center “${target.name}”`,
  );
  return updated;
}

export async function selectSuccessCenters(
  centerIds: string[],
): Promise<string[]> {
  await delay(200);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const limit = store.user.centerLimit;
  if (limit <= 0) {
    throw new Error("Enroll as a Founding Participant before selecting centers.");
  }
  if (centerIds.length > limit) {
    throw new Error(`Your plan allows up to ${limit} Success Center(s).`);
  }
  const activeIds = new Set(
    store.successCenters.filter((c) => c.active).map((c) => c.id),
  );
  for (const id of centerIds) {
    if (!activeIds.has(id)) throw new Error(`Center “${id}” is not available.`);
  }
  const user = { ...store.user, selectedCenterIds: centerIds };
  setStore({ user });
  appendAudit(user.email, `Selected Success Centers: ${centerIds.join(", ") || "(none)"}`);
  return centerIds;
}
