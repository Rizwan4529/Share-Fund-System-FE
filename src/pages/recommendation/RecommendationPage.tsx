import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Target } from "lucide-react";

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
import { getMyRecommendation } from "@/lib/api/recommendations";
import type { Recommendation } from "@/types";
import { ROUTES } from "@/utils/constants";

function displayBudget(rec: Recommendation) {
  return rec.adjustedBudget ?? rec.recommendedBudget;
}

function displayTimeline(rec: Recommendation) {
  return rec.adjustedTimelineMonths ?? rec.projectedTimelineMonths;
}

export default function RecommendationPage() {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setRec(await getMyRecommendation());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <AppPageContainer>
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="BMIS projections"
        title="Recommendations"
        subtitle="Rule-based planning figures. Clearly labeled as simulations — no live funding."
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.QUESTIONNAIRE}>Questionnaire</Link>
          </GoldButton>
        }
      />

      <InfoCallout className="mb-6">
        These numbers are projections / simulations only. Live Success Center
        funding is not activated in Phase 1.
      </InfoCallout>

      {!rec ? (
        <EmptyState
          icon={LineChart}
          title="No projection yet"
          description="Complete the BMIS questionnaire to generate a recommended planning budget and estimated timeline."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.QUESTIONNAIRE}>Start questionnaire</Link>
            </GoldButton>
          }
        />
      ) : (
        <div className="grid max-w-4xl gap-4 md:grid-cols-2">
          <AppSurfaceCard>
            <div className="mb-3 flex items-center justify-between">
              <SectionLabel tone="info">Planning budget</SectionLabel>
              <Target className="size-4 text-info" />
            </div>
            <StatusChip tone="info" className="mb-3">
              Projection
            </StatusChip>
            <Typography
              as="p"
              variant="h4"
              className="font-display text-[28px] font-bold text-ink-heading"
            >
              ${displayBudget(rec).toLocaleString()}
            </Typography>
            <Typography variant="body-sm" className="mt-2 text-muted-soft">
              Recommended activation / planning budget (simulation).
            </Typography>
          </AppSurfaceCard>

          <AppSurfaceCard>
            <div className="mb-3 flex items-center justify-between">
              <SectionLabel tone="navy">Estimated timeline</SectionLabel>
              <LineChart className="size-4 text-ink-tag" />
            </div>
            <StatusChip tone="navy" className="mb-3">
              Projection
            </StatusChip>
            <Typography
              as="p"
              variant="h4"
              className="font-display text-[28px] font-bold text-ink-heading"
            >
              {displayTimeline(rec)} months
            </Typography>
            <Typography variant="body-sm" className="mt-2 text-muted-soft">
              Estimated time to reach your goal (simulation).
            </Typography>
          </AppSurfaceCard>

          <AppSurfaceCard className="md:col-span-2">
            <SectionLabel tone="info">Review status</SectionLabel>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusChip
                tone={
                  rec.status === "approved"
                    ? "success"
                    : rec.status === "adjusted"
                      ? "gold"
                      : "muted"
                }
              >
                {rec.status}
              </StatusChip>
            </div>
            <Typography variant="body-sm" className="mt-3 text-muted-soft">
              {rec.notes}
            </Typography>
          </AppSurfaceCard>
        </div>
      )}
    </AppPageContainer>
  );
}
