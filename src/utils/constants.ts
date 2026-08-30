import type { LearnItem, RedeemOption, SuccessCenter } from "@/types";
import { SEED_SUCCESS_CENTERS } from "@/lib/mock/phase1Seed";

export const LANDING_URL =
  import.meta.env.VITE_LANDING_URL ?? "http://localhost:5173";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const API_PATHS = {
  LOGIN: "/login/",
  REGISTER: "/register/",
  VERIFY_EMAIL: "/verify-email",
  RESEND_LINK: "/resend-link",
  LEGAL_DOCUMENTS: "/legal-documents/",
  LEGAL_DOCUMENT: (documentType: string) => `/legal-documents/${documentType}`,
  LEGAL_DOCUMENT_VERSIONS: (documentType: string) =>
    `/legal-documents/${documentType}/versions`,
  LEGAL_DOCUMENT_VERSION: (documentType: string, version: number) =>
    `/legal-documents/${documentType}/versions/${version}`,
  LEGAL_DOCUMENT_PUBLISH: (documentType: string, version: number) =>
    `/legal-documents/${documentType}/versions/${version}/publish`,
  LEGAL_ACCEPTANCES: "/legal-acceptances/",
  LEGAL_ACCEPTANCES_ME: "/legal-acceptances/me",
  LEGAL_ACCEPTANCE_CURRENT: (documentType: string) =>
    `/legal-acceptances/me/${documentType}/current`,
  AUDIT_LOGS: "/audit-logs/",
  SETTINGS: "/settings/",
  SETTINGS_CATEGORY: (category: string) => `/settings/category/${category}`,
  SETTING_BY_KEY: (key: string) => `/settings/${encodeURIComponent(key)}`,
  SETTING_CATEGORIES: "/setting-categories/",
  SETTING_CATEGORY_BY_ID: (id: string) => `/setting-categories/${id}`,
  FOUNDER_PLANS: "/founder-plans/",
  FOUNDER_PLAN_BY_ID: (id: string) => `/founder-plans/${id}`,
  FOUNDER_PLAN_AVAILABILITY: (id: string) =>
    `/founder-plans/${id}/availability`,
  SUCCESS_CENTER_CATEGORIES: "/success-center-categories/",
  SUCCESS_CENTER_CATEGORY_BY_ID: (id: string) =>
    `/success-center-categories/${id}`,
  SUCCESS_CENTER_PROGRAMS: "/success-center-programs/",
  SUCCESS_CENTER_PROGRAM_BY_ID: (id: string) =>
    `/success-center-programs/${id}`,
} as const;

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY: "/verify",
  VERIFY_EMAIL: "/verify-email/:token",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  QUESTIONNAIRE: "/questionnaire",
  SUCCESS_CENTERS: "/success-centers",
  SUCCESS_CENTER_DETAIL: "/success-centers/:centerId",
  ENROLLMENT: "/enrollment",
  ENROLLMENT_CHECKOUT: "/enrollment/checkout",
  BILLING: "/billing",
  RECOMMENDATION: "/recommendation",
  ACCOUNT: "/account",
  ACCOUNT_SECTION: "/account/:section",
  LEGAL: "/legal/:kind",
  ADMIN: "/admin",
  ADMIN_PARTICIPANTS: "/admin/participants",
  ADMIN_ENROLLMENTS: "/admin/enrollments",
  ADMIN_SUCCESS_CENTERS: "/admin/success-centers",
  ADMIN_PRICING: "/admin/pricing",
  ADMIN_RULES: "/admin/rules",
  ADMIN_RECOMMENDATIONS: "/admin/recommendations",
  ADMIN_DISCLOSURES: "/admin/disclosures",
  ADMIN_AUDIT: "/admin/audit",
  ADMIN_SETTINGS: "/admin/settings",
  /* PHASE2_PARKED — kept for reference; routes redirect away */
  DASHBOARD_PROGRESS: "/dashboard/progress",
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_DETAIL: "/campaigns/:categoryId",
  CAMPAIGN_ACTIVATE: "/campaigns/:categoryId/activate",
  CAMPAIGN_SUCCESS: "/campaigns/success",
  REWARDS: "/rewards",
  LEARN: "/learn",
  LEARN_ARTICLE: "/learn/:slug",
  LEARN_VIDEO: "/learn/:slug/watch",
  ADMIN_MEMBERS: "/admin/members",
  ADMIN_CAMPAIGNS: "/admin/campaigns",
  ADMIN_REWARDS: "/admin/rewards",
  ADMIN_CONTENT: "/admin/content",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_MARKETING: "/admin/marketing",
} as const;

