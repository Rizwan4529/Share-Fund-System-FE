import { formatCurrency } from "@/lib/app/greeting";
import type { PaymentRecord } from "@/types/payments";

/** Charged in the payment's own currency — that's what Stripe billed. */
export const formatPaymentAmount = (
  payment: Pick<PaymentRecord, "amount" | "currency">,
) => formatCurrency(payment.amount, payment.currency);

export const formatPaymentDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
