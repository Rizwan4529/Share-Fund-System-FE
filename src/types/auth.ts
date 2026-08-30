export type ApiEnvelope<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

export type BackendRole = "admin" | "user";

export type BackendUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: BackendRole;
  phone: string;
  country: string;
  address?: string;
  stateRegion?: string;
  preferredCurrency?: string;
  foundingParticipant?: boolean;
  foundingParticipantSource?: string;
  founderWaitlistStatus?: string;
  founderApplicantStatus?: string;
  founderQualificationStatus?: string;
  founderTier?: string;
  permanentFounderNumber?: number;
  founderActivationDate?: string;
  founderEnrollmentDeadline?: string;
  founderBenefitsVersion?: string;
  contactMethod?: string;
  additionalNotes?: string;
  status: string;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = BackendUser & { token: string };

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  address?: string;
  stateRegion?: string;
  preferredCurrency?: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type ResendLinkRequest = {
  email: string;
};

export type LegalDocumentType =
  | "disclaimer"
  | "founding_disclosure"
  | "terms"
  | "privacy"
  | "refund_policy"
  | "checkout_acknowledgment"
  | "success_center_notice"
  | "partner_disclosure"
  | "other";

export type LegalAcceptanceContext =
  | "signup"
  | "checkout"
  | "founder_activation"
  | "other";

export type LegalDocument = {
  _id: string;
  documentType: LegalDocumentType;
  title: string;
  content: string;
  version: number;
  status: string;
  effectiveDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LegalAcceptanceCurrent = {
  accepted: boolean;
  documentType: LegalDocumentType;
  currentVersion: number;
  acceptedVersion: number | null;
  acceptedAt: string | null;
  context: LegalAcceptanceContext | null;
};

export type RecordLegalAcceptanceRequest = {
  documentType: LegalDocumentType;
  context: LegalAcceptanceContext;
};

export const SIGNUP_LEGAL_TYPES = [
  "terms",
  "privacy",
  "founding_disclosure",
] as const;

export type SignupLegalType = (typeof SIGNUP_LEGAL_TYPES)[number];

export type PersistedAuth = {
  user: BackendUser;
  token: string;
};

export function stripAuthToken(data: LoginResponse): BackendUser {
  const { token: _token, ...user } = data;
  return user;
}
