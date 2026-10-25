import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, CreditCard, XCircle } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
} from "@/components/member/app";
import { PaymentFacts } from "@/components/payments/PaymentParts";
import { Button } from "@/components/ui/button";
import { PAYMENT_ACTIVATED } from "@/lib/payments/labels";
import { paymentsApi, useGetPaymentQuery } from "@/store/api/paymentsApi";
import { ROUTES, checkoutPath, paymentDetailPath } from "@/utils/constants";

// UI polling cadence (not business values).
const POLL_INTERVAL_MS = 2_000;
const SLOW_AFTER_MS = 10_000; // switch to "this can take a moment"
const STOP_AFTER_MS = 60_000; // stop polling; point to receipt/history

/**
 * Stripe's redirect back here is NOT proof of payment. We poll the payment
 * until the webhook-driven status leaves "pending", then show the result.
 */
export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const paymentId = params.get("paymentId") ?? "";
  const [slow, setSlow] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    const stopTimer = setTimeout(() => setStopped(true), STOP_AFTER_MS);
    return () => {
      clearTimeout(slowTimer);
      clearTimeout(stopTimer);
    };
  }, []);

  // Read the cache first so polling switches off once the status settles.
  const cached = paymentsApi.endpoints.getPayment.useQueryState(paymentId, {
    skip: !paymentId,
  });
  const settled = Boolean(cached.data && cached.data.status !== "pending");
  const paymentQuery = useGetPaymentQuery(paymentId, {
    skip: !paymentId,
    pollingInterval: settled || stopped ? 0 : POLL_INTERVAL_MS,
  });
  const payment = paymentQuery.data;

  const header = (
    <ParticipantPageHeader overline="Payment" title="Payment status" />
  );

  if (!paymentId || (paymentQuery.isError && !payment)) {
    return (
      <AppPageContainer>
        {header}
        <EmptyState
          icon={CreditCard}
          title="We couldn't find that payment"
          description="Your payment history shows every payment and its current status."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.BILLING}>View payment history</Link>
            </GoldButton>
          }
        />
      </AppPageContainer>
    );
  }

  if (payment?.status === "completed") {
    const activated = PAYMENT_ACTIVATED[payment.purpose];
    return (
      <AppPageContainer>
        {header}
        <AppSurfaceCard className="max-w-2xl space-y-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" />
            <div>
              <Typography variant="h6" className="text-ink-heading">
                Payment confirmed
              </Typography>
              <Typography variant="body-sm" className="mt-1 text-muted-soft">
                {activated.message} A receipt is on its way to your email.
              </Typography>
            </div>
          </div>
          <PaymentFacts payment={payment} />
          <InfoCallout>
            This payment covers your plan or activation. Budgets, timelines and
            funding remain planning projections — not guaranteed outcomes.
          </InfoCallout>
          <div className="flex flex-wrap gap-2">
            <GoldButton asChild>
              <Link to={activated.nextTo}>{activated.nextLabel}</Link>
            </GoldButton>
            <GoldButton variant="ghost-outline" asChild>
              <Link to={paymentDetailPath(payment._id)}>View payment</Link>
            </GoldButton>
          </div>
        </AppSurfaceCard>
      </AppPageContainer>
    );
  }

  if (payment?.status === "failed") {
    return (
      <AppPageContainer>
        {header}
        <EmptyState
          icon={XCircle}
          variant="error"
          title="This payment didn't go through"
          description={`${payment.failureReason ? `${payment.failureReason}. ` : ""}Nothing was activated. You can try again.`}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <GoldButton asChild>
                <Link to={checkoutPath(payment.purpose, payment.referenceId)}>Try again</Link>
              </GoldButton>
              <GoldButton variant="ghost-outline" asChild>
                <Link to={ROUTES.BILLING}>Payment history</Link>
              </GoldButton>
            </div>
          }
        />
      </AppPageContainer>
    );
  }

  if (stopped) {
    return (
      <AppPageContainer>
        {header}
        <EmptyState
          icon={Clock}
          title="Still confirming your payment"
          description="Our payment provider hasn't confirmed it yet. We'll email your receipt as soon as it's confirmed — check your payment history shortly."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void paymentQuery.refetch()}
              >
                Check again
              </Button>
              <GoldButton asChild>
                <Link to={ROUTES.BILLING}>Payment history</Link>
              </GoldButton>
            </div>
          }
        />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      {header}
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
        <Spinner />
        <Typography variant="label" className="text-ink-heading">
          Confirming your payment…
        </Typography>
        <Typography variant="body-sm" color="muted" className="max-w-sm">
          {slow
            ? "This can take a moment. You can stay on this page — it updates automatically."
            : "We're waiting for confirmation from our payment provider."}
        </Typography>
      </div>
    </AppPageContainer>
  );
}
