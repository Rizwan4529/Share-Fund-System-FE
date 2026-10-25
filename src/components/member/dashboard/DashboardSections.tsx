import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CreditCard, LayoutGrid, Receipt } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppSurfaceCard, SectionLabel, StatusChip } from "@/components/member/app";
import { PaymentStatusChip } from "@/components/payments/PaymentParts";
import {
  AFFORDABILITY_MESSAGES,
  PLAN_LABELS,
  PROJECTION_FALLBACK_NOTICE,
  PROJECTION_UNAVAILABLE,
  formatProjectionDate,
} from "@/lib/activation/labels";
import { formatCurrency } from "@/lib/app/greeting";
import {
  ACCOUNT_STATUS_CHIPS,
  DASHBOARD_COPY,
  ENROLLMENT_STATUS_CHIPS,
  formatDashboardDate,
} from "@/lib/dashboard/labels";
import { founderPlanNameLabel } from "@/lib/founder-plans/labels";
import { PAYMENT_PURPOSE_LABELS } from "@/lib/payments/labels";
import type { OptionProjection } from "@/types/activation";
import type {
  DashboardEnrollment,
  DashboardRecommendation,
  ParticipantDashboard,
} from "@/types/dashboard";
import {
  ROUTES,
  activationPlanPath,
  paymentDetailPath,
} from "@/utils/constants";

// Display only: every figure below comes straight from GET /me/dashboard.

function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <SectionLabel tone="info">{title}</SectionLabel>
      {action}
    </div>
  );
}

function CardLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-xs font-bold text-info hover:underline">
      {children}
    </Link>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <Typography as="dt" variant="caption" color="muted">
        {label}
      </Typography>
      <Typography as="dd" variant="caption" className="text-right font-semibold text-ink-heading">
        {value}
      </Typography>
    </div>
  );
}

/* --- Status summary --- */

export function StatusSummary({ dashboard }: { dashboard: ParticipantDashboard }) {
  const { participant, planningAccess, successProfile } = dashboard;
  const account = ACCOUNT_STATUS_CHIPS[participant.accountStatus];
  const completion = successProfile?.completionPercentage ?? 0;
  const profileComplete = successProfile?.status === "complete";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <AppSurfaceCard>
        <SectionLabel tone="navy">Participant status</SectionLabel>
        <Typography as="p" variant="h5" className="mt-3 font-display text-[20px] font-bold text-ink-heading">
          {participant.founder.statusLabel}
        </Typography>
        <div className="mt-3">
          <StatusChip tone={account.tone}>{account.label}</StatusChip>
        </div>
      </AppSurfaceCard>

      <AppSurfaceCard>
        <SectionLabel tone="navy">Planning Access</SectionLabel>
        <Typography as="p" variant="h5" className="mt-3 font-display text-[20px] font-bold text-ink-heading">
          {planningAccess.active ? "Active" : "Not Active"}
        </Typography>
        <Typography variant="caption" color="muted" className="mt-1.5 block">
          {planningAccess.active
            ? DASHBOARD_COPY.planningAccessActiveBody
            : DASHBOARD_COPY.planningAccessInactiveBody}
        </Typography>
        {planningAccess.active ? null : (
          <GoldButton asChild className="mt-4 w-full">
            <Link to={ROUTES.ENROLLMENT}>{DASHBOARD_COPY.getFundingAccess}</Link>
          </GoldButton>
        )}
      </AppSurfaceCard>

      <AppSurfaceCard>
        <SectionLabel tone="navy">Success Profile</SectionLabel>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <Typography as="p" variant="h5" className="font-display text-[20px] font-bold text-ink-heading">
            {completion}%
          </Typography>
          <StatusChip tone={profileComplete ? "success" : "muted"}>
            {profileComplete ? "Complete" : "Incomplete"}
          </StatusChip>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
        </div>
        <GoldButton
          asChild
          className="mt-4 w-full"
          variant={profileComplete ? "ghost-outline" : "gold"}
        >
          <Link to={ROUTES.QUESTIONNAIRE}>
            {profileComplete ? DASHBOARD_COPY.reviewProfile : DASHBOARD_COPY.completeProfile}
          </Link>
        </GoldButton>
      </AppSurfaceCard>
    </div>
  );
}

/* --- Selected Success Centers --- */

