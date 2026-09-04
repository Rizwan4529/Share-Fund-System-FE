import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerCommon } from "../common/DrawerCommon";
import {
  FormCommon,
  Input,
  Select,
  Textarea,
} from "../common/FormCommon";
import { GoldButton } from "../common/GoldButton";
import { Spinner } from "../common/LoadingScreen";
import { ButtonSpinner } from "../common/LoadingStates";
import { Typography } from "../common/Typography";
import { Button } from "../ui/button";
import { getApiErrorMessage } from "../../lib/api/getApiErrorMessage";
import {
  numberToInput,
  parseOptionalNumber,
  successCenterProgramFormSchema,
  type SuccessCenterProgramFormValues,
} from "../../lib/schemas/successCenters";
import {
  useCreateSuccessCenterProgramMutation,
  useGetSuccessCenterProgramByIdQuery,
  useListSuccessCenterCategoriesQuery,
  useUpdateSuccessCenterProgramMutation,
} from "../../store/api/successCentersApi";
import {
  SUCCESS_CENTER_GOAL_NATURES,
  SUCCESS_CENTER_PROGRAM_STATUSES,
  SUCCESS_CENTER_PROGRAM_TYPES,
} from "../../types/successCenters";

type SuccessCenterProgramFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  programId?: string | null;
  defaultCategoryId?: string | null;
};

