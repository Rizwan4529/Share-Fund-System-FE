import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  ParticipantPageHeader,
  SectionLabel,
  StatusChip,
} from "@/components/member/app";
import { listMyPayments } from "@/lib/api/enrollment";
import type { PaymentRecord, PaymentStatus } from "@/types";
import { ROUTES } from "@/utils/constants";

function statusTone(
  status: PaymentStatus,
): "success" | "muted" | "gold" | "navy" {
  if (status === "succeeded") return "success";
  if (status === "failed") return "gold";
  if (status === "refunded") return "navy";
  return "muted";
}

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
      <ParticipantPageHeader
        overline="Account"
        title="Billing & receipts"
        subtitle="Enrollment payments, refund windows, and chargeback records."
        actions={
          <GoldButton asChild>
            <Link to={ROUTES.ENROLLMENT}>New enrollment</Link>
          </GoldButton>
        }
      />

      {loading ? (
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          description="When you complete Founding Participant checkout, receipts and refund deadlines will appear here."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.ENROLLMENT}>Browse enrollment plans</Link>
            </GoldButton>
          }
        />
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <AppSurfaceCard key={p.id} padding="md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <SectionLabel tone="info">
                    {p.plan.replaceAll("_", " ")}
                  </SectionLabel>
                  <Typography
                    as="h2"
                    variant="h5"
                    className="mt-2 font-display text-[18px] font-bold text-ink-heading"
                  >
                    ${p.amount}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="mt-1.5 block text-muted-soft"
                  >
                    Receipt {p.receiptNumber} · Ref {p.transactionRef}
                  </Typography>
                </div>
                <StatusChip tone={statusTone(p.status)}>{p.status}</StatusChip>
              </div>
              <div className="mt-4 grid gap-2 rounded-lg border border-line bg-bg-card px-3.5 py-3 text-sm text-muted-soft sm:grid-cols-2">
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
