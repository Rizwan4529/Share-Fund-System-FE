import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Play } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import type { LearnItem } from "@/types";

type LearnFeaturedHeroProps = {
  item: LearnItem;
};

export function LearnFeaturedHero({ item }: LearnFeaturedHeroProps) {
  const href = item.type === "video" ? `/learn/${item.id}/watch` : `/learn/${item.id}`;

  return (
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-hero-card p-8 shadow-app-hero">
      <div className="relative max-w-xl">
        <span className="mb-3 inline-flex rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide text-gold-chip">
          Featured guide
        </span>
        <h2 className="font-display text-[28px] font-bold tracking-tight text-white">
          {item.title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-white/75">{item.blurb}</p>
        <p className="mt-2 text-[13px] text-white/60">{item.mins}</p>
        <GoldButton size="app" className="mt-5" asChild>
          <Link to={href}>
            Read guide
            <ArrowRight className="size-4" />
          </Link>
        </GoldButton>
      </div>
    </div>
  );
}

type LearnContentCardProps = {
  item: LearnItem;
};

export function LearnContentCard({ item }: LearnContentCardProps) {
  const href = item.type === "video" ? `/learn/${item.id}/watch` : `/learn/${item.id}`;
  const TypeIcon = item.type === "video" ? Play : BookOpen;

  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-gold-chip hover:shadow-app-card"
    >
      <div className="relative flex h-[104px] items-center justify-center bg-gradient-to-br from-bg-gold to-bg-gold-alt">
        <TypeIcon className="size-8 text-gold-dark/60" />
        <span className="absolute top-3 right-3 rounded-md border border-line bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-gold-dark">
          {item.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-[#a9842a]">
          {item.cat}
        </span>
        <h4 className="mt-1 font-display text-[15px] font-bold leading-snug text-ink-heading">
          {item.title}
        </h4>
        <p className="mt-2 line-clamp-2 flex-1 text-[13px] text-muted-soft">{item.blurb}</p>
        <span className="mt-3 text-[12.5px] text-[#8496b7]">{item.mins}</span>
      </div>
    </Link>
  );
}
