import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Layers, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
  StatusChip,
} from "@/components/member/app";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { CheckoutPlanOption } from "@/lib/api/enrollment";
import { toCheckoutOption } from "@/lib/founder-plans/checkout";
import { foundingAccessState } from "@/lib/auth/roles";
import { useListFounderPlansQuery } from "@/store/api/founderPlansApi";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

export default function EnrollmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plansQuery = useListFounderPlansQuery();
  const plans = (plansQuery.data ?? []).map(toCheckoutOption);
  const founding = plans.filter((plan) => !plan.separateOffer);
  const founderStack = plans.filter((plan) => plan.separateOffer);
  const enrolled = (user?.foundingStatus ?? "none") !== "none";

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Founding Access"
        title="Choose a Founding Plan"
        subtitle={
          <>
            Prices and limits come from the founder plans configured by admin.
            Founding Participant Status:{" "}
            <StatusChip
              tone={enrolled ? "success" : "muted"}
              className="ml-1 align-middle normal-case tracking-normal"
            >
              {foundingAccessState(user?.foundingStatus ?? "none")}
            </StatusChip>
          </>
        }
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.BILLING}>Founding Access Payment History</Link>
          </GoldButton>
        }
      />

      <InfoCallout className="mb-6">
        Founding Access unlocks Success Center planning tools. Budgets and
        timelines are projections only — live funding is not active.
      </InfoCallout>

      {plansQuery.isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : plansQuery.isError ? (
        <EmptyState
          icon={Layers}
          variant="error"
          title="Could not load founder plans"
          description={getApiErrorMessage(
            plansQuery.error,
            "Enrollment prices could not be loaded.",
          )}
          action={
            <Button type="button" variant="outline" onClick={plansQuery.refetch}>
              Try again
            </Button>
          }
        />
      ) : founding.length === 0 && founderStack.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No enrollment plans available"
          description="Founder plans will appear here once an admin creates and activates them."
          variant="muted"
        />
      ) : (
        <>
          {founding.length > 0 ? (
            <>
              <div className="mb-3 flex items-center gap-2">
                <SectionLabel tone="info">Founder plans</SectionLabel>
              </div>
              <div className="mb-8 grid gap-4 md:grid-cols-2">
                {founding.map((plan) => (
                  <PlanCard
                    key={plan.plan}
                    plan={plan}
                    onCheckout={() =>
                      navigate(`${ROUTES.ENROLLMENT_CHECKOUT}?plan=${plan.plan}`)
                    }
                  />
                ))}
              </div>
            </>
          ) : null}

          {founderStack.length > 0 ? (
            <>
              <div className="mb-3 flex items-center gap-2">
                <SectionLabel tone="navy">Separate offer</SectionLabel>
                <StatusChip tone="navy">Premium</StatusChip>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {founderStack.map((plan) => (
                  <PlanCard
                    key={plan.plan}
                    plan={plan}
                    featured
                    onCheckout={() =>
                      navigate(`${ROUTES.ENROLLMENT_CHECKOUT}?plan=${plan.plan}`)
                    }
                  />
                ))}
              </div>
            </>
          ) : null}
        </>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-soft">
        <Link
          to={ROUTES.SUCCESS_CENTERS}
          className="font-semibold text-info hover:underline"
        >
          Browse Success Centers
        </Link>
        <span className="text-line">·</span>
        <Link
          to={ROUTES.BILLING}
          className="font-semibold text-ink-heading hover:underline"
        >
          Founding Access Payment History
        </Link>
      </div>
    </AppPageContainer>
  );
}

function PlanCard({
  plan,
  featured,
  onCheckout,
}: {
  plan: CheckoutPlanOption;
  featured?: boolean;
  onCheckout: () => void;
}) {
  return (
    <AppSurfaceCard
      className={cn(
        "flex flex-col",
        featured && "border-info/25 bg-gradient-to-br from-white to-info-bg/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SectionLabel tone={featured ? "navy" : "info"}>
          {featured ? "Premium tier" : "Founder plan"}
        </SectionLabel>
        {featured ? (
          <span className="flex size-9 items-center justify-center rounded-lg bg-info/10 text-info">
            <Sparkles className="size-4" />
          </span>
        ) : (
          <span className="flex size-9 items-center justify-center rounded-lg bg-bg-icon text-gold-deep">
            <BadgeCheck className="size-4" />
          </span>
        )}
      </div>

      <Typography
        as="h2"
        variant="h5"
        className="mt-3 font-display text-[18px] font-bold text-ink-heading sm:text-[20px]"
      >
        {plan.title}
      </Typography>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-[32px] font-bold tracking-tight text-ink-heading">
          ${plan.price}
        </span>
        <span className="text-sm text-muted-soft">one-time</span>
      </div>

      <Typography variant="body-sm" className="mt-3 flex-1 text-muted-soft">
        {plan.subtitle}. Includes {plan.centerLimit} success center program
        {plan.centerLimit === 1 ? "" : "s"}. Recurring billing is not live in
        Phase 1.
      </Typography>

      <GoldButton className="mt-6 w-full" onClick={onCheckout}>
        Continue to checkout
        <ArrowRight className="size-4" />
      </GoldButton>
    </AppSurfaceCard>
  );
}
