import type { UserRole } from "@/types";
import type { BackendRole } from "@/types/auth";

export type AdminViewRole = "Owner" | "Operator";

export function isAdminUser(
  role: UserRole | BackendRole | undefined,
): boolean {
  return role === "admin";
}

export function foundingStatusLabel(
  status: "none" | "founding_participant" | "founder_stack",
): string {
  switch (status) {
    case "founding_participant":
      return "Founding Participant";
    case "founder_stack":
      return "Founder Stack";
    default:
      return "Not active";
  }
}

/**
 * Founding Participant Status shown to participants: never "Not enrolled".
 * Registered-but-unpaid reads "Not active"; after payment it reads "Active".
 */
export function foundingAccessState(
  status: "none" | "founding_participant" | "founder_stack",
): "Active" | "Not active" {
  return status === "none" ? "Not active" : "Active";
}
