/**
 * Shared types entry.
 * Phase 1 domain lives in ./phase1.
 * Phase 2 demo types kept below so parked modules still typecheck.
 */

export type {
  UserRole,
  FoundingStatus,
  PricingTier,
  BillingStructure,
  RecommendationStatus,
  PaymentStatus,
  RefundStatus,
  ChargebackStatus,
  DisclosureKind,
  BmisProfile,
  QuestionnaireAnswer,
  SuccessCenter,
  FounderStackOffer,
  PricingConfig,
  PlatformRules,
  CustomPlatformRule,
  EnrollmentPlan,
  Enrollment,
  PaymentRecord,
  Recommendation,
  DisclosureDoc,
  DisclosureAcceptance,
  AuditEvent,
  PlatformSettings,
  UserProfile,
  AuthUser,
  NotificationPrefs,
  CommunicationPrefs,
  NotificationItem,
} from "./phase1";

/* ─── PHASE2_PARKED: types used by parked Rewards / Learn / Campaigns demo ─── */

export type CampaignFilter = "all" | "essentials" | "financial" | "business";

export type CampaignCategory = {
  id: string;
  name: string;
  blurb: string;
  filter: Exclude<CampaignFilter, "all">;
  tag?: string;
  long: string;
  featured?: "dark" | "gold";
};

export type ActiveCampaign = {
  cat: string;
  name: string;
  target: number;
  saved: number;
  timeline: string;
  started: string;
};

export type LearnItem = {
  id: string;
  cat: string;
  type: "guide" | "video" | "faq";
  title: string;
  mins: string;
  blurb: string;
};

export type ArticleBlock =
  | { type: "t"; text: string }
  | { type: "h"; text: string };

export type LearnArticle = {
  cat: string;
  title: string;
  meta: string;
  type: "guide" | "video" | "faq";
  body?: ArticleBlock[];
  vid?: string;
};

export type Milestone = {
  title: string;
  note: string;
  state: "done" | "current" | "todo";
};

export type ActivityItem = {
  id: string;
  icon: "up" | "star" | "book" | "flag" | "check";
  text: string;
  date: string;
  tone: "gold" | "blue" | "green";
};

export type RewardHistoryItem = {
  id: string;
  title: string;
  date: string;
  delta: string;
  positive: boolean;
};

export type RewardsBalance = {
  balance: number;
  monthEarned: number;
  lifetime: number;
};

export type RedeemOption = {
  id: string;
  title: string;
  description: string;
  cost: number;
};

export type ActivateCampaignInput = {
  categoryId: string;
  goalName: string;
  target: number;
  timeline: string;
};
