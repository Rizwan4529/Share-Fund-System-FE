import { delay } from "@/lib/delay";
import { addDaysIso } from "@/lib/mock/phase1Seed";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type {
  Enrollment,
  EnrollmentPlan,
  FoundingStatus,
  PaymentRecord,
  PaymentStatus,
  RefundStatus,
  ChargebackStatus,
} from "@/types";

export type CheckoutPlanOption = {
  plan: EnrollmentPlan;
  title: string;
  subtitle: string;
  price: number;
  centerLimit: number;
  foundingStatus: FoundingStatus;
  separateOffer?: boolean;
};

export async function getEnrollmentPlans(): Promise<CheckoutPlanOption[]> {
  await delay(120);
  const { pricing } = getStore().settings;
  const plans: CheckoutPlanOption[] = [
    {
      plan: "founding_one",
      title: "Founding Participant — 1 Success Center",
      subtitle: "Founding Participant Introductory Pricing",
      price: pricing.foundingPriceOne,
      centerLimit: 1,
      foundingStatus: "founding_participant",
    },
    {
      plan: "founding_bundle",
      title: `Founding Participant — ${pricing.bundleCenterCount} Success Centers`,
      subtitle: "Founding Participant Introductory Pricing",
      price: pricing.foundingPriceBundle,
      centerLimit: pricing.bundleCenterCount,
      foundingStatus: "founding_participant",
    },
  ];
  if (pricing.founderStack.active && pricing.founderStack.available) {
    plans.push({
      plan: "founder_stack",
      title: "Founder Stack",
      subtitle: pricing.founderStack.benefits,
      price: pricing.founderStack.price,
      centerLimit: pricing.founderStack.successCenterCount,
      foundingStatus: "founder_stack",
      separateOffer: true,
    });
  }
  return plans;
}

export async function processMockCheckout(input: {
  plan: EnrollmentPlan;
  /** Simulate failure for testing failed-payment recording. */
  forceFail?: boolean;
}): Promise<{ enrollment: Enrollment; payment: PaymentRecord }> {
  // TODO: Stripe Elements when BE ready — this is a mock provider only.
  await delay(400);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");

  const plans = await getEnrollmentPlans();
  const option = plans.find((p) => p.plan === input.plan);
  if (!option) throw new Error("Unknown enrollment plan");

  const now = new Date();
  const paidAt = now.toISOString();
  const paymentId = crypto.randomUUID();
  const enrollmentId = crypto.randomUUID();
  const status: PaymentStatus = input.forceFail ? "failed" : "succeeded";

  const enrollment: Enrollment = {
    id: enrollmentId,
    userId: store.user.id,
    userName: store.user.name,
    userEmail: store.user.email,
    plan: input.plan,
    centerLimit: option.centerLimit,
    amount: option.price,
    status,
    createdAt: paidAt,
    paymentId,
  };

  const payment: PaymentRecord = {
    id: paymentId,
    userId: store.user.id,
    userName: store.user.name,
    userEmail: store.user.email,
    enrollmentId,
    plan: input.plan,
    amount: option.price,
    status,
    paidAt,
    transactionRef: `MOCK-${paymentId.slice(0, 8).toUpperCase()}`,
    receiptNumber: `RCP-${now.getFullYear()}-${paymentId.slice(0, 6).toUpperCase()}`,
    refundDeadline: addDaysIso(
      paidAt.slice(0, 10),
      store.settings.rules.refundWindowDays,
    ),
    refundRequestedAt: null,
    refundStatus: "none",
    refundAmount: null,
    refundProcessedAt: null,
    chargebackStatus: "none",
    accountStatusAfterRefund: null,
  };

  let user = store.user;
  if (status === "succeeded") {
    user = {
      ...store.user,
      foundingStatus: option.foundingStatus,
      centerLimit: option.centerLimit,
      membership:
        option.foundingStatus === "founder_stack"
          ? "Founder Stack"
          : "Founding Participant",
      selectedCenterIds: store.user.selectedCenterIds.slice(
        0,
        option.centerLimit,
      ),
    };
  }

  setStore({
    user,
    enrollments: [enrollment, ...store.enrollments],
    payments: [payment, ...store.payments],
  });

  appendAudit(
    store.user.email,
    status === "succeeded"
      ? `Enrollment payment succeeded (${option.plan}, $${option.price})`
      : `Enrollment payment failed (${option.plan})`,
    status === "succeeded" ? "ok" : "danger",
  );

  return { enrollment, payment };
}

export async function listMyPayments(): Promise<PaymentRecord[]> {
  await delay(120);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  return store.payments.filter((p) => p.userId === store.user!.id);
}

export async function listMyEnrollments(): Promise<Enrollment[]> {
  await delay(120);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  return store.enrollments.filter((e) => e.userId === store.user!.id);
}

export async function listAllEnrollments(): Promise<Enrollment[]> {
  await delay(150);
  return structuredClone(getStore().enrollments);
}

export async function listAllPayments(): Promise<PaymentRecord[]> {
  await delay(150);
  return structuredClone(getStore().payments);
}

export async function updatePaymentRefundFields(
  paymentId: string,
  patch: Partial<
    Pick<
      PaymentRecord,
      | "refundRequestedAt"
      | "refundStatus"
      | "refundAmount"
      | "refundProcessedAt"
      | "chargebackStatus"
      | "accountStatusAfterRefund"
      | "status"
    >
  >,
  actor = "Admin",
): Promise<PaymentRecord> {
  await delay(200);
  const store = getStore();
  const target = store.payments.find((p) => p.id === paymentId);
  if (!target) throw new Error("Payment not found");
  const updated = { ...target, ...patch };
  setStore({
    payments: store.payments.map((p) => (p.id === paymentId ? updated : p)),
  });
  appendAudit(
    actor,
    `Updated refund/chargeback fields on ${target.transactionRef}`,
    "warn",
  );
  return updated;
}

export type RefundFieldPatch = {
  refundStatus?: RefundStatus;
  chargebackStatus?: ChargebackStatus;
  refundAmount?: number | null;
};
