import type { AdminDateRange } from "@/utils/constants";

export type AdminMemberStatus = "active" | "pending" | "suspended";
export type AdminCampaignStatus =
  | "active"
  | "paused"
  | "completed"
  | "draft";
export type AdminContentStatus = "published" | "draft";
export type AdminContentType = "guide" | "video" | "faq";
export type AdminMarketingStatus = "live" | "paused" | "scheduled";

export type AdminMember = {
  id: string;
  name: string;
  email: string;
  join: string;
  status: AdminMemberStatus;
  campaigns: number;
  credits: number;
  source: string;
};

export type AdminCampaign = {
  id: string;
  name: string;
  owner: string;
  cat: string;
  pct: number;
  status: AdminCampaignStatus;
  started: string;
};

export type AdminLedgerEntry = {
  id: string;
  name: string;
  reason: string;
  date: string;
  delta: number;
  positive: boolean;
};

export type AdminContentItem = {
  id: string;
  title: string;
  type: AdminContentType;
  cat: string;
  status: AdminContentStatus;
  updated: string;
};

export type AdminTeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  access: string;
};

export type AdminAuditEntry = {
  actor: string;
  action: string;
  time: string;
  tone: "ok" | "warn" | "danger";
};

export type AdminActivityItem = {
  icon: string;
  text: string;
  date: string;
  tone: "gold" | "blue" | "green" | "red";
};

export type AdminNotification = {
  text: string;
  time: string;
  tone: "gold" | "slate" | "danger" | "blue";
};

export type AdminMarketingEffort = {
  name: string;
  channel: string;
  reach: string;
  results: string;
  status: AdminMarketingStatus;
};

export const ADMIN_CAT_LABELS: Record<string, string> = {
  housing: "Housing",
  food: "Food",
  utilities: "Utilities",
  debt: "Debt",
  vehicle: "Vehicle",
  medical: "Medical",
  business: "Business",
};

export const ADMIN_CAT_FULL: Record<string, string> = {
  housing: "Housing",
  food: "Food & Groceries",
  utilities: "Utilities",
  debt: "Debt Reduction",
  vehicle: "Vehicle",
  medical: "Medical",
  business: "Business Growth",
};

export const ADMIN_CAT_TOTALS: Record<string, number> = {
  housing: 642,
  food: 298,
  utilities: 214,
  debt: 388,
  vehicle: 176,
  medical: 143,
  business: 85,
};

export const ADMIN_MEMBERS: AdminMember[] = [
  { id: "m1", name: "Jordan Rivera", email: "jordan.r@email.com", join: "Mar 2, 2026", status: "active", campaigns: 2, credits: 1240, source: "Instagram" },
  { id: "m2", name: "Alicia Monroe", email: "alicia.monroe@email.com", join: "Mar 5, 2026", status: "active", campaigns: 1, credits: 820, source: "Facebook" },
  { id: "m3", name: "Devin Park", email: "devin.park@email.com", join: "Feb 22, 2026", status: "pending", campaigns: 0, credits: 150, source: "YouTube" },
  { id: "m4", name: "Sofia Grant", email: "sofia.g@email.com", join: "Feb 18, 2026", status: "active", campaigns: 3, credits: 2640, source: "Direct" },
  { id: "m5", name: "Marcus Chen", email: "m.chen@email.com", join: "Feb 11, 2026", status: "suspended", campaigns: 1, credits: 60, source: "Facebook" },
  { id: "m6", name: "Tasha Bell", email: "tasha.bell@email.com", join: "Feb 8, 2026", status: "active", campaigns: 2, credits: 1710, source: "Instagram" },
  { id: "m7", name: "Owen Foster", email: "owen.foster@email.com", join: "Jan 30, 2026", status: "active", campaigns: 1, credits: 430, source: "Direct" },
  { id: "m8", name: "Priya Nair", email: "priya.nair@email.com", join: "Jan 24, 2026", status: "pending", campaigns: 0, credits: 150, source: "YouTube" },
  { id: "m9", name: "Liam Walsh", email: "liam.walsh@email.com", join: "Jan 19, 2026", status: "active", campaigns: 2, credits: 980, source: "Instagram" },
  { id: "m10", name: "Nina Okafor", email: "nina.o@email.com", join: "Jan 12, 2026", status: "active", campaigns: 1, credits: 1320, source: "Facebook" },
];

