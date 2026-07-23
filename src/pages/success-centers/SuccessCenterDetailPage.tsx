import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
} from "@/components/member/app";
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
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Success Center"
        title={center.name}
        subtitle={center.blurb}
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.SUCCESS_CENTERS}>All centers</Link>
          </GoldButton>
        }
      />

      <AppSurfaceCard className="max-w-3xl">
        <SectionLabel tone="navy">{center.filter}</SectionLabel>
        <Typography variant="body" className="mt-4 text-[15px] leading-relaxed text-ink-heading">
          {center.long}
        </Typography>
        <InfoCallout className="mt-5">{center.notices}</InfoCallout>
        <Typography variant="body-sm" className="mt-4 text-muted-soft">
          {center.content}
        </Typography>
      </AppSurfaceCard>
    </AppPageContainer>
  );
}
