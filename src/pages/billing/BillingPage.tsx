import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
import { listMyPayments } from "@/lib/api/enrollment";
import type { PaymentRecord } from "@/types";
import { ROUTES } from "@/utils/constants";

export default function BillingPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setPayments(await listMyPayments());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppPageContainer>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Typography variant="h2">Billing & receipts</Typography>
          <Typography variant="body" className="mt-2 text-muted-foreground">
            Enrollment and payment history for your participant account.
          </Typography>
        </div>
        <GoldButton asChild>
          <Link to={ROUTES.ENROLLMENT}>New enrollment</Link>
        </GoldButton>
      </div>

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : payments.length === 0 ? (
        <AppSurfaceCard className="p-6">
          <Typography variant="body">
            No payments yet.{" "}
            <Link to={ROUTES.ENROLLMENT} className="font-semibold underline">
              Enroll as a Founding Participant
            </Link>
            .
          </Typography>
        </AppSurfaceCard>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <AppSurfaceCard key={p.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Typography variant="h3">
                    ${p.amount} · {p.plan.replaceAll("_", " ")}
                  </Typography>
                  <Typography variant="caption" className="mt-1 block text-muted-foreground">
                    Receipt {p.receiptNumber} · Ref {p.transactionRef}
                  </Typography>
                </div>
                <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-bold uppercase">
                  {p.status}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div>Paid: {new Date(p.paidAt).toLocaleString()}</div>
                <div>Refund deadline: {p.refundDeadline}</div>
                <div>Refund status: {p.refundStatus}</div>
                <div>Chargeback: {p.chargebackStatus}</div>
                {p.refundAmount != null ? (
                  <div>Refund amount: ${p.refundAmount}</div>
                ) : null}
              </div>
            </AppSurfaceCard>
          ))}
        </div>
      )}
    </AppPageContainer>
  );
}