export const ADMIN_CAMPAIGNS: AdminCampaign[] = [
  { id: "c1", name: "Move to a bigger place", owner: "Jordan Rivera", cat: "housing", pct: 35, status: "active", started: "Started Mar 2026" },
  { id: "c2", name: "Emergency debt payoff", owner: "Sofia Grant", cat: "debt", pct: 62, status: "active", started: "Started Feb 2026" },
  { id: "c3", name: "Reliable second car", owner: "Owen Foster", cat: "vehicle", pct: 18, status: "active", started: "Started Feb 2026" },
  { id: "c4", name: "Grocery buffer fund", owner: "Tasha Bell", cat: "food", pct: 74, status: "active", started: "Started Jan 2026" },
  { id: "c5", name: "Dental procedure", owner: "Nina Okafor", cat: "medical", pct: 41, status: "active", started: "Started Feb 2026" },
  { id: "c6", name: "Winter utilities plan", owner: "Liam Walsh", cat: "utilities", pct: 100, status: "completed", started: "Started Nov 2025" },
  { id: "c7", name: "Storefront expansion", owner: "Alicia Monroe", cat: "business", pct: 8, status: "paused", started: "Started Mar 2026" },
  { id: "c8", name: "Rent deposit goal", owner: "Priya Nair", cat: "housing", pct: 0, status: "draft", started: "Draft" },
];

export const ADMIN_LEDGER: AdminLedgerEntry[] = [
  { id: "l1", name: "Jordan Rivera", reason: "Monthly check-in", date: "Today", delta: 40, positive: true },
  { id: "l2", name: "Sofia Grant", reason: "Reached 50% milestone", date: "Today", delta: 100, positive: true },
  { id: "l3", name: "Tasha Bell", reason: "Completed a learning guide", date: "Yesterday", delta: 25, positive: true },
  { id: "l4", name: "Marcus Chen", reason: "Redeemed — activation credit", date: "2 days ago", delta: 250, positive: false },
  { id: "l5", name: "Owen Foster", reason: "Welcome bonus", date: "3 days ago", delta: 150, positive: true },
  { id: "l6", name: "Nina Okafor", reason: "Monthly check-in", date: "Mar 20", delta: 40, positive: true },
  { id: "l7", name: "Liam Walsh", reason: "Reached goal — completion bonus", date: "Mar 18", delta: 300, positive: true },
  { id: "l8", name: "Devin Park", reason: "Manual adjustment (support)", date: "Mar 15", delta: 60, positive: false },
];

export const ADMIN_CONTENT: AdminContentItem[] = [
  { id: "ct1", title: "How SFS campaigns work", type: "guide", cat: "Getting Started", status: "published", updated: "Mar 2026" },
  { id: "ct2", title: "Setting a goal you can actually reach", type: "guide", cat: "Getting Started", status: "published", updated: "Feb 2026" },
  { id: "ct3", title: "Budgeting basics for real life", type: "guide", cat: "Budgeting", status: "published", updated: "Jan 2026" },
  { id: "ct4", title: "Snowball vs. avalanche, explained", type: "video", cat: "Budgeting", status: "published", updated: "Feb 2026" },
  { id: "ct5", title: "Making the most of your credits", type: "guide", cat: "Rewards", status: "draft", updated: "Mar 2026" },
  { id: "ct6", title: "Activating your first campaign", type: "video", cat: "Campaigns", status: "draft", updated: "Mar 2026" },
  { id: "ct7", title: "Rewards credits: common questions", type: "faq", cat: "Rewards", status: "published", updated: "Mar 2026" },
  { id: "ct8", title: "Staying motivated month to month", type: "guide", cat: "Campaigns", status: "published", updated: "Feb 2026" },
];

