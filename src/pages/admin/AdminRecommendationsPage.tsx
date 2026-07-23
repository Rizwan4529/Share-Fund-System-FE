import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminPageHeader,
  AdminTableIconAction,
  AdminTableToolbar,
} from "@/components/admin";
import { DialogCommon } from "@/components/common/DialogCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { Input } from "@/components/ui/input";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import { fetchAdminRecommendations } from "@/lib/api/admin";
import { reviewRecommendation } from "@/lib/api/recommendations";
import type { Recommendation } from "@/types";

export default function AdminRecommendationsPage() {
  const [rows, setRows] = useState<Recommendation[]>([]);
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState<Recommendation | null>(null);
  const [drafts, setDrafts] = useState<
    Record<string, { budget: string; months: string }>
  >({});

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        rows,
        search,
        (r) =>
          `${r.userName} ${r.status} ${r.recommendedBudget} ${r.projectedTimelineMonths}`,
      ),
    [rows, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const reload = () => void fetchAdminRecommendations().then(setRows);
  useEffect(() => {
    reload();
  }, []);

  const act = async (
    id: string,
    status: "approved" | "adjusted" | "rejected",
  ) => {
    const d = drafts[id];
    await reviewRecommendation(id, {
      status,
      adjustedBudget:
        status === "adjusted" && d?.budget ? Number(d.budget) : null,
      adjustedTimelineMonths:
        status === "adjusted" && d?.months ? Number(d.months) : null,
      notes:
        status === "adjusted"
          ? "Manually adjusted by administrator."
          : undefined,
    });
    toast.success(`Recommendation ${status}.`);
    reload();
  };

  const columns = useMemo<ColumnDef<Recommendation>[]>(
    () => [
      {
        accessorKey: "userName",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Participant"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {row.original.userName}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "recommendedBudget",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Budget (proj.)"
          />
        ),
        cell: ({ row }) => {
          const r = row.original;
          return (
            <>
              ${r.recommendedBudget.toLocaleString()}
              {r.adjustedBudget != null
                ? ` → $${r.adjustedBudget.toLocaleString()}`
                : ""}
            </>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "projectedTimelineMonths",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Timeline (proj.)"
          />
        ),
        cell: ({ row }) => {
          const r = row.original;
          return (
            <>
              {r.projectedTimelineMonths} mo
              {r.adjustedTimelineMonths != null
                ? ` → ${r.adjustedTimelineMonths} mo`
                : ""}
            </>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.status}</span>
        ),
        enableSorting: true,
      },
      {
        id: "adjust",
        enableSorting: false,
        header: () => <span>Adjust</span>,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex items-center gap-2">
              <Input
                className="h-9 w-24"
                placeholder="Budget"
                value={drafts[r.id]?.budget ?? ""}
                onChange={(e) =>
                  setDrafts((d) => ({
                    ...d,
                    [r.id]: {
                      budget: e.target.value,
                      months: d[r.id]?.months ?? "",
                    },
                  }))
                }
              />
              <Input
                className="h-9 w-20"
                placeholder="Months"
                value={drafts[r.id]?.months ?? ""}
                onChange={(e) =>
                  setDrafts((d) => ({
                    ...d,
                    [r.id]: {
                      budget: d[r.id]?.budget ?? "",
                      months: e.target.value,
                    },
                  }))
                }
              />
            </div>
          );
        },
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
                label="Approve"
                icon={Check}
                tone="success"
                onClick={() => void act(r.id, "approved")}
              />
              <AdminTableIconAction
                label="Apply adjustment"
                icon={SlidersHorizontal}
                tone="info"
                onClick={() => {
                  if (!drafts[r.id]?.budget && !drafts[r.id]?.months) {
                    toast.error("Enter budget and/or months to adjust.");
                    return;
                  }
                  void act(r.id, "adjusted");
                }}
              />
              <AdminTableIconAction
                label="Reject"
                icon={X}
                tone="danger"
                onClick={() => setRejectTarget(r)}
              />
            </div>
          );
        },
      },
    ],
    [drafts],
  );

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Recommendations"
        subtitle="Review, approve, or manually adjust projected figures (simulations)."
      />
      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search participant or status…"
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
          emptyMessage="No recommendations yet."
        />
      </div>

      <DialogCommon
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        title="Reject this recommendation?"
        description={
          rejectTarget
            ? `Projection for ${rejectTarget.userName} will be marked rejected.`
            : undefined
        }
        confirmLabel="Reject"
        confirmVariant="destructive"
        onConfirm={async () => {
          if (!rejectTarget) return;
          await act(rejectTarget.id, "rejected");
          setRejectTarget(null);
        }}
      />
    </section>
  );
}
