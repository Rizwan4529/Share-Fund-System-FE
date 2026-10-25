import type { ReactNode } from "react";
import { useWatch, type Control } from "react-hook-form";

import {
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Textarea,
} from "@/components/common/FormCommon";
import { Typography } from "@/components/common/Typography";
import { InfoCallout } from "@/components/member/app";
import { Button } from "@/components/ui/button";
import type { SuccessProfileFormValues } from "@/lib/schemas/successProfile";
import {
  DISCRETIONARY_RULES,
  FINANCIAL_FIELDS,
  PLANNING_CHOICE_OPTIONS,
  PLANNING_CHOICE_QUESTIONS,
  PLANNING_TEXT_QUESTIONS,
  PROFILE_TYPE_LABELS,
  planningChoiceLabel,
} from "@/lib/success-profile/labels";
import {
  DISCRETIONARY_RULE_LABELS,
  SUCCESS_PROFILE_TYPES,
} from "@/types/successProfile";

type StepProps = { control: Control<SuccessProfileFormValues> };

const PROFILE_TYPE_OPTIONS = SUCCESS_PROFILE_TYPES.map((type) => ({
  value: type,
  label: PROFILE_TYPE_LABELS[type],
}));

const DISCRETIONARY_RULE_OPTIONS = DISCRETIONARY_RULE_LABELS.map((label) => ({
  value: label,
  label: DISCRETIONARY_RULES[label].label,
}));

export function AboutStep({ control }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        control={control}
        name="profileType"
        label="Who is this plan for?"
        required
        placeholder="Select a profile type"
        options={PROFILE_TYPE_OPTIONS}
      />
      <Input
        control={control}
        name="employmentSource"
        label="Primary income source"
        placeholder="Employment, self-employed, benefits…"
      />
    </div>
  );
}

export function FinancesStep({ control }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {FINANCIAL_FIELDS.map((field) => (
        <Input
          key={field.key}
          control={control}
          name={`financials.${field.key}`}
          label={field.label}
          description={field.description}
          placeholder={field.placeholder}
          type="number"
          min={0}
          step="any"
          inputMode="decimal"
        />
      ))}
    </div>
  );
}

export function DiscretionaryStep({ control }: StepProps) {
  const label = useWatch({ control, name: "discretionaryRule.label" });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        control={control}
        name="discretionaryRule.label"
        label="How much of your discretionary income can go toward your goals?"
        placeholder="Select a rule"
        options={DISCRETIONARY_RULE_OPTIONS}
        description={label ? DISCRETIONARY_RULES[label].description : undefined}
        itemClassName="sm:col-span-2"
      />
      {label === "custom" ? (
        <Input
          control={control}
          name="discretionaryRule.customPercentage"
          label="Custom percentage"
          required
          placeholder="25"
          type="number"
          min={0}
          max={100}
          step="any"
          inputMode="decimal"
        />
      ) : null}
    </div>
  );
}

export function PlanningStep({ control }: StepProps) {
  return (
    <div className="space-y-5">
      {PLANNING_TEXT_QUESTIONS.map((question) => (
        <Textarea
          key={question.key}
          control={control}
          name={`planningAnswers.${question.key}`}
          label={question.label}
          placeholder={question.placeholder}
          className="min-h-24"
        />
      ))}
      {PLANNING_CHOICE_QUESTIONS.map((question) => (
        <RadioGroup
          key={question.key}
          control={control}
          name={`planningAnswers.${question.key}`}
          label={question.label}
          options={PLANNING_CHOICE_OPTIONS}
          className="flex flex-wrap gap-5"
        />
      ))}
    </div>
  );
}

export function ReviewStep({
  control,
  onEditStep,
}: StepProps & { onEditStep: (stepIndex: number) => void }) {
  const values = useWatch({ control });
  const rule = values.discretionaryRule;
  const answers = values.planningAnswers;

  const ruleSummary =
    rule?.label === "custom"
      ? `Custom — ${rule.customPercentage}%`
      : rule?.label
        ? DISCRETIONARY_RULES[rule.label].label
        : "";

  return (
    <div className="space-y-4">
      <ReviewSection title="About you" onEdit={() => onEditStep(0)}>
        <ReviewRow
          label="Profile type"
          value={values.profileType ? PROFILE_TYPE_LABELS[values.profileType] : ""}
        />
        <ReviewRow label="Primary income source" value={values.employmentSource} />
      </ReviewSection>

      <ReviewSection title="Monthly finances" onEdit={() => onEditStep(1)}>
        {FINANCIAL_FIELDS.map((field) => (
          <ReviewRow
            key={field.key}
            label={field.label}
            value={formatAmount(values.financials?.[field.key])}
          />
        ))}
      </ReviewSection>

      <ReviewSection title="Discretionary rule" onEdit={() => onEditStep(2)}>
        <ReviewRow label="Selected rule" value={ruleSummary} />
      </ReviewSection>

      <ReviewSection title="Planning" onEdit={() => onEditStep(3)}>
        {PLANNING_TEXT_QUESTIONS.map((question) => (
          <ReviewRow
            key={question.key}
            label={question.label}
            value={answers?.[question.key]}
          />
        ))}
        {PLANNING_CHOICE_QUESTIONS.map((question) => (
          <ReviewRow
            key={question.key}
            label={question.label}
            value={planningChoiceLabel(answers?.[question.key])}
          />
        ))}
      </ReviewSection>

      <InfoCallout>
        Recommendations and timelines built from this profile are estimates,
        not guarantees.
      </InfoCallout>

      <Checkbox
        control={control}
        name="accuracyConfirmed"
        label="I confirm the information above is accurate to the best of my knowledge."
        required
        itemClassName="items-start rounded-lg border border-line bg-bg-card px-3.5 py-3"
        className="leading-snug"
      />
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <Typography variant="label" className="text-ink-heading">
          {title}
        </Typography>
        <Button type="button" variant="link" size="xs" onClick={onEdit}>
          Edit
        </Button>
      </div>
      <dl className="divide-y divide-line">{children}</dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:justify-between sm:gap-6">
      <Typography as="dt" variant="body-sm" color="muted">
        {label}
      </Typography>
      <Typography
        as="dd"
        variant="body-sm"
        className="font-medium text-ink-heading sm:max-w-[55%] sm:text-right"
      >
        {value?.trim() ? value : "—"}
      </Typography>
    </div>
  );
}

function formatAmount(value?: string): string {
  if (!value?.trim()) return "";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
}
