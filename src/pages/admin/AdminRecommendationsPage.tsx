import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardCheck, Eye, X } from "lucide-react";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminFilterSelect,
  AdminPageHeader,
  AdminStatusPill,
  AdminTableIconAction,
  AdminTableToolbar,
  RecommendationReviewDrawer,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Button } from "@/components/ui/button";
import { useServerTableState } from "@/hooks/useServerTableState";
import { ALL_FILTER } from "@/lib/admin-participants/labels";
import {
  AFFORDABILITY_STATUS_LABELS,
  AFFORDABILITY_STATUS_OPTIONS,
  REVIEW_STATUS_OPTIONS,
} from "@/lib/admin-recommendations/labels";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useListAdminRecommendationsQuery } from "@/store/api/adminRecommendationsApi";
import type { AffordabilityStatus } from "@/types/activation";
import type {
  AdminRecommendationRow,
  RecommendationSortBy,
  ReviewStatus,
} from "@/types/adminRecommendations";

const NO_FILTERS: {
  reviewStatus: ReviewStatus | typeof ALL_FILTER;
  affordabilityStatus: AffordabilityStatus | typeof ALL_FILTER;
} = {
  reviewStatus: ALL_FILTER,
  affordabilityStatus: ALL_FILTER,
};

/** Table column id → API sortBy. */
const SORTABLE_COLUMNS: Record<string, RecommendationSortBy> = {
  participant: "name",
  affordability: "affordability",
  review: "reviewStatus",
  date: "date",
};

export default function AdminRecommendationsPage() {
  const table = useServerTableState({
    initialFilters: NO_FILTERS,
    sortableColumns: SORTABLE_COLUMNS,
  });
  const listQuery = useListAdminRecommendationsQuery(table.args);
  const { refetch } = listQuery;
  const rows = listQuery.data?.recommendations ?? [];
  const total = listQuery.data?.pagination.total ?? 0;

  const [reviewing, setReviewing] = useState<AdminRecommendationRow | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const columns = useMemo<ColumnDef<AdminRecommendationRow>[]>(
    () => [
      {
        id: "participant",
        accessorFn: (r) => r.participant.name,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Participant" className="ml-1" />
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="block font-semibold text-ink-heading">
              {row.original.participant.name || "Unknown participant"}
            </span>
            <span className="block text-xs text-muted-soft">{row.original.participant.email}</span>
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "program",
        accessorFn: (r) => r.programName,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Program" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="block text-ink-heading">{row.original.programName ?? "—"}</span>
            <span className="block text-xs text-muted-soft">
              {row.original.categoryName}
              {row.original.selectionStatus === "removed" ? " · selection removed" : ""}
            </span>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "affordability",
        accessorFn: (r) => AFFORDABILITY_STATUS_LABELS[r.affordabilityStatus],
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Affordability" />
        ),
        enableSorting: true,
      },
      {
        id: "review",
        accessorFn: (r) => r.reviewStatus,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Review" />,
        cell: ({ row }) => <AdminStatusPill status={row.original.reviewStatus} />,
        enableSorting: true,
      },
      {
        id: "adjusted",
        accessorFn: (r) => (r.adminAdjusted ? "Yes" : "No"),
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Adjusted" />,
        enableSorting: false,
      },
      {
        id: "date",
        accessorFn: (r) => r.createdAt,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Created" />,
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(undefined, {
            dateStyle: "medium",
          }),
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-0.5">
            <AdminTableIconAction
              label="Review"
              icon={Eye}
              tone="info"
              onClick={() => {
                setReviewing(row.original);
                setReviewOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Recommendations"
        subtitle="Review participants' activation plans, approve them, or adjust figures and projections. Every change is audited."
        actions={
          <GoldButton size="sm" variant="outline" onClick={() => void refetch()}>
            Refresh
          </GoldButton>
        }
      />
      <AdminTableToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        placeholder="Search participant name or email…"
        resultCount={total}
        endSlot={
          <div className="flex flex-wrap items-center gap-2">
            <AdminFilterSelect
              placeholder="Review status"
              allLabel="All review statuses"
              value={table.filters.reviewStatus}
              options={REVIEW_STATUS_OPTIONS}
              onChange={(value) => table.setFilter("reviewStatus", value)}
            />
            <AdminFilterSelect
              placeholder="Affordability"
              allLabel="All affordability"
              value={table.filters.affordabilityStatus}
              options={AFFORDABILITY_STATUS_OPTIONS}
              onChange={(value) => table.setFilter("affordabilityStatus", value)}
            />
            {table.hasFilters ? (
              <Button type="button" variant="ghost" className="h-11" onClick={table.clearFilters}>
                <X />
                Clear filters
              </Button>
            ) : null}
          </div>
        }
      />
      <div className={ADMIN_TABLE_SLOT}>
        {listQuery.isError ? (
          <EmptyState
            icon={ClipboardCheck}
            variant="error"
            title="Could not load recommendations"
            description={getApiErrorMessage(listQuery.error, "Please try again in a moment.")}
            action={
              <Button type="button" variant="outline" onClick={() => void refetch()}>
                Try again
              </Button>
            }
          />
        ) : (
          <DataTableCommon
            columns={columns}
            data={rows}
            isLoading={listQuery.isFetching}
            totalDataCount={total}
            onFetchData={table.onFetchData}
            onSortingChange={table.onSortingChange}
            pageResetKey={table.queryKey}
            fillViewport={false}
            className="min-h-0 flex-1"
            emptyMessage={
              table.hasFilters
                ? "No recommendations match these filters."
                : "No recommendations yet. They appear once participants calculate an activation plan."
            }
          />
        )}
      </div>

      <RecommendationReviewDrawer
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        recommendation={reviewing}
      />
    </section>
  );
}
