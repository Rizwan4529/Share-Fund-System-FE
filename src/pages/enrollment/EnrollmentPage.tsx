import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Layers, Sparkles } from "lucide-react";

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
import { useAuth } from "@/context/AuthContext";
import {
  getEnrollmentPlans,
  type CheckoutPlanOption,
} from "@/lib/api/enrollment";
import { foundingStatusLabel } from "@/lib/auth/roles";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

export default function EnrollmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<CheckoutPlanOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getEnrollmentPlans()
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  const founding = plans.filter((p) => !p.separateOffer);
  const founderStack = plans.filter((p) => p.separateOffer);
  const enrolled = (user?.foundingStatus ?? "none") !== "none";

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Founding Participant"
        title="Enrollment"
        subtitle={
          <>
            Introductory pricing is admin-configurable. Current status:{" "}
            <StatusChip
              tone={enrolled ? "success" : "muted"}
              className="ml-1 align-middle normal-case tracking-normal"
            >
              {foundingStatusLabel(user?.foundingStatus ?? "none")}
            </StatusChip>
          </>
        }
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.BILLING}>View billing</Link>
          </GoldButton>
        }
      />

      <InfoCallout className="mb-6">
        Phase 1 unlocks Success Center planning tools. Budgets and timelines are
        projections only — live funding is not active.
      </InfoCallout>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-56 animate-pulse rounded-panel bg-muted" />
          <div className="h-56 animate-pulse rounded-panel bg-muted" />
        </div>
      ) : founding.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No enrollment plans available"
          description="Pricing offers will appear here once configured in admin settings."
          variant="muted"
        />
      ) : (
        <>
          <div className="mb-3 flex items-center gap-2">
            <SectionLabel tone="info">Introductory pricing</SectionLabel>
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
      )}

      {founderStack.length > 0 ? (
        <>
          <div className="mb-3 flex items-center gap-2">
            <SectionLabel tone="navy">Separate offer</SectionLabel>
            <StatusChip tone="navy">Founder Stack</StatusChip>
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
          Payment history
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
          {featured ? "Founder Stack" : "Founding pricing"}
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
        {featured
          ? `${plan.subtitle} Includes ${plan.centerLimit} Success Centers and distinct Founder Stack status.`
          : `Access to ${plan.centerLimit} Success Center${plan.centerLimit === 1 ? "" : "s"}. Recurring billing is not live in Phase 1.`}
      </Typography>

      <GoldButton className="mt-6 w-full" onClick={onCheckout}>
        Continue to checkout
        <ArrowRight className="size-4" />
      </GoldButton>
    </AppSurfaceCard>
  );
}
