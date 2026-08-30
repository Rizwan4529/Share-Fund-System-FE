import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Pencil, Plus } from "lucide-react";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminGoldButton,
  AdminPageHeader,
  AdminStatusPill,
  AdminTableIconAction,
  AdminTableToolbar,
  LegalDocumentFormDrawer,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  legalDocumentTypeLabel,
  summarizeLegalDocuments,
  type LegalDocumentRow,
} from "@/lib/legal/labels";
import { formatSettingDate } from "@/lib/settings/value";
import { useListLegalDocumentsQuery } from "@/store/api/legalApi";
import type { LegalDocumentType } from "@/types/auth";

type DrawerMode = "create" | "edit";

export default function AdminDisclosuresPage() {
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("edit");
  const [editingType, setEditingType] = useState<LegalDocumentType | null>(
    null,
  );

  const listQuery = useListLegalDocumentsQuery();
  const rows = useMemo(
    () => summarizeLegalDocuments(listQuery.data ?? []),
    [listQuery.data],
  );

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        rows,
        search,
        (row) =>
          `${legalDocumentTypeLabel(row.documentType)} ${row.latest?.title ?? ""} ${row.latest?.status ?? ""}`,
      ),
    [rows, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const existingTypes = useMemo(
    () => rows.filter((row) => row.latest).map((row) => row.documentType),
    [rows],
  );

  const openCreate = (documentType: LegalDocumentType | null = null) => {
    setDrawerMode("create");
    setEditingType(documentType);
    setDrawerOpen(true);
  };

  const openEdit = (documentType: LegalDocumentType) => {
    setDrawerMode("edit");
    setEditingType(documentType);
    setDrawerOpen(true);
  };

  const columns = useMemo<ColumnDef<LegalDocumentRow>[]>(
    () => [
      {
        accessorKey: "documentType",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Type"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {legalDocumentTypeLabel(row.original.documentType)}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "title",
        accessorFn: (row) => row.latest?.title ?? "",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Title" />
        ),
        cell: ({ row }) => row.original.latest?.title ?? "—",
        enableSorting: true,
      },
      {
        id: "publishedVersion",
        accessorFn: (row) => row.published?.version ?? 0,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Published" />
        ),
        cell: ({ row }) =>
          row.original.published
            ? `v${row.original.published.version}`
            : "None",
        enableSorting: true,
      },
      {
        id: "status",
        accessorFn: (row) =>
          row.latest?.status === "draft" ? "draft" : (row.latest?.status ?? ""),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        cell: ({ row }) => {
          if (!row.original.latest) {
            return <AdminStatusPill status="inactive" />;
          }
          if (row.original.latest.status === "draft") {
            return <AdminStatusPill status="draft" />;
          }
          return <AdminStatusPill status="published" />;
        },
        enableSorting: true,
      },
      {
        id: "updatedAt",
        accessorFn: (row) => row.latest?.updatedAt ?? "",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Updated" />
        ),
        cell: ({ row }) => formatSettingDate(row.original.latest?.updatedAt),
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            {row.original.latest ? (
              <AdminTableIconAction
                label="Edit"
                icon={Pencil}
                tone="info"
                onClick={() => openEdit(row.original.documentType)}
              />
            ) : (
              <AdminTableIconAction
                label="Add"
                icon={Plus}
                tone="success"
                onClick={() => openCreate(row.original.documentType)}
              />
            )}
          </div>
        ),
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
          title="Could not load legal documents"
          description={getApiErrorMessage(
            listQuery.error,
            "The legal document list could not be loaded.",
          )}
          action={
            <Button type="button" variant="outline" onClick={listQuery.refetch}>
              Try again
            </Button>
          }
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
        emptyMessage="No legal documents match your search."
      />
    );
  };

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Disclosures & legal"
        subtitle="Add or edit versioned legal documents in a rich text editor. Saving a published document creates a new draft — publish only when the wording is final."
        // actions={
        //   <AdminGoldButton type="button" onClick={() => openCreate()}>
        //     <Plus className="size-4" />
        //     Add document
        //   </AdminGoldButton>
        // }
      />
      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search type, title, or status…"
        resultCount={filtered.length}
      />
      <div className={ADMIN_TABLE_SLOT}>{tableBody()}</div>
      <LegalDocumentFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        documentType={editingType}
        existingTypes={existingTypes}
      />
    </section>
  );
}
