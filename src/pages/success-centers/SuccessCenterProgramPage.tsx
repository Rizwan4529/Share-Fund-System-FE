import { Link, useParams } from "react-router-dom";
import { BookOpen, SearchX } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
} from "@/components/member/app";
import { ProgramActivateAction } from "@/components/success-centers/ProgramActivateAction";
import { ProgramTags } from "@/components/success-centers/SuccessCenterBadges";
import { Button } from "@/components/ui/button";
import { useSelectedProgramIds } from "@/hooks/useSelectedProgramIds";
import {
  getApiErrorMessage,
  isNotFoundError,
} from "@/lib/api/getApiErrorMessage";
import { useGetBrowseProgramQuery } from "@/store/api/successCenterBrowseApi";
import { ROUTES, successCenterCategoryPath } from "@/utils/constants";

export default function SuccessCenterProgramPage() {
  const { programId = "" } = useParams();
  const programQuery = useGetBrowseProgramQuery(programId, {
    skip: !programId,
  });
  const selected = useSelectedProgramIds();

  if (programQuery.isLoading) {
    return (
      <AppPageContainer>
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      </AppPageContainer>
    );
  }

  if (programQuery.isError || !programQuery.data) {
    const notFound = isNotFoundError(programQuery.error);
    return (
      <AppPageContainer>
        <EmptyState
          icon={SearchX}
          variant={notFound ? "default" : "error"}
          title={notFound ? "Program not found" : "Could not load this program"}
          description={
            notFound
              ? "That program doesn't exist or isn't available yet."
              : getApiErrorMessage(programQuery.error, "Please try again.")
          }
          action={
            notFound ? (
              <GoldButton asChild>
                <Link to={ROUTES.SUCCESS_CENTERS}>Browse Success Centers</Link>
              </GoldButton>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => void programQuery.refetch()}
              >
                Try again
              </Button>
            )
          }
        />
      </AppPageContainer>
    );
  }

  const program = programQuery.data;
  const isComingSoon = program.status === "coming_soon";

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline={program.category.name}
        title={program.name}
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={successCenterCategoryPath(program.category._id)}>
              Back to {program.category.name}
            </Link>
          </GoldButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <AppSurfaceCard>
            <SectionLabel tone="info">Program overview</SectionLabel>
            <ProgramTags program={program} className="mt-3" />
            <Typography
              variant="body"
              className="mt-4 text-[15px] whitespace-pre-line text-ink-heading"
            >
              {program.description || "An overview for this program is coming soon."}
            </Typography>
          </AppSurfaceCard>

          <AppSurfaceCard>
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="size-4 text-info" />
              <SectionLabel tone="info">Education</SectionLabel>
            </div>
            <Typography
              variant="body-sm"
              className="whitespace-pre-line text-muted-soft"
            >
              {program.educationalContent ||
                "Educational content for this program will appear here."}
            </Typography>
          </AppSurfaceCard>
        </div>

        <AppSurfaceCard padding="md" className="h-fit space-y-4">
          <SectionLabel tone="navy">
            {isComingSoon ? "Coming soon" : "Ready to start?"}
          </SectionLabel>
          <Typography variant="body-sm" className="text-muted-soft">
            {isComingSoon
              ? "You can explore this program now. Activation opens once it launches."
              : "Activate this program to add it to your plan. You'll set the activation amount and pay in a later step."}
          </Typography>
          <ProgramActivateAction
            program={program}
            isSelected={selected.ids.has(program._id)}
            isChecking={selected.isLoading}
          />
        </AppSurfaceCard>
      </div>

      <InfoCallout className="mt-4">
        Planning tools only. No live funding in Phase 1.
      </InfoCallout>
    </AppPageContainer>
  );
}
