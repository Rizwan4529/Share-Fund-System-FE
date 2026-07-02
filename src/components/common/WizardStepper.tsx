import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type WizardStepperProps = {
  steps: string[];
  current: number;
  className?: string;
};

export function WizardStepper({ steps, current, className }: WizardStepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, i) => (
        <div key={step} className="flex flex-1 items-center gap-2">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold",
              i <= current
                ? "bg-gradient-gold text-navy-deep"
                : "border border-line bg-white text-muted-soft",
            )}
          >
            {i + 1}
          </div>
          {i < steps.length - 1 ? (
            <div
              className={cn(
                "h-0.5 flex-1 rounded-full",
                i < current ? "bg-gold-dark" : "bg-line",
              )}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function WizardStepLabels({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="mt-2 flex justify-between">
      {steps.map((step, i) => (
        <Typography
          key={step}
          variant="caption"
          color={i === current ? "default" : "muted"}
          className={cn(i === current && "font-semibold text-ink-heading")}
        >
          {step}
        </Typography>
      ))}
    </div>
  );
}
