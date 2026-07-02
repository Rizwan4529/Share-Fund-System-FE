import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { ActivityFeed } from "@/components/common/ActivityFeed";
import { GoldButton } from "@/components/common/GoldButton";
import { MilestoneTimeline } from "@/components/common/MilestoneTimeline";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Typography } from "@/components/common/Typography";
import {
  AppSurfaceCard,
  NavyHeroCard,
} from "@/components/member/app";
import { getCategoryIcon } from "@/lib/app/categoryIcons";
import {
  formatCurrency,
  formatTimelineLabel,
} from "@/lib/app/greeting";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDashboard } from "@/hooks/queries/useDashboard";
import { ROUTES, getCategoryLabel } from "@/utils/constants";
import { ASSETS } from "@/utils/assets";

export default function DashboardProgressPage() {
  const { data, isLoading } = useDashboard();
  const [activityLoading, setActivityLoading] = useState(false);
  const qc = useQueryClient();

  const campaign = data?.campaign;
  const percent = campaign
    ? Math.round((campaign.saved / campaign.target) * 100)
    : 0;

  const handleRefresh = async () => {
    setActivityLoading(true);
    await qc.invalidateQueries({ queryKey: ["dashboard"] });
    setTimeout(() => setActivityLoading(false), 600);
  };

  if (!campaign && !isLoading) {
    return (
      <div className="text-center">
        <Typography variant="h4">No active campaign</Typography>
        <GoldButton className="mt-4" asChild>
          <Link to={ROUTES.CAMPAIGNS}>Browse campaigns</Link>
        </GoldButton>
      </div>
    );
  }

  const Icon = getCategoryIcon(campaign?.cat ?? "");

  return (
    <div className="mx-auto max-w-[1120px]">
      <Link
        to={ROUTES.DASHBOARD}
        className="mb-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-muted-soft"
      >
        <ArrowLeft className="size-[17px]" strokeWidth={2.2} />
        Back to dashboard
      </Link>

      <NavyHeroCard padding="lg" className="shadow-app-hero-lg">
        <img
          src={ASSETS.worldWhite}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-[-30px] w-[400px] -translate-y-1/2 opacity-[0.12]"
        />
        <div className="relative flex flex-wrap items-center gap-9">
          <ProgressRing
            percent={percent}
            preset="lg"
            variant="dark"
            subLabel="toward goal"
          />
          <div className="min-w-0 flex-1 lg:min-w-[260px]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-gold/34 bg-gold/13">
                <Icon className="size-5 text-gold" strokeWidth={1.9} />
              </span>
              <span className="text-[13px] font-semibold text-white/72">
                {getCategoryLabel(campaign?.cat ?? "")} · Started{" "}
                {campaign?.started}
              </span>
            </div>
            <Typography
              variant="h2"
              className="text-[32px] font-bold tracking-tight text-white"
            >
              {campaign?.name}
            </Typography>
            <div className="mt-5 flex flex-wrap gap-7">
              {[
                { label: "Progress", value: formatCurrency(campaign?.saved ?? 0) },
                { label: "Goal", value: formatCurrency(campaign?.target ?? 0) },
                {
                  label: "Timeline",
                  value: formatTimelineLabel(Number(campaign?.timeline ?? 0)),
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="mb-0.5 text-[12.5px] text-white/62">{label}</div>
                  <div className="font-display text-xl font-bold text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </NavyHeroCard>

      <div className="mt-[22px] grid items-start gap-[22px] lg:grid-cols-2">
        <AppSurfaceCard className="rounded-[14px] shadow-[0_16px_40px_-30px_rgba(12,31,68,0.4)]">
          <Typography
            variant="h4"
            className="mb-5 text-[19px] font-bold tracking-tight text-ink-heading"
          >
            Milestones
          </Typography>
          <MilestoneTimeline items={data?.milestones ?? []} />
        </AppSurfaceCard>

        <div className="flex flex-col gap-[22px]">
          <ActivityFeed
            title="Activity"
            items={data?.activity ?? []}
            isLoading={activityLoading}
            onRefresh={() => void handleRefresh()}
          />
          <div className="rounded-[14px] border border-border-gold bg-gradient-to-br from-bg-gold to-bg-gold-alt px-7 py-6">
            <Typography
              variant="h5"
              className="text-base font-bold text-ink-heading"
            >
              Keep it moving
            </Typography>
            <Typography
              variant="body-sm"
              className="mt-1.5 mb-4 text-[13.5px] leading-relaxed text-[#6a5f38]"
            >
              Log an update, adjust your target, or explore guides tied to this
              goal.
            </Typography>
            <div className="flex flex-wrap gap-2.5">
              <GoldButton size="app" className="px-[18px] py-[11px] text-[13.5px]">
                Log an update
              </GoldButton>
              <GoldButton
                variant="ghost-outline"
                size="sm"
                className="rounded-md border-[#e0d3a8] bg-white/50 px-[18px] py-[11px] text-[13.5px] text-[#6a5f38] hover:bg-white/85"
                asChild
              >
                <Link to={ROUTES.LEARN}>Related guides</Link>
              </GoldButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
