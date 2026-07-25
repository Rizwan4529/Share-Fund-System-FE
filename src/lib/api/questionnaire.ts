import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import {
  computeRecommendation,
  toRecommendation,
} from "@/lib/recommendations/engine";
import { profileCompletion } from "@/lib/questionnaire/schema";
import type { PlanKind, Recommendation, SuccessCenter, SuccessProfile } from "@/types";

export async function getSuccessProfile(): Promise<{
  profile: SuccessProfile;
  complete: boolean;
  completion: number;
  categories: SuccessCenter[];
}> {
  await delay(120);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  return {
    profile: store.user.successProfile,
    complete: store.user.questionnaireComplete,
    completion: profileCompletion(store.user.successProfile),
    categories: store.successCenters.filter((c) => c.active),
  };
}

export async function saveSuccessProfile(
  profile: SuccessProfile,
  selectedPlanId: PlanKind = "moderate",
): Promise<{ profile: SuccessProfile; recommendation: Recommendation }> {
  await delay(250);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");

  const program = store.successCenters
    .find((c) => c.id === profile.selectedCategoryId)
    ?.programs.find((p) => p.id === profile.selectedProgramId);

  const computation = computeRecommendation({
    profile,
    rules: store.settings.rules,
    programActivationPercent: program?.activationPercent,
  });

  const recommendation = toRecommendation(
    {
      id: store.user.recommendationId ?? crypto.randomUUID(),
      userId: store.user.id,
      userName: store.user.name,
      selectedPlanId,
    },
    computation,
  );

  const recommendations = [
    recommendation,
    ...store.recommendations.filter((r) => r.userId !== store.user!.id),
  ];

  const categoryName =
    store.successCenters.find((c) => c.id === profile.selectedCategoryId)?.name ??
    "";

  const user = {
    ...store.user,
    successProfile: profile,
    questionnaireComplete: true,
    recommendationId: recommendation.id,
    bmisProfile: {
      ...store.user.bmisProfile,
      goalSummary:
        profile.desiredResult ||
        (categoryName ? `${categoryName} goal` : store.user.bmisProfile.goalSummary),
    },
  };

  setStore({ user, recommendations });
  appendAudit(user.email, "Completed Success Profile; BMIS projection generated");
  return { profile, recommendation };
}

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
