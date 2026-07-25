import type {
  AuditEvent,
  DisclosureAcceptance,
  DisclosureDoc,
  Enrollment,
  PaymentRecord,
  PlatformSettings,
  Recommendation,
  SuccessCenter,
  SuccessProfile,
} from "@/types";

export const DEFAULT_PRICING_SETTINGS: PlatformSettings = {
  pricing: {
    regularPricePerCenter: 75,
    foundingPriceOne: 50,
    foundingPriceBundle: 100,
    bundleCenterCount: 3,
    selectionMode: "categories",
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
        "Enhanced BMIS onboarding, planning, and recommendations across up to eight Success Center categories.",
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
    activationPercentDefault: 5,
    roundingUnit: 100,
    safeCapacityFactor: 0.8,
    planPresets: {
      fastMonths: 6,
      moderateMonths: 12,
      longMonths: 24,
    },
    caps: {
      maxRecommendedBudget: 100000,
      minMonthlySetAside: 25,
    },
    customRules: [],
  },
};

/** Fresh, empty Success Profile for a new participant. */
export function emptySuccessProfile(): SuccessProfile {
  return {
    participantType: "",
    country: "",
    region: "",
    currency: "USD",
    incomeSource: "",
    netMonthlyIncome: 0,
    essentialExpenses: 0,
    monthlyDebt: 0,
    currentSavings: 0,
    emergencySavings: 0,
    existingCommitments: 0,
    comfortableMonthlyActivation: 0,
    selectedCategoryId: "",
    selectedProgramId: "",
    goalCadence: "",
    goalAmount: 0,
    monthlyObligation: 0,
    desiredCompletionDate: "",
    preferredFundingMonths: 0,
    goalPriority: "",
    hasVerifiedProvider: false,
    activationCadence: "",
    desiredResult: "",
    currentObstacle: "",
    wouldReduceExpense: false,
    wouldIncreaseIncome: false,
    openToLowerCostOrLongerTimeline: false,
    priorityNote: "",
    infoAccurate: false,
    understandsEstimates: false,
  };
}

const PHASE1_NOTICE = "Planning tools only. No live funding in Phase 1.";

