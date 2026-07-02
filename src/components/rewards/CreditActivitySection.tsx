import { Award, Gift, Star } from "lucide-react";

import { AppSurfaceCard } from "@/components/member/app";
import { cn } from "@/lib/utils";
import type { RewardHistoryItem } from "@/types";

const ICONS = [Star, Gift, Award];

type CreditActivitySectionProps = {
  items: RewardHistoryItem[];
};

export function CreditActivitySection({ items }: CreditActivitySectionProps) {
  return (
    <AppSurfaceCard>
      <h3 className="mb-5 font-display text-[19px] font-bold text-ink-heading">
        Credit activity
      </h3>
      <div className="space-y-1">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3.5 border-b border-line/80 py-3.5 last:border-0"
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-bg-gold">
                <Icon className="size-4 text-gold-dark" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[#33425f]">{item.title}</div>
                <div className="text-[12.5px] text-[#a4b1c9]">{item.date}</div>
              </div>
              <span
                className={cn(
                  "font-display text-[14px] font-bold",
                  item.positive ? "text-success" : "text-error",
                )}
              >
                {item.delta}
              </span>
            </div>
          );
        })}
      </div>
    </AppSurfaceCard>
  );
}
