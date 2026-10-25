import type {
  AffordabilityStatus,
  OptionProjection,
  PlanLabel,
  ProjectionBasis,
  ProjectionStatus,
} from "@/types/activation";
import type { FounderPlanName } from "@/types/founderPlans";
import type { PaymentPurpose, PaymentRecordStatus } from "@/types/payments";
import type { ParticipantStatus } from "@/types/participantStatus";

/** GET /me/dashboard — one owner-only payload; every figure comes from the API. */
export type ParticipantDashboard = {
  participant: {
    firstName: string;
    lastName: string;
    email: string;
    accountStatus: ParticipantStatus["accountStatus"];
    emailVerified: boolean;
    country?: string;
    preferredCurrency: string | null;
    founder: ParticipantStatus["founder"];
  };
  successProfile: {
    status: "incomplete" | "complete";
    completionPercentage: number;
    updatedAt: string;
  } | null;
  planningAccess: { status: "inactive" | "active"; active: boolean };
  selectedCenters: DashboardSelectedCenter[];
  recommendations: DashboardRecommendation[];
  enrollmentHistory: DashboardEnrollment[];
  paymentHistory: { recent: DashboardPayment[]; total: number };
};

export type DashboardSelectedCenter = {
  _id: string;
  programName: string | null;
  programType: "funding" | "planning" | null;
  categoryName: string | null;
  obligationType: "existing_obligation" | "new_goal";
  status: "active" | "removed";
  activationStatus?: "unpaid" | "paid";
  selectedAt: string;
  hasRecommendation: boolean;
};

export type DashboardRecommendation = {
  selectionId: string;
  recommendationId: string;
  programName: string | null;
  categoryName: string | null;
  goalAmount: number | null;
  activationPercentage: number | null;
  recommendedActivation: number | null;
  affordabilityStatus: AffordabilityStatus;
  /** The chosen plan, else the fastest plan that fits; null when none fits. */
  featuredOption: {
    label: PlanLabel;
    reason: "selected" | "fits_budget";
    months: number;
    scheduledPayment: number;
    totalActivationRequirement: number;
    projection: OptionProjection | null;
  } | null;
  oneTimeOption: {
    totalActivationRequirement: number | null;
    projection: OptionProjection | null;
  };
  projection: {
    isProjection: true;
    status: ProjectionStatus;
    notice: string;
    basis: ProjectionBasis;
    basisDate: string;
  } | null;
  updatedAt: string;
};

export type DashboardEnrollment = {
  _id: string;
  purpose: Extract<PaymentPurpose, "funding_access" | "founder_tier">;
  /** Funding Access plan label (founder purchases send founderPlanName). */
  label: string | null;
  founderPlanName: FounderPlanName | null;
  programAllowance: number | null;
  status: "pending" | "completed" | "failed";
  purchasedAt: string;
  amount: number | null;
  currency: string | null;
  paymentId: string | null;
};

export type DashboardPayment = {
  _id: string;
  purpose: PaymentPurpose;
  description: string | null;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  date: string;
  reference: string | null;
  refundStatus?: string;
};
