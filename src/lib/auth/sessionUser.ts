import { emptySuccessProfile } from "@/lib/mock/phase1Seed";
import { emptyBmisProfile } from "@/lib/mock/store";
import { homePathForRole, isAdminUser } from "@/lib/auth/roles";
import type { AuthUser } from "@/types";
import type { BackendUser } from "@/types/auth";
import { ROUTES } from "@/utils/constants";

function initialsFromName(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
}

export function toSessionUser(user: BackendUser): AuthUser {
  const name = `${user.firstName} ${user.lastName}`.trim();
  return {
    id: user._id,
    name,
    email: user.email,
    phone: user.phone ?? "",
    location: user.country ?? "",
    avatarInitials: initialsFromName(user.firstName, user.lastName),
    membership: isAdminUser(user.role) ? "Platform admin" : "Participant",
    onboardingComplete: true,
    verified: user.emailVerified,
    role: isAdminUser(user.role) ? "admin" : "participant",
    foundingStatus: user.foundingParticipant ? "founding_participant" : "none",
    selectedCenterIds: [],
    centerLimit: 0,
    questionnaireComplete: false,
    questionnaireAnswers: [],
    bmisProfile: emptyBmisProfile(),
    successProfile: emptySuccessProfile(),
    recommendationId: null,
  };
}

export function postLoginPath(user: BackendUser): string {
  if (isAdminUser(user.role)) return homePathForRole(user.role);
  if (!user.emailVerified) return ROUTES.VERIFY;
  return homePathForRole(user.role);
}
