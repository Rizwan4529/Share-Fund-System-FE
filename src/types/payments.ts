export const PAYMENT_PURPOSES = [
  "funding_access",
  "founder_tier",
  "program_activation",
] as const;

export type PaymentPurpose = (typeof PAYMENT_PURPOSES)[number];

export type PaymentRecordStatus = "pending" | "completed" | "failed";

/** Machine-readable reasons checkout can't start (`errors[0].code`). */
export type PaymentErrorCode =
  | "EMAIL_NOT_VERIFIED"
  | "ACKNOWLEDGMENT_REQUIRED"
  | "ACKNOWLEDGMENT_OUTDATED"
  | "AMOUNT_UNRESOLVED"
  | "ALREADY_PAID"
  | "NOT_ELIGIBLE";

export type PaymentRecord = {
  _id: string;
  purpose: PaymentPurpose;
  referenceId: string;
  description?: string;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  provider: string;
  providerTransactionRef?: string;
  paymentDate?: string;
  receiptRef?: string;
  failureReason?: string;
  purchaseId?: string;
  legalAcceptanceId?: string;
  /* Refund / dispute — present but inactive until the refunds milestone. */
  refundStatus: string;
  refundAmount?: number;
  refundDeadline?: string;
  disputeStatus: string;
  createdAt: string;
  updatedAt: string;
};

/** Server-resolved checkout amount — the client never computes a price. */
export type CheckoutQuote = {
  purpose: PaymentPurpose;
  referenceId: string;
  amount: number;
  currency: string;
  description: string;
};

export type CheckoutQuoteRequest = {
  purpose: PaymentPurpose;
  referenceId: string;
};

export type CreateCheckoutSessionRequest = CheckoutQuoteRequest & {
  /** The checkout acknowledgment version the participant accepted. */
  acknowledgmentVersion: number;
};

export type CheckoutSessionResponse = {
  paymentId: string;
  sessionId: string;
  /** Hosted Stripe Checkout page to redirect to. */
  url: string;
  amount: number;
  currency: string;
  description: string;
};

export type FundingAccessPlan = {
  key: string;
  label: string;
  price: number;
  programAllowance: number | null;
  currency: string | null;
};
