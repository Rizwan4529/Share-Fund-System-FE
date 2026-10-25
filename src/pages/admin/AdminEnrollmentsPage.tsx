import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardList, Eye, X } from "lucide-react";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminFilterSelect,
  AdminPageHeader,
  AdminPaymentDetailDrawer,
  AdminSegmentedControl,
  AdminStatusPill,
  AdminTableIconAction,
  AdminTableToolbar,
} from "@/components/admin";
import { AdminDateRangeInputs } from "@/components/admin/AdminDateRangeInputs";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import {
  dayEndIso,
  dayStartIso,
  useServerTableState,
} from "@/hooks/useServerTableState";
import { ALL_FILTER } from "@/lib/admin-participants/labels";
import {
  ENROLLMENT_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  PURPOSE_OPTIONS,
} from "@/lib/admin-reports/labels";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatPaymentAmount, formatPaymentDate } from "@/lib/payments/format";
import { PAYMENT_PURPOSE_LABELS } from "@/lib/payments/labels";
import {
  useListAdminEnrollmentsQuery,
  useListAdminPaymentsQuery,
} from "@/store/api/adminReportsApi";
import type {
  AdminEnrollmentRow,
  AdminPaymentRow,
  AdminPaymentSortBy,
  EnrollmentSortBy,
  EnrollmentStatus,
} from "@/types/adminReports";
import type { PaymentPurpose, PaymentRecordStatus } from "@/types/payments";

type Tab = "enrollments" | "payments";

const TABS = [
  { id: "enrollments", label: "Enrollments" },
  { id: "payments", label: "Payments" },
];

export default function AdminEnrollmentsPage() {
  const [tab, setTab] = useState<Tab>("enrollments");

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Enrollments"
        subtitle="Who enrolled in or activated what, and every payment behind it."
        actions={
          <AdminSegmentedControl
            options={TABS}
            value={tab}
            onChange={(id) => setTab(id as Tab)}
            size="sm"
          />
        }
      />
      {tab === "enrollments" ? <EnrollmentsTable /> : <PaymentsTable />}
    </section>
  );
}

/* ─── Shared cell renderers ─── */

function ParticipantCell({ name, email }: { name: string; email: string }) {
  return (
    <div className="min-w-0">
      <span className="block font-semibold text-ink-heading">{name || "—"}</span>
      <span className="block text-xs text-muted-foreground">{email}</span>
    </div>
  );
}

function ClearFiltersButton({ show, onClick }: { show: boolean; onClick: () => void }) {
  if (!show) return null;
  return (
    <Button type="button" variant="ghost" className="h-11" onClick={onClick}>
      <X />
      Clear filters
    </Button>
  );
}

