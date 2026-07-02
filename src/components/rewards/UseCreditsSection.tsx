import { ShoppingBag, Store, Ticket, Wrench } from "lucide-react";

import { AppSurfaceCard } from "@/components/member/app";
import { SectionLabel } from "@/components/member/app";
import { StatusPill } from "@/components/common/StatusPill";
import { cn } from "@/lib/utils";

const ICONS = [Ticket, Store, Wrench, ShoppingBag];

type UseCard = { title: string; soon: boolean };

type UseCreditsSectionProps = {
  cards: UseCard[];
};

export function UseCreditsSection({ cards }: UseCreditsSectionProps) {
  return (
    <AppSurfaceCard padding="md">
      <SectionLabel>Ways to use them</SectionLabel>
      <h3 className="mt-2 font-display text-xl font-bold text-ink-heading">
        Put your credits to work
      </h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {cards.map((card, i) => {
          const Icon = ICONS[i] ?? Ticket;
          return (
            <div
              key={card.title}
              className={cn(
                "rounded-lg border border-line bg-bg-card p-4 transition-all",
                "hover:-translate-y-0.5 hover:border-gold-chip",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg border border-border-gold bg-bg-icon">
                  <Icon className="size-4 text-gold-dark" />
                </span>
                {card.soon ? <StatusPill status="soon">Soon</StatusPill> : null}
              </div>
              <div className="text-[15px] font-bold text-ink-heading">{card.title}</div>
            </div>
          );
        })}
      </div>
    </AppSurfaceCard>
  );
}

export function MarketplacePreview() {
  return (
    <AppSurfaceCard>
      <SectionLabel>Marketplace</SectionLabel>
      <h3 className="mt-2 font-display text-xl font-bold text-ink-heading">
        Coming soon
      </h3>
      <p className="mt-2 text-[14.5px] text-muted-soft">
        Redeem credits for marketplace rewards and partner offers.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex h-24 items-center justify-center rounded-lg border border-dashed border-line bg-bg-alt text-[13px] font-semibold text-muted-soft"
          >
            Marketplace item
          </div>
        ))}
      </div>
    </AppSurfaceCard>
  );
}