export const ADMIN_TEAM: AdminTeamMember[] = [
  { id: "t1", name: "Marcus Reed", email: "marcus@sfs.io", role: "Owner", access: "Full access" },
  { id: "t2", name: "Elena Vasquez", email: "elena@sfs.io", role: "Admin", access: "All sections" },
  { id: "t3", name: "David Kim", email: "david@sfs.io", role: "Operator", access: "Members, Campaigns" },
  { id: "t4", name: "Rosa Mendes", email: "rosa@sfs.io", role: "Operator", access: "Content, Support" },
];

export const ADMIN_AUDIT: AdminAuditEntry[] = [
  { actor: "Elena Vasquez", action: "suspended member Marcus Chen", time: "12 min ago", tone: "danger" },
  { actor: "Marcus Reed", action: "adjusted credit balance for Devin Park (−60)", time: "1 hr ago", tone: "warn" },
  { actor: "David Kim", action: 'published "Budgeting basics for real life"', time: "3 hrs ago", tone: "ok" },
  { actor: "Elena Vasquez", action: "edited earning rule: Monthly check-in → 40", time: "Yesterday", tone: "warn" },
  { actor: "Marcus Reed", action: "invited teammate rosa@sfs.io as Operator", time: "2 days ago", tone: "ok" },
  { actor: "David Kim", action: "exported member list (CSV)", time: "2 days ago", tone: "ok" },
];

export const ADMIN_ACTIVITY: AdminActivityItem[] = [
  { icon: "members", text: "New member — Jordan Rivera joined via Instagram.", date: "Today, 9:24 AM", tone: "gold" },
  { icon: "campaigns", text: "Sofia Grant activated a Debt Reduction campaign.", date: "Today, 8:02 AM", tone: "blue" },
  { icon: "star", text: "Liam Walsh reached a goal — completion bonus issued.", date: "Yesterday", tone: "green" },
  { icon: "book", text: '"Budgeting basics for real life" was published.', date: "Yesterday", tone: "blue" },
  { icon: "members", text: "2 new signups from the YouTube campaign.", date: "2 days ago", tone: "gold" },
  { icon: "alert", text: "Marcus Chen flagged for review and suspended.", date: "2 days ago", tone: "red" },
];

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { text: "3 new members are pending review.", time: "12 min ago", tone: "gold" },
  { text: '"Storefront expansion" campaign was paused.', time: "1 hr ago", tone: "slate" },
  { text: "A manual credit adjustment needs sign-off.", time: "3 hrs ago", tone: "danger" },
  { text: "Weekly analytics report is ready.", time: "Yesterday", tone: "blue" },
];

export const ADMIN_SIGNUPS: Record<AdminDateRange, number[]> = {
  "7d": [14, 19, 12, 22, 26, 18, 31],
  "30d": [120, 142, 131, 168, 159, 182, 201, 178, 214, 238, 226, 261],
  "90d": [320, 380, 410, 460, 520, 590, 640, 710, 780, 830, 910, 980],
  "12m": [180, 220, 260, 310, 290, 360, 420, 480, 540, 610, 720, 860],
};

export const ADMIN_WAITLIST: Record<AdminDateRange, number[]> = {
  "7d": [8, 10, 7, 12, 9, 11, 14],
  "30d": [60, 72, 68, 80, 76, 88, 92, 84, 98, 104, 101, 112],
  "90d": [140, 180, 190, 210, 230, 250, 270, 290, 300, 320, 340, 360],
  "12m": [90, 110, 130, 150, 140, 170, 190, 210, 230, 250, 280, 310],
};

export const ADMIN_TRAFFIC_SOURCES = [
  { name: "Instagram", value: 2840, color: "#c4a33a" },
  { name: "Facebook", value: 2110, color: "#0c2148" },
  { name: "YouTube", value: 1290, color: "#3f5580" },
  { name: "Direct", value: 760, color: "#9fb0d4" },
];

export const ADMIN_EARN_RULES = [
  { label: "Welcome bonus", note: "On account creation", value: "+150" },
  { label: "Campaign activation", note: "First activation of a campaign", value: "+200" },
  { label: "Monthly check-in", note: "Logging progress each month", value: "+40" },
  { label: "Milestone reached", note: "Every 25% of a goal", value: "+100" },
];