export function SelectedCentersCard({
  dashboard,
  className,
}: {
  dashboard: ParticipantDashboard;
  className?: string;
}) {
  const centers = dashboard.selectedCenters;
  const hasAccess = dashboard.planningAccess.active;

  return (
    <AppSurfaceCard className={className}>
      <CardHeader
        title="Selected Success Centers"
        action={centers.length ? <CardLink to={ROUTES.MY_SELECTIONS}>Manage</CardLink> : null}
      />
      {centers.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          size="compact"
          variant="muted"
          title={DASHBOARD_COPY.centersEmptyTitle}
          description={
            hasAccess ? DASHBOARD_COPY.centersEmptyWithAccess : DASHBOARD_COPY.centersEmptyNoAccess
          }
          action={
            <GoldButton asChild size="app">
              <Link to={hasAccess ? ROUTES.SUCCESS_CENTERS : ROUTES.ENROLLMENT}>
                {hasAccess ? "Browse Success Centers" : DASHBOARD_COPY.getFundingAccess}
              </Link>
            </GoldButton>
          }
        />
      ) : (
        <ul className="space-y-2">
          {centers.map((center) => (
            <li key={center._id}>
              <Link
                to={activationPlanPath(center._id)}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg-card px-3.5 py-2.5 hover:border-gold-chip"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink-heading">
                    {center.programName ?? "Program"}
                  </span>
                  <span className="block text-xs text-muted-soft">{center.categoryName}</span>
                </span>
                <StatusChip tone={center.activationStatus === "paid" ? "success" : "muted"}>
                  {center.programType === "planning"
                    ? "Planning only"
                    : center.activationStatus === "paid"
                      ? "Activation paid"
                      : center.hasRecommendation
                        ? "Plan ready"
                        : "Plan not calculated"}
                </StatusChip>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppSurfaceCard>
  );
}

/* --- Recommendation summary (budget + projected timeline) --- */

export function RecommendationSummaryCard({
  dashboard,
  className,
}: {
  dashboard: ParticipantDashboard;
  className?: string;
}) {
  const currency = dashboard.participant.preferredCurrency ?? undefined;
  const { recommendations } = dashboard;
  // Funding programs selected but not calculated yet (planning-only never need one).
  const uncalculated = dashboard.selectedCenters.filter(
    (center) => center.programType === "funding" && !center.hasRecommendation,
  );

  return (
    <AppSurfaceCard className={className}>
      <CardHeader title="BMIS recommendation" action={<StatusChip tone="gold">Estimated</StatusChip>} />
      {recommendations.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <EmptyBlock title="Projected budget" body={DASHBOARD_COPY.budgetEmpty} />
          <EmptyBlock title="Projected timeline" body={DASHBOARD_COPY.timelineEmpty} />
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <RecommendationItem
              key={recommendation.recommendationId}
              recommendation={recommendation}
              currency={currency}
            />
          ))}
          <Typography variant="caption" color="muted" className="block">
            {recommendations[0]?.projection?.notice ?? PROJECTION_FALLBACK_NOTICE}
          </Typography>
        </div>
      )}
      {uncalculated.length ? (
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {uncalculated.map((center) => (
            <li key={center._id} className="flex flex-wrap items-center justify-between gap-2">
              <Typography variant="body-sm" className="text-ink-heading">
                {center.programName ?? "Program"} — plan not calculated yet
              </Typography>
              <CardLink to={activationPlanPath(center._id)}>See my recommendation</CardLink>
            </li>
          ))}
        </ul>
      ) : null}
    </AppSurfaceCard>
  );
}

function EmptyBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-bg-card px-4 py-3.5">
      <Typography variant="label" className="text-ink-heading">
        {title}
      </Typography>
      <Typography variant="caption" color="muted" className="mt-1 block">
        {body}
      </Typography>
    </div>
  );
}

function RecommendationItem({
  recommendation,
  currency,
}: {
  recommendation: DashboardRecommendation;
  currency?: string;
}) {
  const message = AFFORDABILITY_MESSAGES[recommendation.affordabilityStatus];
  const featured = recommendation.featuredOption;
  const money = (value: number | null) => (value != null ? formatCurrency(value, currency) : "—");

  return (
    <div className="rounded-lg border border-line bg-bg-card px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <Typography variant="label" className="block text-ink-heading">
            {recommendation.programName ?? "Program"}
          </Typography>
          <Typography variant="caption" color="muted">
            {recommendation.categoryName}
          </Typography>
        </div>
        <StatusChip tone={message.tone}>{message.title}</StatusChip>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Typography variant="caption" color="muted" className="block">
            Projected budget · recommended activation
          </Typography>
          <Typography as="p" variant="h5" className="mt-1 font-display text-[22px] font-bold text-ink-heading">
            {money(recommendation.recommendedActivation)}
          </Typography>
          {recommendation.activationPercentage != null && recommendation.goalAmount != null ? (
            <Typography variant="caption" color="muted" className="block">
              Based on {recommendation.activationPercentage}% of your {money(recommendation.goalAmount)} goal
            </Typography>
          ) : null}
          {featured ? (
            <Typography variant="body-sm" className="mt-2 text-ink-heading">
              {PLAN_LABELS[featured.label]} plan: {money(featured.scheduledPayment)} / month for{" "}
              {featured.months} months
              <Typography as="span" variant="caption" color="muted">
                {featured.reason === "selected" ? " (your choice)" : " (fits your budget)"}
              </Typography>
            </Typography>
          ) : (
            <Typography variant="caption" color="muted" className="mt-2 block">
              {message.body}
            </Typography>
          )}
        </div>

        <ProjectedTimeline projection={featured?.projection ?? null} showActivationCompletion={Boolean(featured)} />
      </div>

      <div className="mt-4 flex justify-end">
        <GoldButton asChild size="sm" variant="ghost-outline">
          <Link to={activationPlanPath(recommendation.selectionId)}>View full recommendation</Link>
        </GoldButton>
      </div>
    </div>
  );
}

