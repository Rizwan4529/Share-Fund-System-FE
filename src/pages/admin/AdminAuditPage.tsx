import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, ScrollText } from "lucide-react";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminPageHeader,
  AdminTableToolbar,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatSettingDate } from "@/lib/settings/value";
import { useListAuditLogsQuery } from "@/store/api/auditApi";
import { AUDIT_LOG_ACTIONS, type AuditLog } from "@/types/audit";

function actorLabel(actor: AuditLog["actorId"]): string {
  if (!actor) return "System";
  if (typeof actor === "string") return actor;
  const name = [actor.firstName, actor.lastName].filter(Boolean).join(" ");
  return name || actor.email || actor._id;
}

function actionLabel(action: string): string {
  return action.replaceAll("_", " ").replace(/^./, (char) => char.toUpperCase());
}

function snapshotPreview(value: unknown): string {
  if (value == null) return "—";
  try {
    const text = JSON.stringify(value);
    return text.length > 72 ? `${text.slice(0, 72)}…` : text;
  } catch {
    return String(value);
  }
}

export default function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const listQuery = useListAuditLogsQuery({
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
    limit: 200,
  });
  const logs = listQuery.data ?? [];

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        logs,
        search,
        (log) =>
          `${actionLabel(log.action)} ${actorLabel(log.actorId)} ${log.targetType} ${log.targetId ?? ""}`,
      ),
    [logs, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const columns = useMemo<ColumnDef<AuditLog>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Time"
            className="ml-1"
          />
        ),
        cell: ({ row }) => formatSettingDate(row.original.createdAt),
        enableSorting: true,
      },
      {
        id: "actor",
        accessorFn: (row) => actorLabel(row.actorId),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Actor" />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "action",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Action" />
        ),
        cell: ({ row }) => actionLabel(row.original.action),
        enableSorting: true,
      },
      {
        accessorKey: "targetType",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Target" />
        ),
        cell: ({ row }) =>
          `${row.original.targetType}${row.original.targetId ? ` · ${row.original.targetId}` : ""}`,
        enableSorting: true,
      },
      {
        id: "change",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Change" />
        ),
        cell: ({ row }) => (
          <span className="block max-w-xs truncate font-mono text-xs">
            {snapshotPreview(row.original.afterValue ?? row.original.beforeValue)}
          </span>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  const tableBody = () => {
    if (listQuery.isLoading) {
      return (
        <div className="flex min-h-48 flex-1 items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (listQuery.isError) {
      return (
        <EmptyState
          icon={AlertCircle}
          variant="error"
          title="Could not load audit logs"
          description={getApiErrorMessage(
            listQuery.error,
            "The audit trail could not be loaded.",
          )}
          action={
            <Button type="button" variant="outline" onClick={listQuery.refetch}>
              Try again
            </Button>
          }
        />
      );
    }

    if (logs.length === 0) {
      return (
        <EmptyState
          icon={ScrollText}
          title="No audit entries"
          description="Admin and system changes will appear here as they happen."
        />
      );
    }

    return (
      <DataTableCommon
        columns={columns}
        data={pageRows}
        totalDataCount={totalDataCount}
        onFetchData={onFetchData}
        fillViewport={false}
        className="min-h-0 flex-1"
        emptyMessage="No audit entries match your search."
      />
    );
  };

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Audit log"
        subtitle="Read-only trail of admin and system changes. Entries are append-only."
      />
      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search actor, action, or target…"
        resultCount={filtered.length}
        endSlot={
          <div className="flex flex-wrap gap-2">
            <select
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="h-11 rounded-md border border-border-input bg-white px-3 text-sm"
            >
              <option value="">All actions</option>
              {AUDIT_LOG_ACTIONS.map((value) => (
                <option key={value} value={value}>
                  {actionLabel(value)}
                </option>
              ))}
            </select>
            <Input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="h-11 w-auto"
              aria-label="From date"
            />
            <Input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="h-11 w-auto"
              aria-label="To date"
            />
          </div>
        }
      />
      <div className={ADMIN_TABLE_SLOT}>{tableBody()}</div>
    </section>
  );
}
