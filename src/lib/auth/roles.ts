export type UserRole = "member" | "admin";

export type AdminViewRole = "Owner" | "Operator";

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().includes("admin");
}

export function isAdminUser(role: UserRole | undefined): boolean {
  return role === "admin";
}
