import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  AdminKpiCard,
  AdminPageContainer,
  AdminPageHeader,
} from "@/components/admin";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  downloadCsv,
  exportAdminCsv,
  fetchAdminOverview,
  type AdminOverviewStats,
} from "@/lib/api/admin";
import { ROUTES } from "@/utils/constants";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);

  useEffect(() => {
    void fetchAdminOverview().then(setStats);
  }, []);

  const exportKind = async (
    kind: "participants" | "enrollments" | "payments",
  ) => {
    const csv = await exportAdminCsv(kind);
    downloadCsv(`sfs-${kind}.csv`, csv);
    toast.success(`Exported ${kind}.csv`);
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Overview"
        subtitle="Phase 1 Founding Participant control panel (mock data)."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          label="Participants"
          value={String(stats?.participants ?? "—")}
        />
        <AdminKpiCard
          label="Founding / Stack"
          value={`${stats?.foundingCount ?? 0} / ${stats?.founderStackCount ?? 0}`}
        />
        <AdminKpiCard
          label="Enrollment revenue"
          value={stats ? `$${stats.revenue}` : "—"}
        />
        <AdminKpiCard
          label="Pending projections"
          value={String(stats?.pendingRecs ?? "—")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <Typography variant="h3">Quick links</Typography>
          <div className="mt-4 flex flex-wrap gap-2">
            <GoldButton size="sm" asChild>
              <Link to={ROUTES.ADMIN_PARTICIPANTS}>Participants</Link>
            </GoldButton>
            <GoldButton size="sm" variant="outline" asChild>
              <Link to={ROUTES.ADMIN_ENROLLMENTS}>Enrollments</Link>
            </GoldButton>
            <GoldButton size="sm" variant="outline" asChild>
              <Link to={ROUTES.ADMIN_PRICING}>Pricing</Link>
            </GoldButton>
            <GoldButton size="sm" variant="outline" asChild>
              <Link to={ROUTES.ADMIN_RECOMMENDATIONS}>Recommendations</Link>
            </GoldButton>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Typography variant="h3">Export data</Typography>
          <Typography
            variant="body"
            className="mt-2 text-sm text-muted-foreground"
          >
            Download CSV from mock store (participants, enrollments, payments).
          </Typography>
          <div className="mt-4 flex flex-wrap gap-2">
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => void exportKind("participants")}
            >
              Participants
            </GoldButton>
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => void exportKind("enrollments")}
            >
              Enrollments
            </GoldButton>
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => void exportKind("payments")}
            >
              Payments
            </GoldButton>
          </div>
        </div>
      </div>
    </AdminPageContainer>
  );
}
