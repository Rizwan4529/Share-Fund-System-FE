import { Star } from "lucide-react";

type BenefitHighlightCardProps = {
  title?: string;
  description: string;
};

export function BenefitHighlightCard({
  title = "How it helps",
  description,
}: BenefitHighlightCardProps) {
  return (
    <div className="rounded-panel border border-border-gold bg-gradient-to-br from-bg-gold to-bg-gold-alt p-6">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-border-gold bg-white/60">
        <Star className="size-5 text-gold-dark" fill="currentColor" />
      </div>
      <h3 className="font-display text-[17px] font-bold text-ink-heading">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted-soft">{description}</p>
    </div>
  );
}
