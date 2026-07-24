/* PHASE2_PARKED — campaign mock API kept for parked pages; not used in Phase 1 routes. */
import { delay } from "@/lib/delay";
import { seedDemoCampaign } from "@/lib/mock/store";
import { CATEGORIES } from "@/utils/constants";
import type { ActivateCampaignInput, CampaignCategory } from "@/types";

export async function getCategories(): Promise<CampaignCategory[]> {
  await delay();
  return CATEGORIES as CampaignCategory[];
}

export async function getCategory(id: string): Promise<CampaignCategory | null> {
  await delay();
  return (CATEGORIES as CampaignCategory[]).find((c) => c.id === id) ?? null;
}

export async function activateCampaign(
  input: ActivateCampaignInput,
): Promise<void> {
  await delay();
  void seedDemoCampaign(
    input.categoryId,
    input.goalName,
    input.target,
    input.timeline,
  );
}

export async function getActiveCampaign() {
  await delay();
  return { hasCampaign: false, campaign: null };
}
