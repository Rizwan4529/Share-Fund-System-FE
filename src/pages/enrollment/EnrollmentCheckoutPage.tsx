import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CreditCard, MailWarning, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { Checkbox, FormCommon } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { LegalDocumentHtml } from "@/components/common/LegalDocumentHtml";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
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
import { getApiErrorCode, getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatCurrency } from "@/lib/app/greeting";
import {
  PAYMENT_ERROR_MESSAGES,
  PAYMENT_PURPOSE_LABELS,
  isPaymentErrorCode,
} from "@/lib/payments/labels";
import { useResendLinkMutation } from "@/store/api/authApi";
import { useGetLegalDocumentQuery } from "@/store/api/legalApi";
import {
  useCreateCheckoutSessionMutation,
  useGetCheckoutQuoteQuery,
} from "@/store/api/paymentsApi";
import { useAppSelector } from "@/store/hooks";
import type { LegalDocument } from "@/types/auth";
import {
  PAYMENT_PURPOSES,
  type CheckoutQuote,
  type PaymentErrorCode,
  type PaymentPurpose,
} from "@/types/payments";
import { ROUTES } from "@/utils/constants";

const isPurpose = (value: string): value is PaymentPurpose =>
  (PAYMENT_PURPOSES as readonly string[]).includes(value);

/** Where "back" goes for each kind of purchase. */
const BACK_LINKS: Record<PaymentPurpose, { label: string; to: string }> = {
  funding_access: { label: "Back to plans", to: ROUTES.ENROLLMENT },
  founder_tier: { label: "Back to plans", to: ROUTES.ENROLLMENT },
  program_activation: { label: "Back to my selections", to: ROUTES.MY_SELECTIONS },
};

/**
 * Generic checkout: ?purpose=funding_access|founder_tier|program_activation
 * &ref=<plan key | FounderPlan id | selection id>. (Legacy ?plan=<id> = a
 * Founder tier.) The amount shown and charged is always the server's quote.
 */
export default function EnrollmentCheckoutPage() {
  const [params] = useSearchParams();
  const legacyPlan = params.get("plan");
  const purposeParam = params.get("purpose") ?? (legacyPlan ? "founder_tier" : "");
  const referenceId = params.get("ref") ?? legacyPlan ?? "";
  const purpose = isPurpose(purposeParam) ? purposeParam : null;

  const quoteQuery = useGetCheckoutQuoteQuery(
    { purpose: purpose ?? "funding_access", referenceId },
    { skip: !purpose || !referenceId },
  );

  if (!purpose || !referenceId) {
    return (
      <AppPageContainer>
        <EmptyState
          icon={CreditCard}
          title="Nothing to check out"
          description="Choose a plan or program to pay for first."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.ENROLLMENT}>Browse plans</Link>
            </GoldButton>
          }
        />
      </AppPageContainer>
    );
  }

  const back = BACK_LINKS[purpose];
  const header = (
    <ParticipantPageHeader
      overline={`Checkout · ${PAYMENT_PURPOSE_LABELS[purpose]}`}
      title="Review and pay"
      subtitle="Confirm what you're buying, accept the checkout acknowledgment, then pay securely with Stripe."
      actions={
        <GoldButton variant="ghost-outline" asChild>
          <Link to={back.to}>{back.label}</Link>
        </GoldButton>
      }
    />
  );

  if (quoteQuery.isLoading) {
    return (
      <AppPageContainer>
        {header}
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      </AppPageContainer>
    );
  }

  if (quoteQuery.isError || !quoteQuery.data) {
    const code = getApiErrorCode(quoteQuery.error);
    const known = isPaymentErrorCode(code) ? PAYMENT_ERROR_MESSAGES[code] : null;
    return (
      <AppPageContainer>
        {header}
        <EmptyState
          icon={CreditCard}
          variant={known ? "default" : "error"}
          title={known?.title ?? "We couldn't load this checkout"}
          description={
            known?.body ??
            getApiErrorMessage(quoteQuery.error, "Please try again in a moment.")
          }
          action={
            code === "ALREADY_PAID" ? (
              <GoldButton asChild>
                <Link to={ROUTES.BILLING}>View payment history</Link>
              </GoldButton>
            ) : known ? (
              <GoldButton asChild>
                <Link to={back.to}>{back.label}</Link>
              </GoldButton>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => void quoteQuery.refetch()}
              >
                Try again
              </Button>
            )
          }
        />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      {header}
      <CheckoutContent quote={quoteQuery.data} />
    </AppPageContainer>
  );
}

