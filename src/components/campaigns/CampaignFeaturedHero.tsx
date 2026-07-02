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
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-hero-card p-4 shadow-app-hero sm:p-6 lg:p-8">
      <img
        src={ASSETS.worldWhite}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-20px] hidden w-[300px] -translate-y-1/2 opacity-[0.1] sm:block"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4 sm:gap-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-gold/34 bg-gold/13 sm:size-14">
              <Icon className="size-6 text-gold sm:size-7" />
            </span>
            <div className="min-w-0 flex-1">
              {category.tag ? (
                <span className="mb-2 inline-flex rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide text-gold-chip">
                  {category.tag}
                </span>
              ) : null}
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                {category.name}
              </h2>
            </div>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-white/75 sm:mt-2 sm:max-w-lg sm:text-[15px]">
            {category.long}
          </p>
        </div>
        <GoldButton size="app" className="w-full shrink-0 sm:w-auto" asChild>
          <Link to={href}>
            Explore
            <ArrowRight className="size-4" strokeWidth={2.3} />
          </Link>
        </GoldButton>
      </div>
    </div>
  );
}
