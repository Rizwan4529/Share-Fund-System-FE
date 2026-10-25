import type {
  SuccessCenterCategory,
  SuccessCenterGoalNature,
  SuccessCenterProgramStatus,
  SuccessCenterProgramType,
} from "../../types/successCenters";
import type {
  ObligationType,
  PayeeType,
  PricingSource,
} from "../../types/successCenterSelections";

export function categoryNameById(
  categories: SuccessCenterCategory[],
  categoryId: string,
): string {
  return categories.find((category) => category._id === categoryId)?.name ?? "—";
}

export function programStatusLabel(status: SuccessCenterProgramStatus): string {
  return status.replace(/_/g, " ");
}

export function programTypeLabel(type: SuccessCenterProgramType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/* ─── Participant-facing labels ─── */

export const PARTICIPANT_PROGRAM_TYPE_LABELS: Record<
  SuccessCenterProgramType,
  string
> = {
  funding: "Funding",
  planning: "Planning only",
};

export const GOAL_NATURE_LABELS: Record<SuccessCenterGoalNature, string> = {
  one_time: "One-time",
  recurring: "Recurring",
};

export const OBLIGATION_TYPE_LABELS: Record<ObligationType, string> = {
  existing_obligation: "Existing bill",
  new_goal: "New goal",
};

export const OBLIGATION_TYPE_OPTIONS: { value: ObligationType; label: string }[] =
  [
    {
      value: "existing_obligation",
      label: "An existing bill I already pay (rent, a loan, a utility…)",
    },
    { value: "new_goal", label: "A new goal I want to reach" },
  ];

export const PRICING_SOURCE_LABELS: Record<PricingSource, string> = {
  estimated: "Estimated",
  verified: "Verified quote",
};

export const PRICING_SOURCE_OPTIONS: { value: PricingSource; label: string }[] =
  [
    { value: "estimated", label: "My own estimate" },
    { value: "verified", label: "A verified quote from a provider" },
  ];

export const PAYEE_TYPE_LABELS: Record<PayeeType, string> = {
  landlord: "Landlord",
  lender: "Lender",
  dealer: "Dealer",
  vendor: "Vendor",
  provider: "Provider",
  self: "Myself",
};
