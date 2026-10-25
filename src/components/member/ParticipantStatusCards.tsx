import { Link } from "react-router-dom";
import { LayoutGrid, ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import { AppSurfaceCard, SectionLabel, StatusChip } from "@/components/member/app";
import type { StatusChipTone } from "@/components/member/app";
import { PaymentHistoryList } from "@/components/payments/PaymentHistoryList";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useGetMyStatusQuery } from "@/store/api/meApi";
import type { ParticipantStatus } from "@/types/participantStatus";
import { ROUTES, activationPlanPath } from "@/utils/constants";

const ACCOUNT_LABELS: Record<ParticipantStatus["accountStatus"], { label: string; tone: StatusChipTone }> = {
  active: { label: "Active", tone: "success" },
  pending_verification: { label: "Email not verified", tone: "gold" },
  suspended: { label: "Suspended", tone: "gold" },
  closed: { label: "Closed", tone: "muted" },
};

function StatusLoading() {
  return (
    <div className="flex min-h-24 items-center justify-center">
      <Spinner />
    </div>
  );
}

function StatusError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <EmptyState
      icon={ShieldCheck}
      variant="error"
      size="compact"
      title="Could not load your status"
      description={getApiErrorMessage(error, "Please try again.")}
      action={
        <Button type="button" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}

/** Founder standing, planning access and account state (real data). */
export function AccessStatusCard() {
  const query = useGetMyStatusQuery();
  const status = query.data;

  return (
    <AppSurfaceCard>
      <SectionLabel tone="navy">Your access</SectionLabel>
      {query.isLoading ? (
        <StatusLoading />
      ) : query.isError || !status ? (
        <StatusError error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <>
          <Typography
            as="p"
            variant="h5"
            className="mt-3 font-display text-[20px] font-bold text-ink-heading"
          >
            {status.founder.statusLabel}
          </Typography>
          <dl className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Typography as="dt" variant="caption" color="muted">
                Planning access
              </Typography>
              <dd>
                <StatusChip tone={status.planningAccessStatus === "active" ? "success" : "muted"}>
                  {status.planningAccessStatus === "active" ? "Active" : "Not active"}
                </StatusChip>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Typography as="dt" variant="caption" color="muted">
                Account
              </Typography>
              <dd>
                <StatusChip tone={ACCOUNT_LABELS[status.accountStatus].tone}>
                  {ACCOUNT_LABELS[status.accountStatus].label}
                </StatusChip>
              </dd>
            </div>
          </dl>
          <GoldButton
            asChild
            className="mt-5 w-full"
            variant={status.planningAccessStatus === "active" ? "ghost-outline" : "gold"}
          >
            <Link to={ROUTES.ENROLLMENT}>
              {status.planningAccessStatus === "active" ? "Manage Founding Access" : "Get Founding Access"}
            </Link>
          </GoldButton>
        </>
      )}
    </AppSurfaceCard>
  );
}

/** The participant's active program selections and each one's activation. */
export function MyProgramsCard({ className }: { className?: string }) {
  const query = useGetMyStatusQuery();
  const selections = query.data?.selections ?? [];

  return (
    <AppSurfaceCard className={className}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <SectionLabel tone="info">My programs</SectionLabel>
        <Link to={ROUTES.MY_SELECTIONS} className="text-xs font-bold text-info hover:underline">
          Manage
        </Link>
      </div>
      {query.isLoading ? (
        <StatusLoading />
      ) : query.isError ? (
        <StatusError error={query.error} onRetry={() => void query.refetch()} />
      ) : selections.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          size="compact"
          variant="muted"
          title="No programs selected yet"
          description="Browse Success Centers and activate a program you want to plan for."
          action={
            <GoldButton asChild size="app">
              <Link to={ROUTES.SUCCESS_CENTERS}>Browse Success Centers</Link>
            </GoldButton>
          }
        />
      ) : (
        <ul className="space-y-2">
          {selections.map((selection) => (
            <li key={selection._id}>
              <Link
                to={activationPlanPath(selection._id)}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg-card px-3.5 py-2.5 hover:border-gold-chip"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink-heading">
                    {selection.programName ?? "Program"}
                  </span>
                  <span className="block text-xs text-muted-soft">{selection.categoryName}</span>
                </span>
                <StatusChip tone={selection.activationStatus === "paid" ? "success" : "muted"}>
                  {selection.programType === "planning"
                    ? "Planning only"
                    : selection.activationStatus === "paid"
                      ? "Activation paid"
                      : "Not activated"}
                </StatusChip>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppSurfaceCard>
  );
}

/** Recent payments (reuses the billing history list). */
export function RecentPaymentsCard({ className }: { className?: string }) {
  return (
    <AppSurfaceCard className={className}>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel tone="navy">Payment &amp; enrollment history</SectionLabel>
        <Link to={ROUTES.BILLING} className="text-xs font-bold text-info hover:underline">
          View all
        </Link>
      </div>
      <PaymentHistoryList limit={5} />
    </AppSurfaceCard>
  );
}
