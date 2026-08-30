/** Phase 1 Founding Participant domain types */

export type UserRole = "participant" | "admin";

export type FoundingStatus = "none" | "founding_participant" | "founder_stack";

export type PricingTier = "personal" | "professional_partner" | "organizational";

export type BillingStructure = "one_time" | "recurring";

export type RecommendationStatus =
  | "pending"
  | "approved"
  | "adjusted"
  | "rejected";

export type PaymentStatus = "succeeded" | "failed" | "pending" | "refunded";

export type RefundStatus =
  | "none"
  | "requested"
  | "approved"
  | "denied"
  | "processed";

export type ChargebackStatus = "none" | "opened" | "won" | "lost";

export type DisclosureKind =
  | "disclaimer"
  | "founding_disclosure"
  | "terms"
  | "privacy"
  | "refund_policy"
  | "checkout_acknowledgment"
  | "partner_sponsored_notice";

export type BmisProfile = {
  goalSummary: string;
  preferredContact: string;
  notes: string;
};

export type QuestionnaireAnswer = {
  questionId: string;
  questionLabel: string;
  value: string;
};

/* ─── Success Center Category → Program hierarchy ─── */

/** A specialized program that lives inside a Success Center category. */
export type SuccessProgram = {
  id: string;
  name: string;
  blurb: string;
  /** % of the goal required to activate the program (admin-configurable). */
  activationPercent: number;
  educationSummary: string;
  timelineNote: string;
  eligibilityNote: string;
};

/**
 * A Success Center **category**. Each category contains specialized programs.
 * (`filter` is the coarse grouping used by browse chips.)
 */
export type SuccessCenter = {
  id: string;
  name: string;
  blurb: string;
  long: string;
  filter: "essentials" | "financial" | "business";
  tag?: string;
  featured?: "dark" | "gold";
  active: boolean;
  notices: string;
  content: string;
  programs: SuccessProgram[];
};

/* ─── Participant Success Profile (core BMIS intake) ─── */

export type ParticipantType =
  | "individual"
  | "household"
  | "group"
  | "professional"
  | "business"
  | "organizational";

export type GoalCadence = "one_time" | "recurring";

export type GoalPriority = "urgent" | "important" | "long_term";

export type ActivationCadence = "monthly" | "3_month" | "6_month" | "full_term";

/**
 * Core Participant Success Profile shared across every Success Center.
 * Program-specific questions are captured separately in `questionnaireAnswers`.
 */
export type SuccessProfile = {
  /* Participant information */
  participantType: ParticipantType | "";
  country: string;
  region: string;
  currency: string;
  incomeSource: string;
  netMonthlyIncome: number;
  essentialExpenses: number;
  monthlyDebt: number;
  currentSavings: number;
  emergencySavings: number;
  existingCommitments: number;
  comfortableMonthlyActivation: number;
  /* Goal information */
  selectedCategoryId: string;
  selectedProgramId: string;
  goalCadence: GoalCadence | "";
  goalAmount: number;
  monthlyObligation: number;
  desiredCompletionDate: string;
  preferredFundingMonths: number;
  goalPriority: GoalPriority | "";
  hasVerifiedProvider: boolean;
  activationCadence: ActivationCadence | "";
  /* Financial-planning questions */
  desiredResult: string;
  currentObstacle: string;
  wouldReduceExpense: boolean;
  wouldIncreaseIncome: boolean;
  openToLowerCostOrLongerTimeline: boolean;
  priorityNote: string;
  /* Attestation */
  infoAccurate: boolean;
  /** Participant acknowledges recommendations/timelines are estimates. */
  understandsEstimates: boolean;
};

export type FounderStackOffer = {
  price: number;
  successCenterCount: number;
  benefits: string;
  available: boolean;
  promoStart: string;
  promoEnd: string;
  billing: BillingStructure;
  active: boolean;
};

/**
 * What a Founding Access allotment unlocks. Admin-configurable, defaulting to
 * `categories` (e.g. $50 = 1 category, $100 = 3, $500 = up to 8).
 */
export type FoundingSelectionMode = "categories" | "programs" | "count";

export type PricingConfig = {
  regularPricePerCenter: number;
  foundingPriceOne: number;
  foundingPriceBundle: number;
  bundleCenterCount: number;
  /** How Founding Access allotments are counted for participants. */
  selectionMode: FoundingSelectionMode;
  promoStart: string;
  promoEnd: string;
  billing: BillingStructure;
  tiers: Record<PricingTier, number>;
  founderStack: FounderStackOffer;
};

