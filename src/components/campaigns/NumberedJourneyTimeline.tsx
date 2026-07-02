type Step = { title: string; note: string };

type NumberedJourneyTimelineProps = {
  steps: Step[];
};

export function NumberedJourneyTimeline({ steps }: NumberedJourneyTimelineProps) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-gold-dark bg-bg-gold font-display text-[14px] font-bold text-gold-dark">
              {i + 1}
            </span>
            {i < steps.length - 1 ? (
              <span className="my-1 w-0.5 flex-1 min-h-3.5 bg-line" />
            ) : null}
          </div>
          <div className="pb-4">
            <h4 className="font-display text-[15.5px] font-bold text-ink-heading">
              {step.title}
            </h4>
            <p className="mt-1 text-[13.5px] leading-relaxed text-[#8496b7]">
              {step.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
