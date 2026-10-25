import { PAYMENT_PURPOSE_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/payments/labels";
import type { EnrollmentStatus } from "@/types/adminReports";
import {
  PAYMENT_PURPOSES,
  type PaymentPurpose,
  type PaymentRecordStatus,
} from "@/types/payments";

export const PURPOSE_OPTIONS: { value: PaymentPurpose; label: string }[] =
  PAYMENT_PURPOSES.map((value) => ({ value, label: PAYMENT_PURPOSE_LABELS[value] }));

export const ENROLLMENT_STATUS_OPTIONS: { value: EnrollmentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "removed", label: "Removed" },
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentRecordStatus; label: string }[] = (
  Object.keys(PAYMENT_STATUS_LABELS) as PaymentRecordStatus[]
).map((value) => ({ value, label: PAYMENT_STATUS_LABELS[value].label }));
