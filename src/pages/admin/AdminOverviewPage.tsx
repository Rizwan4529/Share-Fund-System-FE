import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  DollarSign,
  LayoutGrid,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  AdminKpiCard,
  AdminPageHeader,
  AdminSectionTitle,
  AdminStatusPill,
  AdminSurfaceCard,
} from "@/components/admin";
import { AdminDateRangeInputs } from "@/components/admin/AdminDateRangeInputs";
import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dayEndIso, dayStartIso } from "@/hooks/useServerTableState";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatCurrency } from "@/lib/app/greeting";
import { formatPaymentDate } from "@/lib/payments/format";
import { PAYMENT_PURPOSE_LABELS } from "@/lib/payments/labels";
import { useGetAdminOverviewQuery } from "@/store/api/adminReportsApi";
import type { AdminActivity, AdminOverview } from "@/types/adminOverview";
import { ROUTES } from "@/utils/constants";

const ADMIN_PAYMENTS_TAB = `${ROUTES.ADMIN_ENROLLMENTS}?tab=payments`;

const ACTIVITY_ICONS = {
  signup: UserPlus,
  selection: LayoutGrid,
  payment: CreditCard,
} as const;

const ACTIVITY_LABELS: Record<AdminActivity["type"], string> = {
  signup: "New participant",
  selection: "Success Center selected",
  payment: "Payment",
};

// Payments without a description fall back to the raw purpose on the server.
const activityTitle = (item: AdminActivity) =>
  item.type === "payment" && item.purpose && item.title === item.purpose
    ? PAYMENT_PURPOSE_LABELS[item.purpose]
    : item.title;

/** "USD 150.00 · EUR 40.00" — revenue is never summed across currencies. */
const formatRevenue = (rows: { currency: string; total: number }[]) =>
  rows.length ? rows.map((row) => formatCurrency(row.total, row.currency)).join(" · ") : "—";

export default function AdminOverviewPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const query = useGetAdminOverviewQuery(
    { from: dayStartIso(from), to: dayEndIso(to) },
    { refetchOnMountOrArgChange: true },
  );
  const overview = query.data;
  const ranged = Boolean(from || to);

  return (
    <>
      <AdminPageHeader
        title="Overview"
        subtitle="Founding Participant control panel — participants, Success Centers, Funding Access and recent activity."
        actions={
          <GoldButton size="sm" variant="outline" onClick={() => void query.refetch()}>
            Refresh
          </GoldButton>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <AdminDateRangeInputs from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
        {ranged ? (
          <Button
            type="button"
            variant="ghost"
            className="h-11"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            <X />
            Clear range
          </Button>
        ) : null}
        <Typography variant="caption" color="muted">
          {ranged
            ? "The range applies to signups, selections, purchases and revenue. Totals are all-time."
            : "Showing all-time figures. Pick a range to filter signups, selections, purchases and revenue."}
        </Typography>
      </div>

      {query.isError && !overview ? (
        <EmptyState
          icon={Activity}
          variant="error"
          title="Could not load the overview"
          description={getApiErrorMessage(query.error, "Please try again in a moment.")}
          action={
            <Button type="button" variant="outline" onClick={() => void query.refetch()}>
              Try again
            </Button>
          }
        />
      ) : !overview ? (
        <OverviewSkeleton />
      ) : (
        <OverviewContent overview={overview} ranged={ranged} />
      )}
    </>
  );
}

