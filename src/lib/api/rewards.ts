import { delay } from "@/lib/delay";
import { getStore, setStore } from "@/lib/mock/store";
import { REDEEM_OPTIONS } from "@/utils/constants";

export async function getRewardsData() {
  await delay();
  const store = getStore();
  return {
    balance: store.rewards,
    history: store.rewardHistory,
    redeemOptions: REDEEM_OPTIONS,
  };
}

export async function redeemCredits(optionId: string): Promise<void> {
  await delay();
  const store = getStore();
  const option = REDEEM_OPTIONS.find((o) => o.id === optionId);
  if (!option) throw new Error("Invalid option");
  if (store.rewards.balance < option.cost) {
    throw new Error("Insufficient credits");
  }
  setStore({
    rewards: {
      ...store.rewards,
      balance: store.rewards.balance - option.cost,
    },
    rewardHistory: [
      {
        id: crypto.randomUUID(),
        title: `Redeemed — ${option.title.toLowerCase()}`,
        date: "Just now",
        delta: `−${option.cost}`,
        positive: false,
      },
      ...store.rewardHistory,
    ],
  });
}
