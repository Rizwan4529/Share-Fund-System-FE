import { Typography } from "@/components/common/Typography";
import { StatusChip } from "@/components/member/app";
import { formatPaymentAmount, formatPaymentDate } from "@/lib/payments/format";
import {
  PAYMENT_PURPOSE_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/payments/labels";
import type { PaymentRecord } from "@/types/payments";

export function PaymentStatusChip({ status }: { status: PaymentRecord["status"] }) {
  const { label, tone } = PAYMENT_STATUS_LABELS[status];
  return <StatusChip tone={tone}>{label}</StatusChip>;
}

/** Label/value rows for a payment (success page + detail page). */
export function PaymentFacts({
  payment,
  showRefundFields = false,
}: {
  payment: PaymentRecord;
  showRefundFields?: boolean;
}) {
  const rows = [
    { label: "Purchase", value: payment.description ?? PAYMENT_PURPOSE_LABELS[payment.purpose] },
    { label: "Type", value: PAYMENT_PURPOSE_LABELS[payment.purpose] },
    { label: "Amount", value: formatPaymentAmount(payment) },
    { label: "Date", value: formatPaymentDate(payment.paymentDate ?? payment.createdAt) },
    { label: "Transaction reference", value: payment.providerTransactionRef ?? "—" },
    ...(payment.failureReason ? [{ label: "Note", value: payment.failureReason }] : []),
    ...(showRefundFields
      ? [
          { label: "Refund status", value: payment.refundStatus },
          { label: "Dispute status", value: payment.disputeStatus },
        ]
      : []),
  ];

  return (
    <dl className="divide-y divide-line rounded-lg border border-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:justify-between sm:gap-6"
        >
          <Typography as="dt" variant="body-sm" color="muted">
            {row.label}
          </Typography>
          <Typography
            as="dd"
            variant="body-sm"
            className="font-semibold break-all text-ink-heading sm:text-right"
          >
            {row.value}
          </Typography>
        </div>
      ))}
    </dl>
  );
}
