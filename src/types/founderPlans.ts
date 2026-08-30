export const FOUNDER_PLAN_NAMES = [
  "essential_100",
  "expanded_500",
  "premium_1000",
] as const;

export const FOUNDER_PLAN_PRIORITY_LEVELS = [
  "standard",
  "higher",
  "premium",
] as const;

export const FOUNDER_PLAN_BMIS_LEVELS = [
  "standard",
  "expanded",
  "premium",
] as const;

export const FOUNDER_PLAN_STATUSES = ["active", "inactive"] as const;

export type FounderPlanName = (typeof FOUNDER_PLAN_NAMES)[number];
export type FounderPlanPriorityLevel =
  (typeof FOUNDER_PLAN_PRIORITY_LEVELS)[number];
export type FounderPlanBmisLevel = (typeof FOUNDER_PLAN_BMIS_LEVELS)[number];
export type FounderPlanStatus = (typeof FOUNDER_PLAN_STATUSES)[number];

export type FounderPlanProgramRef = {
  _id: string;
  name: string;
  status?: string;
  programType?: string;
  goalNature?: string;
};

export type FounderPlanFundingCap = {
  standard?: number | null;
  premium?: number | null;
};

export type FounderPlan = {
  _id: string;
  name: FounderPlanName;
  price: number;
  includedSuccessCenters: Array<string | FounderPlanProgramRef>;
  eligiblePrograms?: Array<string | FounderPlanProgramRef>;
  fundingCap?: FounderPlanFundingCap;
  majorOneTimeProgramsEligible?: boolean;
  priorityLevel?: FounderPlanPriorityLevel;
  bmisPlanningLevel?: FounderPlanBmisLevel;
  founderBenefitsVersion?: string;
  status: FounderPlanStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type SuccessCenterProgramOption = {
  _id: string;
  name: string;
  status?: string;
  programType?: string;
  categoryId?: string;
};

export type CreateFounderPlanRequest = {
  name: FounderPlanName;
  price: number;
  includedSuccessCenters: string[];
  fundingCap?: FounderPlanFundingCap;
  eligiblePrograms?: string[];
  majorOneTimeProgramsEligible?: boolean;
  priorityLevel?: FounderPlanPriorityLevel;
  bmisPlanningLevel?: FounderPlanBmisLevel;
  founderBenefitsVersion?: string;
  status?: FounderPlanStatus;
};

export type UpdateFounderPlanRequest = Omit<
  CreateFounderPlanRequest,
  "name"
>;

export type ToggleFounderPlanAvailabilityRequest = {
  status: FounderPlanStatus;
};
