import { useMemo, useState } from "react";
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
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { processMockCheckout } from "@/lib/api/enrollment";
import { toCheckoutOption } from "@/lib/founder-plans/checkout";
import { useListFounderPlansQuery } from "@/store/api/founderPlansApi";
import {
  useGetLegalDocumentQuery,
  useGetMyCurrentAcceptanceQuery,
  useRecordAcceptanceMutation,
} from "@/store/api/legalApi";
import { CHECKOUT_LEGAL_TYPES } from "@/types/auth";
import { ROUTES } from "@/utils/constants";

export default function EnrollmentCheckoutPage() {
  const [params] = useSearchParams();
  const planId = params.get("plan") ?? "";
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const plansQuery = useListFounderPlansQuery();
  const ackQuery = useGetLegalDocumentQuery("checkout_acknowledgment");
  const [recordAcceptance] = useRecordAcceptanceMutation();
  const currentQueries = {
    checkout_acknowledgment: useGetMyCurrentAcceptanceQuery(
      "checkout_acknowledgment",
    ),
    founding_disclosure: useGetMyCurrentAcceptanceQuery("founding_disclosure"),
    terms: useGetMyCurrentAcceptanceQuery("terms"),
    privacy: useGetMyCurrentAcceptanceQuery("privacy"),
    refund_policy: useGetMyCurrentAcceptanceQuery("refund_policy"),
  };
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  const plan = useMemo(() => {
    const match = (plansQuery.data ?? []).find((item) => item._id === planId);
    return match ? toCheckoutOption(match) : null;
  }, [plansQuery.data, planId]);

  const pay = async (forceFail = false) => {
    if (!plan) return;
    if (!accepted) {
      toast.error("Please acknowledge the checkout disclosures.");
      return;
    }
    if (!ackQuery.data) {
      toast.error("Checkout acknowledgment is not published yet.");
      return;
    }
    setBusy(true);
    try {
      for (const documentType of CHECKOUT_LEGAL_TYPES) {
        const current = currentQueries[documentType].data;
        if (current?.accepted) continue;
        await recordAcceptance({
          documentType,
          context: "checkout",
        }).unwrap();
      }
      const result = await processMockCheckout({ option: plan, forceFail });
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
      toast.error(
        getApiErrorMessage(err, "Checkout failed. Please try again."),
      );
    } finally {
      setBusy(false);
    }
  };

  if (plansQuery.isLoading) {
    return (
      <AppPageContainer>
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  if (!plan) {
    return (
      <AppPageContainer>
        <ParticipantPageHeader
          overline="Checkout"
          title="Plan not found"
          subtitle="That enrollment plan isn’t available. Choose a plan to continue."
          actions={
            <GoldButton asChild>
              <Link to={ROUTES.ENROLLMENT}>Browse plans</Link>
            </GoldButton>
          }
        />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Founding Access · Checkout"
        title="Complete Founding Access"
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
            Founding Access to {plan.centerLimit} Success Center categor
            {plan.centerLimit === 1 ? "y" : "ies"}
          </Typography>

          <div className="mt-6 space-y-3 rounded-lg border border-line bg-bg-card p-4">
            <SectionLabel tone="navy">
              Acknowledgment · v{ackQuery.data?.version ?? "—"}
            </SectionLabel>
            <Typography variant="body-sm" className="text-muted-soft">
              {ackQuery.isError
                ? getApiErrorMessage(
                    ackQuery.error,
                    "No published checkout acknowledgment was found.",
                  )
                : ackQuery.data?.content}
            </Typography>
            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="ack"
                checked={accepted}
                disabled={!ackQuery.data}
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
            Card entry is simulated for Phase 1. Live Stripe Elements will replace
            this mock when the backend is ready.
          </Typography>
          <GoldButton
            disabled={busy || !ackQuery.data}
            className="w-full"
            onClick={() => void pay(false)}
          >
            {busy ? "Processing…" : `Pay $${plan.price}`}
          </GoldButton>
          <GoldButton
            variant="ghost-outline"
            disabled={busy || !ackQuery.data}
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
