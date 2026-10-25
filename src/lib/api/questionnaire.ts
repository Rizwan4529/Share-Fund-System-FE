import { delay } from "@/lib/delay";
import { getStore, setStore } from "@/lib/mock/store";
import type { PlanKind, Recommendation } from "@/types";

/** Persist just the participant's chosen plan on their recommendation. */
export async function selectRecommendationPlan(
  planId: PlanKind,
): Promise<Recommendation> {
  await delay(150);
  const store = getStore();
  if (!store.user?.recommendationId) throw new Error("No recommendation yet");
  const target = store.recommendations.find(
    (r) => r.id === store.user!.recommendationId,
  );
  if (!target) throw new Error("Recommendation not found");
  const updated: Recommendation = {
    ...target,
    selectedPlanId: planId,
    updatedAt: new Date().toISOString(),
  };
  setStore({
    recommendations: store.recommendations.map((r) =>
      r.id === updated.id ? updated : r,
    ),
  });
  return updated;
}
