import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BadgeCheck,
  Copy,
  Eye,
  Layers,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminPageHeader,
  AdminTableIconAction,
  AdminTableToolbar,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import {
  fetchAdminParticipants,
  updateParticipantFoundingStatus,
} from "@/lib/api/admin";
import { foundingStatusLabel } from "@/lib/auth/roles";
import type { AuthUser, FoundingStatus } from "@/types";

export default function AdminParticipantsPage() {
  const [rows, setRows] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        rows,
        search,
        (r) =>
          `${r.name} ${r.email} ${foundingStatusLabel(r.foundingStatus)}`,
      ),
    [rows, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const reload = () => void fetchAdminParticipants().then(setRows);
  useEffect(() => {
    reload();
  }, []);

  const onStatus = async (id: string, status: FoundingStatus) => {
    await updateParticipantFoundingStatus(id, status);
    toast.success("Founding status updated.");
    reload();
  };

  const columns = useMemo<ColumnDef<AuthUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Name"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {row.original.name}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Email" />
        ),
        enableSorting: true,
      },
      {
        id: "status",
        accessorFn: (r) => foundingStatusLabel(r.foundingStatus),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        enableSorting: true,
      },
      {
        id: "centers",
        accessorFn: (r) => `${r.selectedCenterIds.length}/${r.centerLimit}`,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Centers" />
        ),
        enableSorting: false,
      },
      {
        id: "questionnaire",
        accessorFn: (r) => (r.questionnaireComplete ? "Yes" : "No"),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Questionnaire"
          />
        ),
        enableSorting: true,
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
                onClick={() =>
                  toast.message(r.name, {
                    description: `${r.email} · ${foundingStatusLabel(r.foundingStatus)}`,
                  })
                }
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
                label="Set not enrolled"
                icon={UserRoundX}
                disabled={r.foundingStatus === "none"}
                onClick={() => void onStatus(r.id, "none")}
              />
              <AdminTableIconAction
                label="Set Founding Participant"
                icon={BadgeCheck}
                tone="success"
                disabled={r.foundingStatus === "founding_participant"}
                onClick={() => void onStatus(r.id, "founding_participant")}
              />
              <AdminTableIconAction
                label="Set Founder Stack"
                icon={Layers}
                tone="info"
                disabled={r.foundingStatus === "founder_stack"}
                onClick={() => void onStatus(r.id, "founder_stack")}
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
        title="Participants"
        subtitle="View participants and manage Founding / Founder Stack status."
        actions={
          <GoldButton size="sm" variant="outline" onClick={reload}>
            Refresh
          </GoldButton>
        }
      />
      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search name, email, or status…"
        resultCount={filtered.length}
      />
      <div className={ADMIN_TABLE_SLOT}>
        <DataTableCommon
          columns={columns}
          data={pageRows}
          totalDataCount={totalDataCount}
          onFetchData={onFetchData}
          fillViewport={false}
          className="min-h-0 flex-1"
          emptyMessage="No participants yet. Sign up as a non-admin user to populate."
        />
      </div>
    </section>
  );
}
