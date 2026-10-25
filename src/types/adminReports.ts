import type { PaymentPurpose, PaymentRecordStatus } from "@/types/payments";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SortOrder = "asc" | "desc";

export const ENROLLMENT_STATUSES = ["active", "pending", "failed", "removed"] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export type EnrollmentSortBy = "date" | "name" | "email" | "type" | "status";
export type AdminPaymentSortBy = "date" | "amount" | "status" | "name";

export type AdminParticipantRef = { _id: string; name: string; email: string };

/** Unified enrollment: a purchase (funding access / founder tier) or a program activation. */
export type AdminEnrollmentRow = {
  _id: string;
  type: PaymentPurpose;
  status: EnrollmentStatus;
  date: string;
  participant: AdminParticipantRef;
  planningAccessStatus?: string;
  itemName?: string | null;
  itemDetail?: string | null;
  programAllowance?: number | null;
  paymentStatus: PaymentRecordStatus | null;
  payment?: { _id: string; status: PaymentRecordStatus; amount: number; currency: string };
};

export type ListAdminEnrollmentsParams = {
  page: number;
  limit: number;
  search?: string;
  type?: PaymentPurpose;
  status?: EnrollmentStatus;
  from?: string;
  to?: string;
  sortBy?: EnrollmentSortBy;
  sortOrder?: SortOrder;
};

export type AdminPaymentRow = {
  _id: string;
  participant: AdminParticipantRef;
  purpose: PaymentPurpose;
  referenceId: string;
  description?: string;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  paymentDate?: string;
  createdAt: string;
  providerTransactionRef?: string;
  refundStatus: string;
  disputeStatus: string;
  failureReason?: string;
};

export type ListAdminPaymentsParams = {
  page: number;
  limit: number;
  search?: string;
  purpose?: PaymentPurpose;
  status?: PaymentRecordStatus;
  from?: string;
  to?: string;
  sortBy?: AdminPaymentSortBy;
  sortOrder?: SortOrder;
};

export type AdminPaymentDetail = Omit<AdminPaymentRow, "participant"> & {
  userId: { _id: string; firstName: string; lastName: string; email: string; phone?: string } | null;
  checkoutSessionId?: string;
  receiptRef?: string;
  legalAcceptanceId?: {
    documentType: string;
    documentVersion: number;
    acceptedAt: string;
    context: string;
  } | null;
  purchaseId?: {
    purpose?: string;
    fundingAccessPlanKey?: string;
    programAllowance?: number;
    activationStatus?: string;
    purchasedAt?: string;
  } | null;
  refundAmount?: number;
  refundDeadline?: string;
};

export type RevenueSummary = {
  range: { from: string | null; to: string | null };
  counts: Record<PaymentRecordStatus, number> & { total: number };
  revenue: { currency: string; total: number; count: number }[];
  byPurpose: { purpose: PaymentPurpose; currency: string; total: number; count: number }[];
};

export type RevenueSummaryParams = { from?: string; to?: string };
