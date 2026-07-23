import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminPageHeader,
  AdminTableIconAction,
  AdminTableToolbar,
} from "@/components/admin";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import { listDisclosures, saveDisclosure } from "@/lib/api/disclosures";
import type { DisclosureDoc } from "@/types";

export default function AdminDisclosuresPage() {
  const [docs, setDocs] = useState<DisclosureDoc[]>([]);
  const [editing, setEditing] = useState<DisclosureDoc | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        docs,
        search,
        (d) => `${d.title} ${d.kind} ${d.version} ${d.updatedAt}`,
      ),
    [docs, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const reload = () => void listDisclosures().then(setDocs);
  useEffect(() => {
    reload();
  }, []);

  const openEdit = (doc: DisclosureDoc) => {
    setEditing({ ...doc });
    setDrawerOpen(true);
  };

  const closeDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) setEditing(null);
  };

  const onSave = async (bump: boolean) => {
    if (!editing) return;
    setSaving(true);
    try {
      await saveDisclosure(editing, bump);
      toast.success(bump ? "Saved with new version." : "Saved.");
      closeDrawer(false);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<ColumnDef<DisclosureDoc>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Title"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {row.original.title}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "kind",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Kind" />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "version",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Version" />
        ),
        cell: ({ row }) => `v${row.original.version}`,
        enableSorting: true,
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Updated" />
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <AdminTableIconAction
              label="Edit"
              icon={Pencil}
              tone="info"
              onClick={() => openEdit(row.original)}
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
        title="Disclosures & legal"
        subtitle="Edit platform disclosures. Saving with a version bump records a new version for acceptances."
      />
      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search title, kind, or version…"
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
          emptyMessage="No disclosure documents yet."
        />
      </div>

      <DrawerCommon
        open={drawerOpen}
        onOpenChange={closeDrawer}
        title={editing?.title ?? "Edit disclosure"}
        description="Edit legal copy. Use bump version when participants must re-accept."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDrawer(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void onSave(false)}
              disabled={saving}
            >
              Save without bump
            </Button>
            <Button
              type="button"
              variant="gold"
              onClick={() => void onSave(true)}
              disabled={saving}
            >
              Save & bump version
            </Button>
          </>
        }
      >
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="disclosure-body">Body</Label>
              <Textarea
                id="disclosure-body"
                className="min-h-64"
                value={editing.body}
                onChange={(e) =>
                  setEditing({ ...editing, body: e.target.value })
                }
              />
            </div>
          </div>
        ) : null}
      </DrawerCommon>
    </section>
  );
}
