import type {
  ActivationErrorCode,
  AffordabilityStatus,
  PlanLabel,
} from "@/types/activation";
import { ROUTES } from "@/utils/constants";

export const PLAN_LABELS: Record<PlanLabel, string> = {
  fast: "Fast",
  moderate: "Moderate",
  longer: "Longer",
};

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
