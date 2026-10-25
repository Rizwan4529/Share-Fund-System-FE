import type {
  ActivationErrorCode,
  AffordabilityStatus,
  PlanLabel,
  ProjectionBasis,
} from "@/types/activation";
import { ROUTES } from "@/utils/constants";

export const PLAN_LABELS: Record<PlanLabel, string> = {
  fast: "Fast",
  moderate: "Moderate",
  longer: "Longer",
};

export const PROJECTION_INTRO =
  "All figures are projections based on your Success Profile and this program's current rules — estimates for planning, not guaranteed funding.";

/** Used when an older plan has no stored notice. */
export const PROJECTION_FALLBACK_NOTICE =
  "Projected estimate for planning only. Not a guarantee of funding, amounts, or timing.";

/** What the projected dates are counted from. */
export const PROJECTION_BASIS_LABELS: Record<ProjectionBasis, string> = {
  calculation_date: "Projected dates assume your activation starts on",
  activation_paid_date: "Projected dates are counted from your activation payment on",
};

export const PROJECTION_UNAVAILABLE =
  "A projected timeline isn't available for this program yet.";

/**
 * Short date for projected milestones, e.g. "Mar 18, 2026". Shown by UTC
 * calendar day: admin-entered dates are stored as UTC midnight, which local
 * time would show as the previous day west of UTC.
 */
export const formatProjectionDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        dateStyle: "medium",
        timeZone: "UTC",
      })
    : "—";

/** ISO date/time → "YYYY-MM-DD" (UTC day), the value date inputs use. */
export const toDateInputValue = (value?: string) => (value ? value.slice(0, 10) : "");

type StatusTone = "success" | "info" | "gold";

/** Supportive copy for each backend affordability status. */
export const AFFORDABILITY_MESSAGES: Record<
  AffordabilityStatus,
  { title: string; body: string; tone: StatusTone; canProceed: boolean }
> = {
  eligible: {
    title: "You're ready to go",
    body: "Your Success Profile shows room in your budget for these plans. Choose the pace that suits you.",
    tone: "success",
    canProceed: true,
  },
  eligible_with_adjustment: {
    title: "You're eligible on a longer timeline",
    body: "The fastest plan is above your comfortable monthly amount, but a slower pace fits. Plans that fit your budget are marked below.",
    tone: "info",
    canProceed: true,
  },
  build_savings_first: {
    title: "Let's build a little savings first",
    body: "None of the plans fit comfortably in your monthly budget yet. A few steps now will get you there.",
    tone: "gold",
    canProceed: false,
  },
  increase_income_first: {
    title: "Let's make room in your budget first",
    body: "Right now your essential costs use up your monthly income, so a plan wouldn't be comfortable. These steps can open up room.",
    tone: "gold",
    canProceed: false,
  },
  not_currently_eligible: {
    title: "This goal doesn't fit this program yet",
    body: "Your goal amount is outside what this program currently supports. Adjusting it will open up a plan.",
    tone: "gold",
    canProceed: false,
  },
};

/** What to tell the participant when a plan can't be calculated yet. */
export const ACTIVATION_BLOCKERS: Record<
  ActivationErrorCode,
  { title: string; body: string; actionLabel: string; actionTo: string }
> = {
  GOAL_AMOUNT_REQUIRED: {
    title: "Add your goal amount",
    body: "We need a goal amount for this program to work out your plan. Remove it from My selections, then activate the program again and enter your goal amount.",
    actionLabel: "Go to My selections",
    actionTo: ROUTES.MY_SELECTIONS,
  },
  PROFILE_REQUIRED: {
    title: "Complete your Success Profile",
    body: "Your plan is based on your Success Profile. Fill it in and we'll calculate your activation plan.",
    actionLabel: "Complete Success Profile",
    actionTo: ROUTES.QUESTIONNAIRE,
  },
  INCOME_REQUIRED: {
    title: "Add your monthly income",
    body: "Your plan depends on your monthly finances. Add your net monthly income in your Success Profile to continue.",
    actionLabel: "Update Success Profile",
    actionTo: ROUTES.QUESTIONNAIRE,
  },
  SELECTION_REMOVED: {
    title: "This program was removed",
    body: "This selection is no longer active, so there's no plan to show.",
    actionLabel: "Go to My selections",
    actionTo: ROUTES.MY_SELECTIONS,
  },
};

export const isActivationErrorCode = (
  code: string | undefined,
): code is ActivationErrorCode => Boolean(code && code in ACTIVATION_BLOCKERS);
