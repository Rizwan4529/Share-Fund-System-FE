import { delay } from "@/lib/delay";
import { getStore, seedDemoCampaign, setStore } from "@/lib/mock/store";
import { CATEGORIES } from "@/utils/constants";
import type { ActivateCampaignInput, CampaignCategory } from "@/types";

export async function getCategories(): Promise<CampaignCategory[]> {
  await delay();
  return CATEGORIES;
}

export async function getCategory(id: string): Promise<CampaignCategory | null> {
  await delay();
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

export async function activateCampaign(
  input: ActivateCampaignInput,
): Promise<void> {
  await delay();
  const campaign = seedDemoCampaign(
    input.categoryId,
    input.goalName,
    input.target,
    input.timeline,
  );
  const store = getStore();
  setStore({
    hasCampaign: true,
    campaign,
    rewards: {
      ...store.rewards,
      balance: store.rewards.balance + 200,
      monthEarned: store.rewards.monthEarned + 200,
      lifetime: store.rewards.lifetime + 200,
    },
  });
}

export async function getActiveCampaign() {
  await delay();
  const store = getStore();
  return {
    hasCampaign: store.hasCampaign,
    campaign: store.campaign,
  };
}
