import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  ClipboardList,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Tags,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminGoldButton,
  AdminPageHeader,
  AdminStatusPill,
  AdminTableIconAction,
  AdminTableToolbar,
  WaitlistCampaignCategoryFormDrawer,
  WaitlistFormDrawer,
} from "../../components/admin";
import { DialogCommon } from "../../components/common/DialogCommon";
import { DataTableColumnHeaderCommon } from "../../components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "../../components/common/DataTableCommon";
import { EmptyState } from "../../components/common/EmptyState";
import { Spinner } from "../../components/common/LoadingScreen";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/common/TabsCommon";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { filterRowsBySearch } from "../../hooks/useAdminTableSearch";
import { useClientTablePage } from "../../hooks/useClientTablePage";
import { getApiErrorMessage } from "../../lib/api/getApiErrorMessage";
import { waitlistCampaignLabel } from "../../lib/waitlist/labels";
import {
  useDeleteWaitlistCampaignCategoryMutation,
  useDeleteWaitlistEntryMutation,
  useListWaitlistCampaignCategoriesQuery,
  useListWaitlistEntriesQuery,
  useUpdateWaitlistCampaignCategoryMutation,
} from "../../store/api/waitlistApi";
import type {
  WaitlistCampaignCategory,
  WaitlistEntry,
  WaitlistStatus,
} from "../../types/waitlist";

type MainTab = "entries" | "campaigns";
type DrawerMode = "create" | "edit";
type StatusFilter = "all" | WaitlistStatus;
type ActiveFilter = "all" | "active" | "inactive";

