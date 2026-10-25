import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, Calculator, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  ActivationSummary,
  AffordabilityNotice,
  OneTimeOptionCard,
  PacedOptionCard,
  ProjectionNotice,
} from "@/components/activation/ActivationPlanParts";
import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  ParticipantPageHeader,
  SectionLabel,
} from "@/components/member/app";
import { Button } from "@/components/ui/button";
import {
  ACTIVATION_BLOCKERS,
  AFFORDABILITY_MESSAGES,
  isActivationErrorCode,
} from "@/lib/activation/labels";
import {
  getApiErrorCode,
  getApiErrorMessage,
  isNotFoundError,
} from "@/lib/api/getApiErrorMessage";
import { useAppSelector } from "@/store/hooks";
import {
  useCalculateActivationMutation,
  useGetActivationPlanQuery,
} from "@/store/api/activationApi";
import { useListMySelectionsQuery } from "@/store/api/successCenterBrowseApi";
import type { ActivationPlan, PlanLabel } from "@/types/activation";
import {
  ROUTES,
  checkoutPath,
  successCenterProgramPath,
} from "@/utils/constants";

type Choice = PlanLabel | "one_time" | null;

export default function ActivationPlanPage() {
  const { selectionId = "" } = useParams();
  const planQuery = useGetActivationPlanQuery(selectionId, { skip: !selectionId });
  const [calculate, calcState] = useCalculateActivationMutation();
  const selectionsQuery = useListMySelectionsQuery();
  const selection = selectionsQuery.data?.find((item) => item._id === selectionId);

  // No stored plan yet (404) → calculate one, once, automatically.
  const noStoredPlan = planQuery.isError && isNotFoundError(planQuery.error);
  const autoCalculated = useRef(false);
  useEffect(() => {
    if (!noStoredPlan || autoCalculated.current) return;
    autoCalculated.current = true;
    void calculate(selectionId);
  }, [noStoredPlan, calculate, selectionId]);

  const plan = planQuery.currentData;
  const isPlanningOnly = calcState.data?.activationRequired === false;

  const header = (
    <ParticipantPageHeader
      overline="My Recommendation & Projections"
      title={selection?.programId?.name ?? "Your recommendation"}
      subtitle={selection?.categoryId?.name}
      actions={
        <GoldButton variant="ghost-outline" asChild>
          <Link to={ROUTES.MY_SELECTIONS}>My selections</Link>
        </GoldButton>
      }
    />
  );

  if (isPlanningOnly) {
    return (
      <AppPageContainer>
        {header}
        <EmptyState
          icon={BookOpen}
          title="No activation needed for this program"
          description="This is a planning and education program, so there's no activation requirement or payment. Explore its guidance at your own pace."
          action={
            selection?.programId ? (
              <GoldButton asChild>
                <Link to={successCenterProgramPath(selection.programId._id)}>
                  View program
                </Link>
              </GoldButton>
            ) : undefined
          }
        />
      </AppPageContainer>
    );
  }

  if (plan) {
    return (
      <AppPageContainer>
        {header}
        <PlanView
          plan={plan}
          activationPaid={selection?.activationStatus === "paid"}
          selectionId={selectionId}
          recalculate={calculate}
          recalculating={calcState.isLoading}
        />
      </AppPageContainer>
    );
  }

  const calcError = calcState.isError ? calcState.error : undefined;
  const lookupFailed = planQuery.isError && !noStoredPlan;

  if (calcError || lookupFailed) {
    const error = calcError ?? planQuery.error;
    const code = getApiErrorCode(error);
    const blocker = isActivationErrorCode(code) ? ACTIVATION_BLOCKERS[code] : null;
    const notFound = !blocker && isNotFoundError(error);

    return (
      <AppPageContainer>
        {header}
        {blocker ? (
          <EmptyState
            icon={Calculator}
            title={blocker.title}
            description={blocker.body}
            action={
              <GoldButton asChild>
                <Link to={blocker.actionTo}>{blocker.actionLabel}</Link>
              </GoldButton>
            }
          />
        ) : (
          <EmptyState
            icon={Calculator}
            variant={notFound ? "default" : "error"}
            title={
              notFound
                ? "Selection not found"
                : "We couldn't calculate your plan right now"
            }
            description={
              notFound
                ? "That program selection doesn't exist or isn't yours."
                : "Please try again in a moment."
            }
            action={
              notFound ? (
                <GoldButton asChild>
                  <Link to={ROUTES.MY_SELECTIONS}>Go to My selections</Link>
                </GoldButton>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void calculate(selectionId)}
                >
                  Try again
                </Button>
              )
            }
          />
        )}
      </AppPageContainer>
    );
  }

  // Loading the stored plan, or calculating a first one.
  return (
    <AppPageContainer>
      {header}
      <div className="flex min-h-48 flex-col items-center justify-center gap-3">
        <Spinner />
        <Typography variant="body-sm" color="muted">
          {calcState.isLoading
            ? "Preparing your recommendation…"
            : "Loading your recommendation…"}
        </Typography>
      </div>
    </AppPageContainer>
  );
}