const STATUS_OPTIONS = SUCCESS_CENTER_PROGRAM_STATUSES.map((status) => ({
  value: status,
  label: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const TYPE_OPTIONS = SUCCESS_CENTER_PROGRAM_TYPES.map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

const GOAL_OPTIONS = SUCCESS_CENTER_GOAL_NATURES.map((nature) => ({
  value: nature,
  label: nature.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const CREATE_DEFAULTS: SuccessCenterProgramFormValues = {
  categoryId: "",
  name: "",
  description: "",
  educationalContent: "",
  status: "draft",
  programType: "planning",
  goalNature: "one_time",
  order: "",
  activationPercentageMin: "",
  activationPercentageMax: "",
  defaultActivationPercentage: "",
  growthPeriodDays: "",
  roundingIncrement: "",
  minGoalAmount: "",
  maxGoalAmount: "",
};

function optionalTrimmed(value?: string): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed || undefined;
}

export function SuccessCenterProgramFormDrawer({
  open,
  onOpenChange,
  mode,
  programId,
  defaultCategoryId,
}: SuccessCenterProgramFormDrawerProps) {
  const close = () => onOpenChange(false);
  const categoriesQuery = useListSuccessCenterCategoriesQuery(undefined, {
    skip: !open,
  });
  const programQuery = useGetSuccessCenterProgramByIdQuery(programId ?? "", {
    skip: !open || mode !== "edit" || !programId,
  });
  const [createProgram, createState] = useCreateSuccessCenterProgramMutation();
  const [updateProgram, updateState] = useUpdateSuccessCenterProgramMutation();

  const form = useForm<SuccessCenterProgramFormValues>({
    resolver: zodResolver(successCenterProgramFormSchema),
    defaultValues: CREATE_DEFAULTS,
  });
  const saving = createState.isLoading || updateState.isLoading;
  const categories = categoriesQuery.data ?? [];

  useEffect(() => {
    if (!open) {
      form.reset(CREATE_DEFAULTS);
      return;
    }
    if (mode === "create") {
      form.reset({
        ...CREATE_DEFAULTS,
        categoryId: defaultCategoryId ?? "",
      });
    }
  }, [open, mode, defaultCategoryId, form]);

  useEffect(() => {
    if (!open || mode !== "edit" || !programQuery.data) return;
    const program = programQuery.data;
    const rules = program.activationRules ?? {};
    form.reset({
      categoryId: String(program.categoryId),
      name: program.name,
      description: program.description ?? "",
      educationalContent: program.educationalContent ?? "",
      status: program.status,
      programType: program.programType,
      goalNature: program.goalNature,
      order: numberToInput(program.order),
      activationPercentageMin: numberToInput(rules.activationPercentageMin),
      activationPercentageMax: numberToInput(rules.activationPercentageMax),
      defaultActivationPercentage: numberToInput(
        rules.defaultActivationPercentage,
      ),
      growthPeriodDays: numberToInput(rules.growthPeriodDays),
      roundingIncrement: numberToInput(rules.roundingIncrement),
      minGoalAmount: numberToInput(rules.minGoalAmount),
      maxGoalAmount: numberToInput(rules.maxGoalAmount),
    });
  }, [open, mode, programQuery.data, form]);

  const onSubmit = async (values: SuccessCenterProgramFormValues) => {
    const activationRules = {
      activationPercentageMin:
        parseOptionalNumber(values.activationPercentageMin) ?? null,
      activationPercentageMax:
        parseOptionalNumber(values.activationPercentageMax) ?? null,
      defaultActivationPercentage:
        parseOptionalNumber(values.defaultActivationPercentage) ?? null,
      growthPeriodDays: parseOptionalNumber(values.growthPeriodDays) ?? null,
      roundingIncrement: parseOptionalNumber(values.roundingIncrement) ?? null,
      minGoalAmount: parseOptionalNumber(values.minGoalAmount) ?? null,
      maxGoalAmount: parseOptionalNumber(values.maxGoalAmount) ?? null,
    };
    const order = parseOptionalNumber(values.order);
    const payload = {
      categoryId: values.categoryId,
      name: values.name.trim(),
      description: optionalTrimmed(values.description),
      educationalContent: optionalTrimmed(values.educationalContent),
      status: values.status,
      programType: values.programType,
      goalNature: values.goalNature,
      order: order ?? undefined,
      activationRules,
    };

    try {
      if (mode === "create") {
        await createProgram(payload).unwrap();
        toast.success("Program created.");
      } else if (programId) {
        await updateProgram({ id: programId, ...payload }).unwrap();
        toast.success("Program updated.");
      }
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save program."));
    }
  };

  const loadingEdit = mode === "edit" && programQuery.isLoading;
  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add program" : "Edit program"}
      description="Programs belong to a Success Center category and can be included in founder plans."
    >
      {loadingEdit || categoriesQuery.isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <FormCommon form={form} onSubmit={onSubmit} className="space-y-4">
          <Select
            control={form.control}
            name="categoryId"
            label="Category"
            required
            placeholder="Select a category"
            options={categoryOptions}
          />
          <Input
            control={form.control}
            name="name"
            label="Name"
            required
            placeholder="Rent Stabilization"
          />
          <Textarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Short program summary."
          />
          <Textarea
            control={form.control}
            name="educationalContent"
            label="Educational content"
            placeholder="Education / planning guidance for participants."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              control={form.control}
              name="status"
              label="Status"
              required
              options={STATUS_OPTIONS}
            />
            <Select
              control={form.control}
              name="programType"
              label="Program type"
              required
              options={TYPE_OPTIONS}
            />
            <Select
              control={form.control}
              name="goalNature"
              label="Goal nature"
              required
              options={GOAL_OPTIONS}
            />
            <Input
              control={form.control}
              name="order"
              label="Order"
              type="number"
              placeholder="1"
            />
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <Typography variant="label">Activation rules</Typography>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                control={form.control}
                name="defaultActivationPercentage"
                label="Default activation %"
                type="number"
              />
              <Input
                control={form.control}
                name="activationPercentageMin"
                label="Min activation %"
                type="number"
              />
              <Input
                control={form.control}
                name="activationPercentageMax"
                label="Max activation %"
                type="number"
              />
              <Input
                control={form.control}
                name="growthPeriodDays"
                label="Growth period (days)"
                type="number"
              />
              <Input
                control={form.control}
                name="roundingIncrement"
                label="Rounding increment"
                type="number"
              />
              <Input
                control={form.control}
                name="minGoalAmount"
                label="Min goal amount"
                type="number"
              />
              <Input
                control={form.control}
                name="maxGoalAmount"
                label="Max goal amount"
                type="number"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <GoldButton type="submit" disabled={saving}>
              {saving ? <ButtonSpinner /> : null}
              {mode === "create" ? "Create program" : "Save changes"}
            </GoldButton>
          </div>
        </FormCommon>
      )}
    </DrawerCommon>
  );
}
