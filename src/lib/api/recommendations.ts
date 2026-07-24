import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type { Recommendation, RecommendationStatus } from "@/types";

export async function getMyRecommendation(): Promise<Recommendation | null> {
  await delay(120);
  const store = getStore();
  if (!store.user?.recommendationId) return null;
  return (
    store.recommendations.find((r) => r.id === store.user!.recommendationId) ??
    null
  );
}

export async function listRecommendations(): Promise<Recommendation[]> {
  await delay(150);
  return structuredClone(getStore().recommendations);
}

export async function reviewRecommendation(
  id: string,
  input: {
    status: RecommendationStatus;
    adjustedBudget?: number | null;
    adjustedTimelineMonths?: number | null;
    notes?: string;
  },
  actor = "Admin",
): Promise<Recommendation> {
  await delay(200);
  const store = getStore();
  const target = store.recommendations.find((r) => r.id === id);
  if (!target) throw new Error("Recommendation not found");

  const updated: Recommendation = {
    ...target,
    status: input.status,
    adjustedBudget:
      input.adjustedBudget !== undefined
        ? input.adjustedBudget
        : target.adjustedBudget,
    adjustedTimelineMonths:
      input.adjustedTimelineMonths !== undefined
        ? input.adjustedTimelineMonths
        : target.adjustedTimelineMonths,
    notes: input.notes ?? target.notes,
    updatedAt: new Date().toISOString(),
  };

  setStore({
    recommendations: store.recommendations.map((r) =>
      r.id === id ? updated : r,
    ),
  });
  appendAudit(
    actor,
    `Reviewed recommendation for ${target.userName} → ${input.status}`,
  );
  return updated;
}