function TableError({ error, onRetry, title }: { error: unknown; onRetry: () => void; title: string }) {
  return (
    <EmptyState
      icon={ClipboardList}
      variant="error"
      title={title}
      description={getApiErrorMessage(error, "Please try again in a moment.")}
      action={
        <Button type="button" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}

/* ─── Enrollments ─── */

const ENROLLMENT_FILTERS: {
  type: PaymentPurpose | typeof ALL_FILTER;
  status: EnrollmentStatus | typeof ALL_FILTER;
  from: string;
  to: string;
} = { type: ALL_FILTER, status: ALL_FILTER, from: "", to: "" };

const ENROLLMENT_SORTABLE: Record<string, EnrollmentSortBy> = {
  participant: "name",
  type: "type",
  status: "status",
  date: "date",
};

function EnrollmentsTable() {
  const table = useServerTableState({
    initialFilters: ENROLLMENT_FILTERS,
    sortableColumns: ENROLLMENT_SORTABLE,
  });
  const { from, to, ...args } = table.args;
  const query = useListAdminEnrollmentsQuery({
    ...args,
    from: dayStartIso(from),
    to: dayEndIso(to),
  });
  const total = query.data?.pagination.total ?? 0;

  const columns = useMemo<ColumnDef<AdminEnrollmentRow>[]>(
    () => [
      {
        id: "participant",
        accessorFn: (row) => row.participant.name,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Participant" className="ml-1" />
        ),
        cell: ({ row }) => <ParticipantCell {...row.original.participant} />,
        enableSorting: true,
      },
      {
        id: "type",
        accessorFn: (row) => PAYMENT_PURPOSE_LABELS[row.type],
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Type" />,
        enableSorting: true,
      },
      {
        id: "item",
        accessorFn: (row) => row.itemName,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Enrolled in" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="block text-ink-heading">{row.original.itemName ?? "—"}</span>
            {row.original.itemDetail ? (
              <span className="block text-xs text-muted-foreground">{row.original.itemDetail}</span>
            ) : null}
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Status" />,
        cell: ({ row }) => <AdminStatusPill status={row.original.status} />,
        enableSorting: true,
      },
      {
        id: "planning",
        accessorFn: (row) => row.planningAccessStatus,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Planning access" />,
        cell: ({ row }) =>
          row.original.planningAccessStatus ? (
            <AdminStatusPill
              status={row.original.planningAccessStatus === "active" ? "active" : "inactive"}
            />
          ) : (
            "—"
          ),
        enableSorting: false,
      },
      {
        id: "payment",
        accessorFn: (row) => row.paymentStatus,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Payment" />,
        cell: ({ row }) =>
          row.original.paymentStatus ? (
            <AdminStatusPill status={row.original.paymentStatus} />
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        enableSorting: false,
      },
      {
        id: "date",
        accessorFn: (row) => row.date,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Date" />,
        cell: ({ row }) => formatPaymentDate(row.original.date),
        enableSorting: true,
      },
    ],
    [],
  );

  return (
    <>
      <AdminTableToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        placeholder="Search name or email…"
        resultCount={total}
        endSlot={
          <div className="flex flex-wrap items-center gap-2">
            <AdminFilterSelect
              placeholder="Type"
              allLabel="All types"
              value={table.filters.type}
              options={PURPOSE_OPTIONS}
              onChange={(value) => table.setFilter("type", value)}
            />
            <AdminFilterSelect
              placeholder="Status"
              allLabel="All statuses"
              value={table.filters.status}
              options={ENROLLMENT_STATUS_OPTIONS}
              onChange={(value) => table.setFilter("status", value)}
            />
            <AdminDateRangeInputs
              from={table.filters.from}
              to={table.filters.to}
              onFromChange={(value) => table.setFilter("from", value)}
              onToChange={(value) => table.setFilter("to", value)}
            />
            <ClearFiltersButton show={table.hasFilters} onClick={table.clearFilters} />
          </div>
        }
      />
      <div className={ADMIN_TABLE_SLOT}>
        {query.isError ? (
          <TableError
            title="Could not load enrollments"
            error={query.error}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <DataTableCommon
            columns={columns}
            data={query.data?.enrollments ?? []}
            isLoading={query.isFetching}
            totalDataCount={total}
            onFetchData={table.onFetchData}
            onSortingChange={table.onSortingChange}
            pageResetKey={table.queryKey}
            fillViewport={false}
            className="min-h-0 flex-1"
            emptyMessage={
              table.hasFilters ? "No enrollments match these filters." : "No enrollments yet."
            }
          />
        )}
      </div>
    </>
  );
}

/* ─── Payments ─── */

const PAYMENT_FILTERS: {
  purpose: PaymentPurpose | typeof ALL_FILTER;
  status: PaymentRecordStatus | typeof ALL_FILTER;
  from: string;
  to: string;
} = { purpose: ALL_FILTER, status: ALL_FILTER, from: "", to: "" };

const PAYMENT_SORTABLE: Record<string, AdminPaymentSortBy> = {
  participant: "name",
  amount: "amount",
  status: "status",
  date: "date",
};

function PaymentsTable() {
  const table = useServerTableState({
    initialFilters: PAYMENT_FILTERS,
    sortableColumns: PAYMENT_SORTABLE,
  });
  const { from, to, ...args } = table.args;
  const query = useListAdminPaymentsQuery({
    ...args,
    from: dayStartIso(from),
    to: dayEndIso(to),
  });
  const total = query.data?.pagination.total ?? 0;
  const [viewing, setViewing] = useState<AdminPaymentRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns = useMemo<ColumnDef<AdminPaymentRow>[]>(
    () => [
      {
        id: "participant",
        accessorFn: (row) => row.participant.name,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Participant" className="ml-1" />
        ),
        cell: ({ row }) => <ParticipantCell {...row.original.participant} />,
        enableSorting: true,
      },
      {
        id: "purchase",
        accessorFn: (row) => row.description,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="For" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="block text-ink-heading">
              {row.original.description ?? PAYMENT_PURPOSE_LABELS[row.original.purpose]}
            </span>
            <span className="block text-xs text-muted-foreground">
              {PAYMENT_PURPOSE_LABELS[row.original.purpose]}
            </span>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "amount",
        accessorFn: (row) => row.amount,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Amount" />,
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">{formatPaymentAmount(row.original)}</span>
        ),
        enableSorting: true,
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Status" />,
        cell: ({ row }) => <AdminStatusPill status={row.original.status} />,
        enableSorting: true,
      },
      {
        id: "date",
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Date" />,
        cell: ({ row }) => formatPaymentDate(row.original.paymentDate ?? row.original.createdAt),
        enableSorting: true,
      },
      {
        id: "reference",
        accessorFn: (row) => row.providerTransactionRef,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Transaction ref" />,
        cell: ({ row }) => (
          <span className="block max-w-40 truncate text-xs text-muted-foreground">
            {row.original.providerTransactionRef ?? "—"}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "refund",
        accessorFn: (row) => row.refundStatus,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Refund / dispute" />,
        cell: ({ row }) => (
          <Typography variant="caption" color="muted">
            {row.original.refundStatus} / {row.original.disputeStatus}
          </Typography>
        ),
        enableSorting: false,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <AdminTableIconAction
              label="View payment"
              icon={Eye}
              tone="info"
              onClick={() => {
                setViewing(row.original);
                setDrawerOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <AdminTableToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        placeholder="Search name or email…"
        resultCount={total}
        endSlot={
          <div className="flex flex-wrap items-center gap-2">
            <AdminFilterSelect
              placeholder="Type"
              allLabel="All types"
              value={table.filters.purpose}
              options={PURPOSE_OPTIONS}
              onChange={(value) => table.setFilter("purpose", value)}
            />
            <AdminFilterSelect
              placeholder="Status"
              allLabel="All statuses"
              value={table.filters.status}
              options={PAYMENT_STATUS_OPTIONS}
              onChange={(value) => table.setFilter("status", value)}
            />
            <AdminDateRangeInputs
              from={table.filters.from}
              to={table.filters.to}
              onFromChange={(value) => table.setFilter("from", value)}
              onToChange={(value) => table.setFilter("to", value)}
            />
            <ClearFiltersButton show={table.hasFilters} onClick={table.clearFilters} />
          </div>
        }
      />
      <div className={ADMIN_TABLE_SLOT}>
        {query.isError ? (
          <TableError
            title="Could not load payments"
            error={query.error}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <DataTableCommon
            columns={columns}
            data={query.data?.payments ?? []}
            isLoading={query.isFetching}
            totalDataCount={total}
            onFetchData={table.onFetchData}
            onSortingChange={table.onSortingChange}
            pageResetKey={table.queryKey}
            fillViewport={false}
            className="min-h-0 flex-1"
            emptyMessage={table.hasFilters ? "No payments match these filters." : "No payments yet."}
          />
        )}
      </div>
      <AdminPaymentDetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} payment={viewing} />
    </>
  );
}
