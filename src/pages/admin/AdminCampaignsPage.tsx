import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Cog } from "lucide-react";
import { toast } from "sonner";

import {
  AdminGhostButton,
  AdminPageHeader,
  AdminSegmentedControl,
  AdminStatusPill,
  AdminSurfaceCard,
  AdminTableScroll,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminShell } from "@/context/AdminShellContext";
import { fetchAdminCampaigns } from "@/lib/api/admin";
import {
  ADMIN_CAT_FULL,
  ADMIN_CAT_LABELS,
  ADMIN_CAT_TOTALS,
} from "@/lib/mock/adminData";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "completed", label: "Completed" },
  { id: "draft", label: "Draft" },
];

export default function AdminCampaignsPage() {
  const { search } = useAdminShell();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: fetchAdminCampaigns,
  });

  const maxCat = Math.max(...Object.values(ADMIN_CAT_TOTALS));

  const campaigns = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.campaigns.filter((campaign) => {
      if (statusFilter !== "all" && campaign.status !== statusFilter) return false;
      if (categoryFilter !== "all" && campaign.cat !== categoryFilter) return false;
      if (!q) return true;
      return (
        campaign.name.toLowerCase().includes(q) ||
        campaign.owner.toLowerCase().includes(q)
      );
    });
  }, [data, statusFilter, categoryFilter, search]);

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  return (
    <div className="min-w-0 animate-fade-up">
      <AdminPageHeader
        title="Campaigns"
        subtitle={`Across all seven categories · ${data.campaigns.length} total`}
        actions={
          <AdminGhostButton
            className="w-full sm:w-auto"
            onClick={() => toast.message("Category management coming soon")}
          >
            <Cog className="size-4 shrink-0" />
            <span className="truncate">Manage categories</span>
          </AdminGhostButton>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {Object.keys(ADMIN_CAT_LABELS).map((id) => {
          const active = categoryFilter === id;
          const count = ADMIN_CAT_TOTALS[id] ?? 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCategoryFilter(active ? "all" : id)}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors sm:p-3.5",
                active
                  ? "border-gold-dark bg-[#fdf9ee]"
                  : "border-line bg-white hover:border-gold-chip",
              )}
            >
              <Typography variant="caption" className="truncate font-semibold text-muted-soft">
                {ADMIN_CAT_LABELS[id]}
              </Typography>
              <Typography variant="h4" className="mt-1 font-display font-bold text-ink-heading">
                {count.toLocaleString()}
              </Typography>
              <div className="mt-2 h-1 overflow-hidden rounded-[3px] bg-[#eef1f7]">
                <div
                  className={cn(
                    "h-full rounded-[3px]",
                    active
                      ? "bg-gradient-to-r from-gold-dark to-gold"
                      : "bg-[#c9d4e5]",
                  )}
                  style={{ width: `${(count / maxCat) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-3.5 flex min-w-0 w-full flex-col gap-2">
        <AdminSegmentedControl
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <Typography variant="label" className="text-[13px] font-semibold text-muted-soft">
          {categoryFilter === "all"
            ? "All categories"
            : `${ADMIN_CAT_FULL[categoryFilter]} only`}
        </Typography>
      </div>

      <AdminSurfaceCard className="min-w-0">
        <AdminTableScroll minWidth="720px">
        <div className="grid grid-cols-[2.2fr_1.2fr_1fr_1.6fr_1fr_40px] gap-3 border-b border-[#e9edf5] bg-bg-card px-5 py-3 text-[11.5px] font-bold tracking-[0.05em] text-[#8092b3] uppercase">
          <span>Campaign</span>
          <span>Owner</span>
          <span>Category</span>
          <span>Progress</span>
          <span>Status</span>
          <span />
        </div>
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            role="button"
            tabIndex={0}
            onClick={() => toast.message(`Campaign detail — ${campaign.name}`)}
            className="grid cursor-pointer grid-cols-[2.2fr_1.2fr_1fr_1.6fr_1fr_40px] items-center gap-3 border-b border-[#f2f5fa] px-5 py-3 transition-colors hover:bg-bg-card"
          >
            <div className="min-w-0">
              <Typography variant="label" className="truncate text-sm font-semibold text-[#1a2c4e]">
                {campaign.name}
              </Typography>
              <Typography variant="caption" className="text-[#93a3c2]">
                {campaign.started}
              </Typography>
            </div>
            <Typography variant="body-sm" className="text-[#33425f]">
              {campaign.owner}
            </Typography>
            <span className="inline-flex w-fit rounded-md bg-bg-card px-2 py-0.5 text-xs font-semibold text-[#4a5a7a]">
              {ADMIN_CAT_LABELS[campaign.cat]}
            </span>
            <div>
              <div className="mb-1 flex justify-between text-xs text-[#8496b7]">
                <span>{campaign.status === "draft" ? "Not started" : "Progress"}</span>
                <span className="font-bold text-[#33425f]">{campaign.pct}%</span>
              </div>
              <div className="h-[5px] overflow-hidden rounded-[3px] bg-[#eef1f7]">
                <div
                  className={cn(
                    "h-full rounded-[3px]",
                    campaign.status === "completed"
                      ? "bg-[#2b5299]"
                      : campaign.status === "paused"
                        ? "bg-gold-chip"
                        : "bg-gradient-to-r from-gold-dark to-gold",
                  )}
                  style={{ width: `${campaign.pct}%` }}
                />
              </div>
            </div>
            <AdminStatusPill status={campaign.status} />
            <ChevronRight className="size-4 justify-self-end text-[#c3cee0]" />
          </div>
        ))}
        </AdminTableScroll>
      </AdminSurfaceCard>
    </div>
  );
}