export default function AdminWaitlistPage() {
  const [mainTab, setMainTab] = useState<MainTab>("entries");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [entryDrawerOpen, setEntryDrawerOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [pendingDeleteEntry, setPendingDeleteEntry] =
    useState<WaitlistEntry | null>(null);

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [categoryDrawerMode, setCategoryDrawerMode] =
    useState<DrawerMode>("create");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [pendingDeleteCategory, setPendingDeleteCategory] =
    useState<WaitlistCampaignCategory | null>(null);

  const categoriesQuery = useListWaitlistCampaignCategoriesQuery({
    includeInactive: true,
  });
  const categories = categoriesQuery.data ?? [];

  const listQuery = useListWaitlistEntriesQuery(
    statusFilter === "all" ? undefined : { status: statusFilter },
  );
  const [deleteEntry, deleteEntryState] = useDeleteWaitlistEntryMutation();
  const [updateCategory] = useUpdateWaitlistCampaignCategoryMutation();
  const [deleteCategory, deleteCategoryState] =
    useDeleteWaitlistCampaignCategoryMutation();
  const entries = listQuery.data ?? [];

  const filteredEntries = useMemo(
    () =>
      filterRowsBySearch(
        entries,
        search,
        (row) =>
          `${row.name} ${row.email} ${waitlistCampaignLabel(row.campaignCategory, categories)} ${row.campaignCategory} ${row.message ?? ""} ${row.status}`,
      ),
    [entries, search, categories],
  );
  const entryPage = useClientTablePage(filteredEntries);

  const filteredCategories = useMemo(() => {
    const byActive =
      activeFilter === "all"
        ? categories
        : categories.filter((category) =>
            activeFilter === "active" ? category.isActive : !category.isActive,
          );
    return filterRowsBySearch(
      byActive,
      search,
      (row) =>
        `${row.label} ${row.slug} ${row.description ?? ""} ${row.isActive ? "active" : "inactive"}`,
    );
  }, [categories, activeFilter, search]);
  const categoryPage = useClientTablePage(filteredCategories);

  const openEditEntry = (entry: WaitlistEntry) => {
    setEditingEntryId(entry._id);
    setEntryDrawerOpen(true);
  };

  const openCreateCategory = () => {
    setCategoryDrawerMode("create");
    setEditingCategoryId(null);
    setCategoryDrawerOpen(true);
  };

  const openEditCategory = (category: WaitlistCampaignCategory) => {
    setCategoryDrawerMode("edit");
    setEditingCategoryId(category._id);
    setCategoryDrawerOpen(true);
  };

  const onConfirmDeleteEntry = async () => {
    if (!pendingDeleteEntry) return;
    try {
      await deleteEntry(pendingDeleteEntry._id).unwrap();
      toast.success("Waitlist entry deleted.");
      setPendingDeleteEntry(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete waitlist entry."));
    }
  };

  const onToggleCategoryActive = async (category: WaitlistCampaignCategory) => {
    try {
      await updateCategory({
        id: category._id,
        isActive: !category.isActive,
      }).unwrap();
      toast.success(
        category.isActive
          ? "Campaign category deactivated."
          : "Campaign category activated.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not update campaign category."),
      );
    }
  };

  const onConfirmDeleteCategory = async () => {
    if (!pendingDeleteCategory) return;
    try {
      await deleteCategory(pendingDeleteCategory._id).unwrap();
      toast.success("Campaign category deleted.");
      setPendingDeleteCategory(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not delete campaign category."),
      );
    }
  };

  const entryColumns = useMemo<ColumnDef<WaitlistEntry>[]>(
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
        accessorKey: "campaignCategory",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Campaign" />
        ),
        cell: ({ row }) =>
          waitlistCampaignLabel(row.original.campaignCategory, categories),
        enableSorting: true,
      },
      {
        accessorKey: "message",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Message" />
        ),
        cell: ({ row }) => {
          const message = (row.original.message ?? "").trim();
          if (!message) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <span className="block max-w-xs truncate" title={message}>
              {message}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        cell: ({ row }) => <AdminStatusPill status={row.original.status} />,
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <AdminTableIconAction
              label="Edit"
              icon={Pencil}
              tone="info"
              onClick={() => openEditEntry(row.original)}
            />
            <AdminTableIconAction
              label="Delete"
              icon={Trash2}
              tone="danger"
              onClick={() => setPendingDeleteEntry(row.original)}
            />
          </div>
        ),
      },
    ],
    [categories],
  );

  const categoryColumns = useMemo<ColumnDef<WaitlistCampaignCategory>[]>(
    () => [
      {
        accessorKey: "label",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Label"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {row.original.label}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Slug" />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "order",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Order" />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Description" />
        ),
        cell: ({ row }) => {
          const description = (row.original.description ?? "").trim();
          if (!description) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <span className="block max-w-xs truncate" title={description}>
              {description}
            </span>
          );
        },
      },
      {
        id: "isActive",
        accessorFn: (row) => (row.isActive ? "active" : "inactive"),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <AdminStatusPill
            status={row.original.isActive ? "active" : "inactive"}
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
          const active = row.original.isActive;
          return (
            <div className="flex justify-end gap-1">
              <AdminTableIconAction
                label="Edit"
                icon={Pencil}
                tone="info"
                onClick={() => openEditCategory(row.original)}
              />
              <AdminTableIconAction
                label={active ? "Deactivate" : "Activate"}
                icon={active ? PowerOff : Power}
                tone={active ? "danger" : "success"}
                onClick={() => void onToggleCategoryActive(row.original)}
              />
              <AdminTableIconAction
                label="Delete"
                icon={Trash2}
                tone="danger"
                onClick={() => setPendingDeleteCategory(row.original)}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  const entriesBody = () => {
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
          title="Could not load waitlist"
          description={getApiErrorMessage(
            listQuery.error,
            "The waitlist could not be loaded.",
          )}
          action={
            <Button type="button" variant="outline" onClick={listQuery.refetch}>
              Try again
            </Button>
          }
        />
      );
    }
    if (entries.length === 0) {
      return (
        <EmptyState
          icon={ClipboardList}
          title="No waitlist entries yet"
          description="Submissions from the public waitlist form will appear here."
        />
      );
    }
    return (
      <DataTableCommon
        columns={entryColumns}
        data={entryPage.pageRows}
        totalDataCount={entryPage.totalDataCount}
        onFetchData={entryPage.onFetchData}
        fillViewport={false}
        className="min-h-0 flex-1"
        emptyMessage="No waitlist entries match your filters."
      />
    );
  };

  const categoriesBody = () => {
    if (categoriesQuery.isLoading) {
      return (
        <div className="flex min-h-48 flex-1 items-center justify-center">
          <Spinner />
        </div>
      );
    }
    if (categoriesQuery.isError) {
      return (
        <EmptyState
          icon={AlertCircle}
          variant="error"
          title="Could not load campaign categories"
          description={getApiErrorMessage(
            categoriesQuery.error,
            "The campaign category list could not be loaded.",
          )}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={categoriesQuery.refetch}
            >
              Try again
            </Button>
          }
        />
      );
    }
    if (categories.length === 0) {
      return (
        <EmptyState
          icon={Tags}
          title="No campaign categories yet"
          description="Create categories for the public waitlist campaign dropdown."
          action={
            <AdminGoldButton type="button" onClick={openCreateCategory}>
              <Plus className="size-4" />
              Add category
            </AdminGoldButton>
          }
        />
      );
    }
    return (
      <DataTableCommon
        columns={categoryColumns}
        data={categoryPage.pageRows}
        totalDataCount={categoryPage.totalDataCount}
        onFetchData={categoryPage.onFetchData}
        fillViewport={false}
        className="min-h-0 flex-1"
        emptyMessage="No campaign categories match your filters."
      />
    );
  };

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Waitlist"
        subtitle="Manage pre-access waitlist submissions and the campaign categories shown on the public form."
        actions={
          mainTab === "campaigns" ? (
            <AdminGoldButton type="button" onClick={openCreateCategory}>
              <Plus className="size-4" />
              Add category
            </AdminGoldButton>
          ) : null
        }
      />

      <Tabs
        value={mainTab}
        onValueChange={(value) => {
          setMainTab(value as MainTab);
          setSearch("");
        }}
        className="mt-4 flex min-h-0 flex-1 flex-col gap-2"
      >
        <TabsList>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign categories</TabsTrigger>
        </TabsList>

        <TabsContent
          value="entries"
          className="mt-0 flex min-h-0 flex-1 flex-col gap-0"
        >
          <AdminTableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search name, email, campaign, or message…"
            resultCount={filteredEntries.length}
            endSlot={
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as StatusFilter)
                }
              >
                <SelectTrigger className="h-11 w-full sm:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <div className={ADMIN_TABLE_SLOT}>{entriesBody()}</div>
        </TabsContent>

        <TabsContent
          value="campaigns"
          className="mt-0 flex min-h-0 flex-1 flex-col gap-0"
        >
          <AdminTableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search label, slug, or description…"
            resultCount={filteredCategories.length}
            endSlot={
              <Select
                value={activeFilter}
                onValueChange={(value) =>
                  setActiveFilter(value as ActiveFilter)
                }
              >
                <SelectTrigger className="h-11 w-full sm:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <div className={ADMIN_TABLE_SLOT}>{categoriesBody()}</div>
        </TabsContent>
      </Tabs>

      <WaitlistFormDrawer
        open={entryDrawerOpen}
        onOpenChange={(open) => {
          setEntryDrawerOpen(open);
          if (!open) setEditingEntryId(null);
        }}
        entryId={editingEntryId}
      />
      <WaitlistCampaignCategoryFormDrawer
        open={categoryDrawerOpen}
        onOpenChange={(open) => {
          setCategoryDrawerOpen(open);
          if (!open) setEditingCategoryId(null);
        }}
        mode={categoryDrawerMode}
        categoryId={editingCategoryId}
      />

      <DialogCommon
        open={Boolean(pendingDeleteEntry)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteEntry(null);
        }}
        title="Delete waitlist entry?"
        description={
          pendingDeleteEntry
            ? `Remove “${pendingDeleteEntry.name}” (${pendingDeleteEntry.email}) from the waitlist?`
            : undefined
        }
        confirmLabel="Delete"
        confirmLoading={deleteEntryState.isLoading}
        onConfirm={onConfirmDeleteEntry}
      />
      <DialogCommon
        open={Boolean(pendingDeleteCategory)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteCategory(null);
        }}
        title="Delete campaign category?"
        description={
          pendingDeleteCategory
            ? `Delete “${pendingDeleteCategory.label}”? Categories still used by waitlist entries cannot be deleted.`
            : undefined
        }
        confirmLabel="Delete"
        confirmLoading={deleteCategoryState.isLoading}
        onConfirm={onConfirmDeleteCategory}
      />
    </section>
  );
}
