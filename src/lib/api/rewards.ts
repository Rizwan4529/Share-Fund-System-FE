/* PHASE2_PARKED — rewards mock API kept for parked pages; not used in Phase 1 routes. */
import { delay } from "@/lib/delay";
import { REDEEM_OPTIONS } from "@/utils/constants";

export async function getRewardsData() {
  await delay();
  return {
    balance: { balance: 0, monthEarned: 0, lifetime: 0 },
    history: [],
    redeemOptions: REDEEM_OPTIONS,
  };
}

export async function redeemCredits(_optionId: string): Promise<void> {
  await delay();
  throw new Error("Rewards are parked in Phase 1.");
}
