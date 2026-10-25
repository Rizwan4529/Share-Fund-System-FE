export const SUCCESS_PROFILE_TYPES = [
  "individual",
  "household",
  "group",
  "professional",
  "business",
  "organizational",
] as const;

export type SuccessProfileType = (typeof SUCCESS_PROFILE_TYPES)[number];

export const SUCCESS_PROFILE_STATUSES = ["incomplete", "complete"] as const;

export type SuccessProfileStatus = (typeof SUCCESS_PROFILE_STATUSES)[number];

export const DISCRETIONARY_RULE_LABELS = [
  "wealth_preservation_10",
  "conservative_20",
  "moderate_30",
  "flexible_40",
  "custom",
] as const;

export type DiscretionaryRuleLabel = (typeof DISCRETIONARY_RULE_LABELS)[number];

export const SUCCESS_PROFILE_FINANCIAL_FIELDS = [
  "netMonthlyIncome",
  "essentialExpenses",
  "monthlyDebt",
  "currentSavings",
  "emergencySavings",
  "existingCommitments",
  "comfortableMonthlyAmount",
] as const;

export type SuccessProfileFinancialField =
  (typeof SUCCESS_PROFILE_FINANCIAL_FIELDS)[number];

export type SuccessProfileFinancials = Record<
  SuccessProfileFinancialField,
  number
>;

export type SuccessProfileDiscretionaryRule = {
  selectedPercentage?: number;
  label?: DiscretionaryRuleLabel;
  customPercentage?: number;
};

export type SuccessProfilePlanningAnswers = {
  desiredResult?: string;
  whatIsBlocking?: string;
  wouldReducingExpenseHelp?: string;
  wouldIncreasingIncomeHelp?: string;
  willingToConsiderLongerTimeline?: string;
  goalPriorities?: string;
};

/** Backend `SuccessProfile` document (named to avoid the Phase 1 mock type). */
export type SuccessProfileRecord = {
  _id: string;
  userId: string;
  profileType: SuccessProfileType;
  completionPercentage: number;
  status: SuccessProfileStatus;
  financials: SuccessProfileFinancials;
  employmentSource?: string;
  discretionaryRule?: SuccessProfileDiscretionaryRule;
  planningAnswers?: SuccessProfilePlanningAnswers;
  accuracyConfirmed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateSuccessProfileRequest = {
  profileType?: SuccessProfileType;
  financials?: Partial<SuccessProfileFinancials>;
  employmentSource?: string;
  discretionaryRule?: SuccessProfileDiscretionaryRule;
  planningAnswers?: SuccessProfilePlanningAnswers;
};

export type CreateSuccessProfileRequest = UpdateSuccessProfileRequest & {
  profileType: SuccessProfileType;
};
