import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  AdminPageHeader,
  AdminSectionTitle,
  AdminSurfaceCard,
  AdminTableToolbar,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/TabsCommon";
import { Typography } from "@/components/common/Typography";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import { fetchAdminAudit } from "@/lib/api/admin";
import type { AuditEvent } from "@/types";
import { cn } from "@/lib/utils";

const AUDIT_TONE: Record<string, string> = {
  ok: "bg-success",
  warn: "bg-primary",
  danger: "bg-error",
};

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("audit");
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        audit,
        search,
        (e) => `${e.action} ${e.actor} ${e.time}`,
      ),
    [audit, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  useEffect(() => {
    void fetchAdminAudit().then(setAudit);
  }, []);

  const columns = useMemo<ColumnDef<AuditEvent>[]>(
    () => [
      {
        id: "tone",
        enableSorting: false,
        enableHiding: false,
        header: () => <span className="sr-only">Tone</span>,
        cell: ({ row }) => (
          <span
            className={cn(
              "mt-1.5 inline-block size-2 shrink-0 rounded-full",
              AUDIT_TONE[row.original.tone] ?? AUDIT_TONE.ok,
            )}
          />
        ),
      },
      {
        accessorKey: "action",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Action" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {row.original.action}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "actor",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Actor" />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "time",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Time" />
        ),
        enableSorting: true,
      },
    ],
    [],
  );

  return (
    <>
      <AdminPageHeader
        title="Settings"
        subtitle="Platform notes and the Phase 1 audit trail."
      />

      <Tabs value={tab} onValueChange={setTab} className="gap-4">
        <TabsList>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <AdminSurfaceCard className="p-5">
            <AdminSectionTitle>Platform</AdminSectionTitle>
            <Typography
              variant="body"
              className="mt-2 text-sm text-muted-foreground"
            >
              Pricing, rules, Success Centers, and disclosures are managed from
              their dedicated admin pages. This Phase 1 build uses local mock
              storage (`sfs-phase1-store`). Real JWT/Mongo/Stripe come with the
              backend.
            </Typography>
          </AdminSurfaceCard>
        </TabsContent>

        <TabsContent value="audit" className="space-y-3">
          <AdminSectionTitle>Audit log</AdminSectionTitle>
          <AdminTableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search action, actor, or time…"
            resultCount={filtered.length}
          />
          <DataTableCommon
            columns={columns}
            data={pageRows}
            totalDataCount={totalDataCount}
            onFetchData={onFetchData}
            fillViewport
            emptyMessage="No audit events yet."
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
