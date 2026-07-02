import type { LucideIcon } from "lucide-react";

type Item = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

type OnboardingHowItWorksListProps = {
  items: Item[];
};

export function OnboardingHowItWorksList({ items }: OnboardingHowItWorksListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex gap-4 rounded-lg border border-line bg-bg-card p-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border-gold bg-bg-icon">
            <Icon className="size-5 text-gold-dark" strokeWidth={1.7} />
          </span>
          <div>
            <h3 className="font-display text-[16.5px] font-bold text-ink-heading">
              {title}
            </h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-muted-soft">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
