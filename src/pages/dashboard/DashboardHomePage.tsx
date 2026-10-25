import { LayoutDashboard } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import {
  AppPageContainer,
  InfoCallout,
  ParticipantPageHeader,
  StatusChip,
} from "@/components/member/app";
import {
  EnrollmentHistoryCard,
  RecentPaymentsCard,
  RecommendationSummaryCard,
  SelectedCentersCard,
  StatusSummary,
} from "@/components/member/dashboard/DashboardSections";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getFirstName, getTimeGreeting } from "@/lib/app/greeting";
import { DASHBOARD_COPY } from "@/lib/dashboard/labels";
import { useGetMyDashboardQuery } from "@/store/api/meApi";

/** Participant home: one GET /me/dashboard call feeds every section. */
export default function DashboardHomePage() {
  const { user } = useAuth();
  // Always refetch on visit so recent payments/recalculations show up.
  const query = useGetMyDashboardQuery(undefined, { refetchOnMountOrArgChange: true });
  const dashboard = query.data;
  const firstName = dashboard?.participant.firstName ?? getFirstName(user?.name ?? "there");

  const header = (
    <ParticipantPageHeader
      overline="Participant dashboard"
      title={getTimeGreeting(firstName)}
      subtitle={DASHBOARD_COPY.intro}
      actions={
        dashboard ? (
          <StatusChip tone={dashboard.participant.founder.status === "none" ? "muted" : "success"}>
            {dashboard.participant.founder.statusLabel}
          </StatusChip>
        ) : null
      }
    />
  );

  if (query.isError && !dashboard) {
    return (
      <AppPageContainer>
        {header}
        <EmptyState
          icon={LayoutDashboard}
          variant="error"
          title="We couldn't load your dashboard"
          description={getApiErrorMessage(query.error, "Please try again in a moment.")}
          action={
            <Button type="button" variant="outline" onClick={() => void query.refetch()}>
              Try again
            </Button>
          }
        />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      {header}
      <InfoCallout className="mb-6">{DASHBOARD_COPY.phase1Notice}</InfoCallout>

      {!dashboard ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-4">
          <StatusSummary dashboard={dashboard} />
          <div className="grid gap-4 lg:grid-cols-3">
            <RecommendationSummaryCard dashboard={dashboard} className="lg:col-span-2" />
            <SelectedCentersCard dashboard={dashboard} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <EnrollmentHistoryCard dashboard={dashboard} />
            <RecentPaymentsCard dashboard={dashboard} />
          </div>
        </div>
      )}
    </AppPageContainer>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-36 rounded-panel" />
        <Skeleton className="h-36 rounded-panel" />
        <Skeleton className="h-36 rounded-panel" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-56 rounded-panel lg:col-span-2" />
        <Skeleton className="h-56 rounded-panel" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-40 rounded-panel" />
        <Skeleton className="h-40 rounded-panel" />
      </div>
    </div>
  );
}
