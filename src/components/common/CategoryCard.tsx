import {
  Briefcase,
  Car,
  HeartPulse,
  Home,
  ShoppingCart,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";
import type { CampaignCategory } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  housing: Home,
  food: UtensilsCrossed,
  utilities: Zap,
  debt: ShoppingCart,
  vehicle: Car,
  medical: HeartPulse,
  business: Briefcase,
};

type CategoryCardProps = {
  category: CampaignCategory;
  href: string;
  className?: string;
};

export function CategoryCard({ category, href, className }: CategoryCardProps) {
  const Icon = ICONS[category.id] ?? Home;
  const isDark = category.featured === "dark";
  const isGold = category.featured === "gold";

  return (
    <Link
      to={href}
      className={cn(
        "group relative flex flex-col rounded-panel border p-6 transition-all hover:-translate-y-0.5 hover:border-gold-chip hover:shadow-app-card",
        isDark
          ? "border-navy-border bg-gradient-navy-marketing text-white"
          : isGold
            ? "border-border-gold bg-gradient-to-br from-bg-gold to-bg-gold-alt"
            : "border-line bg-white",
        className,
      )}
    >
      {category.tag && !isDark ? (
        <span className="absolute top-4 right-4 rounded-full border border-border-gold bg-bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-dark">
          {category.tag}
        </span>
      ) : null}
      <div
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-lg border",
          isDark
            ? "border-gold/30 bg-gold/12 text-gold"
            : "border-line bg-bg-icon text-gold-dark",
        )}
      >
        <Icon className="size-6" />
      </div>
      {category.tag && isDark ? (
        <Typography variant="overline" className="mb-2 text-gold-chip">
          {category.tag}
        </Typography>
      ) : null}
      <Typography
        variant="h5"
        className={cn("mb-2", isDark ? "text-white" : "text-ink-heading")}
      >
        {category.name}
      </Typography>
      <Typography
        variant="body-sm"
        color={isDark ? "white" : "muted"}
        className={cn("flex-1", isDark && "text-white/75")}
      >
        {category.blurb}
      </Typography>
      <Typography
        variant="label"
        className={cn("mt-4", isDark ? "text-gold" : "text-gold-dark")}
      >
        Explore →
      </Typography>
    </Link>
  );
}