export type PlatformRules = {
  platformFeePercent: number;
  refundReservePercent: number;
  refundWindowDays: number;
  maxCentersPerParticipant: number;
  defaultTimelineMonths: number;
  recommendationBudgetFactor: number;
  recommendationTimelineFactor: number;
  /** Default % of a goal required to activate a program. */
  activationPercentDefault: number;
  /** Scheduled payments round up to the nearest multiple of this ($). */
  roundingUnit: number;
  /** Portion of available monthly cash flow considered safe to commit. */
  safeCapacityFactor: number;
  /** Month presets that drive the Fast / Moderate / Long plan options. */
  planPresets: {
    fastMonths: number;
    moderateMonths: number;
    longMonths: number;
  };
  caps: {
    maxRecommendedBudget: number;
    minMonthlySetAside: number;
  };
  /** Admin-defined numeric rules beyond the built-in set. */
  customRules: CustomPlatformRule[];
};

export type CustomPlatformRule = {
  id: string;
  label: string;
  value: number;
  description?: string;
};

export type EnrollmentPlan =
  | "founding_one"
  | "founding_bundle"
  | "founder_stack"
  | "essential_100"
  | "expanded_500"
  | "premium_1000";

export type Enrollment = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: EnrollmentPlan;
  centerLimit: number;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  paymentId: string;
};

export type PaymentRecord = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  enrollmentId: string;
  plan: EnrollmentPlan;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
  transactionRef: string;
  receiptNumber: string;
  refundDeadline: string;
  refundRequestedAt: string | null;
  refundStatus: RefundStatus;
  refundAmount: number | null;
  refundProcessedAt: string | null;
  chargebackStatus: ChargebackStatus;
  accountStatusAfterRefund: string | null;
};

export type PlanKind = "fast" | "moderate" | "long" | "one_time";

/** Whether the participant can comfortably fund a plan right now. */
export type AffordabilityStatus =
  | "eligible"
  | "eligible_with_adjustment"
  | "build_savings_first"
  | "increase_income_first"
  | "not_currently_eligible";

export type RecommendationPlan = {
  id: PlanKind;
  label: string;
  /** Months over which the activation requirement is scheduled (1 = one-time). */
  months: number;
  activationPercent: number;
  activationRequirement: number;
  scheduledPayment: number;
  fundingRangeLow: number;
  fundingRangeHigh: number;
  affordable: boolean;
};

export type Recommendation = {
  id: string;
  userId: string;
  userName: string;
  /* BMIS engine outputs */
  goalAmount: number;
  availableCashFlow: number;
  safeCapacity: number;
  plans: RecommendationPlan[];
  affordability: AffordabilityStatus;
  /** Alternative next-step suggestions when a plan is not yet affordable. */
  suggestions: string[];
  selectedPlanId: PlanKind | null;
  /** Back-compat: mirrors the Moderate plan's activation requirement. */
  recommendedBudget: number;
  /** Back-compat: mirrors the Moderate plan's month count. */
  projectedTimelineMonths: number;
  status: RecommendationStatus;
  notes: string;
  adjustedBudget: number | null;
  adjustedTimelineMonths: number | null;
  createdAt: string;
  updatedAt: string;
  labeledAsProjection: true;
};

export type DisclosureDoc = {
  id: string;
  kind: DisclosureKind;
  title: string;
  version: string;
  body: string;
  updatedAt: string;
};

export type DisclosureAcceptance = {
  id: string;
  userId: string;
  docId: string;
  kind: DisclosureKind;
  version: string;
  acceptedAt: string;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  time: string;
  tone: "ok" | "warn" | "danger";
};

export type PlatformSettings = {
  pricing: PricingConfig;
  rules: PlatformRules;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarInitials: string;
  membership: string;
};

export type AuthUser = UserProfile & {
  id: string;
  onboardingComplete: boolean;
  verified: boolean;
  role: UserRole;
  foundingStatus: FoundingStatus;
  selectedCenterIds: string[];
  centerLimit: number;
  questionnaireComplete: boolean;
  questionnaireAnswers: QuestionnaireAnswer[];
  bmisProfile: BmisProfile;
  /** Structured Success Profile that feeds the BMIS recommendation engine. */
  successProfile: SuccessProfile;
  recommendationId: string | null;
  /** Demo-only: pause hides profile activity until resumed. */
  paused?: boolean;
};

export type NotificationPrefs = {
  platform: boolean;
  campaign: boolean;
  education: boolean;
  announce: boolean;
};

export type CommunicationPrefs = {
  email: boolean;
  product: boolean;
  promos: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};
