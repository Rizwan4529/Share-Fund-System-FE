export type PlanLabel = "fast" | "moderate" | "longer";

export type AffordabilityStatus =
  | "eligible"
  | "eligible_with_adjustment"
  | "build_savings_first"
  | "increase_income_first"
  | "not_currently_eligible";

/** Machine-readable reasons the backend can't calculate a plan (422 `errors`). */
export type ActivationErrorCode =
  | "SELECTION_REMOVED"
  | "PROFILE_REQUIRED"
  | "INCOME_REQUIRED"
  | "GOAL_AMOUNT_REQUIRED";

export type ActivationOption = {
  _id?: string;
  label: PlanLabel;
  months: number;
  scheduledPayment: number;
  totalActivationRequirement: number;
  activationPercentage: number;
  growthPeriodDays: number | null;
  /** The goal amount the plan was calculated from. */
  totalGoal: number;
  affordable: boolean;
};

/** Stored Recommendation snapshot — every figure comes from the backend. */
export type ActivationPlan = {
  _id: string;
  selectionId: string;
  options: ActivationOption[];
  oneTimeOption: { totalActivationRequirement: number; payFullNow: boolean };
  affordabilityStatus: AffordabilityStatus;
  suggestedAlternatives: string[];
  selectedOption?: PlanLabel;
  createdAt: string;
  updatedAt: string;
};

export type CalculateActivationResponse =
  | {
      activationRequired: true;
      goalAmount: number;
      activationPercentage: number;
      totalActivationRequirement: number;
      recommendation: ActivationPlan;
    }
  | {
      activationRequired: false;
      selectionId: string;
      programType: string;
    };
