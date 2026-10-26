import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  Copy,
  Eye,
  UserCheck,
  UserCog,
  UserRoundX,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminExportButton,
  AdminFilterSelect,
  AdminPageHeader,
  AdminStatusPill,
  AdminTableIconAction,
  AdminTableToolbar,
  ParticipantAccessDrawer,
  ParticipantDetailDrawer,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { DialogCommon } from "@/components/common/DialogCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Button } from "@/components/ui/button";
import { useServerTableState, withoutPaging } from "@/hooks/useServerTableState";
import {
  ALL_FILTER,
  PARTICIPANT_ACCOUNT_STATUS_OPTIONS,
  PARTICIPANT_QUESTIONNAIRE_OPTIONS,
  PARTICIPANT_STANDING_OPTIONS,
} from "@/lib/admin-participants/labels";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  useListAdminParticipantsQuery,
  useUpdateParticipantStatusMutation,
} from "@/store/api/adminParticipantsApi";
import type {
  AdminParticipantRow,
  AdminSettableAccountStatus,
  ParticipantAccountStatus,
  ParticipantQuestionnaireFilter,
  ParticipantSortBy,
  ParticipantStanding,
} from "@/types/adminParticipants";

const NO_FILTERS: {
  status: ParticipantStanding | typeof ALL_FILTER;
  questionnaire: ParticipantQuestionnaireFilter | typeof ALL_FILTER;
  accountStatus: ParticipantAccountStatus | typeof ALL_FILTER;
} = {
  status: ALL_FILTER,
  questionnaire: ALL_FILTER,
  accountStatus: ALL_FILTER,
};

/** Table column id → API sortBy. */
const SORTABLE_COLUMNS: Record<string, ParticipantSortBy> = {
  name: "name",
  email: "email",
  status: "status",
  questionnaire: "questionnaire",
};

/** Suspend/close are destructive, so they go through a confirm dialog. */
type PendingAction = {
  participant: AdminParticipantRow;
  status: Extract<AdminSettableAccountStatus, "suspended" | "closed">;
};

const CONFIRM_COPY: Record<PendingAction["status"], { title: string; body: string; label: string }> = {
  suspended: {
    title: "Suspend this participant?",
    body: "Their account will be marked suspended. You can reactivate it at any time. This is recorded in the audit log.",
    label: "Suspend",
  },
  closed: {
    title: "Close this account?",
    body: "Their account will be marked closed. You can reactivate it later if needed. This is recorded in the audit log.",
    label: "Close account",
  },
};

