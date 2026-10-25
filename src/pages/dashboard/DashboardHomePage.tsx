import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Target, Wallet } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
  StatusChip,
} from "@/components/member/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/queries/useDashboard";
import {
  AccessStatusCard,
  MyProgramsCard,
  RecentPaymentsCard,
} from "@/components/member/ParticipantStatusCards";
import { foundingAccessState } from "@/lib/auth/roles";
import { AFFORDABILITY_LABELS } from "@/lib/recommendations/engine";
import { getFirstName, getTimeGreeting } from "@/lib/app/greeting";
import { useGetMySuccessProfileQuery } from "@/store/api/successProfileApi";
import { ROUTES } from "@/utils/constants";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const { data: successProfile } = useGetMySuccessProfileQuery();
  const profileCompletion = successProfile?.completionPercentage ?? 0;
  const profileSubmitted = successProfile?.status === "complete";
  const greeting = getTimeGreeting(getFirstName(user?.name ?? "there"));
  const enrolled = (user?.foundingStatus ?? "none") !== "none";

  if (isLoading || !data) {
    return (
      <AppPageContainer>
        <Skeleton className="mb-6 h-16 w-full max-w-md rounded-xl" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-panel lg:col-span-2" />
          <Skeleton className="h-40 rounded-panel" />
        </div>
      </AppPageContainer>
    );
  }

  const budget =
    data.recommendation?.adjustedBudget ??
    data.recommendation?.recommendedBudget;
  const timeline =
    data.recommendation?.adjustedTimelineMonths ??
    data.recommendation?.projectedTimelineMonths;

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Participant home"
        title={greeting}
        subtitle="BMIS planning dashboard — projections only in Phase 1."
        actions={
          <StatusChip tone={enrolled ? "success" : "muted"}>
            {foundingAccessState(user?.foundingStatus ?? "none")}
          </StatusChip>
        }
      />

      <InfoCallout className="mb-6">{data.projectionDisclaimer}</InfoCallout>

      <div className="grid gap-4 lg:grid-cols-3">
        <MyProgramsCard className="lg:col-span-2" />

        <AccessStatusCard />

        <MetricCard
          label="Projected budget"
          value={budget != null ? `$${budget.toLocaleString()}` : "—"}
          hint={
            data.recommendation
              ? AFFORDABILITY_LABELS[data.recommendation.affordability]
              : "Simulation"
          }
          icon={<Wallet className="size-4 text-info" />}
        />
        <MetricCard
          label="Projected timeline"
          value={timeline != null ? `${timeline} mo` : "—"}
          hint="Simulation"
          icon={<Target className="size-4 text-info" />}
        />
        <AppSurfaceCard>
          <SectionLabel tone="info">Success Profile</SectionLabel>
          <Typography
            as="p"
            variant="h5"
            className="mt-3 font-display text-[22px] font-bold text-ink-heading"
          >
            {profileCompletion}%
          </Typography>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <GoldButton
            asChild
            className="mt-4 w-full"
            variant={profileSubmitted ? "ghost-outline" : "gold"}
          >
            <Link to={ROUTES.QUESTIONNAIRE}>
              {profileSubmitted
                ? "Review Success Profile"
                : "Complete Success Profile"}
            </Link>
          </GoldButton>
        </AppSurfaceCard>
      </div>

      <RecentPaymentsCard className="mt-4" />
    </AppPageContainer>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <AppSurfaceCard>
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel tone="info">{label}</SectionLabel>
        {icon}
      </div>
      <Typography
        as="p"
        variant="h5"
        className="font-display text-[22px] font-bold text-ink-heading"
      >
        {value}
      </Typography>
      <Typography variant="caption" className="mt-1.5 block text-muted-soft">
        {hint}
      </Typography>
    </AppSurfaceCard>
  );
}
