import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
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
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <div className="mb-6 max-w-2xl">
        <Typography variant="h2">Recommendations & projections</Typography>
        <Typography variant="body" className="mt-2 text-muted-foreground">
          These figures are projections / simulations only. No live funding
          moves in Phase 1.
        </Typography>
      </div>

      {!rec ? (
        <AppSurfaceCard className="max-w-2xl p-6">
          <Typography variant="body">
            No projection yet.{" "}
            <Link
              to={ROUTES.QUESTIONNAIRE}
              className="font-semibold text-gold-dark underline"
            >
              Complete the BMIS questionnaire
            </Link>{" "}
            to generate one.
          </Typography>
        </AppSurfaceCard>
      ) : (
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <AppSurfaceCard className="p-6">
            <Typography
              variant="caption"
              className="font-bold tracking-wide text-gold-dark uppercase"
            >
              Projection — planning budget
            </Typography>
            <Typography variant="h2" className="mt-2">
              ${displayBudget(rec).toLocaleString()}
            </Typography>
            <Typography variant="body" className="mt-2 text-muted-foreground">
              Recommended activation / planning budget (simulation).
            </Typography>
          </AppSurfaceCard>
          <AppSurfaceCard className="p-6">
            <Typography
              variant="caption"
              className="font-bold tracking-wide text-gold-dark uppercase"
            >
              Projection — estimated timeline
            </Typography>
            <Typography variant="h2" className="mt-2">
              {displayTimeline(rec)} months
            </Typography>
            <Typography variant="body" className="mt-2 text-muted-foreground">
              Estimated timeline to reach your goal (simulation).
            </Typography>
          </AppSurfaceCard>
          <AppSurfaceCard className="p-6 md:col-span-2">
            <Typography variant="label">Status</Typography>
            <Typography variant="body" className="mt-1 capitalize">
              {rec.status}
            </Typography>
            <Typography variant="body" className="mt-3 text-muted-foreground">
              {rec.notes}
            </Typography>
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
              Labeled as projection / simulation. Live Success Center funding is
              not activated in this phase.
            </div>
          </AppSurfaceCard>
        </div>
      )}
    </AppPageContainer>
  );
}
