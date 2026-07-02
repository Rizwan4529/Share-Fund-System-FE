import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

import {
  AdminCategoryBars,
  AdminDualAreaChart,
  AdminFunnelChart,
  AdminGhostButton,
  AdminKpiCard,
  AdminPageHeader,
  AdminSurfaceCard,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminShell } from "@/context/AdminShellContext";
import { fetchAdminAnalytics } from "@/lib/api/admin";
import { ADMIN_RANGE_LABELS } from "@/utils/constants";

export default function AdminAnalyticsPage() {
  const { range } = useAdminShell();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics", range],
    queryFn: () => fetchAdminAnalytics(range),
  });

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  return (
    <div className="min-w-0 animate-fade-up">
      <AdminPageHeader
        title="Analytics & market data"
        subtitle={`Whether the platform and its marketing are working · ${ADMIN_RANGE_LABELS[range]}`}
        actions={
          <AdminGhostButton>
            <Download className="size-4" />
            Export report
          </AdminGhostButton>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <AdminKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendUp={kpi.trendUp}
          />
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <AdminSurfaceCard className="p-5">
          <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
            Signups & waitlist over time
          </Typography>
          <Typography variant="caption" className="mb-1 text-[#8496b7]">
            Registrations vs. early-access waitlist carried over from launch
          </Typography>
          <div className="mb-2 flex gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-soft">
              <span className="size-2.5 rounded-[3px] bg-gold-dark" />
              Signups
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-soft">
              <span className="size-2.5 rounded-[3px] bg-[#3f5580]" />
              Waitlist
            </span>
          </div>
          <AdminDualAreaChart signups={data.signups} waitlist={data.waitlist} />
        </AdminSurfaceCard>

        <AdminSurfaceCard className="p-5">
          <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
            Conversion funnel
          </Typography>
          <Typography variant="caption" className="mb-3.5 text-[#8496b7]">
            Visitor → activated member
          </Typography>
          <AdminFunnelChart data={data.funnel} />
        </AdminSurfaceCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminSurfaceCard className="p-5">
          <Typography variant="label" className="mb-3.5 font-display text-base font-bold text-ink-heading">
            Category interest
          </Typography>
          <AdminCategoryBars data={data.categories} />
        </AdminSurfaceCard>

        <AdminSurfaceCard className="p-5">
          <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
            Acquisition channels
          </Typography>
          <Typography variant="caption" className="mb-3.5 text-[#8496b7]">
            Signups by source with conversion rate
          </Typography>
          {data.channels.map((channel) => (
            <div
              key={channel.name}
              className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-2.5 border-b border-[#f2f5fa] py-2.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-[3px]"
                  style={{ backgroundColor: channel.color }}
                />
                <Typography variant="label" className="text-[13.5px] font-semibold text-[#22314f]">
                  {channel.name}
                </Typography>
              </div>
              <Typography variant="body-sm" className="text-right text-[#33425f]">
                {channel.visitors}
              </Typography>
              <Typography variant="label" className="text-right font-semibold text-[#2f8f66]">
                {channel.conv}
              </Typography>
            </div>
          ))}
        </AdminSurfaceCard>
      </div>
    </div>
  );
}
