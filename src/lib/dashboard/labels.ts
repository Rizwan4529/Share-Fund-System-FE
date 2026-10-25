import type { StatusChipTone } from "@/components/member/app";
import type { DashboardEnrollment, ParticipantDashboard } from "@/types/dashboard";

/** Approved participant dashboard wording (Project Context §5). */
export const DASHBOARD_COPY = {
  intro:
    "Your personalized BMIS planning dashboard for managing goals, budgets, timelines, and selected Success Centers.",
  phase1Notice:
    "Phase 1 provides personalized BMIS planning, budget recommendations, and projected timelines. Funding activation and distribution will become available during a future operational phase.",
  centersEmptyTitle: "You have not selected any Success Centers yet.",
  centersEmptyNoAccess:
    "Choose a Funding Access plan to select and begin planning your Success Centers.",
  centersEmptyWithAccess:
    "Browse Success Centers and choose a program to begin planning.",
  planningAccessInactiveTitle: "Planning Access Not Active",
  planningAccessInactiveBody:
    "Choose a Funding Access plan to unlock Success Center selection and BMIS planning tools.",
  planningAccessActiveBody:
    "Success Center selection and BMIS planning tools are unlocked.",
  getFundingAccess: "Get Funding Access",
  budgetEmpty:
    "Complete your Success Profile and select a Success Center to receive a projected budget.",
  timelineEmpty:
    "Complete your Success Profile and select a Success Center to receive a projected timeline.",
  completeProfile: "Complete My Success Profile",
  reviewProfile: "Review My Success Profile",
  enrollmentEmptyTitle: "No Funding Access plan has been purchased yet.",
  enrollmentEmptyBody:
    "Your Funding Access plan and payment details will appear here after checkout is completed.",
  paymentsEmptyTitle: "No payments have been recorded yet.",
  paymentsEmptyBody:
    "Receipts, payment records, and applicable refund information will appear here after a successful Funding Access purchase.",
} as const;

export const ACCOUNT_STATUS_CHIPS: Record<
  ParticipantDashboard["participant"]["accountStatus"],
  { label: string; tone: StatusChipTone }
> = {
  active: { label: "Active account", tone: "success" },
  pending_verification: { label: "Email not verified", tone: "gold" },
  suspended: { label: "Suspended", tone: "gold" },
  closed: { label: "Closed", tone: "muted" },
};

export const ENROLLMENT_STATUS_CHIPS: Record<
  DashboardEnrollment["status"],
  { label: string; tone: StatusChipTone }
> = {
  completed: { label: "Active", tone: "success" },
  pending: { label: "Pending", tone: "muted" },
  failed: { label: "Failed", tone: "gold" },
};

export const formatDashboardDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "—";
