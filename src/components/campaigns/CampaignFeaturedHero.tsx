import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { getCategoryIcon } from "@/lib/app/categoryIcons";
import { ASSETS } from "@/utils/assets";
import type { CampaignCategory } from "@/types";

type CampaignFeaturedHeroProps = {
  category: CampaignCategory;
  href: string;
};

export function CampaignFeaturedHero({ category, href }: CampaignFeaturedHeroProps) {
  const Icon = getCategoryIcon(category.id);

  return (
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-hero-card p-8 shadow-app-hero">
      <img
        src={ASSETS.worldWhite}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-20px] w-[300px] -translate-y-1/2 opacity-[0.1]"
      />
      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="flex min-w-[260px] flex-1 items-start gap-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-gold/34 bg-gold/13">
            <Icon className="size-7 text-gold" />
          </span>
          <div>
            {category.tag ? (
              <span className="mb-2 inline-flex rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide text-gold-chip">
                {category.tag}
              </span>
            ) : null}
            <h2 className="font-display text-[28px] font-bold tracking-tight text-white">
              {category.name}
            </h2>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/75">
              {category.long}
            </p>
          </div>
        </div>
        <GoldButton size="app" asChild>
          <Link to={href}>
            Explore
            <ArrowRight className="size-4" strokeWidth={2.3} />
          </Link>
        </GoldButton>
      </div>
    </div>
  );
}
