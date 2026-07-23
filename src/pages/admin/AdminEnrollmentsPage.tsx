import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AdminPageContainer,
  AdminPageHeader,
  AdminTableScroll,
  adminTableHeaderClass,
  adminTableRowClass,
} from "@/components/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchAdminEnrollments } from "@/lib/api/admin";
import { updatePaymentRefundFields } from "@/lib/api/enrollment";
import type { Enrollment, PaymentRecord, RefundStatus } from "@/types";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const reload = () =>
    void fetchAdminEnrollments().then((d) => {
      setEnrollments(d.enrollments);
      setPayments(d.payments);
    });

  useEffect(() => {
    reload();
  }, []);

  const patchRefund = async (
    id: string,
    refundStatus: RefundStatus,
    refundAmount?: number,
  ) => {
    await updatePaymentRefundFields(id, {
      refundStatus,
      refundRequestedAt:
        refundStatus === "requested" ? new Date().toISOString() : undefined,
      refundAmount: refundAmount ?? null,
      refundProcessedAt:
        refundStatus === "processed" ? new Date().toISOString() : undefined,
    });
    toast.success("Refund fields updated.");
    reload();
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Enrollments & payments"
        subtitle="All enrollment fees and refund/chargeback record fields."
      />

      <h3 className="mb-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        Enrollments
      </h3>
      <AdminTableScroll className="mb-8">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className={adminTableHeaderClass}>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-muted-foreground">
                  No enrollments yet.
                </td>
              </tr>
            ) : (
              enrollments.map((e) => (
                <tr key={e.id} className={adminTableRowClass}>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{e.userName}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.userEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {e.plan.replaceAll("_", " ")}
                  </td>
                  <td className="px-4 py-3">${e.amount}</td>
                  <td className="px-4 py-3">{e.status}</td>
                  <td className="px-4 py-3">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableScroll>

      <h3 className="mb-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        Payments & refund records
      </h3>
      <AdminTableScroll>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className={adminTableHeaderClass}>
              <th className="px-4 py-3">Receipt</th>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Refund deadline</th>
              <th className="px-4 py-3">Refund status</th>
              <th className="px-4 py-3">Chargeback</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className={adminTableRowClass}>
                <td className="px-4 py-3">
                  <div className="font-semibold">{p.receiptNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.transactionRef}
                  </div>
                </td>
                <td className="px-4 py-3">{p.userEmail}</td>
                <td className="px-4 py-3">
                  ${p.amount} · {p.status}
                </td>
                <td className="px-4 py-3">{p.refundDeadline}</td>
                <td className="px-4 py-3">{p.refundStatus}</td>
                <td className="px-4 py-3">{p.chargebackStatus}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={p.refundStatus}
                      onValueChange={(v) =>
                        void patchRefund(p.id, v as RefundStatus)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">none</SelectItem>
                        <SelectItem value="requested">requested</SelectItem>
                        <SelectItem value="approved">approved</SelectItem>
                        <SelectItem value="denied">denied</SelectItem>
                        <SelectItem value="processed">processed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="w-24"
                      type="number"
                      placeholder="$"
                      defaultValue={p.refundAmount ?? ""}
                      onBlur={(e) => {
                        const n = Number(e.target.value);
                        if (!Number.isNaN(n) && n > 0) {
                          void patchRefund(p.id, p.refundStatus, n);
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableScroll>
    </AdminPageContainer>
  );
}
