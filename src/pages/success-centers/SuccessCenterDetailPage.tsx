import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, CalendarClock, Calculator, SearchX, Target } from "lucide-react";

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
import { getSuccessCenter } from "@/lib/api/successCenters";
import { getPlatformSettings } from "@/lib/api/settings";
import { cn } from "@/lib/utils";
import type { PlatformSettings, SuccessCenter, SuccessProgram } from "@/types";
import { ROUTES } from "@/utils/constants";

export default function SuccessCenterDetailPage() {
  const { centerId = "" } = useParams();
  const [center, setCenter] = useState<SuccessCenter | null>(null);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [activeProgramId, setActiveProgramId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void Promise.all([getSuccessCenter(centerId), getPlatformSettings()])
      .then(([c, s]) => {
        setCenter(c);
        setSettings(s);
        setActiveProgramId(c?.programs[0]?.id ?? "");
      })
      .finally(() => setLoading(false));
  }, [centerId]);

  const activeProgram = useMemo(
    () => center?.programs.find((p) => p.id === activeProgramId) ?? null,
    [center, activeProgramId],
  );

  if (loading) {
    return (
      <AppPageContainer>
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  if (!center) {
    return (
      <AppPageContainer>
        <EmptyState
          icon={SearchX}
          title="Success Center not found"
          description="That category doesn’t exist or is no longer available."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.SUCCESS_CENTERS}>Browse Success Centers</Link>
            </GoldButton>
          }
        />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Success Center category"
        title={center.name}
        subtitle={center.blurb}
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.SUCCESS_CENTERS}>All categories</Link>
          </GoldButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <AppSurfaceCard padding="md" className="h-fit">
          <SectionLabel tone="navy">Programs</SectionLabel>
          <Typography variant="body-sm" className="mt-2 text-muted-soft">
            {center.long}
          </Typography>
          <div className="mt-4 space-y-2">
            {center.programs.map((program) => (
              <button
                key={program.id}
                type="button"
                onClick={() => setActiveProgramId(program.id)}
                className={cn(
                  "w-full rounded-lg border px-3.5 py-2.5 text-left transition",
                  program.id === activeProgramId
                    ? "border-primary bg-primary-light/60"
                    : "border-line hover:border-info/40",
                )}
              >
                <span className="block text-sm font-semibold text-ink-heading">
                  {program.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-soft">
                  {program.blurb}
                </span>
              </button>
            ))}
          </div>
        </AppSurfaceCard>

        <div className="space-y-4">
          {activeProgram ? (
            <ProgramDetail
              program={activeProgram}
              defaultActivation={
                settings?.rules.activationPercentDefault ?? 5
              }
            />
          ) : (
            <AppSurfaceCard>
              <Typography variant="body-sm" className="text-muted-soft">
                This category has no programs yet.
              </Typography>
            </AppSurfaceCard>
          )}
          <InfoCallout>{center.notices}</InfoCallout>
        </div>
      </div>
    </AppPageContainer>
  );
}

function ProgramDetail({
  program,
  defaultActivation,
}: {
  program: SuccessProgram;
  defaultActivation: number;
}) {
  const [goal, setGoal] = useState("");
  const activationPercent =
    program.activationPercent > 0 ? program.activationPercent : defaultActivation;
  const goalNum = Number(goal) || 0;
  const activationEstimate = Math.round(goalNum * (activationPercent / 100));

  return (
    <>
      <AppSurfaceCard>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <SectionLabel tone="info">Program overview</SectionLabel>
            <Typography
              as="h2"
              variant="h5"
              className="mt-2 font-display text-[19px] font-bold text-ink-heading"
            >
              {program.name}
            </Typography>
          </div>
          <StatusChip tone="gold">{activationPercent}% activation</StatusChip>
        </div>
        <Typography variant="body" className="mt-3 text-[15px] text-ink-heading">
          {program.blurb}
        </Typography>
        <p className="mt-3 text-sm text-muted-soft">{program.eligibilityNote}</p>
      </AppSurfaceCard>

      <div className="grid gap-4 md:grid-cols-2">
        <AppSurfaceCard>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="size-4 text-info" />
            <SectionLabel tone="info">Education</SectionLabel>
          </div>
          <Typography variant="body-sm" className="text-muted-soft">
            {program.educationSummary}
          </Typography>
        </AppSurfaceCard>

        <AppSurfaceCard>
          <div className="mb-2 flex items-center gap-2">
            <CalendarClock className="size-4 text-ink-tag" />
            <SectionLabel tone="navy">Projected timeline</SectionLabel>
          </div>
          <Typography variant="body-sm" className="text-muted-soft">
            {program.timelineNote}
          </Typography>
        </AppSurfaceCard>
      </div>

      <AppSurfaceCard>
        <div className="mb-2 flex items-center gap-2">
          <Calculator className="size-4 text-info" />
          <SectionLabel tone="info">Planning calculator</SectionLabel>
        </div>
        <Typography variant="body-sm" className="text-muted-soft">
          Enter a goal amount to estimate the activation requirement. This is a
          Phase 1 projection only — no live funding.
        </Typography>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-sm font-semibold text-ink-heading">
            Goal amount
            <input
              type="number"
              min={0}
              value={goal}
              placeholder="12000"
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block h-9 w-40 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </label>
          <div className="rounded-lg border border-line bg-bg-card px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-info">
              <Target className="size-3.5" /> Activation estimate
            </div>
            <div className="mt-1 font-display text-[20px] font-bold text-ink-heading">
              ${activationEstimate.toLocaleString()}
            </div>
          </div>
        </div>
      </AppSurfaceCard>

      <AppSurfaceCard>
        <SectionLabel tone="navy">Next steps</SectionLabel>
        <ul className="mt-3 space-y-2 text-sm text-muted-soft">
          <li className="flex gap-2">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
            Complete your Success Profile to get a full BMIS recommendation.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
            Get Founding Access to include this category in your plan.
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <GoldButton asChild>
            <Link to={ROUTES.QUESTIONNAIRE}>Start Success Profile</Link>
          </GoldButton>
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.ENROLLMENT}>View Founding Access</Link>
          </GoldButton>
        </div>
      </AppSurfaceCard>
    </>
  );
}
