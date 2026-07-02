import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ActiveCampaignCard,
  EmptyFirstGoalCard,
  LearnHighlightSection,
  MarketingBadge,
  NavyHeroCard,
  QuickActionsCard,
  RewardsSummaryCard,
} from "@/components/member/app";
import { useAuth } from "@/context/AuthContext";
import {
  getFirstName,
  getTimeGreeting,
  getTodayLabel,
} from "@/lib/app/greeting";
import { useDashboard } from "@/hooks/queries/useDashboard";
import { LEARN_ITEMS } from "@/utils/constants";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-40 rounded-panel" />
        <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          <Skeleton className="h-72 rounded-panel" />
          <Skeleton className="h-72 rounded-panel" />
        </div>
      </div>
    );
  }

  const campaign = data?.campaign;
  const percent = campaign
    ? Math.round((campaign.saved / campaign.target) * 100)
    : 0;
  const recommendations = LEARN_ITEMS.slice(0, 3);
  const firstName = getFirstName(user?.name ?? "there");

  return (
    <div className="space-y-5">
      <NavyHeroCard>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-[280px]">
            <span className="mb-2 block text-[13.5px] font-semibold text-white/72">
              {getTodayLabel()}
            </span>
            <Typography
              variant="h2"
              className="text-[30px] font-bold tracking-tight text-white"
            >
              {getTimeGreeting(firstName)}
            </Typography>
            <Typography
              variant="body"
              className="mt-2.5 max-w-[440px] text-[15.5px] leading-relaxed text-white/82"
            >
              You&apos;re making steady progress. Here&apos;s where things stand
              today.
            </Typography>
          </div>
          <MarketingBadge />
        </div>
      </NavyHeroCard>

      <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="flex flex-col gap-5">
          {data?.hasCampaign && campaign ? (
            <ActiveCampaignCard campaign={campaign} percent={percent} />
          ) : (
            <EmptyFirstGoalCard />
          )}
          <LearnHighlightSection items={recommendations} />
        </div>

        <div className="flex flex-col gap-5">
          <RewardsSummaryCard balance={data?.rewards.balance ?? 0} />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
