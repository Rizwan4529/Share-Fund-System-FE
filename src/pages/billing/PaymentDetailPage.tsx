import { Link, useParams } from "react-router-dom";
import { Receipt } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
} from "@/components/member/app";
import { PaymentFacts, PaymentStatusChip } from "@/components/payments/PaymentParts";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage, isNotFoundError } from "@/lib/api/getApiErrorMessage";
import { useGetPaymentQuery } from "@/store/api/paymentsApi";
import { ROUTES } from "@/utils/constants";

export default function PaymentDetailPage() {
  const { paymentId = "" } = useParams();
  const paymentQuery = useGetPaymentQuery(paymentId, { skip: !paymentId });
  const payment = paymentQuery.data;

  const back = (
    <GoldButton variant="ghost-outline" asChild>
      <Link to={ROUTES.BILLING}>All payments</Link>
    </GoldButton>
  );

  if (paymentQuery.isLoading) {
    return (
      <AppPageContainer>
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      </AppPageContainer>
    );
  }

  if (paymentQuery.isError || !payment) {
    const notFound = isNotFoundError(paymentQuery.error);
    return (
      <AppPageContainer>
        <EmptyState
          icon={Receipt}
          variant={notFound ? "default" : "error"}
          title={notFound ? "Payment not found" : "Could not load this payment"}
          description={
            notFound
              ? "That payment doesn't exist or isn't yours."
              : getApiErrorMessage(paymentQuery.error, "Please try again.")
          }
          action={
            notFound ? (
              back
            ) : (
              <Button type="button" variant="outline" onClick={() => void paymentQuery.refetch()}>
                Try again
              </Button>
            )
          }
        />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Payment"
        title={payment.description ?? "Payment details"}
        actions={back}
      />
      <AppSurfaceCard className="max-w-2xl space-y-4">
        <PaymentStatusChip status={payment.status} />
        <PaymentFacts payment={payment} showRefundFields />
        {payment.status === "pending" ? (
          <InfoCallout>
            This payment is waiting for confirmation from our payment provider.
            Its status updates automatically once confirmed.
          </InfoCallout>
        ) : null}
      </AppSurfaceCard>
    </AppPageContainer>
  );
}
