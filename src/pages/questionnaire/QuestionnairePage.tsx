import { useRef, useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control, type FieldPath } from "react-hook-form";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { FormCommon } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { WizardStepper } from "@/components/common/WizardStepper";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
  StatusChip,
} from "@/components/member/app";
import {
  AboutStep,
  DiscretionaryStep,
  FinancesStep,
  PlanningStep,
  ReviewStep,
} from "@/components/success-profile/SuccessProfileSteps";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  formValuesToSuccessProfileRequest,
  successProfileFormSchema,
  successProfileToFormValues,
  type SuccessProfileFormValues,
} from "@/lib/schemas/successProfile";
import { FINANCIAL_FIELDS } from "@/lib/success-profile/labels";
import {
  useCompleteSuccessProfileMutation,
  useCreateSuccessProfileMutation,
  useGetMySuccessProfileQuery,
  useUpdateSuccessProfileMutation,
} from "@/store/api/successProfileApi";
import type {
  SuccessProfileRecord,
  UpdateSuccessProfileRequest,
} from "@/types/successProfile";
import { ROUTES } from "@/utils/constants";

type StepDef = {
  title: string;
  description: string;
  /** Form fields validated before leaving the step. */
  fields: FieldPath<SuccessProfileFormValues>[];
  /** API body keys this step saves. */
  sections: (keyof UpdateSuccessProfileRequest)[];
  /** Omitted for the final review step. */
  Component?: ComponentType<{ control: Control<SuccessProfileFormValues> }>;
};

const STEPS: StepDef[] = [
  {
    title: "About you",
    description: "Tell us who this plan is for and where your income comes from.",
    fields: ["profileType", "employmentSource"],
    sections: ["profileType", "employmentSource"],
    Component: AboutStep,
  },
  {
    title: "Monthly finances",
    description:
      "A clear picture of your monthly money. Skip anything you're unsure of — you can come back later.",
    fields: FINANCIAL_FIELDS.map((field) => `financials.${field.key}` as const),
    sections: ["financials"],
    Component: FinancesStep,
  },
  {
    title: "Discretionary rule",
    description:
      "Choose how much of what's left after essentials you're comfortable directing toward your goals.",
    fields: ["discretionaryRule.label", "discretionaryRule.customPercentage"],
    sections: ["discretionaryRule"],
    Component: DiscretionaryStep,
  },
  {
    title: "Planning",
    description: "Help us understand your goals and what's in the way.",
    fields: [
      "planningAnswers.desiredResult",
      "planningAnswers.whatIsBlocking",
      "planningAnswers.goalPriorities",
      "planningAnswers.wouldReducingExpenseHelp",
      "planningAnswers.wouldIncreasingIncomeHelp",
      "planningAnswers.willingToConsiderLongerTimeline",
    ],
    sections: ["planningAnswers"],
    Component: PlanningStep,
  },
  {
    title: "Review & confirm",
    description: "Check your answers, then confirm and submit your profile.",
    fields: ["accuracyConfirmed"],
    sections: [],
  },
];

const STEP_TITLES = STEPS.map((step) => step.title);

export default function QuestionnairePage() {
  const profileQuery = useGetMySuccessProfileQuery();

  return (
    <AppPageContainer>
      {profileQuery.isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : profileQuery.isError ? (
        <EmptyState
          icon={ClipboardList}
          variant="error"
          title="Could not load your Success Profile"
          description={getApiErrorMessage(
            profileQuery.error,
            "Please try again in a moment.",
          )}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={profileQuery.refetch}
            >
              Try again
            </Button>
          }
        />
      ) : (
        <SuccessProfileWizard profile={profileQuery.data ?? null} />
      )}
    </AppPageContainer>
  );
}

/**
 * Mounted only after the profile loads, so the form starts from saved data and
 * later refetches never overwrite what the participant is typing.
 */
