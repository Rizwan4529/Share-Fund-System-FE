import type {
  AuditEvent,
  DisclosureAcceptance,
  DisclosureDoc,
  Enrollment,
  PaymentRecord,
  PlatformSettings,
  Recommendation,
  SuccessCenter,
} from "@/types";

export const DEFAULT_PRICING_SETTINGS: PlatformSettings = {
  pricing: {
    regularPricePerCenter: 75,
    foundingPriceOne: 50,
    foundingPriceBundle: 100,
    bundleCenterCount: 3,
    promoStart: "2026-01-01",
    promoEnd: "2026-12-31",
    billing: "one_time",
    tiers: {
      personal: 50,
      professional_partner: 150,
      organizational: 400,
    },
    founderStack: {
      price: 500,
      successCenterCount: 8,
      benefits:
        "Enhanced BMIS onboarding, planning, and recommendations across eight Success Centers.",
      available: true,
      promoStart: "2026-01-01",
      promoEnd: "2026-12-31",
      billing: "one_time",
      active: true,
    },
  },
  rules: {
    platformFeePercent: 0,
    refundReservePercent: 10,
    refundWindowDays: 7,
    maxCentersPerParticipant: 8,
    defaultTimelineMonths: 12,
    recommendationBudgetFactor: 1.1,
    recommendationTimelineFactor: 1,
    caps: {
      maxRecommendedBudget: 100000,
      minMonthlySetAside: 25,
    },
    customRules: [],
  },
};

export const SEED_SUCCESS_CENTERS: SuccessCenter[] = [
  {
    id: "housing",
    name: "Housing",
    blurb: "Rent, mortgage, and housing-related goals.",
    filter: "essentials",
    tag: "Most chosen",
    long: "Organize a clear housing goal around rent, a mortgage, a deposit, or a move. Live funding is not active in Phase 1 — figures are planning projections only.",
    featured: "dark",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Housing Success Center planning space.",
  },
  {
    id: "food",
    name: "Food & Groceries",
    blurb: "Household food and grocery needs.",
    filter: "essentials",
    long: "Give grocery spending a plan so you can steady it month to month.",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Food Success Center planning space.",
  },
  {
    id: "utilities",
    name: "Utilities",
    blurb: "Electricity, water, internet, and utilities.",
    filter: "essentials",
    long: "Plan around the recurring bills that keep a home running.",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Utilities Success Center planning space.",
  },
  {
    id: "debt",
    name: "Debt Reduction",
    blurb: "Personal debt reduction goals.",
    filter: "financial",
    tag: "Popular",
    long: "Frame a clear payoff goal and stay focused on projected progress.",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Debt Reduction Success Center planning space.",
  },
  {
    id: "vehicle",
    name: "Vehicle",
    blurb: "Transportation and vehicle-related goals.",
    filter: "financial",
    long: "Plan for a purchase, repairs, or ongoing transportation costs.",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Vehicle Success Center planning space.",
  },
  {
    id: "medical",
    name: "Medical",
    blurb: "Health-related financial goals.",
    filter: "financial",
    long: "Prepare for and organize health-related expenses with a planning timeline.",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Medical Success Center planning space.",
  },
  {
    id: "business",
    name: "Business Growth",
    blurb: "Startup, expansion, and operational goals.",
    filter: "business",
    tag: "For owners",
    long: "Plan toward startup costs, expansion, equipment, or operational runway.",
    featured: "gold",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Business Growth Success Center planning space.",
  },
  {
    id: "education",
    name: "Education",
    blurb: "Tuition, training, and skill-building goals.",
    filter: "financial",
    long: "Organize education and training costs into a clear planning target.",
    active: true,
    notices: "Planning tools only. No live funding in Phase 1.",
    content: "Education Success Center planning space.",
  },
];

export const SEED_DISCLOSURES: DisclosureDoc[] = [
  {
    id: "disc-disclaimer",
    kind: "disclaimer",
    title: "General SFS / BMIS Disclaimer",
    version: "1.0.0",
    updatedAt: "2026-07-01",
    body: "Share Fund System (SFS) operates BMIS as a planning and enrollment platform. Phase 1 does not move live funds. Budgets and timelines shown are projections and simulations only, not guarantees. Final legal wording will be supplied and approved by the platform owner.",
  },
  {
    id: "disc-founding",
    kind: "founding_disclosure",
    title: "Founding Participant Disclosure",
    version: "1.0.0",
    updatedAt: "2026-07-01",
    body: "Founding Participant Introductory Pricing provides access to Success Center planning tools. Enrollment fees are for access and onboarding. Live Success Center funding is not activated in this phase and is clearly disclosed as projections only.",
  },
  {
    id: "disc-terms",
    kind: "terms",
    title: "Terms of Use",
    version: "1.0.0",
    updatedAt: "2026-07-01",
    body: "Placeholder Terms of Use. Final wording to be supplied and approved by the platform owner. By creating an account you agree to these terms as presented at the time of acceptance.",
  },
  {
    id: "disc-privacy",
    kind: "privacy",
    title: "Privacy Policy",
    version: "1.0.0",
    updatedAt: "2026-07-01",
    body: "Placeholder Privacy Policy. We store account, profile, questionnaire, enrollment, and payment records needed to operate the Founding Participant program. Final wording to be supplied by the platform owner.",
  },
  {
    id: "disc-refund",
    kind: "refund_policy",
    title: "Refund Policy",
    version: "1.0.0",
    updatedAt: "2026-07-01",
    body: "Placeholder Refund Policy. Planned structure: a seven-day refund-request period, generally nonrefundable thereafter except where required by law or where access was not delivered. Final wording to be supplied by the platform owner.",
  },
  {
    id: "disc-checkout",
    kind: "checkout_acknowledgment",
    title: "Checkout Acknowledgment",
    version: "1.0.0",
    updatedAt: "2026-07-01",
    body: "I understand that Phase 1 provides planning tools and projections only. No live funding is moving. I acknowledge the Founding Participant disclosure, Terms, Privacy Policy, and Refund Policy as presented at checkout.",
  },
];

export const SEED_AUDIT: AuditEvent[] = [
  {
    id: "a1",
    actor: "System",
    action: "Phase 1 mock platform settings seeded",
    time: "Jul 23, 2026 · 09:00",
    tone: "ok",
  },
];

export const SEED_ENROLLMENTS: Enrollment[] = [];
export const SEED_PAYMENTS: PaymentRecord[] = [];
export const SEED_RECOMMENDATIONS: Recommendation[] = [];
export const SEED_ACCEPTANCES: DisclosureAcceptance[] = [];

export function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatAuditTime(date = new Date()): string {
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}