export default function AdminParticipantsPage() {
  const table = useServerTableState({
    initialFilters: NO_FILTERS,
    sortableColumns: SORTABLE_COLUMNS,
  });
  const listQuery = useListAdminParticipantsQuery(table.args);
  // Same filters/sort as the list, without paging.
  const exportParams = withoutPaging(table.args);
  const { refetch } = listQuery;
  const rows = listQuery.data?.participants ?? [];
  const total = listQuery.data?.pagination.total ?? 0;

  const [updateStatus, updateStatusState] = useUpdateParticipantStatusMutation();
  const [viewing, setViewing] = useState<AdminParticipantRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingAccess, setEditingAccess] = useState<AdminParticipantRow | null>(null);
  const [accessOpen, setAccessOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const applyStatus = async (
    participant: AdminParticipantRow,
    status: AdminSettableAccountStatus,
  ) => {
    try {
      await updateStatus({ userId: participant._id, status }).unwrap();
      toast.success(`${participant.name} is now ${status}.`);
      setPending(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update the account status."));
    }
  };

  const columns = useMemo<ColumnDef<AdminParticipantRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Name" className="ml-1" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">{row.original.name}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Email" />,
        enableSorting: true,
      },
      {
        id: "status",
        accessorFn: (r) => r.statusLabel,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Status" />,
        enableSorting: true,
      },
      {
        id: "centers",
        accessorFn: (r) => `${r.centersUsed}/${r.centersTotal}`,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Centers" />,
        enableSorting: false,
      },
      {
        id: "questionnaire",
        accessorFn: (r) => (r.questionnaireComplete ? "Yes" : "No"),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Questionnaire" />
        ),
        enableSorting: true,
      },
      {
        id: "account",
        accessorFn: (r) => r.accountStatus,
        header: ({ column }) => <DataTableColumnHeaderCommon column={column} title="Account" />,
        cell: ({ row }) => <AdminStatusPill status={row.original.accountStatus} />,
        enableSorting: false,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex items-center justify-end gap-0.5">
              <AdminTableIconAction
                label="View details"
                icon={Eye}
                tone="info"
                onClick={() => {
                  setViewing(r);
                  setDetailOpen(true);
                }}
              />
              <AdminTableIconAction
                label="Copy email"
                icon={Copy}
                onClick={() => {
                  void navigator.clipboard.writeText(r.email);
                  toast.success("Email copied.");
                }}
              />
              <AdminTableIconAction
                label="Activate account"
                icon={UserCheck}
                tone="success"
                disabled={r.accountStatus === "active"}
                onClick={() => void applyStatus(r, "active")}
              />
              <AdminTableIconAction
                label="Suspend account"
                icon={Ban}
                tone="danger"
                disabled={r.accountStatus === "suspended"}
                onClick={() => setPending({ participant: r, status: "suspended" })}
              />
              <AdminTableIconAction
                label="Close account"
                icon={UserRoundX}
                tone="danger"
                disabled={r.accountStatus === "closed"}
                onClick={() => setPending({ participant: r, status: "closed" })}
              />
              <AdminTableIconAction
                label="Update access"
                icon={UserCog}
                onClick={() => {
                  setEditingAccess(r);
                  setAccessOpen(true);
                }}
              />
            </div>
          );
        },
      },
    ],
    // applyStatus only uses stable setters + the mutation trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const confirm = pending ? CONFIRM_COPY[pending.status] : null;

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Participants"
        subtitle="View participants, their founder status and Success Profiles, and manage account access."
        actions={
          <GoldButton size="sm" variant="outline" onClick={() => void refetch()}>
            Refresh
          </GoldButton>
        }
      />
      <AdminTableToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        placeholder="Search name or email…"
        resultCount={total}
        endSlot={
          <div className="flex flex-wrap items-center gap-2">
            <AdminFilterSelect
              placeholder="Status"
              allLabel="All statuses"
              value={table.filters.status}
              options={PARTICIPANT_STANDING_OPTIONS}
              onChange={(value) => table.setFilter("status", value)}
            />
            <AdminFilterSelect
              placeholder="Questionnaire"
              allLabel="All questionnaires"
              value={table.filters.questionnaire}
              options={PARTICIPANT_QUESTIONNAIRE_OPTIONS}
              onChange={(value) => table.setFilter("questionnaire", value)}
            />
            <AdminFilterSelect
              placeholder="Account"
              allLabel="All accounts"
              value={table.filters.accountStatus}
              options={PARTICIPANT_ACCOUNT_STATUS_OPTIONS}
              onChange={(value) => table.setFilter("accountStatus", value)}
            />
            {table.hasFilters ? (
              <Button type="button" variant="ghost" className="h-11" onClick={table.clearFilters}>
                <X />
                Clear filters
              </Button>
            ) : null}
            <AdminExportButton dataset="participants" params={exportParams} />
          </div>
        }
      />
      <div className={ADMIN_TABLE_SLOT}>
        {listQuery.isError ? (
          <EmptyState
            icon={Users}
            variant="error"
            title="Could not load participants"
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
              table.hasFilters ? "No participants match these filters." : "No participants yet."
            }
          />
        )}
      </div>

      <ParticipantDetailDrawer open={detailOpen} onOpenChange={setDetailOpen} participant={viewing} />
      <ParticipantAccessDrawer
        open={accessOpen}
        onOpenChange={setAccessOpen}
        participant={editingAccess}
      />
      <DialogCommon
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open && !updateStatusState.isLoading) setPending(null);
        }}
        title={confirm?.title ?? ""}
        description={pending ? `${pending.participant.name} — ${confirm?.body}` : undefined}
        confirmLabel={confirm?.label}
        confirmLoading={updateStatusState.isLoading}
        onConfirm={() => {
          if (pending) void applyStatus(pending.participant, pending.status);
        }}
      />
    </section>
  );
}
