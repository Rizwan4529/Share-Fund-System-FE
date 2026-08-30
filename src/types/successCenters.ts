export const SUCCESS_CENTER_CATEGORY_STATUSES = [
  "active",
  "inactive",
] as const;

export type SuccessCenterCategoryStatus =
  (typeof SUCCESS_CENTER_CATEGORY_STATUSES)[number];

export const SUCCESS_CENTER_PROGRAM_STATUSES = [
  "published",
  "draft",
  "in_development",
  "coming_soon",
  "inactive",
] as const;

export type SuccessCenterProgramStatus =
  (typeof SUCCESS_CENTER_PROGRAM_STATUSES)[number];

export const SUCCESS_CENTER_PROGRAM_TYPES = [
  "funding",
  "planning",
] as const;

export type SuccessCenterProgramType =
  (typeof SUCCESS_CENTER_PROGRAM_TYPES)[number];

export const SUCCESS_CENTER_GOAL_NATURES = [
  "one_time",
  "recurring",
] as const;

export type SuccessCenterGoalNature =
  (typeof SUCCESS_CENTER_GOAL_NATURES)[number];

export type SuccessCenterCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  programsIntroduction?: string;
  order: number;
  image?: string;
  icon?: string;
  status: SuccessCenterCategoryStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type SuccessCenterProgramActivationRules = {
  activationPercentageMin?: number | null;
  activationPercentageMax?: number | null;
  defaultActivationPercentage?: number | null;
  growthPeriodDays?: number | null;
  roundingIncrement?: number | null;
  minGoalAmount?: number | null;
  maxGoalAmount?: number | null;
};

export type SuccessCenterProgram = {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  educationalContent?: string;
  status: SuccessCenterProgramStatus;
  programType: SuccessCenterProgramType;
  goalNature: SuccessCenterGoalNature;
  activationRules?: SuccessCenterProgramActivationRules;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

/** Slim shape used by Founder Plan program pickers. */
export type SuccessCenterProgramOption = {
  _id: string;
  name: string;
  status?: string;
  programType?: string;
  categoryId?: string;
};

export type CreateSuccessCenterCategoryRequest = {
  name: string;
  slug: string;
  description?: string;
  programsIntroduction?: string;
  order?: number;
  image?: string;
  icon?: string;
  status?: SuccessCenterCategoryStatus;
};

export type UpdateSuccessCenterCategoryRequest =
  Partial<CreateSuccessCenterCategoryRequest>;

export type CreateSuccessCenterProgramRequest = {
  categoryId: string;
  name: string;
  description?: string;
  educationalContent?: string;
  status?: SuccessCenterProgramStatus;
  programType?: SuccessCenterProgramType;
  goalNature?: SuccessCenterGoalNature;
  activationRules?: SuccessCenterProgramActivationRules;
  order?: number;
};

export type UpdateSuccessCenterProgramRequest =
  Partial<CreateSuccessCenterProgramRequest>;

export type ListSuccessCenterProgramsParams = {
  categoryId?: string;
  status?: SuccessCenterProgramStatus;
};
