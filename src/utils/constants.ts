import type { CampaignCategory, LearnItem, RedeemOption } from "@/types";

export const LANDING_URL =
  import.meta.env.VITE_LANDING_URL ?? "http://localhost:5173";

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY: "/verify",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  DASHBOARD_PROGRESS: "/dashboard/progress",
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_DETAIL: "/campaigns/:categoryId",
  CAMPAIGN_ACTIVATE: "/campaigns/:categoryId/activate",
  CAMPAIGN_SUCCESS: "/campaigns/success",
  REWARDS: "/rewards",
  LEARN: "/learn",
  LEARN_ARTICLE: "/learn/:slug",
  LEARN_VIDEO: "/learn/:slug/watch",
  ACCOUNT: "/account",
  ACCOUNT_SECTION: "/account/:section",
  ADMIN: "/admin",
  ADMIN_MEMBERS: "/admin/members",
  ADMIN_CAMPAIGNS: "/admin/campaigns",
  ADMIN_REWARDS: "/admin/rewards",
  ADMIN_CONTENT: "/admin/content",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_MARKETING: "/admin/marketing",
  ADMIN_SETTINGS: "/admin/settings",
} as const;

export const ADMIN_DATE_RANGES = ["7d", "30d", "90d", "12m"] as const;
export type AdminDateRange = (typeof ADMIN_DATE_RANGES)[number];

export const ADMIN_RANGE_LABELS: Record<AdminDateRange, string> = {
  "7d": "past 7 days",
  "30d": "past 30 days",
  "90d": "past 90 days",
  "12m": "past 12 months",
};

export const CAMPAIGN_FILTERS = [
  { id: "all", label: "All" },
  { id: "essentials", label: "Essentials" },
  { id: "financial", label: "Financial" },
  { id: "business", label: "Business" },
] as const;

export const LEARN_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Getting Started", label: "Getting Started" },
  { id: "Budgeting", label: "Budgeting" },
  { id: "Campaigns", label: "Campaigns" },
  { id: "Rewards", label: "Rewards" },
] as const;

export const ACCOUNT_SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "communication", label: "Communication" },
  { id: "management", label: "Account management" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
] as const;

export const JOURNEY_STEPS: [string, string][] = [
  ["Create your account", "Free to join, set up in moments."],
  ["Choose your category", "Pick the campaign that matches your goal."],
  ["Learn how to activate", "Short, clear guidance before you commit."],
  ["Track your progress", "Follow where you stand from your dashboard."],
  ["Earn rewards", "Participation is recognized with credits."],
  ["Access resources", "Guides and tools that keep you supported."],
];

export const INCLUDED_ITEMS = [
  "Goal tracking dashboard",
  "Marketing support from SFS",
  "Rewards credits for participation",
  "Learning resources & guides",
];

export const CATEGORIES: CampaignCategory[] = [
  {
    id: "housing",
    name: "Housing",
    blurb: "Rent, mortgage, and housing-related expenses.",
    filter: "essentials",
    tag: "Most chosen",
    long: "Housing is the largest line item in most household budgets. A Housing campaign helps you organize a clear goal around rent, a mortgage, a deposit, or a move — and stay oriented while you work toward it.",
    featured: "dark",
  },
  {
    id: "food",
    name: "Food & Groceries",
    blurb: "Household food and grocery needs.",
    filter: "essentials",
    long: "Grocery and food costs add up quietly every week. A Food & Groceries campaign gives that spending a plan, so you can steady it month to month and put a little structure around an everyday essential.",
  },
  {
    id: "utilities",
    name: "Utilities",
    blurb: "Electricity, water, internet, and utility expenses.",
    filter: "essentials",
    long: "Keep the lights on without the stress. A Utilities campaign is built around the recurring bills that keep a home running — electricity, water, internet, and more.",
  },
  {
    id: "debt",
    name: "Debt Reduction",
    blurb: "Personal debt reduction goals.",
    filter: "financial",
    tag: "Popular",
    long: "Paying down debt is one of the highest-impact financial moves there is. A Debt Reduction campaign helps you frame a clear payoff goal and stay focused on progress rather than the balance.",
  },
  {
    id: "vehicle",
    name: "Vehicle",
    blurb: "Transportation and vehicle-related goals.",
    filter: "financial",
    long: "Reliable transportation keeps life moving. A Vehicle campaign supports goals around a purchase, repairs, or the ongoing costs of getting where you need to be.",
  },
  {
    id: "medical",
    name: "Medical",
    blurb: "Health-related financial needs.",
    filter: "financial",
    long: "Health costs rarely arrive on schedule. A Medical campaign helps you prepare for and organize health-related expenses with a little more calm and a lot less scramble.",
  },
  {
    id: "business",
    name: "Business Growth",
    blurb: "Startup, expansion, equipment, and operational goals.",
    filter: "business",
    tag: "For owners",
    long: "Growth takes fuel. A Business Growth campaign is built for owners working toward startup costs, expansion, new equipment, or the operational runway to reach the next stage.",
    featured: "gold",
  },
];

