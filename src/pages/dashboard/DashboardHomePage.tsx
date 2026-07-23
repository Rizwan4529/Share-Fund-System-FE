import { Link } from "react-router-dom";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  MarketingBadge,
} from "@/components/member/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/queries/useDashboard";
import { foundingStatusLabel } from "@/lib/auth/roles";
import { getFirstName, getTimeGreeting } from "@/lib/app/greeting";
import { ROUTES } from "@/utils/constants";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const greeting = getTimeGreeting(getFirstName(user?.name ?? "there"));

  if (isLoading || !data) {
    return (
      <AppPageContainer>
        <Skeleton className="h-40 w-full rounded-xl" />
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h2">{greeting}</Typography>
          <Typography variant="body" className="mt-1 text-muted-foreground">
            Your BMIS participant home — planning projections only in Phase 1.
          </Typography>
        </div>
        <MarketingBadge
          title={foundingStatusLabel(user?.foundingStatus ?? "none")}
          subtitle={
            user?.foundingStatus === "none"
              ? "Enroll to unlock Success Centers"
              : "Planning projections only — funding not live"
          }
        />
      </div>

      <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
        {data.projectionDisclaimer}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AppSurfaceCard className="p-5 lg:col-span-2">
          <Typography variant="label">Selected Success Centers</Typography>
          {data.selectedCenters.length === 0 ? (
            <Typography variant="body" className="mt-3 text-muted-foreground">
              None selected yet.{" "}
              {data.centerLimit > 0 ? (
                <Link
                  to={ROUTES.SUCCESS_CENTERS}
                  className="font-semibold underline"
                >
                  Choose up to {data.centerLimit}
                </Link>
              ) : (
                <Link to={ROUTES.ENROLLMENT} className="font-semibold underline">
                  Enroll to unlock selection
                </Link>
              )}
            </Typography>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.selectedCenters.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-semibold"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </AppSurfaceCard>

        <AppSurfaceCard className="p-5">
          <Typography variant="label">Founding status</Typography>
          <Typography variant="h3" className="mt-2">
            {foundingStatusLabel(user?.foundingStatus ?? "none")}
          </Typography>
          <Typography variant="caption" className="mt-2 block text-muted-foreground">
            Center limit: {data.centerLimit || "—"}
          </Typography>
          <GoldButton asChild className="mt-4 w-full" size="sm">
            <Link to={ROUTES.ENROLLMENT}>Enrollment</Link>
          </GoldButton>
        </AppSurfaceCard>

        <AppSurfaceCard className="p-5">
          <Typography variant="label">Projected planning budget</Typography>
          <Typography variant="h3" className="mt-2">
            {budget != null ? `$${budget.toLocaleString()}` : "—"}
          </Typography>
          <Typography variant="caption" className="mt-2 block text-muted-foreground">
            Simulation / projection
          </Typography>
        </AppSurfaceCard>

        <AppSurfaceCard className="p-5">
          <Typography variant="label">Projected timeline</Typography>
          <Typography variant="h3" className="mt-2">
            {timeline != null ? `${timeline} months` : "—"}
          </Typography>
          <Typography variant="caption" className="mt-2 block text-muted-foreground">
            Simulation / projection
          </Typography>
        </AppSurfaceCard>

        <AppSurfaceCard className="p-5">
          <Typography variant="label">Questionnaire</Typography>
          <Typography variant="body" className="mt-2">
            {data.questionnaireComplete ? "Complete" : "Not complete"}
          </Typography>
          <GoldButton asChild className="mt-4 w-full" size="sm" variant="outline">
            <Link to={ROUTES.QUESTIONNAIRE}>
              {data.questionnaireComplete ? "Review answers" : "Start questionnaire"}
            </Link>
          </GoldButton>
        </AppSurfaceCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AppSurfaceCard className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h3">Enrollment history</Typography>
            <Link to={ROUTES.BILLING} className="text-sm font-semibold underline">
              Billing
            </Link>
          </div>
          {data.enrollments.length === 0 ? (
            <Typography variant="body" className="text-muted-foreground">
              No enrollments yet.
            </Typography>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.enrollments.slice(0, 5).map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between gap-2 border-b border-border py-2 last:border-0"
                >
                  <span className="capitalize">
                    {e.plan.replaceAll("_", " ")}
                  </span>
                  <span>
                    ${e.amount} · {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AppSurfaceCard>

        <AppSurfaceCard className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h3">Recent payments</Typography>
            <Link
              to={ROUTES.RECOMMENDATION}
              className="text-sm font-semibold underline"
            >
              Projections
            </Link>
          </div>
          {data.payments.length === 0 ? (
            <Typography variant="body" className="text-muted-foreground">
              No payments yet.
            </Typography>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.payments.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between gap-2 border-b border-border py-2 last:border-0"
                >
                  <span>{p.receiptNumber}</span>
                  <span>
                    ${p.amount} · {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AppSurfaceCard>
      </div>
    </AppPageContainer>
  );
}
