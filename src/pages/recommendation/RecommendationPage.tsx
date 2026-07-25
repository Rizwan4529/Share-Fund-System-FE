import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Wallet } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
  StatusChip,
} from "@/components/member/app";
import type { StatusChipTone } from "@/components/member/app";
import { useAuth } from "@/context/AuthContext";
import { getMyRecommendation } from "@/lib/api/recommendations";
import { selectRecommendationPlan } from "@/lib/api/questionnaire";
import { AFFORDABILITY_LABELS } from "@/lib/recommendations/engine";
import { getFirstName } from "@/lib/app/greeting";
import { cn } from "@/lib/utils";
import type { AffordabilityStatus, PlanKind, Recommendation } from "@/types";
import { ROUTES } from "@/utils/constants";

function affordabilityTone(status: AffordabilityStatus): StatusChipTone {
  switch (status) {
    case "eligible":
      return "success";
    case "eligible_with_adjustment":
      return "gold";
    case "build_savings_first":
    case "increase_income_first":
      return "info";
    default:
      return "muted";
  }
}

export default function RecommendationPage() {
  const { user } = useAuth();
  const firstName = getFirstName(user?.name ?? "there");
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<PlanKind | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setRec(await getMyRecommendation());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const choosePlan = async (planId: PlanKind) => {
    setSelecting(planId);
    try {
      const updated = await selectRecommendationPlan(planId);
      setRec(updated);
      toast.success("Plan selected.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not select plan.");
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <AppPageContainer>
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="BMIS projections"
        title={`${firstName}, here's your plan`}
        subtitle="Rule-based planning figures from your Success Profile. Clearly labeled as simulations — no live funding."
        actions={
          <div className="flex flex-wrap gap-2">
            <GoldButton variant="ghost-outline" asChild>
              <Link to={ROUTES.QUESTIONNAIRE}>Edit Success Profile</Link>
            </GoldButton>
            {rec ? (
              <GoldButton asChild>
                <Link to={ROUTES.ENROLLMENT}>Founding Access</Link>
              </GoldButton>
            ) : null}
          </div>
        }
      />

      <InfoCallout className="mb-6">
        These numbers are projections / simulations only. Live Success Center
        funding is not activated in Phase 1.
      </InfoCallout>

      {!rec ? (
        <EmptyState
          icon={LineChart}
          title="No projection yet"
          description="Complete your Success Profile to generate a rule-based planning budget, timeline, and affordability check."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.QUESTIONNAIRE}>Start Success Profile</Link>
            </GoldButton>
          }
        />
      ) : (
        <div className="max-w-5xl space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <AppSurfaceCard>
              <div className="mb-3 flex items-center justify-between">
                <SectionLabel tone="info">Goal amount</SectionLabel>
                <Wallet className="size-4 text-info" />
              </div>
              <Typography
                as="p"
                variant="h4"
                className="font-display text-[26px] font-bold text-ink-heading"
              >
                ${rec.goalAmount.toLocaleString()}
              </Typography>
              <Typography variant="body-sm" className="mt-2 text-muted-soft">
                Funding range ${rec.plans[0]?.fundingRangeLow.toLocaleString()}–$
                {rec.plans[0]?.fundingRangeHigh.toLocaleString()}.
              </Typography>
            </AppSurfaceCard>

            <AppSurfaceCard>
              <SectionLabel tone="navy">Safe monthly capacity</SectionLabel>
              <Typography
                as="p"
                variant="h4"
                className="mt-3 font-display text-[26px] font-bold text-ink-heading"
              >
                ${rec.safeCapacity.toLocaleString()}
              </Typography>
              <Typography variant="body-sm" className="mt-2 text-muted-soft">
                From ${rec.availableCashFlow.toLocaleString()} monthly cash flow.
              </Typography>
            </AppSurfaceCard>

            <AppSurfaceCard>
              <SectionLabel tone="info">Affordability</SectionLabel>
              <StatusChip
                tone={affordabilityTone(rec.affordability)}
                className="mt-3"
              >
                {AFFORDABILITY_LABELS[rec.affordability]}
              </StatusChip>
              <Typography variant="body-sm" className="mt-3 text-muted-soft">
                Review status:{" "}
                <span className="font-semibold capitalize text-ink-heading">
                  {rec.status}
                </span>
              </Typography>
            </AppSurfaceCard>
          </div>

          <AppSurfaceCard>
            <SectionLabel tone="navy">Choose a plan</SectionLabel>
            <Typography variant="body-sm" className="mt-1.5 text-muted-soft">
              Fast, Moderate, and Long Term spread the activation requirement over
              different timelines. One-time activates in a single payment.
            </Typography>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {rec.plans.map((plan) => {
                const selected = rec.selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "flex flex-col rounded-lg border p-4 transition",
                      selected
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-line",
                      !plan.affordable && "opacity-80",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[15px] font-bold text-ink-heading">
                        {plan.label}
                      </span>
                      <StatusChip tone={plan.affordable ? "success" : "muted"}>
                        {plan.affordable ? "In reach" : "Stretch"}
                      </StatusChip>
                    </div>
                    <Typography
                      as="p"
                      variant="h5"
                      className="mt-3 font-display text-[22px] font-bold text-ink-heading"
                    >
                      ${plan.scheduledPayment.toLocaleString()}
                      <span className="text-sm font-medium text-muted-soft">
                        {plan.id === "one_time" ? " once" : " /mo"}
                      </span>
                    </Typography>
                    <Typography
                      variant="caption"
                      className="mt-1 block text-muted-soft"
                    >
                      {plan.id === "one_time"
                        ? "Single activation payment"
                        : `${plan.months} months`}{" "}
                      · activation ${plan.activationRequirement.toLocaleString()}
                    </Typography>
                    <GoldButton
                      size="sm"
                      variant={selected ? "gold" : "ghost-outline"}
                      className="mt-4 w-full"
                      disabled={selecting === plan.id}
                      onClick={() => void choosePlan(plan.id)}
                    >
                      {selected
                        ? "Selected"
                        : selecting === plan.id
                          ? "Selecting…"
                          : "Select plan"}
                    </GoldButton>
                  </div>
                );
              })}
            </div>
          </AppSurfaceCard>

          {rec.suggestions.length > 0 ? (
            <AppSurfaceCard>
              <SectionLabel tone="info">Suggested next steps</SectionLabel>
              <ul className="mt-3 space-y-2">
                {rec.suggestions.map((s) => (
                  <li
                    key={s}
                    className="flex gap-2 text-sm leading-relaxed text-muted-soft"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <GoldButton asChild>
                  <Link to={ROUTES.ENROLLMENT}>View Founding Access</Link>
                </GoldButton>
                <GoldButton variant="ghost-outline" asChild>
                  <Link to={ROUTES.SUCCESS_CENTERS}>Explore Success Centers</Link>
                </GoldButton>
              </div>
            </AppSurfaceCard>
          ) : null}
        </div>
      )}
    </AppPageContainer>
  );
}
