import type {
  ActivationOption,
  AffordabilityStatus,
  OptionProjection,
  PlanLabel,
  PlanProjection,
} from "@/types/activation";

export type ReviewStatus = "pending_review" | "approved" | "adjusted";

export type RecommendationSortBy = "date" | "name" | "reviewStatus" | "affordability";

/** Paced plan labels, plus the one-time option key used by adjustments. */
export type AdjustableOptionKey = PlanLabel | "one_time";

export type AdminRecommendationRow = {
  _id: string;
  selectionId: string;
  participant: { _id?: string; name: string; email?: string };
  programName?: string;
  categoryName?: string;
  selectionStatus?: "active" | "removed";
  /** Effective status — an admin override wins over the computed one. */
  affordabilityStatus: AffordabilityStatus;
  reviewStatus: ReviewStatus;
  adminAdjusted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminRecommendationsPage = {
  recommendations: AdminRecommendationRow[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type ListAdminRecommendationsParams = {
  page: number;
  limit: number;
  search?: string;
  reviewStatus?: ReviewStatus;
  affordabilityStatus?: AffordabilityStatus;
  sortBy?: RecommendationSortBy;
  sortOrder?: "asc" | "desc";
};

/** An effective option: computed figures with overrides applied. */
export type EffectiveOption = ActivationOption & {
  /** Paths that differ from the computed value, e.g. "scheduledPayment". */
  adjustedFields?: string[];
};

export type EffectiveOneTimeOption = {
  totalActivationRequirement: number;
  payFullNow: boolean;
  projection?: OptionProjection;
  adjustedFields?: string[];
};

type AdminUserRef = { _id: string; firstName?: string; lastName?: string; email?: string };

type RuleValue = { value: unknown; source: "program" | "setting" };

export type AdminRecommendationDetail = {
  _id: string;
  reviewStatus: ReviewStatus;
  adminAdjusted: boolean;
  approvedBy?: AdminUserRef | null;
  approvedAt?: string;
  adjustmentReason?: string;
  participant: {
    _id: string;
    name: string;
    email: string;
    preferredCurrency?: string;
  } | null;
  selection: {
    _id: string;
    programId?: { _id: string; name: string; programType: string; goalNature: string } | null;
    categoryId?: { _id: string; name: string } | null;
    obligationType?: string;
    goalAmount?: number;
    pricingSource?: "estimated" | "verified";
    verifiedQuoteAmount?: number;
    status?: string;
    activationStatus?: string;
  } | null;
  /** As calculated — never changed by an admin. */
  computed: {
    options: ActivationOption[];
    oneTimeOption: EffectiveOneTimeOption;
    affordabilityStatus: AffordabilityStatus;
    projection?: PlanProjection;
    suggestedAlternatives: string[];
  };
  /** What the participant sees: computed + overrides. */
  effective: {
    options: EffectiveOption[];
    oneTimeOption: EffectiveOneTimeOption;
    affordabilityStatus: AffordabilityStatus;
  };
  overrides: { field: string; originalValue: unknown; value: unknown }[];
  adjustments: {
    field: string;
    originalValue?: unknown;
    previousValue?: unknown;
    newValue?: unknown;
    reason?: string;
    adjustedBy?: AdminUserRef | null;
    adjustedAt: string;
  }[];
  inputSnapshot?: Record<string, number>;
  rulesVersionUsed?: {
    resolvedRules?: Record<string, RuleValue | undefined>;
    settings?: { key: string; value: unknown; version: number }[];
  };
  createdAt: string;
  updatedAt: string;
};

type ProjectionOverrides = {
  growthPeriodCompletionDate?: string;
  eligibilityDate?: string;
  activationCompletionDate?: string;
  estimatedFundingRange?: { earliest?: string; latest?: string };
};

export type OptionOverrides = {
  totalActivationRequirement?: number;
  scheduledPayment?: number;
  months?: number;
  projection?: ProjectionOverrides;
};

export type AdjustRecommendationRequest = {
  reason: string;
  affordabilityStatus?: AffordabilityStatus;
  options?: Partial<Record<AdjustableOptionKey, OptionOverrides>>;
};
