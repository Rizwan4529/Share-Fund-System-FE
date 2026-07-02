import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Download,
  Flag,
  Gift,
  Layers,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  AdminGhostButton,
  AdminKpiCard,
  AdminPageHeader,
  AdminSignupChart,
  AdminSurfaceCard,
  AdminTrafficDonut,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminShell } from "@/context/AdminShellContext";
import { fetchAdminOverview } from "@/lib/api/admin";
import { ADMIN_RANGE_LABELS, ROUTES } from "@/utils/constants";

const KPI_ICONS = {
  members: Users,
  star: Star,
  campaigns: Layers,
  gift: Gift,
  flag: Flag,
};

const KPI_ICON_CLASS = {
  members: "bg-bg-icon text-[#8a6413]",
  star: "bg-info-bg text-[#2b5299]",
  campaigns: "bg-success-bg text-[#1f7a55]",
  gift: "bg-bg-icon text-[#8a6413]",
  flag: "bg-bg-card text-[#3f5580]",
};

const PENDING_ROUTES: Record<string, string> = {
  members: ROUTES.ADMIN_MEMBERS,
  campaigns: ROUTES.ADMIN_CAMPAIGNS,
  content: ROUTES.ADMIN_CONTENT,
  rewards: ROUTES.ADMIN_REWARDS,
};

const ACTIVITY_TONE_CLASS = {
  gold: "bg-bg-icon text-[#8a6413]",
  blue: "bg-info-bg text-[#2b5299]",
  green: "bg-success-bg text-[#1f7a55]",
  red: "bg-error-bg text-[#a2453b]",
};

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { range } = useAdminShell();
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-overview", range],
    queryFn: () => fetchAdminOverview(range),
  });

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        overline="Control room"
        title="Platform overview"
        subtitle={`Health of the platform for the ${ADMIN_RANGE_LABELS[range]}.`}
        actions={
          <AdminGhostButton>
            <Download className="size-4" />
            Export
          </AdminGhostButton>
        }
      />

      <div className="mb-4 grid grid-cols-5 gap-3.5">
        {data.kpis.map((kpi) => {
          const Icon = KPI_ICONS[kpi.icon];
          return (
            <AdminKpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              trendUp={kpi.trendUp}
              sub={kpi.sub}
              icon={<Icon className="size-4" />}
              iconClassName={KPI_ICON_CLASS[kpi.icon]}
            />
          );
        })}
      </div>

      <div className="mb-4 grid grid-cols-[1.6fr_1fr] gap-4">
        <AdminSurfaceCard className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
                Signups over time
              </Typography>
              <Typography variant="caption" className="text-[#8496b7]">
                New member registrations · {ADMIN_RANGE_LABELS[range]}
              </Typography>
            </div>
            <div className="text-right">
              <Typography variant="h4" className="font-display font-bold text-ink-heading">
                {data.signupTotal.toLocaleString()}
              </Typography>
              <Typography variant="caption" className="font-semibold text-[#2f8f66]">
                {data.signupTrend}
              </Typography>
            </div>
          </div>
          <AdminSignupChart data={data.signups} />
        </AdminSurfaceCard>

        <AdminSurfaceCard className="p-5">
          <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
            Traffic sources
          </Typography>
          <Typography variant="caption" className="mb-2 text-[#8496b7]">
            Where new members come from
          </Typography>
          <AdminTrafficDonut data={data.traffic} />
        </AdminSurfaceCard>
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] gap-4">
        <AdminSurfaceCard>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
              Recent activity
            </Typography>
            <AdminGhostButton
              className="h-8 px-2.5 text-[12.5px]"
              onClick={() => {
                void refetch();
                toast.success("Activity refreshed");
              }}
              disabled={isFetching}
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </AdminGhostButton>
          </div>
          <div>
            {data.activity.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 border-b border-[#f4f6fb] px-5 py-3"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-[9px] ${ACTIVITY_TONE_CLASS[item.tone]}`}
                >
                  <Star className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <Typography variant="body-sm" className="text-[13.5px] leading-snug text-[#22314f]">
                    {item.text}
                  </Typography>
                  <Typography variant="caption" className="text-[#93a3c2]">
                    {item.date}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </AdminSurfaceCard>

        <AdminSurfaceCard>
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Star className="size-[18px] text-[#9a6a15]" />
            <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
              Needs attention
            </Typography>
          </div>
          <div className="p-2">
            {data.pending.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(PENDING_ROUTES[item.route])}
                className="flex w-full items-center gap-3 rounded-[7px] border border-transparent p-3 text-left hover:bg-bg-card"
              >
                <span
                  className={`flex size-[34px] shrink-0 items-center justify-center rounded-lg font-display text-[15px] font-bold ${
                    item.tone === "gold"
                      ? "bg-[#f6ecd4] text-[#9a6a15]"
                      : item.tone === "blue"
                        ? "bg-info-bg text-[#2b5299]"
                        : item.tone === "danger"
                          ? "bg-error-bg text-[#a2453b]"
                          : "bg-bg-card text-muted-soft"
                  }`}
                >
                  {item.count}
                </span>
                <div className="flex-1">
                  <Typography variant="label" className="text-[13.5px] font-semibold text-[#22314f]">
                    {item.label}
                  </Typography>
                  <Typography variant="caption" className="text-[#93a3c2]">
                    {item.sub}
                  </Typography>
                </div>
                <ChevronRight className="size-4 text-[#c3cee0]" />
              </button>
            ))}
          </div>
        </AdminSurfaceCard>
      </div>
    </div>
  );
}
