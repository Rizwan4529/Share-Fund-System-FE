import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import { AppSurfaceCard } from "@/components/member/app";
import { PaymentStatusChip } from "@/components/payments/PaymentParts";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatPaymentAmount, formatPaymentDate } from "@/lib/payments/format";
import { PAYMENT_PURPOSE_LABELS } from "@/lib/payments/labels";
import { useListMyPaymentsQuery } from "@/store/api/paymentsApi";
import { ROUTES, paymentDetailPath } from "@/utils/constants";

/** The participant's payments, newest first (from GET /payments/me). */
export function PaymentHistoryList({ limit }: { limit?: number }) {
  const paymentsQuery = useListMyPaymentsQuery();
  const payments = (paymentsQuery.data ?? []).slice(0, limit);

  if (paymentsQuery.isLoading) {
    return (
      <div className="flex min-h-32 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (paymentsQuery.isError) {
    return (
      <EmptyState
        icon={Receipt}
        variant="error"
        size="compact"
        title="Could not load your payments"
        description={getApiErrorMessage(paymentsQuery.error, "Please try again.")}
        action={
          <Button type="button" variant="outline" onClick={() => void paymentsQuery.refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        variant="muted"
        size="compact"
        title="No payments yet"
        description="Your Founding Access, Founder tier and program activation payments will appear here."
        action={
          <GoldButton asChild>
            <Link to={ROUTES.ENROLLMENT}>View plans</Link>
          </GoldButton>
        }
      />
    );
  }

  return (
    <ul className="space-y-2">
      {payments.map((payment) => (
        <li key={payment._id}>
          <Link to={paymentDetailPath(payment._id)} className="block">
            <AppSurfaceCard
              padding="md"
              className="flex flex-col gap-3 transition hover:border-gold-chip sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <Typography variant="label" className="block truncate text-ink-heading">
                  {payment.description ?? PAYMENT_PURPOSE_LABELS[payment.purpose]}
                </Typography>
                <Typography variant="caption" color="muted" className="mt-1 block">
                  {formatPaymentDate(payment.paymentDate ?? payment.createdAt)}
                  {payment.providerTransactionRef
                    ? ` · Ref ${payment.providerTransactionRef}`
                    : ""}
                </Typography>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Typography variant="label" className="text-ink-heading">
                  {formatPaymentAmount(payment)}
                </Typography>
                <PaymentStatusChip status={payment.status} />
              </div>
            </AppSurfaceCard>
          </Link>
        </li>
      ))}
    </ul>
  );
}
