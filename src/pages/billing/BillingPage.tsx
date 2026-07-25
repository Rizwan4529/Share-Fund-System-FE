import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import { toast } from "sonner";

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
import { listMyPayments, requestRefund } from "@/lib/api/enrollment";
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

function canRequestRefund(p: PaymentRecord) {
  if (p.status !== "succeeded" || p.refundStatus !== "none") return false;
  const deadline = new Date(p.refundDeadline);
  if (!Number.isFinite(deadline.getTime())) return true;
  return Date.now() <= deadline.getTime();
}

export default function BillingPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const reload = () =>
    void listMyPayments()
      .then(setPayments)
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  const onRequestRefund = async (paymentId: string) => {
    setRequestingId(paymentId);
    try {
      await requestRefund(paymentId);
      toast.success("Refund requested. An admin will review it.");
      reload();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not request refund.",
      );
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Account"
        title="Billing & receipts"
        subtitle="View your Founding Access payments, receipts, refund eligibility, and transaction history."
        actions={
          <GoldButton asChild>
            <Link to={ROUTES.ENROLLMENT}>Choose a Founding Plan</Link>
          </GoldButton>
        }
      />

      {loading ? (
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payment history yet"
          description="Your receipts, refund eligibility dates, and payment records will appear here after checkout."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.ENROLLMENT}>View Founding Plans</Link>
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
                {p.refundAmount != null ? (
                  <div>Refund amount: ${p.refundAmount}</div>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {canRequestRefund(p) ? (
                  <GoldButton
                    size="sm"
                    variant="ghost-outline"
                    disabled={requestingId === p.id}
                    onClick={() => void onRequestRefund(p.id)}
                  >
                    {requestingId === p.id ? "Requesting…" : "Request refund"}
                  </GoldButton>
                ) : null}
                {p.status === "succeeded" ? (
                  <GoldButton
                    size="sm"
                    variant="ghost-outline"
                    onClick={() =>
                      toast.message(
                        "Payment dispute noted. Our team will follow up — full dispute handling arrives with the backend.",
                      )
                    }
                  >
                    Payment dispute
                  </GoldButton>
                ) : null}
              </div>
            </AppSurfaceCard>
          ))}
        </div>
      )}
    </AppPageContainer>
  );
}
