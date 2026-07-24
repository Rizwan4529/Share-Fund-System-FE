/* PHASE2_PARKED — route redirects to /dashboard; page kept for later phases. */
import { Link } from "react-router-dom";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
import { ROUTES } from "@/utils/constants";

export default function DashboardProgressPage() {
  return (
    <AppPageContainer>
      <AppSurfaceCard className="p-6">
        <Typography variant="h2">Progress (parked)</Typography>
        <Typography variant="body" className="mt-2 text-muted-foreground">
          Campaign progress is parked for Phase 1. Use the dashboard for
          projections, Success Centers, and enrollment history.
        </Typography>
        <GoldButton asChild className="mt-4" size="sm">
          <Link to={ROUTES.DASHBOARD}>Back to dashboard</Link>
        </GoldButton>
      </AppSurfaceCard>
    </AppPageContainer>
  );
}
