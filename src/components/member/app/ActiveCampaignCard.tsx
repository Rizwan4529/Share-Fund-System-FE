import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Typography } from "@/components/common/Typography";
import { AppSurfaceCard } from "@/components/member/app/AppSurfaceCard";
import { SectionLabel } from "@/components/member/app/SectionLabel";
import { getCategoryIcon } from "@/lib/app/categoryIcons";
import {
  formatCurrency,
  formatTimelineLabel,
} from "@/lib/app/greeting";
import { ROUTES, getCategoryLabel } from "@/utils/constants";
import type { ActiveCampaign } from "@/types";

type ActiveCampaignCardProps = {
  campaign: ActiveCampaign;
  percent: number;
};

export function ActiveCampaignCard({ campaign, percent }: ActiveCampaignCardProps) {
  const Icon = getCategoryIcon(campaign.cat);

  return (
    <AppSurfaceCard className="overflow-hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-5">
        <SectionLabel>Your active campaign</SectionLabel>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#cbe8d4] bg-success-bg px-2.5 py-1 text-[12.5px] font-bold text-success">
          Active
        </span>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-7">
        <ProgressRing
          percent={percent}
          preset="md"
          variant="light"
          subLabel="of goal"
          className="mx-auto sm:mx-0"
        />
        <div className="w-full min-w-0 flex-1 text-center sm:text-left">
          <div className="mb-1.5 flex items-center justify-center gap-3 sm:justify-start">
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-lg border border-border-gold bg-bg-icon">
              <Icon className="size-[18px] text-gold-dark" strokeWidth={1.9} />
            </span>
            <span className="text-[13px] font-semibold text-[#8496b7]">
              {getCategoryLabel(campaign.cat)}
            </span>
          </div>
          <Typography
            variant="h3"
            className="text-xl font-bold tracking-tight text-ink-heading sm:text-[23px]"
          >
            {campaign.name}
          </Typography>
          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1">
            <span className="font-display text-xl font-bold text-ink-heading sm:text-[22px]">
              {formatCurrency(campaign.saved)}
            </span>
            <span className="text-sm text-[#8496b7]">
              of {formatCurrency(campaign.target)} ·{" "}
              {formatTimelineLabel(Number(campaign.timeline))}
            </span>
          </div>
          <GoldButton size="app" className="mt-4 w-full sm:w-auto" asChild>
            <Link to={ROUTES.DASHBOARD_PROGRESS}>
              View progress
              <ArrowRight className="size-[15px]" strokeWidth={2.3} />
            </Link>
          </GoldButton>
        </div>
      </div>
    </AppSurfaceCard>
  );
}

export function EmptyFirstGoalCard() {
  return (
    <div className="relative overflow-hidden rounded-panel border border-dashed border-[#d3dcea] bg-white px-5 py-9 text-center sm:px-10 sm:py-11">
      <div className="mx-auto mb-5 flex size-[66px] items-center justify-center rounded-panel border border-border-gold bg-gradient-to-br from-[#fdf6e6] to-[#faf0d8] shadow-[0_16px_36px_-18px_rgba(207,159,52,0.5)]">
        <Star className="size-8 text-gold-dark" strokeWidth={1.7} />
      </div>
      <Typography
        variant="h3"
        className="text-2xl font-bold tracking-tight text-ink-heading"
      >
        Let&apos;s set your first goal.
      </Typography>
      <Typography
        variant="body"
        color="muted"
        className="mx-auto mt-3 max-w-[420px] text-[15.5px] leading-relaxed"
      >
        You don&apos;t have an active campaign yet. Choose the category that
        matches your goal and we&apos;ll set up tracking, guidance, and rewards
        around it.
      </Typography>
      <GoldButton size="app" className="mt-6 px-7" asChild>
        <Link to={ROUTES.CAMPAIGNS}>
          Choose a category
          <ArrowRight className="size-4" strokeWidth={2.3} />
        </Link>
      </GoldButton>
    </div>
  );
}
