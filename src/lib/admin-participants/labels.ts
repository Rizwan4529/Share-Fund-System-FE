import type {
  ParticipantAccountStatus,
  ParticipantQuestionnaireFilter,
  ParticipantStanding,
} from "@/types/adminParticipants";

/** Matches the backend's PARTICIPANT_STANDING_LABELS. */
export const PARTICIPANT_STANDING_OPTIONS: {
  value: ParticipantStanding;
  label: string;
}[] = [
  { value: "founding_participant", label: "Founding Participant" },
  { value: "essential_100", label: "Founder · Essential" },
  { value: "expanded_500", label: "Founder · Expanded" },
  { value: "premium_1000", label: "Founder · Premium" },
  { value: "none", label: "Not active" },
];

export const PARTICIPANT_QUESTIONNAIRE_OPTIONS: {
  value: ParticipantQuestionnaireFilter;
  label: string;
}[] = [
  { value: "complete", label: "Complete" },
  { value: "incomplete", label: "Incomplete" },
];

export const PARTICIPANT_ACCOUNT_STATUS_OPTIONS: {
  value: ParticipantAccountStatus;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "pending_verification", label: "Pending verification" },
  { value: "suspended", label: "Suspended" },
  { value: "closed", label: "Closed" },
];

/** Select value meaning "no filter" (Radix Select can't use ""). */
export const ALL_FILTER = "all";
