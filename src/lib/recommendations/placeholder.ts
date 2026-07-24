import type { PlatformRules, QuestionnaireAnswer } from "@/types";

/**
 * Placeholder recommendation formula until Todd supplies the final rules.
 * Clearly intended for projections/simulations only — no live funding.
 */
export function computePlaceholderRecommendation(
  answers: QuestionnaireAnswer[],
  rules: PlatformRules,
): { budget: number; timelineMonths: number } {
  const amountNeeded = Number(
    answers.find((a) => a.questionId === "amount_needed")?.value ?? "0",
  );
  const monthly = Number(
    answers.find((a) => a.questionId === "monthly_set_aside")?.value ?? "0",
  );
  const preferred = Number(
    answers.find((a) => a.questionId === "timeline_preference")?.value ?? "0",
  );

  const rawBudget = Math.max(
    amountNeeded * rules.recommendationBudgetFactor,
    rules.caps.minMonthlySetAside * 6,
  );
  const budget = Math.min(
    Math.round(rawBudget),
    rules.caps.maxRecommendedBudget,
  );

  let timelineMonths = rules.defaultTimelineMonths;
  if (monthly >= rules.caps.minMonthlySetAside && budget > 0) {
    timelineMonths = Math.ceil(
      (budget / monthly) * rules.recommendationTimelineFactor,
    );
  }
  if (preferred > 0) {
    timelineMonths = Math.round((timelineMonths + preferred) / 2);
  }
  timelineMonths = Math.max(1, Math.min(120, timelineMonths));

  return { budget, timelineMonths };
}
