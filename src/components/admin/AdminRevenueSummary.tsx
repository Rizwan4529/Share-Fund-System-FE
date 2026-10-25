import { useState } from "react";
import { CheckCircle2, Clock, DollarSign, XCircle } from "lucide-react";

import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { AdminSectionTitle } from "@/components/admin/AdminSectionTitle";
import { AdminSurfaceCard } from "@/components/admin/AdminPageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dayEndIso, dayStartIso } from "@/hooks/useServerTableState";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatCurrency } from "@/lib/app/greeting";
import { PAYMENT_PURPOSE_LABELS } from "@/lib/payments/labels";
import { useGetRevenueSummaryQuery } from "@/store/api/adminReportsApi";
import { ROUTES } from "@/utils/constants";

const joinMoney = (rows: { currency: string; total: number }[]) =>
  rows.length ? rows.map((row) => formatCurrency(row.total, row.currency)).join(" + ") : "—";

/** Basic revenue totals from completed payments (server-computed). */
export function AdminRevenueSummary() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const query = useGetRevenueSummaryQuery({ from: dayStartIso(from), to: dayEndIso(to) });
  const summary = query.data;

  return (
    <section className="mb-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <AdminSectionTitle>Revenue</AdminSectionTitle>
          <Typography variant="body-sm" color="muted">
            Completed payments only{from || to ? " in the selected range" : " (all time)"}.
          </Typography>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            aria-label="From date"
            value={from}
            max={to || undefined}
            onChange={(event) => setFrom(event.target.value)}
            className="h-10 w-40 bg-white"
          />
          <Input
            type="date"
            aria-label="To date"
            value={to}
            min={from || undefined}
            onChange={(event) => setTo(event.target.value)}
            className="h-10 w-40 bg-white"
          />
          {from || to ? (
            <Button type="button" variant="ghost" onClick={() => { setFrom(""); setTo(""); }}>
              All time
            </Button>
          ) : null}
        </div>
      </div>

      {query.isError ? (
        <EmptyState
          icon={DollarSign}
          variant="error"
          size="compact"
          title="Could not load revenue"
          description={getApiErrorMessage(query.error, "Please try again.")}
          action={
            <Button type="button" variant="outline" onClick={query.refetch}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminKpiCard
              label="Total revenue"
              value={summary ? joinMoney(summary.revenue) : "…"}
              sub="Completed payments"
              href={ROUTES.ADMIN_ENROLLMENTS}
              icon={<DollarSign className="size-4 text-primary" />}
              iconClassName="bg-primary/10"
            />
            <AdminKpiCard
              label="Completed"
              value={summary ? String(summary.counts.completed) : "…"}
              sub="Payments"
              icon={<CheckCircle2 className="size-4 text-success" />}
              iconClassName="bg-success/10"
            />
            <AdminKpiCard
              label="Pending"
              value={summary ? String(summary.counts.pending) : "…"}
              sub="Awaiting confirmation"
              icon={<Clock className="size-4 text-info" />}
              iconClassName="bg-info/10"
            />
            <AdminKpiCard
              label="Failed"
              value={summary ? String(summary.counts.failed) : "…"}
              sub="Not charged / expired"
              icon={<XCircle className="size-4 text-error" />}
              iconClassName="bg-error/10"
            />
          </div>
          <AdminSurfaceCard className="p-5">
            <Typography variant="label" className="text-ink-heading">
              Revenue by type
            </Typography>
            {summary && summary.byPurpose.length === 0 ? (
              <Typography variant="body-sm" color="muted" className="mt-2">
                No completed payments yet.
              </Typography>
            ) : (
              <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                {(summary?.byPurpose ?? []).map((row) => (
                  <div
                    key={`${row.purpose}-${row.currency}`}
                    className="rounded-lg border border-border bg-background px-3 py-2.5"
                  >
                    <Typography as="dt" variant="caption" color="muted">
                      {PAYMENT_PURPOSE_LABELS[row.purpose]}
                    </Typography>
                    <Typography as="dd" variant="body-sm" className="mt-0.5 font-semibold text-ink-heading">
                      {formatCurrency(row.total, row.currency)} · {row.count} payment
                      {row.count === 1 ? "" : "s"}
                    </Typography>
                  </div>
                ))}
              </dl>
            )}
          </AdminSurfaceCard>
        </>
      )}
    </section>
  );
}
