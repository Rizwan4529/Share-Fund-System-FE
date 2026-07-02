import { Link } from "react-router-dom";
import { BookOpen, FileText, Play } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { AppSurfaceCard } from "@/components/member/app/AppSurfaceCard";
import { SectionLabel } from "@/components/member/app/SectionLabel";
import { ROUTES } from "@/utils/constants";
import type { LearnItem } from "@/types";
import { cn } from "@/lib/utils";

type LearnGuideCardProps = {
  item: LearnItem;
};

function LearnIcon({ type }: { type: LearnItem["type"] }) {
  const Icon = type === "video" ? Play : type === "guide" ? FileText : BookOpen;
  return <Icon className="size-[18px] text-gold-dark" strokeWidth={1.7} />;
}

export function LearnGuideCard({ item }: LearnGuideCardProps) {
  const href =
    item.type === "video"
      ? `/learn/${item.id}/watch`
      : `/learn/${item.id}`;

  return (
    <Link
      to={href}
      className={cn(
        "rounded-lg border border-[#e9eef6] bg-bg-card p-[18px] transition-colors",
        "hover:border-gold-chip",
      )}
    >
      <span className="mb-3.5 flex size-10 items-center justify-center rounded-lg border border-line bg-white">
        <LearnIcon type={item.type} />
      </span>
      <span className="mb-1 block text-[11.5px] font-bold uppercase tracking-wide text-[#a9842a]">
        {item.cat}
      </span>
      <Typography
        as="h4"
        variant="label"
        className="text-[15px] font-bold leading-snug text-ink-heading"
      >
        {item.title}
      </Typography>
      <span className="mt-2 block text-[12.5px] text-[#8496b7]">{item.mins}</span>
    </Link>
  );
}

type LearnHighlightSectionProps = {
  items: LearnItem[];
};

export function LearnHighlightSection({ items }: LearnHighlightSectionProps) {
  return (
    <AppSurfaceCard className="overflow-hidden">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <SectionLabel>From the Learn center</SectionLabel>
          <Typography
            variant="h4"
            className="mt-2 text-lg font-bold tracking-tight text-ink-heading sm:text-xl"
          >
            Guides picked for you
          </Typography>
        </div>
        <Button
          variant="ghost-outline"
          size="sm"
          className="w-full shrink-0 rounded-md px-4 py-2 text-[13.5px] sm:w-auto"
          asChild
        >
          <Link to={ROUTES.LEARN}>Open Learn</Link>
        </Button>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <LearnGuideCard key={item.id} item={item} />
        ))}
      </div>
    </AppSurfaceCard>
  );
}