function OverviewContent({ overview, ranged }: { overview: AdminOverview; ranged: boolean }) {
  const { participants, successProfiles, fundingAccess } = overview;
  const [shortWindow, longWindow] = participants.newSignups.windows;
  const signups = ranged ? participants.newSignups.inRange : longWindow?.count;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          label="Total Participants"
          value={String(participants.total)}
          sub="Registered participant accounts"
          href={ROUTES.ADMIN_PARTICIPANTS}
          icon={<Users className="size-4 text-info" />}
          iconClassName="bg-info/10"
        />
        <AdminKpiCard
          label="New Participant Signups"
          value={String(signups ?? 0)}
          sub={
            ranged
              ? "In the selected range"
              : `Last ${longWindow?.days ?? 30} days · ${shortWindow?.count ?? 0} in the last ${shortWindow?.days ?? 7}`
          }
          href={ROUTES.ADMIN_PARTICIPANTS}
          icon={<UserPlus className="size-4 text-info" />}
          iconClassName="bg-info/10"
        />
        <AdminKpiCard
          label="Active Participants"
          value={String(participants.active)}
          sub="Verified, active accounts"
          href={ROUTES.ADMIN_PARTICIPANTS}
          icon={<UserCheck className="size-4 text-success" />}
          iconClassName="bg-success/10"
        />
        <AdminKpiCard
          label="Success Centers Selected"
          value={String(overview.successCentersSelected)}
          sub="Active program selections"
          href={ROUTES.ADMIN_ENROLLMENTS}
          icon={<LayoutGrid className="size-4 text-navy" />}
          iconClassName="bg-navy/10"
        />
        <AdminKpiCard
          label="Success Profiles Completed"
          value={String(successProfiles.completed)}
          sub="Confirmed and complete"
          href={ROUTES.ADMIN_PARTICIPANTS}
          icon={<ClipboardCheck className="size-4 text-success" />}
          iconClassName="bg-success/10"
        />
        <AdminKpiCard
          label="Success Profiles Incomplete"
          value={String(successProfiles.incomplete)}
          sub={`${successProfiles.notStarted} not started yet`}
          href={ROUTES.ADMIN_PARTICIPANTS}
          icon={<ClipboardList className="size-4 text-gold-deep" />}
          iconClassName="bg-gold/15"
        />
        <AdminKpiCard
          label="Funding Access Purchases"
          value={String(fundingAccess.purchases)}
          sub={`${overview.founderTierPurchases} Founder tier purchase${overview.founderTierPurchases === 1 ? "" : "s"}`}
          href={ROUTES.ADMIN_ENROLLMENTS}
          icon={<ClipboardList className="size-4 text-navy" />}
          iconClassName="bg-navy/10"
        />
        <AdminKpiCard
          label="Funding Access Revenue"
          value={formatRevenue(fundingAccess.revenue)}
          sub={`All completed payments: ${formatRevenue(overview.totalRevenue)}`}
          href={ADMIN_PAYMENTS_TAB}
          icon={<DollarSign className="size-4 text-success" />}
          iconClassName="bg-success/10"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <RecentActivity activity={overview.recentActivity} />
        <QuickLinks />
      </div>
    </div>
  );
}

function RecentActivity({ activity }: { activity: AdminActivity[] }) {
  return (
    <AdminSurfaceCard className="p-5">
      <AdminSectionTitle as="h3">Recent Participant Activity</AdminSectionTitle>
      {activity.length === 0 ? (
        <EmptyState
          icon={Activity}
          variant="muted"
          size="compact"
          title="No participant activity yet."
          description="Signups, Success Center selections and payments will appear here."
        />
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {activity.map((item) => {
            const Icon = ACTIVITY_ICONS[item.type];
            return (
              <li key={`${item.type}-${item._id}`} className="flex flex-wrap items-center gap-3 py-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-card">
                  <Icon className="size-4 text-muted-soft" />
                </span>
                <span className="min-w-0 flex-1">
                  <Typography as="span" variant="body-sm" className="block truncate font-semibold text-ink-heading">
                    {item.participant?.name || item.participant?.email || "Unknown participant"}
                  </Typography>
                  <Typography as="span" variant="caption" color="muted" className="block truncate">
                    {ACTIVITY_LABELS[item.type]}
                    {item.type === "signup" ? "" : ` · ${activityTitle(item)}`}
                    {item.amount != null ? ` · ${formatCurrency(item.amount, item.currency)}` : ""}
                  </Typography>
                </span>
                <AdminStatusPill status={item.status} />
                <Typography variant="caption" color="muted" className="w-full text-right sm:w-auto">
                  {formatPaymentDate(item.at)}
                </Typography>
              </li>
            );
          })}
        </ul>
      )}
    </AdminSurfaceCard>
  );
}

const QUICK_LINKS = [
  { to: ROUTES.ADMIN_PARTICIPANTS, label: "Participants", hint: "Accounts, status and access", icon: Users },
  { to: ROUTES.ADMIN_ENROLLMENTS, label: "Enrollments", hint: "Funding Access, Founder and program activations", icon: ClipboardList },
  { to: ADMIN_PAYMENTS_TAB, label: "Payments", hint: "Payment records and status", icon: CreditCard },
  { to: ROUTES.ADMIN_RECOMMENDATIONS, label: "Recommendations", hint: "Review and approve activation plans", icon: ClipboardCheck },
];

function QuickLinks() {
  return (
    <AdminSurfaceCard className="p-5">
      <AdminSectionTitle as="h3">Quick links</AdminSectionTitle>
      <ul className="mt-3 space-y-2">
        {QUICK_LINKS.map(({ to, label, hint, icon: Icon }) => (
          <li key={label}>
            <Link
              to={to}
              className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 hover:border-gold-chip"
            >
              <Icon className="size-4 shrink-0 text-info" />
              <span className="min-w-0">
                <Typography as="span" variant="body-sm" className="block font-semibold text-ink-heading">
                  {label}
                </Typography>
                <Typography as="span" variant="caption" color="muted" className="block">
                  {hint}
                </Typography>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </AdminSurfaceCard>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    </div>
  );
}