function ProjectedTimeline({
  projection,
  showActivationCompletion,
}: {
  projection: OptionProjection | null;
  showActivationCompletion: boolean;
}) {
  const range = projection?.estimatedFundingRange;
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Typography variant="caption" color="muted">
          Projected timeline
        </Typography>
        <StatusChip tone="gold">Estimated</StatusChip>
      </div>
      {projection?.status === "projected" ? (
        <dl className="mt-2 space-y-1.5">
          <Fact label="Eligible from" value={formatProjectionDate(projection.eligibilityDate)} />
          {showActivationCompletion ? (
            <Fact
              label="Activation completes"
              value={formatProjectionDate(projection.activationCompletionDate)}
            />
          ) : null}
          {range ? (
            <Fact
              label="Estimated funding range"
              value={`${formatProjectionDate(range.earliest)} – ${formatProjectionDate(range.latest)}`}
            />
          ) : null}
        </dl>
      ) : (
        <Typography variant="caption" color="muted" className="mt-2 block">
          {projection ? PROJECTION_UNAVAILABLE : "A projected timeline appears once a plan fits your budget."}
        </Typography>
      )}
    </div>
  );
}

/* --- Enrollment / Funding Access history --- */

const enrollmentTitle = (enrollment: DashboardEnrollment) =>
  enrollment.purpose === "founder_tier"
    ? `Founder plan · ${enrollment.founderPlanName ? founderPlanNameLabel(enrollment.founderPlanName) : "—"}`
    : `Funding Access · ${enrollment.label ?? "Plan"}`;

export function EnrollmentHistoryCard({
  dashboard,
  className,
}: {
  dashboard: ParticipantDashboard;
  className?: string;
}) {
  const enrollments = dashboard.enrollmentHistory;
  return (
    <AppSurfaceCard className={className}>
      <CardHeader title="Funding Access history" />
      {enrollments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          size="compact"
          variant="muted"
          title={DASHBOARD_COPY.enrollmentEmptyTitle}
          description={DASHBOARD_COPY.enrollmentEmptyBody}
        />
      ) : (
        <ul className="divide-y divide-line">
          {enrollments.map((enrollment) => {
            const chip = ENROLLMENT_STATUS_CHIPS[enrollment.status];
            return (
              <li key={enrollment._id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span className="min-w-0">
                  <Typography as="span" variant="body-sm" className="block font-semibold text-ink-heading">
                    {enrollmentTitle(enrollment)}
                  </Typography>
                  <Typography as="span" variant="caption" color="muted">
                    {formatDashboardDate(enrollment.purchasedAt)}
                    {enrollment.programAllowance != null
                      ? ` · ${enrollment.programAllowance} program${enrollment.programAllowance === 1 ? "" : "s"}`
                      : ""}
                  </Typography>
                </span>
                <span className="flex items-center gap-2">
                  {enrollment.amount != null ? (
                    <Typography as="span" variant="body-sm" className="font-semibold text-ink-heading">
                      {formatCurrency(enrollment.amount, enrollment.currency ?? undefined)}
                    </Typography>
                  ) : null}
                  <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </AppSurfaceCard>
  );
}

/* --- Recent payments --- */

export function RecentPaymentsCard({
  dashboard,
  className,
}: {
  dashboard: ParticipantDashboard;
  className?: string;
}) {
  const { recent, total } = dashboard.paymentHistory;
  return (
    <AppSurfaceCard className={className}>
      <CardHeader
        title="Recent payments"
        action={total ? <CardLink to={ROUTES.BILLING}>View all ({total})</CardLink> : null}
      />
      {recent.length === 0 ? (
        <EmptyState
          icon={Receipt}
          size="compact"
          variant="muted"
          title={DASHBOARD_COPY.paymentsEmptyTitle}
          description={DASHBOARD_COPY.paymentsEmptyBody}
        />
      ) : (
        <ul className="divide-y divide-line">
          {recent.map((payment) => (
            <li key={payment._id}>
              <Link
                to={paymentDetailPath(payment._id)}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5 hover:opacity-80"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <CreditCard className="size-4 shrink-0 text-muted-soft" />
                  <span className="min-w-0">
                    <Typography as="span" variant="body-sm" className="block truncate font-semibold text-ink-heading">
                      {payment.description ?? PAYMENT_PURPOSE_LABELS[payment.purpose]}
                    </Typography>
                    <Typography as="span" variant="caption" color="muted">
                      {formatDashboardDate(payment.date)}
                    </Typography>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Typography as="span" variant="body-sm" className="font-semibold text-ink-heading">
                    {formatCurrency(payment.amount, payment.currency)}
                  </Typography>
                  <PaymentStatusChip status={payment.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppSurfaceCard>
  );
}