/** Paths that are parked Phase 2 demo surfaces — always redirect. */
export const PHASE2_PARKED_PATHS = [
  "/rewards",
  "/learn",
  "/campaigns",
  "/dashboard/progress",
  "/admin/rewards",
  "/admin/marketing",
  "/admin/analytics",
  "/admin/members",
  "/admin/campaigns",
  "/admin/content",
] as const;

export const ADMIN_DATE_RANGES = ["7d", "30d", "90d", "12m"] as const;
export type AdminDateRange = (typeof ADMIN_DATE_RANGES)[number];

export const ADMIN_RANGE_LABELS: Record<AdminDateRange, string> = {
  "7d": "past 7 days",
  "30d": "past 30 days",
  "90d": "past 90 days",
  "12m": "past 12 months",
};

export const SUCCESS_CENTER_FILTERS = [
  { id: "all", label: "All" },
  { id: "essentials", label: "Essentials" },
  { id: "financial", label: "Financial" },
  { id: "business", label: "Business" },
] as const;

export const ACCOUNT_SECTIONS = [
  { id: "profile", label: "BMIS profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "communication", label: "Communication" },
  { id: "management", label: "Account management" },
] as const;

export const JOURNEY_STEPS: [string, string][] = [
  ["Create your account", "Secure login with saved participant data."],
  ["Complete your Success Profile", "A short BMIS intake that shapes your plan."],
  ["Explore Success Centers", "Browse categories and specialized programs."],
  ["Choose your categories", "Pick the goal categories included in your plan."],
  ["Get Founding Access", "Pay once to unlock planning access."],
  ["Review projections", "Budget and timeline estimates — clearly labeled."],
];

export const INCLUDED_ITEMS = [
  "Success Profile and BMIS intake",
  "Success Center categories and programs",
  "Rule-based budget and timeline projections",
  "Founding Access enrollment and receipts",
];

/** Seed list used when mock store has not loaded yet. */
export const SUCCESS_CENTERS: SuccessCenter[] = SEED_SUCCESS_CENTERS;

/* ─── PHASE2_PARKED constants (kept for parked modules) ─── */
export const CAMPAIGN_FILTERS = SUCCESS_CENTER_FILTERS;
export const CATEGORIES = SUCCESS_CENTERS;

export const LEARN_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Getting Started", label: "Getting Started" },
  { id: "Budgeting", label: "Budgeting" },
  { id: "Campaigns", label: "Campaigns" },
  { id: "Rewards", label: "Rewards" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
] as const;

export const LEARN_ITEMS: LearnItem[] = [];
export const REDEEM_OPTIONS: RedeemOption[] = [];
export const EARN_CARDS: { title: string; points: string; desc: string }[] = [];
export const USE_CREDITS_CARDS: { title: string; soon: boolean }[] = [];

export function getSuccessCenterLabel(id: string): string {
  return SUCCESS_CENTERS.find((c) => c.id === id)?.name ?? id;
}

/** @deprecated use getSuccessCenterLabel */
export function getCategoryLabel(id: string): string {
  return getSuccessCenterLabel(id);
}

export function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/questionnaire")) return "Success Profile";
  if (pathname.startsWith("/success-centers")) return "Success Centers";
  if (pathname.startsWith("/enrollment")) return "Founding Access";
  if (pathname.startsWith("/billing")) return "Billing";
  if (pathname.startsWith("/recommendation")) return "Projections";
  if (pathname.startsWith("/account")) return "Account";
  if (pathname.startsWith("/legal")) return "Legal";
  if (pathname.startsWith("/verify")) return "Verify email";
  if (pathname.startsWith("/admin")) return "Admin";
  return "SFS";
}
