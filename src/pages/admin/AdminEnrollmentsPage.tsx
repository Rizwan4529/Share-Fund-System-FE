import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  Copy,
  DollarSign,
  Eye,
  HandCoins,
} from "lucide-react";
import { toast } from "sonner";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminPageHeader,
  AdminTableIconAction,
  AdminTableToolbar,
} from "@/components/admin";
import { DialogCommon } from "@/components/common/DialogCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/TabsCommon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import { fetchAdminEnrollments } from "@/lib/api/admin";
import { updatePaymentRefundFields } from "@/lib/api/enrollment";
import type { Enrollment, PaymentRecord, RefundStatus } from "@/types";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [tab, setTab] = useState("enrollments");
  const [search, setSearch] = useState("");
  const [denyTarget, setDenyTarget] = useState<PaymentRecord | null>(null);

  const filteredEnrollments = useMemo(
    () =>
      filterRowsBySearch(
        enrollments,
        search,
        (e) =>
          `${e.userName} ${e.userEmail} ${e.plan} ${e.status} ${e.amount}`,
      ),
    [enrollments, search],
  );
  const filteredPayments = useMemo(
    () =>
      filterRowsBySearch(
        payments,
        search,
        (p) =>
          `${p.receiptNumber} ${p.transactionRef} ${p.userEmail} ${p.status} ${p.refundStatus} ${p.chargebackStatus}`,
      ),
    [payments, search],
  );

  const enrollPage = useClientTablePage(filteredEnrollments);
  const paymentPage = useClientTablePage(filteredPayments);

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

  const enrollmentColumns = useMemo<ColumnDef<Enrollment>[]>(
    () => [
      {
        id: "participant",
        accessorFn: (e) => e.userName,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Participant"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-ink-heading">
              {row.original.userName}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.userEmail}
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "plan",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Plan" />
        ),
        cell: ({ row }) => (
          <span className="capitalize">
            {row.original.plan.replaceAll("_", " ")}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Amount" />
        ),
        cell: ({ row }) => `$${row.original.amount}`,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Date" />
        ),
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => {
          const e = row.original;
          return (
            <div className="flex items-center justify-end gap-0.5">
              <AdminTableIconAction
                label="View enrollment"
                icon={Eye}
                tone="info"
                onClick={() =>
                  toast.message(e.userName, {
                    description: `${e.plan.replaceAll("_", " ")} · $${e.amount} · ${e.status}`,
                  })
                }
              />
              <AdminTableIconAction
                label="Copy email"
                icon={Copy}
                onClick={() => {
                  void navigator.clipboard.writeText(e.userEmail);
                  toast.success("Email copied.");
                }}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  const paymentColumns = useMemo<ColumnDef<PaymentRecord>[]>(
    () => [
      {
        accessorKey: "receiptNumber",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Receipt"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-ink-heading">
              {row.original.receiptNumber}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.transactionRef}
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "userEmail",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Participant" />
        ),
        enableSorting: true,
      },
      {
        id: "amountStatus",
        accessorFn: (p) => p.amount,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Amount" />
        ),
        cell: ({ row }) =>
          `$${row.original.amount} · ${row.original.status}`,
        enableSorting: true,
      },
      {
        accessorKey: "refundDeadline",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Refund deadline"
          />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "refundStatus",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Refund status"
          />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "chargebackStatus",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Chargeback" />
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-center justify-end gap-0.5">
              <AdminTableIconAction
                label="Mark refund requested"
                icon={HandCoins}
                tone="info"
                onClick={() => void patchRefund(p.id, "requested")}
              />
              <AdminTableIconAction
                label="Approve refund"
                icon={CheckCircle2}
                tone="success"
                onClick={() => void patchRefund(p.id, "approved")}
              />
              <AdminTableIconAction
                label="Deny refund"
                icon={Ban}
                tone="danger"
                onClick={() => setDenyTarget(p)}
              />
              <AdminTableIconAction
                label="Mark refund processed"
                icon={BadgeCheck}
                tone="success"
                onClick={() => void patchRefund(p.id, "processed")}
              />
              <RefundAmountAction
                amount={p.refundAmount}
                onSave={(n) => void patchRefund(p.id, p.refundStatus, n)}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Enrollments & payments"
        subtitle="All enrollment fees and refund/chargeback record fields."
      />

      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value);
          setSearch("");
        }}
        className="flex min-h-0 flex-1 flex-col gap-3"
      >
        <TabsList>
          <TabsTrigger value="enrollments" className="group">
            Enrollments
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground group-data-[state=active]:bg-primary/15 group-data-[state=active]:text-primary">
              {enrollments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="group">
            Payments & refunds
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground group-data-[state=active]:bg-primary/15 group-data-[state=active]:text-primary">
              {payments.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <AdminTableToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder={
            tab === "enrollments"
              ? "Search participant, plan, or status…"
              : "Search receipt, email, or refund status…"
          }
          resultCount={
            tab === "enrollments"
              ? filteredEnrollments.length
              : filteredPayments.length
          }
        />

        <TabsContent value="enrollments" className={ADMIN_TABLE_SLOT}>
          <DataTableCommon
            columns={enrollmentColumns}
            data={enrollPage.pageRows}
            totalDataCount={enrollPage.totalDataCount}
            onFetchData={enrollPage.onFetchData}
            fillViewport={false}
            className="min-h-0 flex-1"
            emptyMessage="No enrollments yet."
          />
        </TabsContent>

        <TabsContent value="payments" className={ADMIN_TABLE_SLOT}>
          <DataTableCommon
            columns={paymentColumns}
            data={paymentPage.pageRows}
            totalDataCount={paymentPage.totalDataCount}
            onFetchData={paymentPage.onFetchData}
            fillViewport={false}
            className="min-h-0 flex-1"
            emptyMessage="No payments yet."
          />
        </TabsContent>
      </Tabs>

      <DialogCommon
        open={Boolean(denyTarget)}
        onOpenChange={(open) => {
          if (!open) setDenyTarget(null);
        }}
        title="Deny this refund?"
        description={
          denyTarget
            ? `Refund for ${denyTarget.receiptNumber} (${denyTarget.userEmail}) will be marked denied.`
            : undefined
        }
        confirmLabel="Deny refund"
        confirmVariant="destructive"
        onConfirm={async () => {
          if (!denyTarget) return;
          await patchRefund(denyTarget.id, "denied");
          setDenyTarget(null);
        }}
      />
    </section>
  );
}

function RefundAmountAction({
  amount,
  onSave,
}: {
  amount: number | null;
  onSave: (n: number) => void;
}) {
  const [value, setValue] = useState(amount != null ? String(amount) : "");

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Set refund amount"
              className="text-primary hover:bg-bg-gold"
            >
              <DollarSign className="size-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          Set refund amount
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-52 space-y-2 p-3" align="end">
        <p className="text-xs font-medium text-muted-foreground">
          Refund amount ($)
        </p>
        <Input
          type="number"
          className="h-10"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
        />
        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            const n = Number(value);
            if (!Number.isNaN(n) && n > 0) onSave(n);
            else toast.error("Enter a valid amount.");
          }}
        >
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
}
