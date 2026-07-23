import { delay } from "@/lib/delay";
import {
  ADMIN_ACTIVITY,
  ADMIN_AUDIT,
  ADMIN_CAMPAIGNS,
  ADMIN_CATEGORY_INTEREST,
  ADMIN_CHANNELS,
  ADMIN_CONTENT,
  ADMIN_EARN_RULES,
  ADMIN_FUNNEL,
  ADMIN_LEDGER,
  ADMIN_MARKETING_EFFORTS,
  ADMIN_MARKETING_KPIS,
  ADMIN_MEMBERS,
  ADMIN_NOTIFICATIONS,
  ADMIN_PENDING_ATTENTION_EXTRA,
  ADMIN_PLATFORM_CARDS,
  ADMIN_PLATFORM_FINANCIALS,
  ADMIN_REDEEM_RULES,
  ADMIN_SIGNUPS,
  ADMIN_TEAM,
  ADMIN_TRAFFIC_SOURCES,
  ADMIN_WAITLIST,
  formatAdminCredits,
  formatAdminCurrency,
  type AdminCampaign,
  type AdminMember,
} from "@/lib/mock/adminData";
import type { AdminDateRange } from "@/utils/constants";

export async function fetchAdminOverview(range: AdminDateRange) {
  await delay(150);
  const signups = ADMIN_SIGNUPS[range];
  const signupTotal = signups.reduce((sum, n) => sum + n, 0);
  return {
    kpis: [
      { label: "Total members", value: "8,240", trend: "+6.2%", trendUp: true, sub: "vs. last period", icon: "members" as const },
      { label: "New signups", value: "612", trend: "+12%", trendUp: true, sub: range, icon: "star" as const },
      { label: "Active campaigns", value: "1,946", trend: "+4.1%", trendUp: true, sub: "across 7 categories", icon: "campaigns" as const },
      { label: "Credits issued", value: "1.24M", trend: "39%", trendUp: null, sub: "redeemed", icon: "gift" as const },
      { label: "Waitlist carried", value: "3,180", trend: "−2.3%", trendUp: false, sub: "early access", icon: "flag" as const },
      {
        label: "Total activation sales",
        value: formatAdminCurrency(ADMIN_PLATFORM_FINANCIALS.activationSales),
        trend: "+8.4%",
        trendUp: true,
        sub: "activation fees",
        icon: "dollar" as const,
        route: "campaigns" as const,
      },
      {
        label: "Total funds raised",
        value: formatAdminCurrency(ADMIN_PLATFORM_FINANCIALS.fundsRaised),
        trend: "+11.2%",
        trendUp: true,
        sub: "member campaigns",
        icon: "piggybank" as const,
        route: "campaigns" as const,
      },
      {
        label: "Platform revenue",
        value: formatAdminCurrency(ADMIN_PLATFORM_FINANCIALS.platformRevenue),
        trend: "+5.7%",
        trendUp: true,
        sub: "fees & services",
        icon: "banknote" as const,
        route: "analytics" as const,
      },
      {
        label: "Wallet balances",
        value: formatAdminCredits(ADMIN_PLATFORM_FINANCIALS.walletBalances),
        trend: "+3.1%",
        trendUp: true,
        sub: "credits held",
        icon: "wallet" as const,
        route: "rewards" as const,
      },
    ],
    signups,
    signupTotal,
    signupTrend: "+12% vs. last period",
    traffic: ADMIN_TRAFFIC_SOURCES,
    activity: ADMIN_ACTIVITY,
    pending: [
      { count: "3", label: "Members pending review", sub: "New signups awaiting approval", route: "members" as const, tone: "gold" as const },
      { count: "1", label: "Campaign paused", sub: '"Storefront expansion" needs a look', route: "campaigns" as const, tone: "slate" as const },
      { count: "2", label: "Content drafts", sub: "Ready to review and publish", route: "content" as const, tone: "blue" as const },
      { count: "1", label: "Credit adjustment flagged", sub: "Manual change awaiting sign-off", route: "rewards" as const, tone: "danger" as const },
      ...ADMIN_PENDING_ATTENTION_EXTRA,
    ],
  };
}

export async function fetchAdminMembers() {
  await delay(150);
  return { members: ADMIN_MEMBERS, total: 8240 };
}

export async function fetchAdminMember(id: string): Promise<AdminMember | null> {
  await delay(100);
  return ADMIN_MEMBERS.find((m) => m.id === id) ?? null;
}

export async function fetchAdminCampaigns() {
  await delay(150);
  return { campaigns: ADMIN_CAMPAIGNS };
}

export async function fetchAdminRewards() {
  await delay(150);
  return {
    ledger: ADMIN_LEDGER,
    earnRules: ADMIN_EARN_RULES,
    redeemRules: ADMIN_REDEEM_RULES,
  };
}

export async function fetchAdminContent() {
  await delay(150);
  return { content: ADMIN_CONTENT };
}

export async function fetchAdminAnalytics(range: AdminDateRange) {
  await delay(150);
  return {
    kpis: [
      { label: "Visitors", value: "128.4K", trend: "+9.4% vs. last period", trendUp: true },
      { label: "Page views", value: "472K", trend: "+6.1% vs. last period", trendUp: true },
      { label: "Signup conversion", value: "4.8%", trend: "+0.6 pts", trendUp: true },
      { label: "Activation rate", value: "62%", trend: "−1.2 pts", trendUp: false },
    ],
    signups: ADMIN_SIGNUPS[range],
    waitlist: ADMIN_WAITLIST[range],
    funnel: ADMIN_FUNNEL,
    categories: ADMIN_CATEGORY_INTEREST,
    channels: ADMIN_CHANNELS,
  };
}

export async function fetchAdminMarketing() {
  await delay(150);
  return {
    kpis: ADMIN_MARKETING_KPIS,
    efforts: ADMIN_MARKETING_EFFORTS,
  };
}

export async function fetchAdminSettings() {
  await delay(150);
  return {
    team: ADMIN_TEAM,
    platformCards: ADMIN_PLATFORM_CARDS,
    audit: ADMIN_AUDIT,
  };
}

export async function fetchAdminNotifications() {
  await delay(80);
  return ADMIN_NOTIFICATIONS;
}

export type { AdminCampaign, AdminMember };
