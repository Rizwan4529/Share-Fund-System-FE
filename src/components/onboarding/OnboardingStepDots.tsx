import { cn } from "@/lib/utils";

type OnboardingStepDotsProps = {
  steps: string[];
  current: number;
};

export function OnboardingStepDots({ steps, current }: OnboardingStepDotsProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-[30px] shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold",
                  done || active
                    ? "bg-gold-dark text-navy"
                    : "border border-[#dce3ee] bg-white/10 text-white/50",
                )}
              >
                {i + 1}
              </span>
              {i < steps.length - 1 ? (
                <span className="my-1 w-0.5 flex-1 min-h-3 bg-white/15" />
              ) : null}
            </div>
            <div className={cn("pb-5 pt-1", active ? "opacity-100" : "opacity-60")}>
              <span
                className={cn(
                  "text-[14px] font-semibold",
                  active ? "text-gold-chip" : "text-white/70",
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
