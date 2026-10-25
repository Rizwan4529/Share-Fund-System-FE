import { Link, useParams } from "react-router-dom";
import { Layers, SearchX } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
} from "@/components/member/app";
import { ProgramActivateAction } from "@/components/success-centers/ProgramActivateAction";
import { ProgramTags } from "@/components/success-centers/SuccessCenterBadges";
import { Button } from "@/components/ui/button";
import { useSelectedProgramIds } from "@/hooks/useSelectedProgramIds";
import {
  getApiErrorMessage,
  isNotFoundError,
} from "@/lib/api/getApiErrorMessage";
import { useListCategoryProgramsQuery } from "@/store/api/successCenterBrowseApi";
import { ROUTES, successCenterProgramPath } from "@/utils/constants";

/** Programs inside one Success Center category. */
export default function SuccessCenterDetailPage() {
  const { centerId = "" } = useParams();
  const programsQuery = useListCategoryProgramsQuery(centerId, {
    skip: !centerId,
  });
  const selected = useSelectedProgramIds();

  if (programsQuery.isLoading) {
    return (
      <AppPageContainer>
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      </AppPageContainer>
    );
  }

  if (programsQuery.isError || !programsQuery.data) {
    const notFound = isNotFoundError(programsQuery.error);
    return (
      <AppPageContainer>
        <EmptyState
          icon={SearchX}
          variant={notFound ? "default" : "error"}
          title={
            notFound ? "Success Center not found" : "Could not load programs"
          }
          description={
            notFound
              ? "That category doesn't exist or is no longer available."
              : getApiErrorMessage(programsQuery.error, "Please try again.")
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
                onClick={() => void programsQuery.refetch()}
              >
                Try again
              </Button>
            )
          }
        />
      </AppPageContainer>
    );
  }

  const { category, programs } = programsQuery.data;

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Success Center"
        title={category.name}
        subtitle={category.description}
        actions={
          <>
            <GoldButton variant="ghost-outline" asChild>
              <Link to={ROUTES.SUCCESS_CENTERS}>All categories</Link>
            </GoldButton>
            <GoldButton variant="ghost-outline" asChild>
              <Link to={ROUTES.MY_SELECTIONS}>My selections</Link>
            </GoldButton>
          </>
        }
      />

      {category.programsIntroduction ? (
        <InfoCallout className="mb-5 whitespace-pre-line">
          {category.programsIntroduction}
        </InfoCallout>
      ) : null}

      {programs.length === 0 ? (
        <EmptyState
          icon={Layers}
          variant="muted"
          title="No programs in this category yet"
          description="New programs are added regularly — check back soon."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {programs.map((program) => (
            <AppSurfaceCard key={program._id} padding="md" className="flex flex-col">
              <ProgramTags program={program} />
              <Typography
                as="h2"
                variant="h5"
                className="mt-3 font-display text-[17px] font-bold text-ink-heading"
              >
                {program.name}
              </Typography>
              <Typography
                variant="body-sm"
                className="mt-2 line-clamp-3 flex-1 text-muted-soft"
              >
                {program.description || "Open the program to learn more."}
              </Typography>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <GoldButton variant="ghost-outline" asChild>
                  <Link to={successCenterProgramPath(program._id)}>
                    View details
                  </Link>
                </GoldButton>
                <ProgramActivateAction
                  program={program}
                  isSelected={selected.ids.has(program._id)}
                  isChecking={selected.isLoading}
                />
              </div>
            </AppSurfaceCard>
          ))}
        </div>
      )}
    </AppPageContainer>
  );
}
