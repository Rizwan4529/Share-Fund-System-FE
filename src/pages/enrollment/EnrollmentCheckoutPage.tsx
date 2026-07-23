import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

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
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Checkout"
        title="Complete enrollment"
        subtitle="Mock payment provider for Phase 1. Stripe Elements land with the backend."
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.ENROLLMENT}>Back to plans</Link>
          </GoldButton>
        }
      />

      <InfoCallout className="mb-6 max-w-3xl">
        You can simulate both a successful charge and a failed payment so both
        outcomes are recorded in billing history.
      </InfoCallout>

      <div className="grid max-w-4xl gap-4 lg:grid-cols-5">
        <AppSurfaceCard className="lg:col-span-3">
          <SectionLabel tone="info">{plan.subtitle}</SectionLabel>
          <Typography
            as="h2"
            variant="h5"
            className="mt-3 font-display text-[20px] font-bold text-ink-heading"
          >
            {plan.title}
          </Typography>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-[32px] font-bold text-ink-heading">
              ${plan.price}
            </span>
            <StatusChip tone="muted">one-time · mock</StatusChip>
          </div>
          <Typography variant="body-sm" className="mt-2 text-muted-soft">
            {plan.centerLimit} Success Center access
          </Typography>

          <div className="mt-6 space-y-3 rounded-lg border border-line bg-bg-card p-4">
            <SectionLabel tone="navy">
              Acknowledgment · v{ack?.version ?? "—"}
            </SectionLabel>
            <Typography variant="body-sm" className="text-muted-soft">
              {ack?.body}
            </Typography>
            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="ack"
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
              />
              <Label htmlFor="ack" className="text-sm leading-snug text-ink-heading">
                I accept the checkout acknowledgment and related disclosures
                (versioned acceptance will be recorded).
              </Label>
            </div>
          </div>
        </AppSurfaceCard>

        <AppSurfaceCard className="flex flex-col gap-3 lg:col-span-2">
          <SectionLabel tone="navy">Mock Stripe</SectionLabel>
          <Typography variant="body-sm" className="text-muted-soft">
            // TODO: Stripe Elements when BE ready
          </Typography>
          <GoldButton disabled={busy} className="w-full" onClick={() => void pay(false)}>
            {busy ? "Processing…" : `Pay $${plan.price}`}
          </GoldButton>
          <GoldButton
            variant="ghost-outline"
            disabled={busy}
            className="w-full"
            onClick={() => void pay(true)}
          >
            Simulate failed payment
          </GoldButton>
        </AppSurfaceCard>
      </div>
    </AppPageContainer>
  );
}