export const SEED_SUCCESS_CENTERS: SuccessCenter[] = [
  {
    id: "housing",
    name: "Housing",
    blurb: "Rent, mortgage, deposits, and moving goals.",
    filter: "essentials",
    tag: "Most chosen",
    long: "Organize a clear housing goal around rent, a mortgage, a deposit, or a move. Live funding is not active in Phase 1 — figures are planning projections only.",
    featured: "dark",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Housing Success Center planning space.",
    programs: [
      {
        id: "housing-rent-stabilization",
        name: "Rent Stabilization",
        blurb: "Steady monthly rent and avoid falling behind.",
        activationPercent: 5,
        educationSummary:
          "How to build a rent buffer and plan around lease renewals.",
        timelineNote: "Typically planned over 6–12 months.",
        eligibilityNote: "Open to renters with a current lease.",
      },
      {
        id: "housing-deposit",
        name: "Deposit & Move-In",
        blurb: "Plan for a security deposit, first month, and moving costs.",
        activationPercent: 6,
        educationSummary:
          "Break a move-in target into a fundable planning schedule.",
        timelineNote: "Typically planned over 3–9 months.",
        eligibilityNote: "Best for participants preparing to move.",
      },
      {
        id: "housing-mortgage",
        name: "Mortgage Readiness",
        blurb: "Prepare for a down payment or ongoing mortgage goal.",
        activationPercent: 4,
        educationSummary:
          "Understand down-payment targets and readiness milestones.",
        timelineNote: "Typically a longer-horizon 12–24 month plan.",
        eligibilityNote: "For participants planning to buy.",
      },
    ],
  },
  {
    id: "transportation",
    name: "Transportation",
    blurb: "Vehicle purchase and commuting goals.",
    filter: "financial",
    long: "Plan for a vehicle purchase or commuting goal with a clear activation target. Routine repairs and maintenance are not a separate program — BMIS may suggest a transportation reserve from improved cash flow instead.",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Transportation Success Center planning space.",
    programs: [
      {
        id: "transportation-vehicle",
        name: "Vehicle Purchase",
        blurb: "Plan toward a reliable vehicle.",
        activationPercent: 6,
        educationSummary:
          "Set a realistic vehicle target and timeline. Routine repairs and maintenance are covered via a BMIS-suggested transportation reserve from improved cash flow — not a separate program.",
        timelineNote: "Typically planned over 12–24 months.",
        eligibilityNote: "Open to all participants.",
      },
    ],
  },
  {
    id: "debt-management",
    name: "Debt Management",
    blurb: "Reduce and organize personal debt.",
    filter: "financial",
    tag: "Popular",
    long: "Frame a clear payoff goal and stay focused on projected progress across your balances.",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Debt Management Success Center planning space.",
    programs: [
      {
        id: "debt-credit-card",
        name: "Credit Card Payoff",
        blurb: "Focus on high-interest balances first.",
        activationPercent: 5,
        educationSummary: "Compare avalanche and snowball payoff approaches.",
        timelineNote: "Typically planned over 6–18 months.",
        eligibilityNote: "For participants carrying revolving debt.",
      },
      {
        id: "debt-consolidation",
        name: "Debt Consolidation Plan",
        blurb: "Organize multiple balances into one plan.",
        activationPercent: 4,
        educationSummary: "Understand the trade-offs of consolidating debt.",
        timelineNote: "Typically a 12–24 month plan.",
        eligibilityNote: "For participants with multiple obligations.",
      },
    ],
  },
  {
    id: "business-growth",
    name: "Business Growth",
    blurb: "Startup, expansion, equipment, and runway.",
    filter: "business",
    tag: "For owners",
    long: "Plan toward startup costs, expansion, equipment, or operational runway with a fundable target.",
    featured: "gold",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Business Growth Success Center planning space.",
    programs: [
      {
        id: "business-startup",
        name: "Startup Launch",
        blurb: "Plan the costs of getting started.",
        activationPercent: 6,
        educationSummary: "Turn a launch checklist into a funding plan.",
        timelineNote: "Typically planned over 6–18 months.",
        eligibilityNote: "For new and early-stage founders.",
      },
      {
        id: "business-equipment",
        name: "Equipment & Tools",
        blurb: "Fund the equipment your business needs.",
        activationPercent: 5,
        educationSummary: "Prioritize equipment purchases by impact.",
        timelineNote: "Typically planned over 3–12 months.",
        eligibilityNote: "For operating businesses.",
      },
    ],
  },
  {
    id: "health-medical",
    name: "Health & Medical",
    blurb: "Health-related and medical expense goals.",
    filter: "financial",
    long: "Prepare for and organize health-related expenses with a clear planning timeline.",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Health & Medical Success Center planning space.",
    programs: [
      {
        id: "health-procedure",
        name: "Planned Procedure",
        blurb: "Prepare for a known upcoming medical cost.",
        activationPercent: 6,
        educationSummary: "Plan around estimates and payment timing.",
        timelineNote: "Typically planned over 3–12 months.",
        eligibilityNote: "For participants with a planned procedure.",
      },
      {
        id: "health-reserve",
        name: "Medical Reserve",
        blurb: "Build a buffer for health costs.",
        activationPercent: 4,
        educationSummary: "Create a reserve for unexpected medical bills.",
        timelineNote: "An ongoing, flexible plan.",
        eligibilityNote: "Open to all participants.",
      },
    ],
  },
  {
    id: "food-household",
    name: "Food and Household Essentials",
    blurb: "Groceries, utilities, and everyday essentials.",
    filter: "essentials",
    long: "Give groceries, utilities, and everyday essentials a plan so you can steady them month to month.",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Food and Household Essentials planning space.",
    programs: [
      {
        id: "food-groceries",
        name: "Groceries",
        blurb: "Steady month-to-month grocery spending.",
        activationPercent: 4,
        educationSummary: "Plan a realistic monthly grocery target.",
        timelineNote: "An ongoing, flexible plan.",
        eligibilityNote: "Open to all participants.",
      },
      {
        id: "food-utilities",
        name: "Utilities",
        blurb: "Plan around recurring utility bills.",
        activationPercent: 4,
        educationSummary: "Smooth out seasonal utility costs.",
        timelineNote: "An ongoing, flexible plan.",
        eligibilityNote: "Open to all participants.",
      },
    ],
  },
  {
    id: "investments-wealth",
    name: "Investments and Wealth Building",
    blurb: "Savings, investing, and long-term wealth goals.",
    filter: "financial",
    long: "Organize savings and long-term wealth-building goals into a clear, fundable planning target.",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Investments and Wealth Building planning space.",
    programs: [
      {
        id: "investments-emergency-fund",
        name: "Emergency Fund",
        blurb: "Build a cushion for the unexpected.",
        activationPercent: 4,
        educationSummary: "Reach a 3–6 month expense buffer, step by step.",
        timelineNote: "Typically planned over 6–24 months.",
        eligibilityNote: "Open to all participants.",
      },
      {
        id: "investments-long-term",
        name: "Long-Term Investing",
        blurb: "Plan contributions toward long-term goals.",
        activationPercent: 3,
        educationSummary: "Understand consistent contribution planning.",
        timelineNote: "A long-horizon plan.",
        eligibilityNote: "Educational planning only in Phase 1.",
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    blurb: "Tuition, certifications, and training goals.",
    filter: "financial",
    long: "Organize tuition, certification, and training costs into a clear planning target. Personal Growth & Career Development remains a separate future program.",
    active: true,
    notices: PHASE1_NOTICE,
    content: "Education Success Center planning space.",
    programs: [
      {
        id: "education-tuition",
        name: "Education & Tuition",
        blurb: "Plan for tuition or a course of study.",
        activationPercent: 5,
        educationSummary: "Break tuition into a fundable schedule.",
        timelineNote: "Typically planned over 6–24 months.",
        eligibilityNote: "For participants pursuing education.",
      },
      {
        id: "education-certification",
        name: "Certification & Training",
        blurb: "Fund a certification or skill-building program.",
        activationPercent: 4,
        educationSummary: "Prioritize credentials with career impact.",
        timelineNote: "Typically planned over 3–12 months.",
        eligibilityNote: "Open to all participants.",
      },
    ],
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
  {
    id: "disc-partner-sponsored",
    kind: "partner_sponsored_notice",
    title: "Professional-Partner and Sponsored-Content Notices",
    version: "1.0.0",
    updatedAt: "2026-07-01",
    body: "Placeholder — Professional-partner and sponsored-content notices. When professional partners or sponsored content appear in Success Centers or related materials, they will be clearly identified. Final legal wording will be supplied and approved by the platform owner. This is not approved wording.",
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
