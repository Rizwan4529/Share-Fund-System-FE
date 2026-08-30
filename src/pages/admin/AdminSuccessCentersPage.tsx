import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  LayoutGrid,
  Pencil,
  Plus,
  Power,
  PowerOff,
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
  SuccessCenterCategoryFormDrawer,
  SuccessCenterProgramFormDrawer,
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
import { categoryNameById } from "../../lib/success-centers/labels";
import {
  useDeleteSuccessCenterCategoryMutation,
  useDeleteSuccessCenterProgramMutation,
  useListSuccessCenterCategoriesQuery,
  useListSuccessCenterProgramsQuery,
  useUpdateSuccessCenterCategoryMutation,
  useUpdateSuccessCenterProgramMutation,
} from "../../store/api/successCentersApi";
import type {
  SuccessCenterCategory,
  SuccessCenterCategoryStatus,
  SuccessCenterProgram,
  SuccessCenterProgramStatus,
} from "../../types/successCenters";

type MainTab = "categories" | "programs";
type DrawerMode = "create" | "edit";
type CategoryStatusFilter = "all" | SuccessCenterCategoryStatus;
type ProgramStatusFilter = "all" | SuccessCenterProgramStatus;

export default function AdminSuccessCentersPage() {
  const [mainTab, setMainTab] = useState<MainTab>("categories");
  const [search, setSearch] = useState("");
  const [categoryStatusFilter, setCategoryStatusFilter] =
    useState<CategoryStatusFilter>("all");
  const [programStatusFilter, setProgramStatusFilter] =
    useState<ProgramStatusFilter>("all");
  const [programCategoryFilter, setProgramCategoryFilter] =
    useState<string>("all");

  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [categoryDrawerMode, setCategoryDrawerMode] =
    useState<DrawerMode>("create");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [pendingDeleteCategory, setPendingDeleteCategory] =
    useState<SuccessCenterCategory | null>(null);

  const [programDrawerOpen, setProgramDrawerOpen] = useState(false);
  const [programDrawerMode, setProgramDrawerMode] =
    useState<DrawerMode>("create");
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [pendingDeleteProgram, setPendingDeleteProgram] =
    useState<SuccessCenterProgram | null>(null);

  const categoriesQuery = useListSuccessCenterCategoriesQuery();
  const programsQuery = useListSuccessCenterProgramsQuery();
  const [updateCategory] = useUpdateSuccessCenterCategoryMutation();
  const [deleteCategory, deleteCategoryState] =
    useDeleteSuccessCenterCategoryMutation();
  const [updateProgram] = useUpdateSuccessCenterProgramMutation();
  const [deleteProgram, deleteProgramState] =
    useDeleteSuccessCenterProgramMutation();

  const categories = categoriesQuery.data ?? [];
  const programs = programsQuery.data ?? [];

  const programCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const program of programs) {
      const key = String(program.categoryId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [programs]);

  const filteredCategories = useMemo(() => {
    const byStatus =
      categoryStatusFilter === "all"
        ? categories
        : categories.filter((c) => c.status === categoryStatusFilter);
    return filterRowsBySearch(
      byStatus,
      search,
      (c) => `${c.name} ${c.slug} ${c.description ?? ""} ${c.status}`,
    );
  }, [categories, categoryStatusFilter, search]);

  const filteredPrograms = useMemo(() => {
    let rows = programs;
    if (programStatusFilter !== "all") {
      rows = rows.filter((p) => p.status === programStatusFilter);
    }
    if (programCategoryFilter !== "all") {
      rows = rows.filter(
        (p) => String(p.categoryId) === programCategoryFilter,
      );
    }
    return filterRowsBySearch(
      rows,
      search,
      (p) =>
        `${p.name} ${p.description ?? ""} ${p.status} ${p.programType} ${categoryNameById(categories, String(p.categoryId))}`,
    );
  }, [
    programs,
    programStatusFilter,
    programCategoryFilter,
    search,
    categories,
  ]);

  const categoryPage = useClientTablePage(filteredCategories);
  const programPage = useClientTablePage(filteredPrograms);

  const openCreateCategory = () => {
    setCategoryDrawerMode("create");
    setEditingCategoryId(null);
    setCategoryDrawerOpen(true);
  };

  const openEditCategory = (category: SuccessCenterCategory) => {
    setCategoryDrawerMode("edit");
    setEditingCategoryId(category._id);
    setCategoryDrawerOpen(true);
  };

  const openCreateProgram = () => {
    setProgramDrawerMode("create");
    setEditingProgramId(null);
    setProgramDrawerOpen(true);
  };

  const openEditProgram = (program: SuccessCenterProgram) => {
    setProgramDrawerMode("edit");
    setEditingProgramId(program._id);
    setProgramDrawerOpen(true);
  };

  const onToggleCategory = async (category: SuccessCenterCategory) => {
    const status = category.status === "active" ? "inactive" : "active";
    try {
      await updateCategory({ id: category._id, status }).unwrap();
      toast.success(
        status === "active" ? "Category activated." : "Category deactivated.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update category."));
    }
  };

  const onConfirmDeleteCategory = async () => {
    if (!pendingDeleteCategory) return;
    try {
      await deleteCategory(pendingDeleteCategory._id).unwrap();
      toast.success("Category deleted.");
      setPendingDeleteCategory(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete category."));
    }
  };

  const onCycleProgramStatus = async (program: SuccessCenterProgram) => {
    const status =
      program.status === "published" ? "inactive" : "published";
    try {
      await updateProgram({ id: program._id, status }).unwrap();
      toast.success(
        status === "published"
          ? "Program published."
          : "Program set inactive.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update program."));
    }
  };

  const onConfirmDeleteProgram = async () => {
    if (!pendingDeleteProgram) return;
    try {
      await deleteProgram(pendingDeleteProgram._id).unwrap();
      toast.success("Program deleted.");
      setPendingDeleteProgram(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete program."));
    }
  };

  const categoryColumns = useMemo<ColumnDef<SuccessCenterCategory>[]>(
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
        accessorKey: "slug",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Slug" />
        ),
      },
      {
        accessorKey: "order",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Order" />
        ),
        enableSorting: true,
      },
      {
        id: "programs",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Programs" />
        ),
        cell: ({ row }) =>
          programCountByCategory.get(row.original._id) ?? 0,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        cell: ({ row }) => <AdminStatusPill status={row.original.status} />,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => {
          const active = row.original.status === "active";
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
                onClick={() => void onToggleCategory(row.original)}
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
    [programCountByCategory],
  );

  const programColumns = useMemo<ColumnDef<SuccessCenterProgram>[]>(
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
        id: "category",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Category" />
        ),
        cell: ({ row }) =>
          categoryNameById(categories, String(row.original.categoryId)),
      },
      {
        accessorKey: "programType",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Type" />
        ),
        cell: ({ row }) => row.original.programType,
      },
      {
        accessorKey: "order",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Order" />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        cell: ({ row }) => <AdminStatusPill status={row.original.status} />,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => {
          const published = row.original.status === "published";
          return (
            <div className="flex justify-end gap-1">
              <AdminTableIconAction
                label="Edit"
                icon={Pencil}
                tone="info"
                onClick={() => openEditProgram(row.original)}
              />
              <AdminTableIconAction
                label={published ? "Set inactive" : "Publish"}
                icon={published ? PowerOff : Power}
                tone={published ? "danger" : "success"}
                onClick={() => void onCycleProgramStatus(row.original)}
              />
              <AdminTableIconAction
                label="Delete"
                icon={Trash2}
                tone="danger"
                onClick={() => setPendingDeleteProgram(row.original)}
              />
            </div>
          );
        },
      },
    ],
    [categories],
  );

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
          title="Could not load categories"
          description={getApiErrorMessage(
            categoriesQuery.error,
            "The category list could not be loaded.",
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
          icon={LayoutGrid}
          title="No categories yet"
          description="Create the first Success Center category."
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
        emptyMessage="No categories match your filters."
      />
    );
  };

  const programsBody = () => {
    if (programsQuery.isLoading) {
      return (
        <div className="flex min-h-48 flex-1 items-center justify-center">
          <Spinner />
        </div>
      );
    }
    if (programsQuery.isError) {
      return (
        <EmptyState
          icon={AlertCircle}
          variant="error"
          title="Could not load programs"
          description={getApiErrorMessage(
            programsQuery.error,
            "The program list could not be loaded.",
          )}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={programsQuery.refetch}
            >
              Try again
            </Button>
          }
        />
      );
    }
    if (programs.length === 0) {
      return (
        <EmptyState
          icon={LayoutGrid}
          title="No programs yet"
          description="Create a program under an existing category."
          action={
            <AdminGoldButton
              type="button"
              onClick={openCreateProgram}
              disabled={categories.length === 0}
            >
              <Plus className="size-4" />
              Add program
            </AdminGoldButton>
          }
        />
      );
    }
    return (
      <DataTableCommon
        columns={programColumns}
        data={programPage.pageRows}
        totalDataCount={programPage.totalDataCount}
        onFetchData={programPage.onFetchData}
        fillViewport={false}
        className="min-h-0 flex-1"
        emptyMessage="No programs match your filters."
      />
    );
  };

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Success Centers"
        subtitle="Manage Success Center categories and specialized programs. Active categories and published programs appear for participants."
        actions={
          mainTab === "categories" ? (
            <AdminGoldButton type="button" onClick={openCreateCategory}>
              <Plus className="size-4" />
              Add category
            </AdminGoldButton>
          ) : (
            <AdminGoldButton
              type="button"
              onClick={openCreateProgram}
              disabled={categories.length === 0}
            >
              <Plus className="size-4" />
              Add program
            </AdminGoldButton>
          )
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
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>

        <TabsContent
          value="categories"
          className="mt-0 flex min-h-0 flex-1 flex-col gap-0"
        >
          <AdminTableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search name, slug, or status…"
            resultCount={filteredCategories.length}
            endSlot={
              <Select
                value={categoryStatusFilter}
                onValueChange={(value) =>
                  setCategoryStatusFilter(value as CategoryStatusFilter)
                }
              >
                <SelectTrigger className="h-11 w-full sm:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <div className={ADMIN_TABLE_SLOT}>{categoriesBody()}</div>
        </TabsContent>

        <TabsContent
          value="programs"
          className="mt-0 flex min-h-0 flex-1 flex-col gap-0"
        >
          <AdminTableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search program, category, or status…"
            resultCount={filteredPrograms.length}
            endSlot={
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Select
                  value={programCategoryFilter}
                  onValueChange={setProgramCategoryFilter}
                >
                  <SelectTrigger className="h-11 w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={programStatusFilter}
                  onValueChange={(value) =>
                    setProgramStatusFilter(value as ProgramStatusFilter)
                  }
                >
                  <SelectTrigger className="h-11 w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_development">
                      In development
                    </SelectItem>
                    <SelectItem value="coming_soon">Coming soon</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />
          <div className={ADMIN_TABLE_SLOT}>{programsBody()}</div>
        </TabsContent>
      </Tabs>

      <SuccessCenterCategoryFormDrawer
        open={categoryDrawerOpen}
        onOpenChange={setCategoryDrawerOpen}
        mode={categoryDrawerMode}
        categoryId={editingCategoryId}
      />
      <SuccessCenterProgramFormDrawer
        open={programDrawerOpen}
        onOpenChange={setProgramDrawerOpen}
        mode={programDrawerMode}
        programId={editingProgramId}
        defaultCategoryId={
          programCategoryFilter === "all" ? null : programCategoryFilter
        }
      />

      <DialogCommon
        open={Boolean(pendingDeleteCategory)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteCategory(null);
        }}
        title="Delete category?"
        description={
          pendingDeleteCategory
            ? `Delete “${pendingDeleteCategory.name}”? Categories with programs cannot be deleted.`
            : undefined
        }
        confirmLabel="Delete"
        confirmLoading={deleteCategoryState.isLoading}
        onConfirm={onConfirmDeleteCategory}
      />
      <DialogCommon
        open={Boolean(pendingDeleteProgram)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteProgram(null);
        }}
        title="Delete program?"
        description={
          pendingDeleteProgram
            ? `Delete “${pendingDeleteProgram.name}”? This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        confirmLoading={deleteProgramState.isLoading}
        onConfirm={onConfirmDeleteProgram}
      />
    </section>
  );
}
