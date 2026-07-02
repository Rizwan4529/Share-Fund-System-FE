import type { LucideIcon } from "lucide-react";
import { Gift, Sparkles, Star, Zap } from "lucide-react";

import { AppSurfaceCard } from "@/components/member/app";
import { SectionLabel } from "@/components/member/app";

const ICONS: Record<string, LucideIcon> = {
  "Welcome bonus": Sparkles,
  "Campaign activation": Zap,
  "Monthly check-in": Star,
  "Learning content": Gift,
};

type EarnCard = { title: string; points: string; desc: string };

type EarnCreditsSectionProps = {
  cards: EarnCard[];
};

export function EarnCreditsSection({ cards }: EarnCreditsSectionProps) {
  return (
    <AppSurfaceCard padding="md">
      <SectionLabel>How you earn</SectionLabel>
      <h3 className="mt-2 font-display text-xl font-bold text-ink-heading">
        Credits for staying engaged
      </h3>
      <div className="mt-5 flex flex-col gap-3">
        {cards.map((card) => {
          const Icon = ICONS[card.title] ?? Gift;
          return (
            <div
              key={card.title}
              className="flex items-center gap-3.5 rounded-lg border border-line/80 bg-input-bg p-3.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-gold bg-bg-icon">
                <Icon className="size-[18px] text-gold-dark" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-bold text-ink-heading">{card.title}</div>
                <div className="text-[13px] text-muted-soft">{card.desc}</div>
              </div>
              <span className="font-display text-[15px] font-bold text-gold-dark">
                {card.points}
              </span>
            </div>
          );
        })}
      </div>
    </AppSurfaceCard>
  );
}
