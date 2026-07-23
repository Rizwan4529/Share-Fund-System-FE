import { useQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";

import {
  AdminPageHeader,
  AdminStatusPill,
  AdminSurfaceCard,
  AdminTableScroll,
  adminTableHeaderClass,
  adminTableRowClass,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminMarketing } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

export default function AdminMarketingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-marketing"],
    queryFn: fetchAdminMarketing,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  return (
    <div className="min-w-0 animate-fade-up">
      <AdminPageHeader
        title="Marketing"
        subtitle="Centralized marketing support SFS runs on members' behalf."
      />

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <AdminSurfaceCard key={kpi.label} className="p-[18px]">
            <Typography variant="label" className="text-[12.5px] font-semibold text-[#7386a8]">
              {kpi.label}
            </Typography>
            <Typography variant="h4" className="mt-2 font-display text-[25px] font-bold text-ink-heading">
              {kpi.value}
            </Typography>
            <Typography variant="caption" className="mt-1.5 text-[#93a3c2]">
              {kpi.sub}
            </Typography>
          </AdminSurfaceCard>
        ))}
      </div>

      <AdminSurfaceCard className="mb-4 min-w-0 w-full">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
            Active efforts
          </Typography>
          <span className="rounded-full bg-bg-card px-2.5 py-0.5 text-[11.5px] font-bold text-[#7386a8]">
            High-level view
          </span>
        </div>
        <AdminTableScroll minWidth="640px">
        <div
          className={cn(
            adminTableHeaderClass,
            "grid-cols-[2fr_1fr_1fr_1fr_1fr]",
          )}
        >
          <span>Effort</span>
          <span>Channel</span>
          <span>Reach</span>
          <span>Results</span>
          <span>Status</span>
        </div>
        {data.efforts.map((effort) => (
          <div
            key={effort.name}
            className={cn(
              adminTableRowClass,
              "grid-cols-[2fr_1fr_1fr_1fr_1fr]",
            )}
          >
            <Typography variant="label" className="text-[13.5px] font-semibold text-[#1a2c4e]">
              {effort.name}
            </Typography>
            <Typography variant="body-sm" className="text-muted-soft">
              {effort.channel}
            </Typography>
            <Typography variant="body-sm" className="text-[#33425f]">
              {effort.reach}
            </Typography>
            <Typography variant="label" className="font-semibold text-[#2f8f66]">
              {effort.results}
            </Typography>
            <AdminStatusPill status={effort.status} />
          </div>
        ))}
        </AdminTableScroll>
      </AdminSurfaceCard>

      <div className="flex items-center gap-3 rounded-lg border border-[#e0e7f1] bg-[#eef2f8] px-5 py-4">
        <Megaphone className="size-[18px] text-[#7386a8]" />
        <Typography variant="body-sm" className="text-[13px] leading-relaxed text-muted-soft">
          Marketing mechanics are still being defined. This surface stays high-level and flexible
          until the toolset is finalized.
        </Typography>
      </div>
    </div>
  );
}