function PlanView({
  plan,
  activationPaid,
  selectionId,
  recalculate,
  recalculating,
}: {
  plan: ActivationPlan;
  activationPaid: boolean;
  selectionId: string;
  recalculate: ReturnType<typeof useCalculateActivationMutation>[0];
  recalculating: boolean;
}) {
  const currency = useAppSelector((state) => state.auth.user?.preferredCurrency);
  const [choice, setChoice] = useState<Choice>(null);
  const { canProceed } = AFFORDABILITY_MESSAGES[plan.affordabilityStatus];
  const firstOption = plan.options[0];

  const onRecalculate = async () => {
    try {
      const result = await recalculate(selectionId).unwrap();
      // Options may have changed, so a previous choice no longer applies.
      setChoice(null);
      toast.success(
        result.activationRequired
          ? "Your recommendation has been recalculated."
          : "This program no longer needs activation.",
      );
    } catch (error) {
      const code = getApiErrorCode(error);
      toast.error(
        isActivationErrorCode(code)
          ? ACTIVATION_BLOCKERS[code].title
          : getApiErrorMessage(error, "Could not recalculate your plan."),
      );
    }
  };

  return (
    <div className="space-y-5">
      <ProjectionNotice projection={plan.projection} />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <ActivationSummary
          totalActivationRequirement={plan.oneTimeOption.totalActivationRequirement}
          activationPercentage={firstOption?.activationPercentage}
          goalAmount={firstOption?.totalGoal}
          calculatedAt={plan.updatedAt}
          currency={currency}
        />
        <AffordabilityNotice
          status={plan.affordabilityStatus}
          suggestedAlternatives={plan.suggestedAlternatives}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel tone="info">
          {canProceed ? "Choose your activation option" : "Your activation options"}
        </SectionLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={recalculating}
          onClick={() => void onRecalculate()}
        >
          {recalculating ? <ButtonSpinner className="size-4" /> : <RefreshCw />}
          Recalculate
        </Button>
      </div>

      <div role="radiogroup" aria-label="Activation options" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {plan.options.map((option) => (
            <PacedOptionCard
              key={option.label}
              option={option}
              currency={currency}
              selected={choice === option.label}
              selectable={canProceed && option.affordable}
              onSelect={() => setChoice(option.label)}
            />
          ))}
        </div>
        <OneTimeOptionCard
          totalActivationRequirement={plan.oneTimeOption.totalActivationRequirement}
          projection={plan.oneTimeOption.projection}
          currency={currency}
          selected={choice === "one_time"}
          selectable={canProceed}
          onSelect={() => setChoice("one_time")}
        />
      </div>

      <AppSurfaceCard padding="md">
        {activationPaid ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography variant="body-sm" className="text-muted-soft">
              Your activation for this program is paid. See the receipt in your
              payment history.
            </Typography>
            <GoldButton variant="ghost-outline" asChild>
              <Link to={ROUTES.BILLING}>Payment history</Link>
            </GoldButton>
          </div>
        ) : canProceed ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography variant="body-sm" className="text-muted-soft">
              {choice === "one_time"
                ? "You'll review the amount and accept the checkout acknowledgment before paying."
                : choice
                  ? "Installment payments are coming soon — choose the one-time option to pay now."
                  : "Choose an option above to continue."}
            </Typography>
            {/* TODO(installments): paced options pay their first installment
                once installment scheduling exists; one-time only for now. */}
            {choice === "one_time" ? (
              <GoldButton asChild>
                <Link to={checkoutPath("program_activation", selectionId)}>
                  Continue to activation payment
                </Link>
              </GoldButton>
            ) : choice ? (
              <GoldButton disabled>Continue to activation payment</GoldButton>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography variant="body-sm" className="text-muted-soft">
              Try the suggestions above, then recalculate to see an updated plan.
            </Typography>
            <div className="flex flex-wrap gap-2">
              <GoldButton variant="ghost-outline" asChild>
                <Link to={ROUTES.QUESTIONNAIRE}>Update Success Profile</Link>
              </GoldButton>
              <GoldButton variant="ghost-outline" asChild>
                <Link to={ROUTES.SUCCESS_CENTERS}>Explore other programs</Link>
              </GoldButton>
            </div>
          </div>
        )}
      </AppSurfaceCard>
    </div>
  );
}
