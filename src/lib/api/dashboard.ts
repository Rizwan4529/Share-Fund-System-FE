import { delay } from "@/lib/delay";
import { getStore } from "@/lib/mock/store";
import { profileCompletion } from "@/lib/questionnaire/schema";
import type {
  Enrollment,
  FoundingSelectionMode,
  PaymentRecord,
  Recommendation,
  SuccessCenter,
} from "@/types";

export type DashboardPayload = {
  selectedCenters: SuccessCenter[];
  recommendation: Recommendation | null;
  foundingStatus: string;
  centerLimit: number;
  selectionMode: FoundingSelectionMode;
  questionnaireComplete: boolean;
  profileCompletion: number;
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
    selectionMode: store.settings.pricing.selectionMode,
    questionnaireComplete: store.user.questionnaireComplete,
    profileCompletion: profileCompletion(store.user.successProfile),
    enrollments: store.enrollments.filter((e) => e.userId === store.user!.id),
    payments: store.payments.filter((p) => p.userId === store.user!.id),
    projectionDisclaimer:
      "Budgets and timelines are projections / simulations only. Live funding is not active in Phase 1.",
  };
}
