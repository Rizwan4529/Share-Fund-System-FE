import { Receipt } from "lucide-react";

import {
  AdminDetailRow,
  AdminDetailSection,
} from "@/components/admin/AdminDetailRows";
import { AdminStatusPill } from "@/components/admin/AdminStatusPill";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatPaymentAmount, formatPaymentDate } from "@/lib/payments/format";
import { PAYMENT_PURPOSE_LABELS } from "@/lib/payments/labels";
import { useGetAdminPaymentQuery } from "@/store/api/adminReportsApi";
import type { AdminPaymentRow } from "@/types/adminReports";

/** Read-only admin view of one payment. */
export function AdminPaymentDetailDrawer({
  open,
  onOpenChange,
  payment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The list row — gives the header something to show while loading. */
  payment: Pick<AdminPaymentRow, "_id" | "description" | "participant"> | null;
}) {
  const query = useGetAdminPaymentQuery(payment?._id ?? "", {
    skip: !open || !payment,
  });
  const detail = query.currentData;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={payment?.description ?? "Payment"}
      description={payment?.participant.email}
      className="md:max-w-xl"
      footer={
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      {query.isError ? (
        <EmptyState
          icon={Receipt}
          variant="error"
          size="compact"
          title="Could not load this payment"
          description={getApiErrorMessage(query.error, "Please try again.")}
          action={
            <Button type="button" variant="outline" onClick={query.refetch}>
              Try again
            </Button>
          }
        />
      ) : !detail ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-6">
          <AdminStatusPill status={detail.status} />
          <AdminDetailSection title="Payment">
            <AdminDetailRow label="Amount" value={formatPaymentAmount(detail)} />
            <AdminDetailRow label="Type" value={PAYMENT_PURPOSE_LABELS[detail.purpose]} />
            <AdminDetailRow label="Created" value={formatPaymentDate(detail.createdAt)} />
            <AdminDetailRow label="Paid" value={formatPaymentDate(detail.paymentDate)} />
            <AdminDetailRow label="Transaction reference" value={detail.providerTransactionRef} />
            <AdminDetailRow label="Receipt reference" value={detail.receiptRef} />
            <AdminDetailRow label="Stripe session" value={detail.checkoutSessionId} />
            <AdminDetailRow label="Failure reason" value={detail.failureReason} />
          </AdminDetailSection>
          <AdminDetailSection title="Participant">
            <AdminDetailRow
              label="Name"
              value={detail.userId ? `${detail.userId.firstName} ${detail.userId.lastName}` : null}
            />
            <AdminDetailRow label="Email" value={detail.userId?.email} />
            <AdminDetailRow label="Phone" value={detail.userId?.phone} />
          </AdminDetailSection>
          <AdminDetailSection title="Checkout acknowledgment">
            <AdminDetailRow
              label="Version accepted"
              value={
                detail.legalAcceptanceId
                  ? `v${detail.legalAcceptanceId.documentVersion}`
                  : null
              }
            />
            <AdminDetailRow
              label="Accepted at"
              value={
                detail.legalAcceptanceId
                  ? formatPaymentDate(detail.legalAcceptanceId.acceptedAt)
                  : null
              }
            />
          </AdminDetailSection>
          {/* Refunds/disputes arrive in a later milestone — shown read-only. */}
          <AdminDetailSection title="Refund & dispute (inactive)">
            <AdminDetailRow label="Refund status" value={detail.refundStatus} />
            <AdminDetailRow label="Dispute status" value={detail.disputeStatus} />
          </AdminDetailSection>
        </div>
      )}
    </DrawerCommon>
  );
}
