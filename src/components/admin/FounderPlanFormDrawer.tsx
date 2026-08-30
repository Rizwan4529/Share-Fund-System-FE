import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ProgramPickerField } from "@/components/admin/ProgramPickerField";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import {
  Checkbox,
  FormCommon,
  Input,
  Select,
} from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { founderPlanNameLabel, programIds } from "@/lib/founder-plans/labels";
import {
  founderPlanFormSchema,
  parseOptionalCap,
  type FounderPlanFormValues,
} from "@/lib/schemas/founderPlans";
import {
  useCreateFounderPlanMutation,
  useGetFounderPlanByIdQuery,
  useListSuccessCenterProgramsQuery,
  useUpdateFounderPlanMutation,
} from "@/store/api/founderPlansApi";
import {
  FOUNDER_PLAN_BMIS_LEVELS,
  FOUNDER_PLAN_NAMES,
  FOUNDER_PLAN_PRIORITY_LEVELS,
  type FounderPlanName,
} from "@/types/founderPlans";

type FounderPlanFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  planId?: string | null;
  usedNames: FounderPlanName[];
};

const PRIORITY_OPTIONS = FOUNDER_PLAN_PRIORITY_LEVELS.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

const BMIS_OPTIONS = FOUNDER_PLAN_BMIS_LEVELS.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

const CREATE_DEFAULTS: FounderPlanFormValues = {
  name: "essential_100",
  price: "",
  includedSuccessCenters: [],
  eligiblePrograms: [],
  fundingCapStandard: "",
  fundingCapPremium: "",
  majorOneTimeProgramsEligible: false,
  priorityLevel: "standard",
  bmisPlanningLevel: "standard",
  founderBenefitsVersion: "v1",
  status: "active",
};

function toPayload(values: FounderPlanFormValues) {
  return {
    price: Number(values.price),
    includedSuccessCenters: values.includedSuccessCenters,
    eligiblePrograms: values.eligiblePrograms ?? [],
    fundingCap: {
      standard: parseOptionalCap(values.fundingCapStandard),
      premium: parseOptionalCap(values.fundingCapPremium),
    },
    majorOneTimeProgramsEligible: values.majorOneTimeProgramsEligible,
    priorityLevel: values.priorityLevel,
    bmisPlanningLevel: values.bmisPlanningLevel,
    founderBenefitsVersion: values.founderBenefitsVersion?.trim() || "v1",
    status: values.status,
  };
}

