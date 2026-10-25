import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleSlash } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { AppPageContainer } from "@/components/member/app";
import { useCancelPaymentMutation } from "@/store/api/paymentsApi";
import {
  ROUTES,
  checkoutPath,
  paymentDetailPath,
} from "@/utils/constants";

/** Stripe cancel_url: close the open session so the old tab can't be paid. */
export default function PaymentCancelPage() {
  const [params] = useSearchParams();
  const paymentId = params.get("paymentId") ?? "";
  const [cancel, cancelState] = useCancelPaymentMutation();

  const requested = useRef(false);
  useEffect(() => {
    if (!paymentId || requested.current) return;
    requested.current = true;
    void cancel(paymentId);
  }, [cancel, paymentId]);

  const payment = cancelState.data;

  if (cancelState.isLoading) {
    return (
      <AppPageContainer>
        <div className="flex min-h-56 items-center justify-center">
          <Spinner />
        </div>
      </AppPageContainer>
    );
  }

  // Rare: it was paid in another tab before the cancel landed.
  if (payment?.status === "completed") {
    return (
      <AppPageContainer>
        <EmptyState
          icon={CircleSlash}
          title="This payment already went through"
          description="It looks like this payment was completed. See the details in your payment history."
          action={
            <GoldButton asChild>
              <Link to={paymentDetailPath(payment._id)}>View payment</Link>
            </GoldButton>
          }
        />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <EmptyState
        icon={CircleSlash}
        title="Payment canceled"
        description="You left checkout before paying, so nothing was charged and nothing changed on your account."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            {payment ? (
              <GoldButton asChild>
                <Link to={checkoutPath(payment.purpose, payment.referenceId)}>
                  Try again
                </Link>
              </GoldButton>
            ) : null}
            <GoldButton variant="ghost-outline" asChild>
              <Link to={ROUTES.ENROLLMENT}>Back to Founding Access</Link>
            </GoldButton>
          </div>
        }
      />
    </AppPageContainer>
  );
}
