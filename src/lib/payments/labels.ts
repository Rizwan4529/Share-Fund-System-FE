import type { StatusChipTone } from "@/components/member/app";
import type {
  PaymentErrorCode,
  PaymentPurpose,
  PaymentRecordStatus,
} from "@/types/payments";
import { ROUTES } from "@/utils/constants";

export const PAYMENT_STATUS_LABELS: Record<
  PaymentRecordStatus,
  { label: string; tone: StatusChipTone }
> = {
  pending: { label: "Pending", tone: "muted" },
  completed: { label: "Completed", tone: "success" },
  failed: { label: "Failed", tone: "gold" },
};

export const PAYMENT_PURPOSE_LABELS: Record<PaymentPurpose, string> = {
  funding_access: "Funding Access plan",
  founder_tier: "Founder tier",
  program_activation: "Program activation",
};

/** What a confirmed payment switched on, and where to go next. */
export const PAYMENT_ACTIVATED: Record<
  PaymentPurpose,
  { message: string; nextLabel: string; nextTo: string }
> = {
  funding_access: {
    message: "Your planning access is now active.",
    nextLabel: "Explore Success Centers",
    nextTo: ROUTES.SUCCESS_CENTERS,
  },
  founder_tier: {
    message: "Your Founder tier is now active on your account.",
    nextLabel: "Go to dashboard",
    nextTo: ROUTES.DASHBOARD,
  },
  program_activation: {
    message: "Your program activation is paid and recorded.",
    nextLabel: "View my selections",
    nextTo: ROUTES.MY_SELECTIONS,
  },
};

/** Friendly copy for checkout errors the API can return. */
export const PAYMENT_ERROR_MESSAGES: Record<
  PaymentErrorCode,
  { title: string; body: string }
> = {
  EMAIL_NOT_VERIFIED: {
    title: "Verify your email to continue",
    body: "For your security, payments are only available once your email address is verified.",
  },
  ACKNOWLEDGMENT_REQUIRED: {
    title: "Please accept the checkout acknowledgment",
    body: "Read the acknowledgment below and tick the box to continue.",
  },
  ACKNOWLEDGMENT_OUTDATED: {
    title: "The checkout acknowledgment was updated",
    body: "We've loaded the latest version — please review it and accept again.",
  },
  AMOUNT_UNRESOLVED: {
    title: "This item can't be purchased right now",
    body: "We couldn't confirm a price for it. Go back and choose it again, or try later.",
  },
  ALREADY_PAID: {
    title: "This is already paid",
    body: "You've already paid for this. Check your payment history for details.",
  },
  NOT_ELIGIBLE: {
    title: "Your plan isn't eligible for payment yet",
    body: "Your activation plan suggests a few steps first. Review the suggestions on your plan.",
  },
};

export const isPaymentErrorCode = (
  code: string | undefined,
): code is PaymentErrorCode => Boolean(code && code in PAYMENT_ERROR_MESSAGES);
