import type { PaymentPurpose, PaymentRecordStatus } from "@/types/payments";

type CurrencyTotal = { currency: string; total: number; count: number };

/** GET /admin/overview — simple totals; the range applies to time-based metrics. */
export type AdminOverview = {
  range: { from: string | null; to: string | null };
  participants: {
    total: number;
    active: number;
    newSignups: {
      windows: { days: number; count: number }[];
      inRange: number | null;
    };
  };
  successProfiles: { completed: number; incomplete: number; notStarted: number };
  successCentersSelected: number;
  fundingAccess: { purchases: number; revenue: CurrencyTotal[] };
  founderTierPurchases: number;
  totalRevenue: CurrencyTotal[];
  paymentCounts: Record<PaymentRecordStatus | "total", number>;
  recentActivity: AdminActivity[];
};

export type AdminActivity = {
  _id: string;
  type: "signup" | "selection" | "payment";
  at: string;
  participant: { _id: string; name: string | null; email: string } | null;
  title: string;
  status: string;
  purpose?: PaymentPurpose;
  amount?: number;
  currency?: string;
};

export type AdminOverviewParams = { from?: string; to?: string };

export type ExportDataset = "participants" | "enrollments" | "payments";

export type ExportResult = { csv: string; filename: string; rowCount: number | null };
