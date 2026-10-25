import type { SuccessProfileRecord } from "@/types/successProfile";

/** Derived on the backend from foundingParticipant + founderTier. */
export const PARTICIPANT_STANDINGS = [
  "none",
  "founding_participant",
  "essential_100",
  "expanded_500",
  "premium_1000",
] as const;

export type ParticipantStanding = (typeof PARTICIPANT_STANDINGS)[number];

/** Values of User.status — the only account states the backend has today. */
export const PARTICIPANT_ACCOUNT_STATUSES = [
  "active",
  "pending_verification",
  "suspended",
  "closed",
] as const;

/** States an admin can set (Part B access actions). */
export type AdminSettableAccountStatus = "active" | "suspended" | "closed";

export const FOUNDER_TIERS = [
  "none",
  "essential_100",
  "expanded_500",
  "premium_1000",
] as const;
export type FounderTier = (typeof FOUNDER_TIERS)[number];

export type PlanningAccessStatus = "inactive" | "active";

export type UpdateParticipantAccessRequest = {
  founderTier?: FounderTier;
  foundingParticipant?: boolean;
  planningAccessStatus?: PlanningAccessStatus;
};

/** What the status/access endpoints return. */
export type ParticipantAccessSummary = {
  _id: string;
  accountStatus: ParticipantAccountStatus;
  status: ParticipantStanding;
  statusLabel: string;
  founderTier: FounderTier;
  foundingParticipant: boolean;
  planningAccessStatus: PlanningAccessStatus;
};

export type ParticipantAccountStatus =
  (typeof PARTICIPANT_ACCOUNT_STATUSES)[number];

export type ParticipantQuestionnaireFilter = "complete" | "incomplete";

export type ParticipantSortBy =
  | "name"
  | "email"
  | "status"
  | "questionnaire"
  | "createdAt"
  | "lastActiveAt";

export type AdminParticipantRow = {
  _id: string;
  name: string;
  email: string;
  status: ParticipantStanding;
  statusLabel: string;
  centersUsed: number;
  centersTotal: number;
  centersSelected: string;
  questionnaireComplete: boolean;
  accountStatus: ParticipantAccountStatus;
  createdAt: string;
  lastActiveAt: string;
};

export type ListAdminParticipantsParams = {
  page: number;
  limit: number;
  search?: string;
  status?: ParticipantStanding;
  questionnaire?: ParticipantQuestionnaireFilter;
  accountStatus?: ParticipantAccountStatus;
  sortBy?: ParticipantSortBy;
  sortOrder?: "asc" | "desc";
};

export type AdminParticipantsPage = {
  participants: AdminParticipantRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminParticipantSelection = {
  _id: string;
  programId: { _id: string; name: string } | null;
  categoryId: { _id: string; name: string } | null;
  selectedAt?: string;
};

export type AdminParticipantDetail = {
  participant: {
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    stateRegion?: string;
    preferredCurrency?: string;
    accountStatus: ParticipantAccountStatus;
    status: ParticipantStanding;
    statusLabel: string;
    foundingParticipant: boolean;
    founderTier: string;
    planningAccessStatus?: PlanningAccessStatus;
    createdAt: string;
    lastActiveAt: string;
  };
  /** `null` until the participant starts their Success Profile. */
  successProfile: SuccessProfileRecord | null;
  selections: AdminParticipantSelection[];
  centers: { used: number; total: number; label: string };
};
