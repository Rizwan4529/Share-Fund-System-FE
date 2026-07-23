import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { acceptDisclosures } from "@/lib/api/auth";
import { getDisclosureByKind } from "@/lib/api/disclosures";
import {
  getEnrollmentPlans,
  processMockCheckout,
  type CheckoutPlanOption,
} from "@/lib/api/enrollment";
import type { DisclosureDoc, EnrollmentPlan } from "@/types";
import { ROUTES } from "@/utils/constants";

export default function EnrollmentCheckoutPage() {
  const [params] = useSearchParams();
  const planId = (params.get("plan") ?? "founding_one") as EnrollmentPlan;
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [plans, setPlans] = useState<CheckoutPlanOption[]>([]);
  const [ack, setAck] = useState<DisclosureDoc | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getEnrollmentPlans().then(setPlans);
    void getDisclosureByKind("checkout_acknowledgment").then(setAck);
  }, []);

  const plan = useMemo(
    () => plans.find((p) => p.plan === planId) ?? null,
    [plans, planId],
  );

  const pay = async (forceFail = false) => {
    if (!accepted) {
      toast.error("Please acknowledge the checkout disclosures.");
      return;
    }
    setBusy(true);
    try {
      await acceptDisclosures([
        "checkout_acknowledgment",
        "founding_disclosure",
        "terms",
        "privacy",
        "refund_policy",
      ]);
      const result = await processMockCheckout({ plan: planId, forceFail });
      await refresh();
      if (result.payment.status === "succeeded") {
        toast.success(
          `Payment succeeded. Receipt ${result.payment.receiptNumber}`,
        );
        navigate(ROUTES.BILLING);
      } else {
        toast.error("Payment failed and was recorded.");
        navigate(ROUTES.BILLING);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!plan) {
    return (
      <AppPageContainer>
        <Typography variant="body">Loading checkout…</Typography>
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <GoldButton variant="outline" size="sm" asChild className="mb-4">
        <Link to={ROUTES.ENROLLMENT}>Back to plans</Link>
      </GoldButton>

      <Typography variant="h2" className="mb-2">
        Checkout
      </Typography>
      <Typography variant="body" className="mb-6 text-muted-foreground">
        Mock payment provider (Stripe wiring comes with the backend). Test both
        success and failure recording.
      </Typography>

      <div className="grid max-w-3xl gap-4 lg:grid-cols-5">
        <AppSurfaceCard className="p-6 lg:col-span-3">
          <Typography variant="h3">{plan.title}</Typography>
          <Typography variant="body" className="mt-2 text-muted-foreground">
            {plan.subtitle}
          </Typography>
          <Typography variant="h2" className="mt-4">
            ${plan.price}
          </Typography>
          <Typography variant="caption" className="mt-1 block text-muted-foreground">
            {plan.centerLimit} Success Center access · one-time (mock)
          </Typography>

          <div className="mt-6 space-y-3 rounded-lg border border-border p-4">
            <Typography variant="label">
              Checkout acknowledgment (v{ack?.version ?? "—"})
            </Typography>
            <Typography variant="body" className="text-sm text-muted-foreground">
              {ack?.body}
            </Typography>
            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="ack"
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
              />
              <Label htmlFor="ack" className="text-sm leading-snug">
                I accept the checkout acknowledgment and related disclosures
                (versioned acceptance will be recorded).
              </Label>
            </div>
          </div>
        </AppSurfaceCard>

        <AppSurfaceCard className="flex flex-col gap-3 p-6 lg:col-span-2">
          <Typography variant="label">Mock Stripe</Typography>
          <GoldButton disabled={busy} onClick={() => void pay(false)}>
            {busy ? "Processing…" : `Pay $${plan.price}`}
          </GoldButton>
          <GoldButton
            variant="outline"
            disabled={busy}
            onClick={() => void pay(true)}
          >
            Simulate failed payment
          </GoldButton>
          <Typography variant="caption" className="text-muted-foreground">
            // TODO: Stripe Elements when BE ready
          </Typography>
        </AppSurfaceCard>
      </div>
    </AppPageContainer>
  );
}
