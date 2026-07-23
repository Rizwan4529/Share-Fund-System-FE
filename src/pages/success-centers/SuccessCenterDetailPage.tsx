import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
import { getSuccessCenter } from "@/lib/api/successCenters";
import type { SuccessCenter } from "@/types";
import { ROUTES } from "@/utils/constants";

export default function SuccessCenterDetailPage() {
  const { centerId = "" } = useParams();
  const [center, setCenter] = useState<SuccessCenter | null>(null);

  useEffect(() => {
    void getSuccessCenter(centerId).then(setCenter);
  }, [centerId]);

  if (!center) {
    return (
      <AppPageContainer>
        <Typography variant="body">Loading Success Center…</Typography>
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <GoldButton variant="outline" size="sm" asChild className="mb-4">
        <Link to={ROUTES.SUCCESS_CENTERS}>Back</Link>
      </GoldButton>
      <AppSurfaceCard className="max-w-3xl p-6">
        <Typography variant="h2">{center.name}</Typography>
        <Typography variant="body" className="mt-3 text-muted-foreground">
          {center.long}
        </Typography>
        <div className="mt-5 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          {center.notices}
        </div>
        <Typography variant="body" className="mt-4">
          {center.content}
        </Typography>
      </AppSurfaceCard>
    </AppPageContainer>
  );
}
