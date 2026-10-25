import type {
  ParticipantAccountStatus,
  ParticipantStanding,
  PlanningAccessStatus,
} from "@/types/adminParticipants";
import type { PaymentRecordStatus } from "@/types/payments";

/** GET /me/status — the logged-in participant's consolidated status. */
export type ParticipantStatus = {
  accountStatus: ParticipantAccountStatus;
  emailVerified: boolean;
  founder: {
    status: ParticipantStanding;
    statusLabel: string;
    founderTier: string;
    foundingParticipant: boolean;
  };
  planningAccessStatus: PlanningAccessStatus;
  successProfile: {
    profileType: string;
    status: "incomplete" | "complete";
    completionPercentage: number;
    updatedAt: string;
  } | null;
  selections: {
    _id: string;
    programName: string | null;
    programType: string | null;
    categoryName: string | null;
    obligationType: string;
    activationStatus: "unpaid" | "paid";
    activationPaidAt: string | null;
    selectedAt: string;
  }[];
  payments: {
    counts: Record<PaymentRecordStatus, number>;
    completedTotals: { currency: string; total: number }[];
    latest: {
      _id: string;
      description?: string;
      amount: number;
      currency: string;
      status: PaymentRecordStatus;
      createdAt: string;
      paymentDate?: string;
    } | null;
  };
};
