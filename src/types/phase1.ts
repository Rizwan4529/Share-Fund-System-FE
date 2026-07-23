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
  | "checkout_acknowledgment";

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

export type PricingConfig = {
  regularPricePerCenter: number;
  foundingPriceOne: number;
  foundingPriceBundle: number;
  bundleCenterCount: number;
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
  | "founder_stack";

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

export type Recommendation = {
  id: string;
  userId: string;
  userName: string;
  recommendedBudget: number;
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
  recommendationId: string | null;
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
