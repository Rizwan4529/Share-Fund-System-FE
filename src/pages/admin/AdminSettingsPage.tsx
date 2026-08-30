import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Pencil, Plus, SlidersHorizontal, Tags } from "lucide-react";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminGhostButton,
  AdminGoldButton,
  AdminPageHeader,
  AdminTableIconAction,
  AdminTableToolbar,
  SettingCategoryManageDrawer,
  SettingFormDrawer,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/LoadingScreen";
import { Tabs, TabsList, TabsTrigger } from "@/components/common/TabsCommon";
import { Button } from "@/components/ui/button";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  formatSettingDate,
  formatSettingValue,
  settingCategoryLabel,
} from "@/lib/settings/value";
import {
  useGetSettingsByCategoryQuery,
  useListSettingCategoriesQuery,
  useListSettingsQuery,
} from "@/store/api/settingsApi";
import type { Setting } from "@/types/settings";

type CategoryFilter = "all" | string;
type DrawerMode = "create" | "edit";

export default function AdminSettingsPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  const categoriesQuery = useListSettingCategoriesQuery();
  const categories = categoriesQuery.data ?? [];

  useEffect(() => {
    if (categoryFilter === "all" || !categoriesQuery.isSuccess) return;
    const exists = categories.some((category) => category.slug === categoryFilter);
    if (!exists) setCategoryFilter("all");
  }, [categoryFilter, categories, categoriesQuery.isSuccess]);

  const listQuery = useListSettingsQuery(undefined, {
    skip: categoryFilter !== "all",
  });
  const categoryQuery = useGetSettingsByCategoryQuery(categoryFilter, {
    skip: categoryFilter === "all",
  });

  const activeQuery = categoryFilter === "all" ? listQuery : categoryQuery;
  const settings = activeQuery.data ?? [];

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        settings,
        search,
        (setting) =>
          `${setting.key} ${setting.description ?? ""} ${setting.category}`,
      ),
    [settings, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const openCreate = () => {
    setDrawerMode("create");
    setEditingKey(null);
    setDrawerOpen(true);
  };

  const openEdit = (setting: Setting) => {
    setDrawerMode("edit");
    setEditingKey(setting.key);
    setDrawerOpen(true);
  };

  const columns = useMemo<ColumnDef<Setting>[]>(
    () => [
      {
        accessorKey: "key",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Key"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold break-all text-ink-heading">
            {row.original.key}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Category" />
        ),
        cell: ({ row }) =>
          settingCategoryLabel(row.original.category, categories),
        enableSorting: true,
      },
      {
        accessorKey: "dataType",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Data type" />
        ),
        enableSorting: true,
      },
      {
        id: "value",
        accessorFn: (row) => formatSettingValue(row.value),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Value" />
        ),
        cell: ({ row }) => (
          <span className="block max-w-xs truncate font-mono text-xs">
            {formatSettingValue(row.original.value)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "effectiveDate",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Effective date" />
        ),
        cell: ({ row }) => formatSettingDate(row.original.effectiveDate),
        enableSorting: true,
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Updated at" />
        ),
        cell: ({ row }) => formatSettingDate(row.original.updatedAt),
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
    [categories],
  );

  const tableBody = () => {
    if (activeQuery.isLoading) {
      return (
        <div className="flex min-h-48 flex-1 items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (activeQuery.isError) {
      return (
        <EmptyState
          icon={AlertCircle}
          variant="error"
          title="Could not load settings"
          description={getApiErrorMessage(
            activeQuery.error,
            "The settings list could not be loaded.",
          )}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={activeQuery.refetch}
            >
              Try again
            </Button>
          }
        />
      );
    }

    if (settings.length === 0) {
      return (
        <EmptyState
          icon={SlidersHorizontal}
          title="No settings yet"
          description={
            categoryFilter === "all"
              ? "Create the first platform setting to get started."
              : `No settings in ${settingCategoryLabel(categoryFilter, categories)}.`
          }
          action={
            <AdminGoldButton type="button" onClick={openCreate}>
              <Plus className="size-4" />
              Add setting
            </AdminGoldButton>
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
        emptyMessage="No settings match your search."
      />
    );
  };

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Settings"
        subtitle="Manage versioned platform settings. Changes are recorded in each setting’s history."
        actions={
          <>
            <AdminGhostButton
              type="button"
              className="gap-1.5"
              onClick={() => setManageOpen(true)}
            >
              <Tags className="size-4" />
              Manage categories
            </AdminGhostButton>
            <AdminGoldButton type="button" onClick={openCreate}>
              <Plus className="size-4" />
              Add setting
            </AdminGoldButton>
          </>
        }
      />

      <Tabs
        value={categoryFilter}
        onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
        className="mt-4 gap-2"
      >
        <TabsList className="flex h-auto flex-wrap gap-x-4 gap-y-0">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category._id} value={category.slug}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search key, description, or category…"
        resultCount={filtered.length}
      />

      <div className={ADMIN_TABLE_SLOT}>{tableBody()}</div>

      <SettingFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        settingKey={editingKey}
      />
      <SettingCategoryManageDrawer
        open={manageOpen}
        onOpenChange={setManageOpen}
      />
    </section>
  );
}
