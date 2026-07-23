import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type { DisclosureDoc, DisclosureKind } from "@/types";

export async function listDisclosures(): Promise<DisclosureDoc[]> {
  await delay(100);
  return structuredClone(getStore().disclosures);
}

export async function getDisclosureByKind(
  kind: DisclosureKind,
): Promise<DisclosureDoc | null> {
  await delay(80);
  return getStore().disclosures.find((d) => d.kind === kind) ?? null;
}

export async function saveDisclosure(
  doc: DisclosureDoc,
  bumpVersion: boolean,
  actor = "Admin",
): Promise<DisclosureDoc> {
  await delay(200);
  const store = getStore();
  let next = { ...doc };
  if (bumpVersion) {
    const [maj, min, patch] = doc.version.split(".").map(Number);
    next = {
      ...doc,
      version: `${maj}.${min}.${(patch || 0) + 1}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  }
  setStore({
    disclosures: store.disclosures.map((d) => (d.id === doc.id ? next : d)),
  });
  appendAudit(
    actor,
    `Updated disclosure “${next.title}” (v${next.version})`,
  );
  return next;
}
