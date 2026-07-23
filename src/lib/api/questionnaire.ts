import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type { QuestionnaireAnswer, Recommendation } from "@/types";
import { computePlaceholderRecommendation } from "@/lib/recommendations/placeholder";

/** Placeholder questions until Todd supplies the final BMIS set. */
export const PLACEHOLDER_QUESTIONS = [
  {
    id: "goal",
    label: "What is your primary financial goal?",
    placeholder: "e.g. Save for a housing deposit",
  },
  {
    id: "amount_needed",
    label: "How much do you need to reach that goal? (USD)",
    placeholder: "12000",
  },
  {
    id: "monthly_set_aside",
    label: "How much can you set aside each month? (USD)",
    placeholder: "400",
  },
  {
    id: "timeline_preference",
    label: "Preferred timeline in months (optional)",
    placeholder: "12",
  },
  {
    id: "situation",
    label: "Briefly describe your current situation",
    placeholder: "Stable income, first-time planner…",
  },
] as const;

export async function getQuestionnaire(): Promise<{
  answers: QuestionnaireAnswer[];
  complete: boolean;
  questions: typeof PLACEHOLDER_QUESTIONS;
}> {
  await delay(120);
  const user = getStore().user;
  if (!user) throw new Error("Not authenticated");
  return {
    answers: user.questionnaireAnswers,
    complete: user.questionnaireComplete,
    questions: PLACEHOLDER_QUESTIONS,
  };
}

export async function saveQuestionnaire(
  answers: QuestionnaireAnswer[],
): Promise<{ answers: QuestionnaireAnswer[]; recommendation: Recommendation }> {
  await delay(250);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");

  const computed = computePlaceholderRecommendation(
    answers,
    store.settings.rules,
  );
  const recommendation: Recommendation = {
    id: store.user.recommendationId ?? crypto.randomUUID(),
    userId: store.user.id,
    userName: store.user.name,
    recommendedBudget: computed.budget,
    projectedTimelineMonths: computed.timelineMonths,
    status: "pending",
    notes: "Auto-generated from questionnaire (placeholder formula).",
    adjustedBudget: null,
    adjustedTimelineMonths: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    labeledAsProjection: true,
  };

  const recommendations = [
    recommendation,
    ...store.recommendations.filter((r) => r.userId !== store.user!.id),
  ];

  const user = {
    ...store.user,
    questionnaireAnswers: answers,
    questionnaireComplete: true,
    recommendationId: recommendation.id,
    bmisProfile: {
      ...store.user.bmisProfile,
      goalSummary:
        answers.find((a) => a.questionId === "goal")?.value ||
        store.user.bmisProfile.goalSummary,
    },
  };

  setStore({ user, recommendations });
  appendAudit(user.email, "Completed BMIS questionnaire; projection generated");
  return { answers, recommendation };
}
