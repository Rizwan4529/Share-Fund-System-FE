import type { UserRole } from "@/types";

export type AdminViewRole = "Owner" | "Operator";

/** Temporary mock admin detection until real JWT roles exist. */
export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().includes("admin");
}

export function isAdminUser(role: UserRole | undefined): boolean {
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
