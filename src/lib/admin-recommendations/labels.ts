import { PLAN_LABELS } from "@/lib/activation/labels";
import type { AffordabilityStatus, ProjectionBasis } from "@/types/activation";
import type {
  AdjustableOptionKey,
  ReviewStatus,
} from "@/types/adminRecommendations";

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending_review: "Pending review",
  approved: "Approved",
  adjusted: "Adjusted",
};

export const REVIEW_STATUS_OPTIONS = (
  Object.keys(REVIEW_STATUS_LABELS) as ReviewStatus[]
).map((value) => ({ value, label: REVIEW_STATUS_LABELS[value] }));

/** Short admin labels (participants see the supportive AFFORDABILITY_MESSAGES). */
export const AFFORDABILITY_STATUS_LABELS: Record<AffordabilityStatus, string> = {
  eligible: "Eligible",
  eligible_with_adjustment: "Eligible with adjustment",
  build_savings_first: "Build savings first",
  increase_income_first: "Increase income first",
  not_currently_eligible: "Not currently eligible",
};

export const AFFORDABILITY_STATUS_OPTIONS = (
  Object.keys(AFFORDABILITY_STATUS_LABELS) as AffordabilityStatus[]
).map((value) => ({ value, label: AFFORDABILITY_STATUS_LABELS[value] }));

/** Admin wording for the projection date basis (participants see "your"). */
export const ADMIN_PROJECTION_BASIS_LABELS: Record<ProjectionBasis, string> = {
  calculation_date: "Projected dates assume activation starts on",
  activation_paid_date: "Projected dates count from the activation payment on",
};

export const OPTION_KEY_LABELS: Record<AdjustableOptionKey, string> = {
  ...PLAN_LABELS,
  one_time: "One-time",
};

/** The Success Profile figures the calculation used (Recommendation.inputSnapshot). */
export const INPUT_FIGURE_LABELS: Record<string, string> = {
  netMonthlyIncome: "Net monthly income",
  essentialExpenses: "Essential expenses",
  monthlyDebt: "Monthly debt",
  existingCommitments: "Existing commitments",
  comfortableMonthlyAmount: "Comfortable monthly amount",
  currentSavings: "Current savings",
  emergencySavings: "Emergency savings",
  availableCashFlow: "Available cash flow",
  safeCapacity: "Safe monthly capacity",
};

/** Resolved calculation rules (Recommendation.rulesVersionUsed.resolvedRules). */
export const RULE_LABELS: Record<string, string> = {
  activationPercentage: "Activation %",
  percentageMin: "Min activation %",
  percentageMax: "Max activation %",
  roundingIncrement: "Rounding increment",
  planMonthOptions: "Plan months",
  minGoalAmount: "Min goal amount",
  maxGoalAmount: "Max goal amount",
  growthPeriodDays: "Growth period (days)",
  eligibilityOffsetDays: "Eligibility offset (days)",
  fundingStartOffsetDays: "Funding estimate start (days)",
  fundingRangeDays: "Funding range width (days)",
};

/** Labels for the paths inside an option (amounts, then projected dates). */
const OPTION_FIELD_LABELS: Record<string, string> = {
  totalActivationRequirement: "Activation amount",
  scheduledPayment: "Scheduled payment",
  months: "Months",
  "projection.growthPeriodCompletionDate": "Growth period ends (projected)",
  "projection.eligibilityDate": "Eligibility (projected)",
  "projection.activationCompletionDate": "Activation complete (projected)",
  "projection.estimatedFundingRange.earliest": "Funding window from (projected)",
  "projection.estimatedFundingRange.latest": "Funding window to (projected)",
};

/** Fields whose values are dates. */
export const isDateField = (field: string) => field.includes("projection.");

/** "options.fast.scheduledPayment" → "Fast · Scheduled payment". */
export function adjustmentFieldLabel(field: string): string {
  if (field === "affordabilityStatus") return "Affordability status";
  const parts = field.split(".");
  const [optionKey, rest] =
    parts[0] === "oneTimeOption"
      ? (["one_time", parts.slice(1)] as const)
      : ([parts[1], parts.slice(2)] as const);
  const option = OPTION_KEY_LABELS[optionKey as AdjustableOptionKey] ?? optionKey;
  return `${option} · ${OPTION_FIELD_LABELS[rest.join(".")] ?? rest.join(".")}`;
}
