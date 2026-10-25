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

/** Projections are estimates; "not_configured" = a projection rule is missing. */
export type ProjectionStatus = "projected" | "not_configured";

export type ProjectionBasis = "calculation_date" | "activation_paid_date";

/** Timeline + funding range estimate for one option. Dates are ISO strings. */
export type OptionProjection = {
  isProjection: true;
  status: ProjectionStatus;
  growthPeriodStartDate?: string;
  growthPeriodCompletionDate?: string;
  eligibilityDate?: string;
  activationMonths?: number;
  activationCompletionDate?: string;
  estimatedFundingRange?: {
    earliest: string;
    latest: string;
    basis: "projected";
    anchor: "eligibility_date" | "activation_completion_date";
  };
};

/** How the option projections were produced. */
export type PlanProjection = {
  isProjection: true;
  status: ProjectionStatus;
  notice: string;
  basis: ProjectionBasis;
  basisDate: string;
  goalNature?: "one_time" | "recurring";
  /** Settings keys an admin needs to configure. */
  missingRules?: string[];
};

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
  /** Absent on plans calculated before projections existed. */
  projection?: OptionProjection;
};

/** Stored Recommendation snapshot — every figure comes from the backend. */
export type ActivationPlan = {
  _id: string;
  selectionId: string;
  options: ActivationOption[];
  oneTimeOption: {
    totalActivationRequirement: number;
    payFullNow: boolean;
    projection?: OptionProjection;
  };
  /** Absent on plans calculated before projections existed. */
  projection?: PlanProjection;
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
