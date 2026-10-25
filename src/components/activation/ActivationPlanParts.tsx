import type { ReactNode } from "react";
import { CheckCircle2, Info, Sprout } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { AppSurfaceCard, SectionLabel, StatusChip } from "@/components/member/app";
import {
  AFFORDABILITY_MESSAGES,
  PLAN_LABELS,
} from "@/lib/activation/labels";
import { formatCurrency } from "@/lib/app/greeting";
import { cn } from "@/lib/utils";
import type {
  ActivationOption,
  AffordabilityStatus,
} from "@/types/activation";

// Display only: every figure below comes straight from the API response.

/** "Activation requirement: $3,000 (10% of $30,000)". */
export function ActivationSummary({
  totalActivationRequirement,
  activationPercentage,
  goalAmount,
  calculatedAt,
  currency,
}: {
  totalActivationRequirement: number;
  activationPercentage?: number;
  goalAmount?: number;
  calculatedAt: string;
  currency?: string;
}) {
  return (
    <AppSurfaceCard>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionLabel tone="info">Activation requirement</SectionLabel>
        <StatusChip tone="muted">Estimate</StatusChip>
      </div>
      <Typography
        as="p"
        variant="h4"
        className="mt-2 font-display text-[28px] font-bold text-ink-heading"
      >
        {formatCurrency(totalActivationRequirement, currency)}
      </Typography>
      {activationPercentage != null && goalAmount != null ? (
        <Typography variant="body-sm" className="mt-1 text-muted-soft">
          {activationPercentage}% of your {formatCurrency(goalAmount, currency)} goal
        </Typography>
      ) : null}
      <Typography variant="caption" color="muted" className="mt-3 block">
        Calculated{" "}
        {new Date(calculatedAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </Typography>
    </AppSurfaceCard>
  );
}

const NOTICE_TONES = {
  success: { box: "border-success/25 bg-success-bg", icon: CheckCircle2, iconClass: "text-success" },
  info: { box: "border-info/20 bg-info-bg", icon: Info, iconClass: "text-info" },
  gold: { box: "border-gold/35 bg-bg-gold", icon: Sprout, iconClass: "text-gold-deep" },
} as const;

export function AffordabilityNotice({
  status,
  suggestedAlternatives,
}: {
  status: AffordabilityStatus;
  suggestedAlternatives: string[];
}) {
  const message = AFFORDABILITY_MESSAGES[status];
  const tone = NOTICE_TONES[message.tone];

  return (
    <div className={cn("rounded-panel border px-4 py-4 sm:px-6", tone.box)}>
      <div className="flex items-start gap-3">
        <tone.icon className={cn("mt-0.5 size-5 shrink-0", tone.iconClass)} />
        <div className="min-w-0">
          <Typography variant="label" className="text-ink-heading">
            {message.title}
          </Typography>
          <Typography variant="body-sm" className="mt-1.5 text-ink-heading/80">
            {message.body}
          </Typography>
          {suggestedAlternatives.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {suggestedAlternatives.map((text) => (
                <li key={text} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <Typography variant="body-sm" className="text-ink-heading">
                    {text}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Selectable card; unaffordable options stay visible but can't be chosen. */
function SelectableCard({
  selected,
  disabled,
  onSelect,
  children,
  className,
}: {
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex h-full w-full flex-col rounded-panel border bg-white p-4 text-left shadow-app-card transition sm:p-5",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-line hover:border-gold-chip",
        disabled && "cursor-not-allowed bg-bg-card opacity-70 shadow-none hover:border-line",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PacedOptionCard({
  option,
  selected,
  selectable,
  onSelect,
  currency,
}: {
  option: ActivationOption;
  selected: boolean;
  selectable: boolean;
  onSelect: () => void;
  currency?: string;
}) {
  return (
    <SelectableCard selected={selected} disabled={!selectable} onSelect={onSelect}>
      <div className="flex w-full items-start justify-between gap-2">
        <SectionLabel tone="navy">{PLAN_LABELS[option.label]}</SectionLabel>
        <StatusChip tone={option.affordable ? "success" : "muted"}>
          {option.affordable ? "Fits your budget" : "Above your budget"}
        </StatusChip>
      </div>
      <Typography
        as="span"
        variant="h5"
        className="mt-3 block font-display text-[22px] font-bold text-ink-heading"
      >
        {formatCurrency(option.scheduledPayment, currency)}
        <span className="text-sm font-semibold text-muted-soft"> / month</span>
      </Typography>
      <Typography variant="body-sm" className="mt-1 text-muted-soft">
        for {option.months} months
      </Typography>
      <dl className="mt-4 w-full space-y-1.5 border-t border-line pt-3 text-sm">
        <OptionFact
          label="Total activation"
          value={formatCurrency(option.totalActivationRequirement, currency)}
        />
        <OptionFact
          label="Growth period"
          value={
            option.growthPeriodDays != null
              ? `${option.growthPeriodDays} days`
              : "To be confirmed"
          }
        />
      </dl>
    </SelectableCard>
  );
}

export function OneTimeOptionCard({
  totalActivationRequirement,
  selected,
  selectable,
  onSelect,
  currency,
}: {
  totalActivationRequirement: number;
  selected: boolean;
  selectable: boolean;
  onSelect: () => void;
  currency?: string;
}) {
  return (
    <SelectableCard selected={selected} disabled={!selectable} onSelect={onSelect}>
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div>
          <SectionLabel tone="gold">One-time</SectionLabel>
          <Typography variant="label" className="mt-2 block text-ink-heading">
            Pay the full activation at once
          </Typography>
        </div>
        <Typography
          as="span"
          variant="h5"
          className="font-display text-[22px] font-bold text-ink-heading"
        >
          {formatCurrency(totalActivationRequirement, currency)}
        </Typography>
      </div>
    </SelectableCard>
  );
}

function OptionFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <Typography as="dt" variant="caption" color="muted">
        {label}
      </Typography>
      <Typography as="dd" variant="caption" className="font-semibold text-ink-heading">
        {value}
      </Typography>
    </div>
  );
}
