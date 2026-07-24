import { delay } from "@/lib/delay";
import { getStore } from "@/lib/mock/store";
import type {
  Enrollment,
  PaymentRecord,
  Recommendation,
  SuccessCenter,
} from "@/types";

export type DashboardPayload = {
  selectedCenters: SuccessCenter[];
  recommendation: Recommendation | null;
  foundingStatus: string;
  centerLimit: number;
  questionnaireComplete: boolean;
  enrollments: Enrollment[];
  payments: PaymentRecord[];
  projectionDisclaimer: string;
};

export async function getDashboardData(): Promise<DashboardPayload> {
  await delay(150);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");

  const selectedCenters = store.successCenters.filter((c) =>
    store.user!.selectedCenterIds.includes(c.id),
  );
  const recommendation =
    store.recommendations.find((r) => r.id === store.user!.recommendationId) ??
    null;

  return {
    selectedCenters,
    recommendation,
    foundingStatus: store.user.foundingStatus,
    centerLimit: store.user.centerLimit,
    questionnaireComplete: store.user.questionnaireComplete,
    enrollments: store.enrollments.filter((e) => e.userId === store.user!.id),
    payments: store.payments.filter((p) => p.userId === store.user!.id),
    projectionDisclaimer:
      "Budgets and timelines are projections / simulations only. Live funding is not active in Phase 1.",
  };
}
