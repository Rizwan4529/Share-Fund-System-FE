import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  LayoutGrid,
  Receipt,
  Target,
  Wallet,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
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
import { foundingStatusLabel } from "@/lib/auth/roles";
import { getFirstName, getTimeGreeting } from "@/lib/app/greeting";
import { ROUTES } from "@/utils/constants";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
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
            {foundingStatusLabel(user?.foundingStatus ?? "none")}
          </StatusChip>
        }
      />

      <InfoCallout className="mb-6">{data.projectionDisclaimer}</InfoCallout>

      <div className="grid gap-4 lg:grid-cols-3">
        <AppSurfaceCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-2">
            <SectionLabel tone="info">Selected Success Centers</SectionLabel>
            <LayoutGrid className="size-4 text-info" />
          </div>
          {data.selectedCenters.length === 0 ? (
            <EmptyState
              icon={LayoutGrid}
              size="compact"
              variant="muted"
              title="No Success Centers selected"
              description={
                data.centerLimit > 0
                  ? `Your plan allows up to ${data.centerLimit}. Pick the categories that match your goal.`
                  : "Enroll as a Founding Participant to unlock selection."
              }
              action={
                <GoldButton asChild size="app">
                  <Link
                    to={
                      data.centerLimit > 0
                        ? ROUTES.SUCCESS_CENTERS
                        : ROUTES.ENROLLMENT
                    }
                  >
                    {data.centerLimit > 0 ? "Choose centers" : "Enroll now"}
                  </Link>
                </GoldButton>
              }
            />
          ) : (
            <ul className="space-y-2">
              {data.selectedCenters.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-bg-card px-3.5 py-2.5 text-sm font-semibold text-ink-heading"
                >
                  {c.name}
                  <StatusChip tone="info">Active</StatusChip>
                </li>
              ))}
            </ul>
          )}
        </AppSurfaceCard>

        <AppSurfaceCard>
          <SectionLabel tone="navy">Founding status</SectionLabel>
          <Typography
            as="p"
            variant="h5"
            className="mt-3 font-display text-[20px] font-bold text-ink-heading"
          >
            {foundingStatusLabel(user?.foundingStatus ?? "none")}
          </Typography>
          <Typography variant="caption" className="mt-2 block text-muted-soft">
            Center limit: {data.centerLimit || "—"}
          </Typography>
          <GoldButton asChild className="mt-5 w-full">
            <Link to={ROUTES.ENROLLMENT}>
              {enrolled ? "Manage enrollment" : "Enroll now"}
            </Link>
          </GoldButton>
        </AppSurfaceCard>

        <MetricCard
          label="Projected budget"
          value={budget != null ? `$${budget.toLocaleString()}` : "—"}
          hint="Simulation"
          icon={<Wallet className="size-4 text-info" />}
        />
        <MetricCard
          label="Projected timeline"
          value={timeline != null ? `${timeline} mo` : "—"}
          hint="Simulation"
          icon={<Target className="size-4 text-info" />}
        />
        <AppSurfaceCard>
          <SectionLabel tone="info">Questionnaire</SectionLabel>
          <Typography variant="body-sm" className="mt-3 text-ink-heading">
            {data.questionnaireComplete ? "Complete" : "Not started"}
          </Typography>
          <GoldButton
            asChild
            className="mt-5 w-full"
            variant={data.questionnaireComplete ? "ghost-outline" : "gold"}
          >
            <Link to={ROUTES.QUESTIONNAIRE}>
              {data.questionnaireComplete ? "Review answers" : "Start questionnaire"}
            </Link>
          </GoldButton>
        </AppSurfaceCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AppSurfaceCard>
          <div className="mb-4 flex items-center justify-between">
            <SectionLabel tone="navy">Enrollment history</SectionLabel>
            <Link
              to={ROUTES.BILLING}
              className="text-xs font-bold text-info hover:underline"
            >
              Billing
            </Link>
          </div>
          {data.enrollments.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              size="compact"
              variant="muted"
              title="No enrollments yet"
              description="Your Founding Participant plans will show up here after checkout."
            />
          ) : (
            <ul className="space-y-2 text-sm">
              {data.enrollments.slice(0, 5).map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between gap-2 border-b border-line py-2.5 last:border-0"
                >
                  <span className="capitalize text-ink-heading">
                    {e.plan.replaceAll("_", " ")}
                  </span>
                  <span className="text-muted-soft">
                    ${e.amount} · {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AppSurfaceCard>

        <AppSurfaceCard>
          <div className="mb-4 flex items-center justify-between">
            <SectionLabel tone="navy">Recent payments</SectionLabel>
            <Link
              to={ROUTES.RECOMMENDATION}
              className="text-xs font-bold text-info hover:underline"
            >
              Projections
            </Link>
          </div>
          {data.payments.length === 0 ? (
            <EmptyState
              icon={Receipt}
              size="compact"
              variant="muted"
              title="No payments yet"
              description="Receipts and refund windows appear here after a successful enrollment."
            />
          ) : (
            <ul className="space-y-2 text-sm">
              {data.payments.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between gap-2 border-b border-line py-2.5 last:border-0"
                >
                  <span className="text-ink-heading">{p.receiptNumber}</span>
                  <span className="text-muted-soft">
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
