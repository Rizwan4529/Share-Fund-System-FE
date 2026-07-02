import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import {
  BenefitHighlightCard,
  IncludedItemsList,
  NumberedJourneyTimeline,
} from "@/components/campaigns";
import {
  AppSurfaceCard,
  BackNavLink,
  NavyHeroCard,
  SectionLabel,
} from "@/components/member/app";
import { getCategoryIcon } from "@/lib/app/categoryIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategory } from "@/hooks/queries/useCampaigns";
import { INCLUDED_ITEMS, JOURNEY_STEPS, ROUTES } from "@/utils/constants";

export default function CampaignDetailPage() {
  const { categoryId = "" } = useParams();
  const { data: category, isLoading } = useCategory(categoryId);

  if (isLoading) return <Skeleton className="h-96 rounded-panel" />;
  if (!category) {
    return <p className="text-muted-soft">Category not found.</p>;
  }

  const Icon = getCategoryIcon(category.id);
  const journeySteps = JOURNEY_STEPS.map(([title, note]) => ({ title, note }));

  return (
    <div className="space-y-6">
      <BackNavLink to={ROUTES.CAMPAIGNS}>All campaigns</BackNavLink>

      <NavyHeroCard padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-gold/34 bg-gold/13 sm:size-16">
            <Icon className="size-7 text-gold sm:size-8" />
          </span>
          <div className="min-w-0 flex-1">
            {category.tag ? (
              <span className="mb-2 inline-flex rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide text-gold-chip">
                {category.tag}
              </span>
            ) : null}
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[32px]">
              {category.name}
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/75 sm:text-[15.5px]">
              {category.long}
            </p>
            <GoldButton size="app" className="mt-5 w-full sm:mt-6 sm:w-auto" asChild>
              <Link to={`/campaigns/${categoryId}/activate`}>
                Activate this campaign
                <ArrowRight className="size-4" />
              </Link>
            </GoldButton>
          </div>
        </div>
      </NavyHeroCard>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <AppSurfaceCard>
          <SectionLabel>Your journey</SectionLabel>
          <h3 className="mt-2 font-display text-xl font-bold text-ink-heading">
            Six steps, start to goal
          </h3>
          <div className="mt-6">
            <NumberedJourneyTimeline steps={journeySteps} />
          </div>
        </AppSurfaceCard>
        <div className="space-y-4">
          <BenefitHighlightCard description="SFS gives your goal structure, marketing support, and rewards for staying engaged — so you can focus on progress, not logistics." />
          <AppSurfaceCard padding="md">
            <h3 className="mb-4 font-display text-[17px] font-bold text-ink-heading">
              What&apos;s included
            </h3>
            <IncludedItemsList items={INCLUDED_ITEMS} />
          </AppSurfaceCard>
        </div>
      </div>
    </div>
  );
}