export const ADMIN_REDEEM_RULES = [
  { label: "Campaign activations", note: "Apply credits toward activating", badge: "Live" as const },
  { label: "Marketplace items", note: "Redeem for goods & services", badge: "Soon" as const },
  { label: "Platform services", note: "Premium tools & support", badge: "Live" as const },
  { label: "Promotions", note: "Seasonal & partner offers", badge: "Soon" as const },
];

export const ADMIN_MARKETING_KPIS = [
  { label: "Efforts running", value: "6", sub: "Across 4 channels" },
  { label: "Total reach", value: "318K", sub: "This period" },
  { label: "Attributed signups", value: "2,140", sub: "From supported efforts" },
  { label: "Cost per signup", value: "$4.12", sub: "−8% vs. last period" },
];

export const ADMIN_MARKETING_EFFORTS: AdminMarketingEffort[] = [
  { name: "Instagram awareness", channel: "Instagram", reach: "96K", results: "+820 signups", status: "live" },
  { name: "YouTube explainer series", channel: "YouTube", reach: "62K", results: "+410 signups", status: "live" },
  { name: "Facebook retargeting", channel: "Facebook", reach: "74K", results: "+540 signups", status: "live" },
  { name: "Referral incentive", channel: "Email", reach: "21K", results: "+180 signups", status: "paused" },
  { name: "Spring category push", channel: "Multi", reach: "—", results: "—", status: "scheduled" },
];

export const ADMIN_PLATFORM_CARDS = [
  { title: "Branding", desc: "Logo, palette, and the SFS visual identity across the platform.", cta: "Edit branding" },
  { title: "Campaign categories", desc: "Default categories, descriptions, ordering, and availability.", cta: "Manage categories" },
  { title: "Notification templates", desc: "Emails and in-app messages sent to members.", cta: "Edit templates" },
  { title: "Integrations", desc: "Analytics, email, and third-party connections.", cta: "Configure" },
];

export const ADMIN_CATEGORY_INTEREST = [
  { name: "Housing", value: 642, hot: true },
  { name: "Debt", value: 388, hot: false },
  { name: "Food", value: 298, hot: false },
  { name: "Utilities", value: 214, hot: false },
  { name: "Medical", value: 143, hot: false },
  { name: "Vehicle", value: 176, hot: false },
  { name: "Business", value: 85, hot: false },
];

export const ADMIN_CHANNELS = [
  { name: "Instagram", color: "#c4a33a", visitors: "48.2K", conv: "5.6%" },
  { name: "Facebook", color: "#0c2148", visitors: "39.1K", conv: "4.2%" },
  { name: "YouTube", color: "#3f5580", visitors: "26.8K", conv: "3.9%" },
  { name: "Direct", color: "#9fb0d4", visitors: "14.3K", conv: "6.1%" },
];

export const ADMIN_FUNNEL = [
  { label: "Visitors", value: 128400, pct: 100 },
  { label: "Signed up", value: 6180, pct: 4.8 },
  { label: "Onboarded", value: 5240, pct: 84.8 },
  { label: "Activated", value: 3260, pct: 62.2 },
];

export const ADMIN_PLATFORM_FINANCIALS = {
  activationSales: 284_500,
  fundsRaised: 1_240_000,
  platformRevenue: 186_400,
  walletBalances: 892_400,
};

export const ADMIN_PENDING_ATTENTION_EXTRA = [
  {
    count: "2",
    label: "Campaign approvals",
    sub: "Draft campaigns awaiting review",
    route: "campaigns" as const,
    tone: "gold" as const,
  },
  {
    count: "4",
    label: "Payment issues",
    sub: "Failed or disputed activation charges",
    route: "rewards" as const,
    tone: "danger" as const,
  },
  {
    count: "6",
    label: "Support requests",
    sub: "Open member support tickets",
    route: "members" as const,
    tone: "blue" as const,
  },
];

export function formatAdminNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatAdminCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `$${formatAdminNumber(value)}`;
}

export function formatAdminCredits(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M cr`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K cr`;
  }
  return `${formatAdminNumber(value)} cr`;
}

export function getMemberInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getMemberCampaignName(owner: string): string {
  return ADMIN_CAMPAIGNS.find((c) => c.owner === owner)?.name ?? "a campaign";
}