export const LEARN_ITEMS: LearnItem[] = [
  {
    id: "housing-basics",
    cat: "Getting Started",
    type: "guide",
    title: "How SFS campaigns work",
    mins: "5 min read",
    blurb: "The full picture: choose a category, activate, track, and earn along the way.",
  },
  {
    id: "first-goal",
    cat: "Getting Started",
    type: "guide",
    title: "Setting a goal you can actually reach",
    mins: "6 min read",
    blurb: "A simple framework for turning a big number into steady, doable progress.",
  },
  {
    id: "budget-101",
    cat: "Budgeting",
    type: "guide",
    title: "Budgeting basics for real life",
    mins: "8 min read",
    blurb: "Build a budget that survives contact with an actual month — no spreadsheets required.",
  },
  {
    id: "debt-video",
    cat: "Budgeting",
    type: "video",
    title: "Snowball vs. avalanche, explained",
    mins: "4 min watch",
    blurb: "Two proven ways to pay down debt, and how to pick the one that fits you.",
  },
  {
    id: "rewards-guide",
    cat: "Rewards",
    type: "guide",
    title: "Making the most of your credits",
    mins: "3 min read",
    blurb: "Where credits come from and the smartest ways to put them to use.",
  },
  {
    id: "activate-video",
    cat: "Campaigns",
    type: "video",
    title: "Activating your first campaign",
    mins: "2 min watch",
    blurb: "A quick walkthrough of the activation flow from start to finish.",
  },
  {
    id: "staying-on",
    cat: "Campaigns",
    type: "guide",
    title: "Staying motivated month to month",
    mins: "5 min read",
    blurb: "Small habits that keep momentum going long after the excitement fades.",
  },
  {
    id: "faq-credits",
    cat: "Rewards",
    type: "faq",
    title: "Rewards credits: common questions",
    mins: "FAQ",
    blurb: "Do credits expire? Can they be transferred? The answers, in one place.",
  },
];

export const REDEEM_OPTIONS: RedeemOption[] = [
  {
    id: "activation",
    title: "Future activation credit",
    description: "Apply toward your next campaign activation.",
    cost: 250,
  },
  {
    id: "marketplace",
    title: "Marketplace item",
    description: "Redeem for select marketplace rewards.",
    cost: 500,
  },
  {
    id: "services",
    title: "Platform services",
    description: "Unlock premium platform features.",
    cost: 750,
  },
];

export const EARN_CARDS = [
  { title: "Welcome bonus", points: "+150", desc: "When you create your account" },
  { title: "Campaign activation", points: "+200", desc: "When you activate a goal" },
  { title: "Monthly check-in", points: "+40", desc: "Each month you stay engaged" },
  { title: "Learning content", points: "+25", desc: "Per guide or video completed" },
];

export const USE_CREDITS_CARDS = [
  { title: "Future activations", soon: false },
  { title: "Marketplace", soon: true },
  { title: "Platform services", soon: true },
  { title: "Promotions", soon: true },
];

export function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

export function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard/progress")) return "Campaign progress";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.includes("/activate")) return "Activate campaign";
  if (pathname.includes("/campaigns/")) return "Campaign details";
  if (pathname.startsWith("/campaigns")) return "Campaigns";
  if (pathname.startsWith("/rewards")) return "Rewards";
  if (pathname.startsWith("/learn")) return "Learn";
  if (pathname.startsWith("/account")) return "Account";
  return "SFS";
}