function SuccessProfileWizard({
  profile,
}: {
  profile: SuccessProfileRecord | null;
}) {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [createProfile, createState] = useCreateSuccessProfileMutation();
  const [updateProfile, updateState] = useUpdateSuccessProfileMutation();
  const [completeProfile, completeState] = useCompleteSuccessProfileMutation();

  const initialValues = successProfileToFormValues(profile);
  const form = useForm<SuccessProfileFormValues>({
    resolver: zodResolver(successProfileFormSchema),
    defaultValues: initialValues,
  });
  // Last body the server accepted — lets us skip saves when nothing changed.
  const lastSaved = useRef(formValuesToSuccessProfileRequest(initialValues));

  const step = STEPS[stepIdx]!;
  const isLast = stepIdx === STEPS.length - 1;
  const saving = createState.isLoading || updateState.isLoading;
  const busy = saving || completeState.isLoading;

  /** Validates and saves the current step. Returns false if the user must stay. */
  const saveCurrentStep = async (): Promise<boolean> => {
    if (!(await form.trigger(step.fields))) return false;

    const values = form.getValues();
    const request = formValuesToSuccessProfileRequest(values);
    const changed = step.sections.filter(
      (key) =>
        JSON.stringify(request[key]) !== JSON.stringify(lastSaved.current[key]),
    );
    if (changed.length === 0) return true;

    const body: UpdateSuccessProfileRequest = Object.fromEntries(
      changed.map((key) => [key, request[key]]),
    );

    try {
      if (profile) {
        await updateProfile(body).unwrap();
      } else if (values.profileType) {
        // POST upserts, so a repeat before the refetch lands is still safe.
        await createProfile({ ...body, profileType: values.profileType }).unwrap();
      }
      lastSaved.current = { ...lastSaved.current, ...body };
      // The server clears the confirmation on edits; mirror that in the form.
      form.setValue("accuracyConfirmed", false);
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save your progress."));
      return false;
    }
  };

  const goToStep = (index: number) => {
    form.clearErrors();
    setStepIdx(index);
  };

  const moveBy = async (offset: number) => {
    if (await saveCurrentStep()) goToStep(stepIdx + offset);
  };

  const saveAndExit = async () => {
    if (!(await saveCurrentStep())) return;
    toast.success("Progress saved.");
    navigate(ROUTES.DASHBOARD);
  };

  const submit = async () => {
    // Enter in a field submits the form; only the review step may complete it.
    if (!isLast) {
      await moveBy(1);
      return;
    }
    try {
      await completeProfile().unwrap();
      toast.success("Success Profile submitted.");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not submit your profile."));
    }
  };

  const isComplete = profile?.status === "complete";

  return (
    <>
      <ParticipantPageHeader
        overline="BMIS · Success Profile"
        title="Success Profile"
        subtitle="A short intake that shapes your BMIS planning. Your progress is saved at every step."
        actions={
          <>
            <StatusChip tone={isComplete ? "success" : "muted"}>
              {isComplete ? "Submitted" : "In progress"}
            </StatusChip>
            <StatusChip tone="gold">
              {profile?.completionPercentage ?? 0}% complete
            </StatusChip>
          </>
        }
      />

      {isComplete ? (
        <InfoCallout className="mb-6 max-w-2xl">
          You've submitted your Success Profile. If you change any answers,
          you'll be asked to review and confirm it again.
        </InfoCallout>
      ) : null}

      <WizardStepper
        steps={STEP_TITLES}
        current={stepIdx}
        className="mb-6 max-w-2xl"
      />

      <AppSurfaceCard className="max-w-2xl">
        <SectionLabel tone="info">
          Step {stepIdx + 1} of {STEPS.length}
        </SectionLabel>
        <Typography variant="h6" className="mt-1.5 text-ink-heading">
          {step.title}
        </Typography>
        <Typography variant="body-sm" className="mt-1 text-muted-soft">
          {step.description}
        </Typography>

        <FormCommon form={form} onSubmit={submit} className="mt-5 space-y-0">
          {step.Component ? (
            <step.Component control={form.control} />
          ) : (
            <ReviewStep control={form.control} onEditStep={goToStep} />
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <GoldButton
              type="button"
              variant="ghost-outline"
              disabled={busy}
              onClick={() => void saveAndExit()}
            >
              Save & exit
            </GoldButton>
            <div className="flex gap-2">
              {stepIdx > 0 ? (
                <GoldButton
                  type="button"
                  variant="ghost-outline"
                  disabled={busy}
                  onClick={() => void moveBy(-1)}
                >
                  Back
                </GoldButton>
              ) : null}
              {isLast ? (
                <GoldButton type="submit" disabled={busy}>
                  {completeState.isLoading ? <ButtonSpinner /> : null}
                  Submit profile
                </GoldButton>
              ) : (
                <GoldButton
                  type="button"
                  disabled={busy}
                  onClick={() => void moveBy(1)}
                >
                  {saving ? <ButtonSpinner /> : null}
                  Continue
                </GoldButton>
              )}
            </div>
          </div>
        </FormCommon>
      </AppSurfaceCard>
    </>
  );
}
