import { delay } from "@/lib/delay";
import { getStore } from "@/lib/mock/store";

export async function getDashboardData() {
  await delay();
  const store = getStore();
  return {
    hasCampaign: store.hasCampaign,
    campaign: store.campaign,
    milestones: store.milestones,
    activity: store.activity,
    rewards: store.rewards,
  };
}

export async function refreshActivity() {
  await delay(600);
  const store = getStore();
  return store.activity;
}