export function FounderPlanFormDrawer({
  open,
  onOpenChange,
  mode,
  planId,
  usedNames,
}: FounderPlanFormDrawerProps) {
  const close = () => onOpenChange(false);
  const programsQuery = useListSuccessCenterProgramsQuery(undefined, {
    skip: !open,
  });
  const planQuery = useGetFounderPlanByIdQuery(planId ?? "", {
    skip: !open || mode !== "edit" || !planId,
  });
  const [createPlan, createState] = useCreateFounderPlanMutation();
  const [updatePlan, updateState] = useUpdateFounderPlanMutation();

  const availableNames = useMemo(
    () =>
      FOUNDER_PLAN_NAMES.filter(
        (name) => mode === "edit" || !usedNames.includes(name),
      ),
    [mode, usedNames],
  );

  const form = useForm<FounderPlanFormValues>({
    resolver: zodResolver(founderPlanFormSchema),
    defaultValues: {
      ...CREATE_DEFAULTS,
      name: availableNames[0] ?? "essential_100",
    },
  });

  useEffect(() => {
    if (!open || mode !== "create") return;
    form.reset({
      ...CREATE_DEFAULTS,
      name: availableNames[0] ?? "essential_100",
    });
  }, [open, mode, availableNames, form]);

  useEffect(() => {
    if (!planQuery.data || mode !== "edit") return;
    const plan = planQuery.data;
    form.reset({
      name: plan.name,
      price: String(plan.price),
      includedSuccessCenters: programIds(plan.includedSuccessCenters),
      eligiblePrograms: programIds(plan.eligiblePrograms),
      fundingCapStandard:
        plan.fundingCap?.standard == null
          ? ""
          : String(plan.fundingCap.standard),
      fundingCapPremium:
        plan.fundingCap?.premium == null
          ? ""
          : String(plan.fundingCap.premium),
      majorOneTimeProgramsEligible: Boolean(plan.majorOneTimeProgramsEligible),
      priorityLevel: plan.priorityLevel ?? "standard",
      bmisPlanningLevel: plan.bmisPlanningLevel ?? "standard",
      founderBenefitsVersion: plan.founderBenefitsVersion ?? "v1",
      status: plan.status,
    });
  }, [planQuery.data, mode, form]);

  const busy = createState.isLoading || updateState.isLoading;
  const programs = programsQuery.data ?? [];

  const onSubmit = async (values: FounderPlanFormValues) => {
    try {
      if (mode === "create") {
        await createPlan({ name: values.name, ...toPayload(values) }).unwrap();
        toast.success("Founder plan created.");
      } else if (planId) {
        await updatePlan({ id: planId, ...toPayload(values) }).unwrap();
        toast.success("Founder plan updated.");
      }
      close();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          mode === "create"
            ? "Could not create founder plan."
            : "Could not update founder plan.",
        ),
      );
    }
  };

  const loadingEdit =
    mode === "edit" && !planQuery.data && (planQuery.isLoading || planQuery.isFetching);

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add founder plan" : "Edit founder plan"}
      description="Prices, included programs, caps, and eligibility are stored on the plan — they are never hard-coded."
    >
      {loadingEdit ? (
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <FormCommon form={form} onSubmit={onSubmit} className="space-y-4">
          {mode === "create" ? (
            <Select
              control={form.control}
              name="name"
              label="Tier"
              required
              options={availableNames.map((name) => ({
                value: name,
                label: founderPlanNameLabel(name),
              }))}
              placeholder="Select tier"
            />
          ) : (
            <div className="space-y-1.5">
              <Typography variant="label">Tier</Typography>
              <Typography
                variant="body-sm"
                className="rounded-md border border-border-input bg-muted/40 px-3 py-2.5 font-medium text-ink-heading"
              >
                {planQuery.data
                  ? founderPlanNameLabel(planQuery.data.name)
                  : "—"}
              </Typography>
            </div>
          )}

          <Input
            control={form.control}
            name="price"
            label="One-time price"
            required
            type="number"
            min={0}
            step="any"
            placeholder="100"
          />
          <ProgramPickerField
            control={form.control}
            name="includedSuccessCenters"
            label="Included programs"
            required
            programs={programs}
            disabled={busy}
          />
          <ProgramPickerField
            control={form.control}
            name="eligiblePrograms"
            label="Eligible programs"
            programs={programs}
            disabled={busy}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              control={form.control}
              name="fundingCapStandard"
              label="Standard funding cap"
              type="number"
              min={0}
              step="any"
              placeholder="Optional"
            />
            <Input
              control={form.control}
              name="fundingCapPremium"
              label="Premium funding cap"
              type="number"
              min={0}
              step="any"
              placeholder="Optional"
            />
          </div>
          <Select
            control={form.control}
            name="priorityLevel"
            label="Priority level"
            options={PRIORITY_OPTIONS}
          />
          <Select
            control={form.control}
            name="bmisPlanningLevel"
            label="BMIS planning level"
            options={BMIS_OPTIONS}
          />
          <Input
            control={form.control}
            name="founderBenefitsVersion"
            label="Benefits version"
            placeholder="v1"
          />
          <Checkbox
            control={form.control}
            name="majorOneTimeProgramsEligible"
            label="Eligible for major one-time programs"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <GoldButton type="submit" disabled={busy || availableNames.length === 0}>
              {busy ? <ButtonSpinner className="size-4" /> : null}
              {mode === "create" ? "Create plan" : "Save changes"}
            </GoldButton>
          </div>
        </FormCommon>
      )}
    </DrawerCommon>
  );
}
