import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Wallet,
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
  FounderPlanFormDrawer,
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
  formatFundingCap,
  formatPlanPrice,
  founderPlanBmisLabel,
  founderPlanNameLabel,
  founderPlanPriorityLabel,
  includedProgramCount,
  programNames,
} from "@/lib/founder-plans/labels";
import {
  useListFounderPlansQuery,
  useToggleFounderPlanAvailabilityMutation,
} from "@/store/api/founderPlansApi";
import {
  FOUNDER_PLAN_NAMES,
  type FounderPlan,
} from "@/types/founderPlans";

type DrawerMode = "create" | "edit";

export default function AdminPricingPage() {
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const listQuery = useListFounderPlansQuery();
  const [toggleAvailability] = useToggleFounderPlanAvailabilityMutation();
  const plans = listQuery.data ?? [];
  const usedNames = plans.map((plan) => plan.name);
  const canCreate = usedNames.length < FOUNDER_PLAN_NAMES.length;

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        plans,
        search,
        (plan) =>
          `${founderPlanNameLabel(plan.name)} ${plan.name} ${plan.priorityLevel ?? ""} ${plan.bmisPlanningLevel ?? ""} ${plan.status}`,
      ),
    [plans, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const openCreate = () => {
    setDrawerMode("create");
    setEditingId(null);
    setDrawerOpen(true);
  };

  const openEdit = (plan: FounderPlan) => {
    setDrawerMode("edit");
    setEditingId(plan._id);
    setDrawerOpen(true);
  };

  const onToggle = async (plan: FounderPlan) => {
    const status = plan.status === "active" ? "inactive" : "active";
    try {
      await toggleAvailability({ id: plan._id, status }).unwrap();
      toast.success(
        status === "active"
          ? "Founder plan activated."
          : "Founder plan deactivated.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not update plan availability."),
      );
    }
  };

  const columns = useMemo<ColumnDef<FounderPlan>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Tier"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {founderPlanNameLabel(row.original.name)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Price" />
        ),
        cell: ({ row }) => formatPlanPrice(row.original.price),
        enableSorting: true,
      },
      {
        id: "included",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Included" />
        ),
        cell: ({ row }) => (
          <span className="block max-w-xs truncate" title={programNames(row.original.includedSuccessCenters)}>
            {includedProgramCount(row.original)} programs
          </span>
        ),
      },
      {
        id: "standardCap",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Standard cap" />
        ),
        cell: ({ row }) => formatFundingCap(row.original.fundingCap?.standard),
      },
      {
        id: "premiumCap",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Premium cap" />
        ),
        cell: ({ row }) => formatFundingCap(row.original.fundingCap?.premium),
      },
      {
        accessorKey: "priorityLevel",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Priority" />
        ),
        cell: ({ row }) => founderPlanPriorityLabel(row.original.priorityLevel),
      },
      {
        accessorKey: "bmisPlanningLevel",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="BMIS" />
        ),
        cell: ({ row }) => founderPlanBmisLabel(row.original.bmisPlanningLevel),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Availability" />
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
                onClick={() => openEdit(row.original)}
              />
              <AdminTableIconAction
                label={active ? "Deactivate" : "Activate"}
                icon={active ? PowerOff : Power}
                tone={active ? "danger" : "success"}
                onClick={() => void onToggle(row.original)}
              />
            </div>
          );
        },
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
          title="Could not load founder plans"
          description={getApiErrorMessage(
            listQuery.error,
            "The founder plan list could not be loaded.",
          )}
          action={
            <Button type="button" variant="outline" onClick={listQuery.refetch}>
              Try again
            </Button>
          }
        />
      );
    }

    if (plans.length === 0) {
      return (
        <EmptyState
          icon={Wallet}
          title="No founder plans yet"
          description="Create the Essential, Expanded, and Premium tiers, or run the database seed."
          action={
            <AdminGoldButton type="button" onClick={openCreate}>
              <Plus className="size-4" />
              Add founder plan
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
        emptyMessage="No founder plans match your search."
      />
    );
  };

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Pricing"
        subtitle="Configure founder plan prices, included programs, funding caps, and availability. Values come from the database, not hard-coded fees."
        actions={
          <AdminGoldButton
            type="button"
            onClick={openCreate}
            disabled={!canCreate}
          >
            <Plus className="size-4" />
            Add founder plan
          </AdminGoldButton>
        }
      />

      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search tier, priority, or availability…"
        resultCount={filtered.length}
      />

      <div className={ADMIN_TABLE_SLOT}>{tableBody()}</div>

      <FounderPlanFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        planId={editingId}
        usedNames={usedNames}
      />
    </section>
  );
}
