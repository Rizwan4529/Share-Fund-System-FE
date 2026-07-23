import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
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

  useEffect(() => {
    void getEnrollmentPlans().then(setPlans);
  }, []);

  const founding = plans.filter((p) => !p.separateOffer);
  const founderStack = plans.filter((p) => p.separateOffer);

  return (
    <AppPageContainer>
      <div className="mb-6 max-w-2xl">
        <Typography variant="h2">Founding Participant enrollment</Typography>
        <Typography variant="body" className="mt-2 text-muted-foreground">
          Founding Participant Introductory Pricing. Prices come from
          administrator-configurable settings (mock). Current status:{" "}
          <strong>{foundingStatusLabel(user?.foundingStatus ?? "none")}</strong>
        </Typography>
      </div>

      <Typography variant="h3" className="mb-3">
        Founding Participant Introductory Pricing
      </Typography>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {founding.map((plan) => (
          <AppSurfaceCard key={plan.plan} className="flex flex-col p-6">
            <Typography variant="label" className="text-gold-dark">
              {plan.subtitle}
            </Typography>
            <Typography variant="h3" className="mt-2">
              {plan.title}
            </Typography>
            <Typography variant="h2" className="mt-4">
              ${plan.price}
            </Typography>
            <Typography variant="body" className="mt-2 text-muted-foreground">
              Access to {plan.centerLimit} Success Center
              {plan.centerLimit === 1 ? "" : "s"}. One-time enrollment fee
              (recurring billing not live in Phase 1).
            </Typography>
            <GoldButton
              className="mt-5"
              onClick={() =>
                navigate(`${ROUTES.ENROLLMENT_CHECKOUT}?plan=${plan.plan}`)
              }
            >
              Continue to checkout
            </GoldButton>
          </AppSurfaceCard>
        ))}
      </div>

      {founderStack.length > 0 ? (
        <>
          <Typography variant="h3" className="mb-3">
            Founder Stack — separate offer
          </Typography>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {founderStack.map((plan) => (
              <AppSurfaceCard
                key={plan.plan}
                className={cn(
                  "flex flex-col border-gold/40 bg-gold/5 p-6",
                )}
              >
                <Typography variant="label" className="text-gold-dark">
                  Founder Stack Introductory Offer
                </Typography>
                <Typography variant="h3" className="mt-2">
                  {plan.title}
                </Typography>
                <Typography variant="h2" className="mt-4">
                  ${plan.price}
                </Typography>
                <Typography variant="body" className="mt-2 text-muted-foreground">
                  {plan.subtitle} Includes {plan.centerLimit} Success Centers and
                  distinct Founder Stack status.
                </Typography>
                <GoldButton
                  className="mt-5"
                  onClick={() =>
                    navigate(`${ROUTES.ENROLLMENT_CHECKOUT}?plan=${plan.plan}`)
                  }
                >
                  Continue to checkout
                </GoldButton>
              </AppSurfaceCard>
            ))}
          </div>
        </>
      ) : null}

      <Typography variant="body" className="mt-8 text-sm text-muted-foreground">
        Already enrolled? Review{" "}
        <Link to={ROUTES.BILLING} className="font-semibold underline">
          payment history
        </Link>{" "}
        or choose{" "}
        <Link to={ROUTES.SUCCESS_CENTERS} className="font-semibold underline">
          Success Centers
        </Link>
        .
      </Typography>
    </AppPageContainer>
  );
}
