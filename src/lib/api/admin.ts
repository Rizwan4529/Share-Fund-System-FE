import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type {
  AuthUser,
  AuditEvent,
  Enrollment,
  FoundingStatus,
  PaymentRecord,
  Recommendation,
  SuccessCenter,
} from "@/types";

export type AdminOverviewStats = {
  participants: number;
  foundingCount: number;
  founderStackCount: number;
  enrollments: number;
  revenue: number;
  pendingRecs: number;
  activeCenters: number;
};

export async function fetchAdminOverview(): Promise<AdminOverviewStats> {
  await delay(150);
  const store = getStore();
  const participants = store.accounts.filter((a) => a.role === "participant");
  const succeeded = store.payments.filter((p) => p.status === "succeeded");
  return {
    participants: participants.length,
    foundingCount: participants.filter(
      (p) => p.foundingStatus === "founding_participant",
    ).length,
    founderStackCount: participants.filter(
      (p) => p.foundingStatus === "founder_stack",
    ).length,
    enrollments: store.enrollments.length,
    revenue: succeeded.reduce((sum, p) => sum + p.amount, 0),
    pendingRecs: store.recommendations.filter((r) => r.status === "pending")
      .length,
    activeCenters: store.successCenters.filter((c) => c.active).length,
  };
}

export async function fetchAdminParticipants(): Promise<AuthUser[]> {
  await delay(150);
  return structuredClone(
    getStore().accounts.filter((a) => a.role === "participant"),
  );
}

export async function updateParticipantFoundingStatus(
  userId: string,
  foundingStatus: FoundingStatus,
  centerLimit?: number,
  actor = "Admin",
): Promise<AuthUser> {
  await delay(200);
  const store = getStore();
  const account = store.accounts.find((a) => a.id === userId);
  if (!account) throw new Error("Participant not found");

  const limit =
    centerLimit ??
    (foundingStatus === "founder_stack"
      ? store.settings.pricing.founderStack.successCenterCount
      : foundingStatus === "founding_participant"
        ? store.settings.pricing.bundleCenterCount
        : 0);

  const updated: AuthUser = {
    ...account,
    foundingStatus,
    centerLimit: limit,
    membership:
      foundingStatus === "founder_stack"
        ? "Founder Stack"
        : foundingStatus === "founding_participant"
          ? "Founding Participant"
          : "Participant",
    selectedCenterIds: account.selectedCenterIds.slice(0, limit),
  };

  const accounts = store.accounts.map((a) =>
    a.id === userId ? updated : a,
  );
  const user = store.user?.id === userId ? updated : store.user;
  setStore({ accounts, user });
  appendAudit(
    actor,
    `Set ${updated.email} founding status → ${foundingStatus}`,
  );
  return updated;
}

export async function fetchAdminEnrollments(): Promise<{
  enrollments: Enrollment[];
  payments: PaymentRecord[];
}> {
  await delay(150);
  const store = getStore();
  return {
    enrollments: structuredClone(store.enrollments),
    payments: structuredClone(store.payments),
  };
}

export async function fetchAdminSuccessCenters(): Promise<SuccessCenter[]> {
  await delay(120);
  return structuredClone(getStore().successCenters);
}

export async function fetchAdminRecommendations(): Promise<Recommendation[]> {
  await delay(120);
  return structuredClone(getStore().recommendations);
}

export async function fetchAdminAudit(): Promise<AuditEvent[]> {
  await delay(100);
  return structuredClone(getStore().audit);
}

function toCsv(rows: Record<string, string | number | null | undefined>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return `"${s.replaceAll('"', '""')}"`;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

export async function exportAdminCsv(
  kind: "participants" | "enrollments" | "payments",
): Promise<string> {
  await delay(200);
  const store = getStore();
  appendAudit("Admin", `Exported ${kind} CSV`);
  if (kind === "participants") {
    return toCsv(
      store.accounts
        .filter((a) => a.role === "participant")
        .map((a) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          foundingStatus: a.foundingStatus,
          centerLimit: a.centerLimit,
          selectedCenters: a.selectedCenterIds.join("|"),
          questionnaireComplete: a.questionnaireComplete ? "yes" : "no",
        })),
    );
  }
  if (kind === "enrollments") {
    return toCsv(
      store.enrollments.map((e) => ({
        id: e.id,
        userEmail: e.userEmail,
        plan: e.plan,
        amount: e.amount,
        status: e.status,
        createdAt: e.createdAt,
      })),
    );
  }
  return toCsv(
    store.payments.map((p) => ({
      id: p.id,
      userEmail: p.userEmail,
      plan: p.plan,
      amount: p.amount,
      status: p.status,
      paidAt: p.paidAt,
      transactionRef: p.transactionRef,
      refundDeadline: p.refundDeadline,
      refundStatus: p.refundStatus,
      chargebackStatus: p.chargebackStatus,
    })),
  );
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── PHASE2_PARKED API facades (static adminData) for parked pages ─── */

import {
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
  ADMIN_PLATFORM_CARDS,
  ADMIN_REDEEM_RULES,
  ADMIN_SIGNUPS,
  ADMIN_TEAM,
  ADMIN_WAITLIST,
  type AdminCampaign,
  type AdminMember,
} from "@/lib/mock/adminData";
import type { AdminDateRange } from "@/utils/constants";

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
      {
        label: "Visitors",
        value: "128.4K",
        trend: "+9.4% vs. last period",
        trendUp: true,
      },
      {
        label: "Page views",
        value: "472K",
        trend: "+6.1% vs. last period",
        trendUp: true,
      },
      {
        label: "Signup conversion",
        value: "4.8%",
        trend: "+0.6 pts",
        trendUp: true,
      },
      {
        label: "Activation rate",
        value: "62%",
        trend: "−1.2 pts",
        trendUp: false,
      },
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
