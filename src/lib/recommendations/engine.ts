import type {
  AffordabilityStatus,
  PlatformRules,
  Recommendation,
  RecommendationPlan,
  SuccessProfile,
} from "@/types";

export type RecommendationInputs = {
  profile: SuccessProfile;
  rules: PlatformRules;
  /** Activation % of the chosen program, if any (falls back to the default). */
  programActivationPercent?: number;
};

export type RecommendationComputation = {
  goalAmount: number;
  availableCashFlow: number;
  safeCapacity: number;
  plans: RecommendationPlan[];
  affordability: AffordabilityStatus;
  suggestions: string[];
  recommendedBudget: number;
  projectedTimelineMonths: number;
};

function roundUpTo(value: number, unit: number): number {
  if (!Number.isFinite(unit) || unit <= 0) return Math.ceil(value);
  return Math.ceil(value / unit) * unit;
}

/**
 * Rule-based BMIS projection. Every figure is a planning simulation — no live
 * funding moves in Phase 1. All inputs come from the Success Profile and the
 * admin-configurable platform rules.
 */
export function computeRecommendation({
  profile,
  rules,
  programActivationPercent,
}: RecommendationInputs): RecommendationComputation {
  const goalAmount = Math.max(0, profile.goalAmount || 0);

  const availableCashFlow = Math.round(
    (profile.netMonthlyIncome || 0) -
      (profile.essentialExpenses || 0) -
      (profile.monthlyDebt || 0) -
      (profile.existingCommitments || 0) -
      (profile.monthlyObligation || 0),
  );

  const mathCapacity = Math.max(
    0,
    Math.round(availableCashFlow * (rules.safeCapacityFactor || 0)),
  );
  const comfortable = Math.max(0, profile.comfortableMonthlyActivation || 0);
  const safeCapacity =
    comfortable > 0 ? Math.min(comfortable, mathCapacity) : mathCapacity;

  const activationPercent =
    programActivationPercent && programActivationPercent > 0
      ? programActivationPercent
      : rules.activationPercentDefault || 5;

  const activationRequirement = Math.round(
    goalAmount * (activationPercent / 100),
  );

  const { fastMonths, moderateMonths, longMonths } = rules.planPresets;

  const buildPlan = (
    id: RecommendationPlan["id"],
    label: string,
    months: number,
  ): RecommendationPlan => {
    const safeMonths = Math.max(1, months);
    const scheduledPayment = roundUpTo(
      activationRequirement / safeMonths,
      rules.roundingUnit,
    );
    return {
      id,
      label,
      months: safeMonths,
      activationPercent,
      activationRequirement,
      scheduledPayment,
      fundingRangeLow: activationRequirement,
      fundingRangeHigh: roundUpTo(activationRequirement * 1.15, rules.roundingUnit),
      affordable: scheduledPayment <= safeCapacity && safeCapacity > 0,
    };
  };

  const plans: RecommendationPlan[] = [
    buildPlan("fast", "Fast Track", fastMonths),
    buildPlan("moderate", "Moderate", moderateMonths),
    buildPlan("long", "Long Term", longMonths),
    buildPlan("one_time", "One-time", 1),
  ];

  const moderate = plans.find((p) => p.id === "moderate")!;
  const long = plans.find((p) => p.id === "long")!;

  let affordability: AffordabilityStatus;
  if (goalAmount <= 0) {
    affordability = "not_currently_eligible";
  } else if (moderate.affordable) {
    affordability = "eligible";
  } else if (long.affordable) {
    affordability = "eligible_with_adjustment";
  } else if (availableCashFlow <= 0) {
    affordability = "increase_income_first";
  } else if (
    (profile.currentSavings || 0) + (profile.emergencySavings || 0) >=
    activationRequirement
  ) {
    affordability = "build_savings_first";
  } else {
    affordability = "not_currently_eligible";
  }

  const suggestions = buildSuggestions(affordability);

  return {
    goalAmount,
    availableCashFlow,
    safeCapacity,
    plans,
    affordability,
    suggestions,
    recommendedBudget: moderate.activationRequirement,
    projectedTimelineMonths: moderate.months,
  };
}

function buildSuggestions(status: AffordabilityStatus): string[] {
  switch (status) {
    case "eligible":
      return [
        "You're on track for the Moderate plan. Consider Fast Track if you can commit a little more each month.",
      ];
    case "eligible_with_adjustment":
      return [
        "Choose the Long Term plan to spread activation across more months.",
        "Consider lowering the goal amount to bring the schedule within reach.",
      ];
    case "build_savings_first":
      return [
        "Start with a short savings period, then activate.",
        "Apply part of your existing savings toward the activation requirement.",
        "Consider the Long Term plan for a lower monthly amount.",
      ];
    case "increase_income_first":
      return [
        "Explore ways to increase income before activating a paid plan.",
        "Start with free Education planning resources to build toward eligibility.",
        "Reduce an essential or existing commitment to free up cash flow.",
      ];
    default:
      return [
        "Try a longer timeline or a lower goal amount.",
        "Consider an alternate program with a lower activation requirement.",
        "Delay activation and revisit after building savings or income.",
      ];
  }
}

export const AFFORDABILITY_LABELS: Record<AffordabilityStatus, string> = {
  eligible: "Eligible now",
  eligible_with_adjustment: "Eligible with adjustment",
  build_savings_first: "Build savings first",
  increase_income_first: "Increase income first",
  not_currently_eligible: "Not currently eligible",
};

/** Build a full Recommendation record from an engine computation. */
export function toRecommendation(
  base: {
    id: string;
    userId: string;
    userName: string;
    selectedPlanId?: Recommendation["selectedPlanId"];
    status?: Recommendation["status"];
  },
  computation: RecommendationComputation,
): Recommendation {
  const now = new Date().toISOString();
  return {
    id: base.id,
    userId: base.userId,
    userName: base.userName,
    goalAmount: computation.goalAmount,
    availableCashFlow: computation.availableCashFlow,
    safeCapacity: computation.safeCapacity,
    plans: computation.plans,
    affordability: computation.affordability,
    suggestions: computation.suggestions,
    selectedPlanId: base.selectedPlanId ?? "moderate",
    recommendedBudget: computation.recommendedBudget,
    projectedTimelineMonths: computation.projectedTimelineMonths,
    status: base.status ?? "pending",
    notes: "Auto-generated from your Success Profile (BMIS projection).",
    adjustedBudget: null,
    adjustedTimelineMonths: null,
    createdAt: now,
    updatedAt: now,
    labeledAsProjection: true,
  };
}