function CheckoutContent({ quote }: { quote: CheckoutQuote }) {
  const user = useAppSelector((state) => state.auth.user);
  const ackQuery = useGetLegalDocumentQuery("checkout_acknowledgment");
  const [serverSaysUnverified, setServerSaysUnverified] = useState(false);
  const [checkoutError, setCheckoutError] = useState<PaymentErrorCode | null>(null);
  const emailVerified = Boolean(user?.emailVerified) && !serverSaysUnverified;

  return (
    <div className="grid max-w-5xl gap-4 lg:grid-cols-5">
      <AppSurfaceCard className="lg:col-span-3">
        <SectionLabel tone="info">{PAYMENT_PURPOSE_LABELS[quote.purpose]}</SectionLabel>
        <Typography
          as="h2"
          variant="h5"
          className="mt-3 font-display text-[20px] font-bold text-ink-heading"
        >
          {quote.description}
        </Typography>
        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <span className="font-display text-[32px] font-bold text-ink-heading">
            {formatCurrency(quote.amount, quote.currency)}
          </span>
          <StatusChip tone="muted">one-time payment</StatusChip>
        </div>
        <InfoCallout className="mt-5">
          This payment covers your {PAYMENT_PURPOSE_LABELS[quote.purpose].toLowerCase()}.
          Budgets, timelines and funding are planning projections in Phase 1 —
          not guaranteed outcomes.
        </InfoCallout>
      </AppSurfaceCard>

      <AppSurfaceCard className="lg:col-span-2" padding="md">
        {!emailVerified ? (
          <EmailVerificationGate email={user?.email} />
        ) : ackQuery.isLoading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Spinner />
          </div>
        ) : ackQuery.isError || !ackQuery.data ? (
          <EmptyState
            icon={ShieldCheck}
            variant="error"
            size="compact"
            title="Checkout acknowledgment unavailable"
            description="We can't take payments until the checkout acknowledgment is published. Please try again later."
          />
        ) : (
          // Keyed by version: a newer acknowledgment remounts the form unchecked.
          <AcknowledgeAndPay
            key={ackQuery.data.version}
            quote={quote}
            acknowledgment={ackQuery.data}
            checkoutError={checkoutError}
            onCheckoutError={(code) => {
              setCheckoutError(code);
              if (code === "EMAIL_NOT_VERIFIED") setServerSaysUnverified(true);
              if (code === "ACKNOWLEDGMENT_OUTDATED") void ackQuery.refetch();
            }}
          />
        )}
      </AppSurfaceCard>
    </div>
  );
}

function EmailVerificationGate({ email }: { email?: string }) {
  const [resend, resendState] = useResendLinkMutation();
  const { title, body } = PAYMENT_ERROR_MESSAGES.EMAIL_NOT_VERIFIED;

  const onResend = async () => {
    if (!email) return;
    try {
      await resend({ email }).unwrap();
      toast.success(`Verification email sent to ${email}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not resend the verification email."));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MailWarning className="size-5 text-gold-deep" />
        <Typography variant="label" className="text-ink-heading">
          {title}
        </Typography>
      </div>
      <Typography variant="body-sm" className="text-muted-soft">
        {body} Open the link we sent to {email ?? "your inbox"}, then sign in
        again to continue.
      </Typography>
      <GoldButton
        className="w-full"
        disabled={!email || resendState.isLoading}
        onClick={() => void onResend()}
      >
        {resendState.isLoading ? <ButtonSpinner /> : null}
        Resend verification email
      </GoldButton>
    </div>
  );
}

function AcknowledgeAndPay({
  quote,
  acknowledgment,
  checkoutError,
  onCheckoutError,
}: {
  quote: CheckoutQuote;
  acknowledgment: LegalDocument;
  checkoutError: PaymentErrorCode | null;
  onCheckoutError: (code: PaymentErrorCode | null) => void;
}) {
  const [createSession, sessionState] = useCreateCheckoutSessionMutation();
  const [redirecting, setRedirecting] = useState(false);
  const form = useForm<{ accepted: boolean }>({ defaultValues: { accepted: false } });

  const onSubmit = async ({ accepted }: { accepted: boolean }) => {
    if (!accepted) {
      form.setError("accepted", {
        message: "Please read and accept the acknowledgment to continue.",
      });
      return;
    }
    onCheckoutError(null);
    try {
      const session = await createSession({
        purpose: quote.purpose,
        referenceId: quote.referenceId,
        acknowledgmentVersion: acknowledgment.version,
      }).unwrap();
      setRedirecting(true);
      // Hosted Stripe Checkout. Coming back is NOT proof of payment — the
      // success page waits for the webhook-confirmed status.
      window.location.assign(session.url);
    } catch (error) {
      const code = getApiErrorCode(error);
      if (isPaymentErrorCode(code)) onCheckoutError(code);
      else toast.error(getApiErrorMessage(error, "Could not start checkout. Please try again."));
    }
  };

  const busy = sessionState.isLoading || redirecting;
  const errorCopy = checkoutError ? PAYMENT_ERROR_MESSAGES[checkoutError] : null;

  return (
    <FormCommon form={form} onSubmit={onSubmit} className="space-y-4">
      <SectionLabel tone="navy">
        {acknowledgment.title} · v{acknowledgment.version}
      </SectionLabel>
      <div className="max-h-64 overflow-y-auto rounded-lg border border-line bg-bg-card p-3">
        <LegalDocumentHtml className="text-muted-soft" content={acknowledgment.content} />
      </div>
      <Checkbox
        control={form.control}
        name="accepted"
        label="I have read and accept the checkout acknowledgment."
        required
        itemClassName="items-start"
        className="leading-snug"
      />
      {errorCopy ? (
        <InfoCallout>
          <strong>{errorCopy.title}.</strong> {errorCopy.body}
        </InfoCallout>
      ) : null}
      <GoldButton type="submit" className="w-full" disabled={busy}>
        {busy ? <ButtonSpinner /> : <CreditCard />}
        {redirecting
          ? "Redirecting to Stripe…"
          : `Pay ${formatCurrency(quote.amount, quote.currency)} with Stripe`}
      </GoldButton>
      <Typography variant="caption" color="muted" className="block text-center">
        You'll complete payment on Stripe's secure checkout page.
      </Typography>
    </FormCommon>
  );
}
