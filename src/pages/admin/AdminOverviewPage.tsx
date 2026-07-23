import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ClipboardList,
  DollarSign,
  Download,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  AdminCategoryBars,
  AdminFunnelChart,
  AdminKpiCard,
  AdminPageHeader,
  AdminSectionTitle,
  AdminSignupChart,
  AdminSurfaceCard,
  AdminTrafficDonut,
  AdminTableToolbar,
} from "@/components/admin";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import {
  downloadCsv,
  exportAdminCsv,
  fetchAdminEnrollments,
  fetchAdminOverview,
  fetchAdminParticipants,
  fetchAdminRecommendations,
  type AdminOverviewStats,
} from "@/lib/api/admin";
import type { AuthUser, Enrollment, Recommendation } from "@/types";
import { ROUTES } from "@/utils/constants";

type ActivityRow = {
  id: string;
  kind: "enrollment" | "recommendation";
  title: string;
  detail: string;
  status: string;
  at: string;
};

function buildEnrollmentTrend(enrollments: Enrollment[]): number[] {
  const buckets = Array.from({ length: 8 }, () => 0);
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  for (const e of enrollments) {
    const age = now - new Date(e.createdAt).getTime();
    const weekIndex = 7 - Math.min(7, Math.max(0, Math.floor(age / weekMs)));
    buckets[weekIndex] += e.amount;
  }
  // Soften empty mock charts so the sparkline still reads
  if (buckets.every((v) => v === 0) && enrollments.length === 0) {
    return [12, 18, 15, 22, 28, 24, 31, 36];
  }
  return buckets.map((v, i) => (v === 0 && i > 0 ? buckets[i - 1] * 0.85 : v));
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [participants, setParticipants] = useState<AuthUser[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [activitySearch, setActivitySearch] = useState("");
  const filteredActivity = useMemo(
    () =>
      filterRowsBySearch(
        activity,
        activitySearch,
        (r) => `${r.kind} ${r.title} ${r.detail} ${r.status}`,
      ),
    [activity, activitySearch],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filteredActivity);

  useEffect(() => {
    void fetchAdminOverview().then(setStats);
    void Promise.all([
      fetchAdminParticipants(),
      fetchAdminEnrollments(),
      fetchAdminRecommendations(),
    ]).then(([people, enrollData, recs]) => {
      setParticipants(people);
      setEnrollments(enrollData.enrollments);

      const enrollRows: ActivityRow[] = enrollData.enrollments.map(
        (e: Enrollment) => ({
          id: `enr-${e.id}`,
          kind: "enrollment" as const,
          title: e.userName,
          detail: `${e.plan.replaceAll("_", " ")} · $${e.amount}`,
          status: e.status,
          at: e.createdAt,
        }),
      );
      const recRows: ActivityRow[] = recs
        .filter((r: Recommendation) => r.status === "pending")
        .map((r) => ({
          id: `rec-${r.id}`,
          kind: "recommendation" as const,
          title: r.userName,
          detail: `$${r.recommendedBudget.toLocaleString()} · ${r.projectedTimelineMonths} mo`,
          status: r.status,
          at: r.createdAt,
        }));
      const merged = [...enrollRows, ...recRows].sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
      );
      setActivity(merged.slice(0, 20));
    });
  }, []);

  const exportKind = async (
    kind: "participants" | "enrollments" | "payments",
  ) => {
    const csv = await exportAdminCsv(kind);
    downloadCsv(`sfs-${kind}.csv`, csv);
    toast.success(`Exported ${kind}.csv`);
  };

  const revenueTrend = useMemo(
    () => buildEnrollmentTrend(enrollments),
    [enrollments],
  );

  const statusDonut = useMemo(() => {
    const none = participants.filter((p) => p.foundingStatus === "none").length;
    const founding = participants.filter(
      (p) => p.foundingStatus === "founding_participant",
    ).length;
    const stack = participants.filter(
      (p) => p.foundingStatus === "founder_stack",
    ).length;
    const data = [
      { name: "Not enrolled", value: none || 0, color: "#9fb0d4" },
      { name: "Founding", value: founding || 0, color: "#c4a33a" },
      { name: "Founder Stack", value: stack || 0, color: "#0a1c40" },
    ].filter((d) => d.value > 0);
    return data.length
      ? data
      : [{ name: "No participants", value: 1, color: "#e4e9f2" }];
  }, [participants]);

  const funnel = useMemo(() => {
    const total = Math.max(participants.length, 1);
    const questionnaireDone = participants.filter(
      (p) => p.questionnaireComplete,
    ).length;
    const enrolled = participants.filter(
      (p) => p.foundingStatus !== "none",
    ).length;
    const pending = stats?.pendingRecs ?? 0;
    return [
      { label: "Participants", value: participants.length, pct: 100 },
      {
        label: "Questionnaire done",
        value: questionnaireDone,
        pct: Math.round((questionnaireDone / total) * 100),
      },
      {
        label: "Enrolled",
        value: enrolled,
        pct: Math.round((enrolled / total) * 100),
      },
      {
        label: "Pending projections",
        value: pending,
        pct: Math.round((pending / total) * 100),
      },
    ];
  }, [participants, stats?.pendingRecs]);

  const planBars = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of enrollments) {
      const key = e.plan.replaceAll("_", " ");
      counts[key] = (counts[key] ?? 0) + 1;
    }
    const entries = Object.entries(counts).map(([name, value], i) => ({
      name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
      hot: i === 0,
    }));
    return entries.length
      ? entries
      : [
          { name: "Founding One", value: 1, hot: true },
          { name: "Founding Bundle", value: 0 },
          { name: "Founder Stack", value: 0 },
        ];
  }, [enrollments]);

  const columns = useMemo<ColumnDef<ActivityRow>[]>(
    () => [
      {
        accessorKey: "kind",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Type" />
        ),
        cell: ({ row }) => (
          <span className="capitalize text-muted-foreground">
            {row.original.kind}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Participant" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {row.original.title}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "detail",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Detail" />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.status}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "at",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Date" />
        ),
        cell: ({ row }) =>
          new Date(row.original.at).toLocaleDateString(),
        enableSorting: true,
      },
    ],
    [],
  );

  return (
    <>
      <AdminPageHeader
        title="Overview"
        subtitle="Founding Participant control panel — participants, enrollments, and projections."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          label="Participants"
          value={String(stats?.participants ?? "—")}
          sub="Registered accounts"
          href={ROUTES.ADMIN_PARTICIPANTS}
          icon={<Users className="size-4 text-info" />}
          iconClassName="bg-info/10"
        />
        <AdminKpiCard
          label="Founding / Stack"
          value={`${stats?.foundingCount ?? 0} / ${stats?.founderStackCount ?? 0}`}
          sub="Enrollment statuses"
          href={ROUTES.ADMIN_ENROLLMENTS}
          icon={<ClipboardList className="size-4 text-navy" />}
          iconClassName="bg-navy/10"
        />
        <AdminKpiCard
          label="Enrollment revenue"
          value={stats ? `$${stats.revenue}` : "—"}
          sub="Collected fees"
          href={ROUTES.ADMIN_ENROLLMENTS}
          icon={<DollarSign className="size-4 text-primary" />}
          iconClassName="bg-primary/10"
        />
        <AdminKpiCard
          label="Pending projections"
          value={String(stats?.pendingRecs ?? "—")}
          sub="Awaiting review"
          href={ROUTES.ADMIN_RECOMMENDATIONS}
          icon={<Sparkles className="size-4 text-info" />}
          iconClassName="bg-info/10"
        />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <AdminSurfaceCard className="p-5">
          <AdminSectionTitle>Enrollment revenue trend</AdminSectionTitle>
          <Typography
            variant="body-sm"
            className="mt-1.5 text-sm text-muted-foreground"
          >
            Fee volume across recent weeks (from enrollment records).
          </Typography>
          <div className="mt-4">
            <AdminSignupChart data={revenueTrend} />
          </div>
        </AdminSurfaceCard>

        <AdminSurfaceCard className="p-5">
          <AdminSectionTitle>Founding status mix</AdminSectionTitle>
          <Typography
            variant="body-sm"
            className="mt-1.5 text-sm text-muted-foreground"
          >
            How participants are tagged today.
          </Typography>
          <div className="mt-4">
            <AdminTrafficDonut data={statusDonut} />
          </div>
        </AdminSurfaceCard>

        <AdminSurfaceCard className="p-5">
          <AdminSectionTitle>Conversion funnel</AdminSectionTitle>
          <Typography
            variant="body-sm"
            className="mt-1.5 text-sm text-muted-foreground"
          >
            Progress from signup through projections.
          </Typography>
          <div className="mt-4">
            <AdminFunnelChart data={funnel} />
          </div>
        </AdminSurfaceCard>

        <AdminSurfaceCard className="p-5">
          <AdminSectionTitle>Plans enrolled</AdminSectionTitle>
          <Typography
            variant="body-sm"
            className="mt-1.5 text-sm text-muted-foreground"
          >
            Count of enrollment plans in the local store.
          </Typography>
          <div className="mt-4">
            <AdminCategoryBars data={planBars} />
          </div>
        </AdminSurfaceCard>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <AdminSurfaceCard className="p-5">
          <AdminSectionTitle>Quick links</AdminSectionTitle>
          <Typography
            variant="body-sm"
            className="mt-1.5 text-sm text-muted-foreground"
          >
            Jump to the most-used Phase 1 admin tools.
          </Typography>
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
        </AdminSurfaceCard>

        <AdminSurfaceCard className="p-5">
          <AdminSectionTitle>Export data</AdminSectionTitle>
          <Typography
            variant="body-sm"
            className="mt-1.5 text-sm text-muted-foreground"
          >
            Download CSV from the local store (participants, enrollments,
            payments).
          </Typography>
          <div className="mt-4 flex flex-wrap gap-2">
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => void exportKind("participants")}
            >
              <Download className="size-3.5" />
              Participants
            </GoldButton>
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => void exportKind("enrollments")}
            >
              <Download className="size-3.5" />
              Enrollments
            </GoldButton>
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => void exportKind("payments")}
            >
              <Download className="size-3.5" />
              Payments
            </GoldButton>
          </div>
        </AdminSurfaceCard>
      </div>

      <div className="space-y-3 pb-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <AdminSectionTitle>Recent activity</AdminSectionTitle>
            <Typography
              variant="body-sm"
              className="mt-1 text-sm text-muted-foreground"
            >
              Latest enrollments and pending recommendation reviews.
            </Typography>
          </div>
          <GoldButton size="sm" variant="outline" asChild>
            <Link to={ROUTES.ADMIN_ENROLLMENTS}>View all</Link>
          </GoldButton>
        </div>
        <AdminTableToolbar
          search={activitySearch}
          onSearchChange={setActivitySearch}
          placeholder="Search recent activity…"
          resultCount={filteredActivity.length}
        />
        <DataTableCommon
          columns={columns}
          data={pageRows}
          totalDataCount={totalDataCount}
          onFetchData={onFetchData}
          fillViewport={false}
          className="min-h-80"
          emptyMessage="No recent enrollments or pending projections yet."
        />
      </div>
    </>
  );
}
