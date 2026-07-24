import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type { PlatformSettings } from "@/types";

export async function getPlatformSettings(): Promise<PlatformSettings> {
  await delay(120);
  return structuredClone(getStore().settings);
}

export async function updatePlatformSettings(
  next: PlatformSettings,
  actor = "Admin",
): Promise<PlatformSettings> {
  await delay(200);
  setStore({ settings: structuredClone(next) });
  appendAudit(actor, "Updated platform pricing/rules settings");
  return structuredClone(next);
}
