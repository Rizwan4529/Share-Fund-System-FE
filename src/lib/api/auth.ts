import { isAdminEmail } from "@/lib/auth/roles";
import { delay } from "@/lib/delay";
import {
  clearStore,
  createUserFromSignup,
  getStore,
  setStore,
} from "@/lib/mock/store";
import type { AuthUser } from "@/types";

function buildAdminUser(email: string): AuthUser {
  const local = email.split("@")[0] ?? "Admin";
  const name = local
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: crypto.randomUUID(),
    name: name || "Admin User",
    email,
    phone: "",
    location: "",
    avatarInitials: initials || "AD",
    membership: "Platform admin",
    onboardingComplete: true,
    verified: true,
    role: "admin",
  };
}

export async function loginUser(
  email: string,
  _password: string,
): Promise<AuthUser> {
  await delay();
  const store = getStore();
  if (store.user) {
    return store.user;
  }

  if (isAdminEmail(email)) {
    const user = buildAdminUser(email);
    setStore({ user, hasCampaign: false, campaign: null });
    return user;
  }

  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: email.split("@")[0] ?? "Member",
    email,
    phone: "",
    location: "",
    avatarInitials: (email[0] ?? "S").toUpperCase(),
    membership: "Free member",
    onboardingComplete: true,
    verified: true,
    role: "member",
  };
  setStore({
    user,
    hasCampaign: true,
    campaign: {
      cat: "housing",
      name: "Move to a bigger place",
      target: 12000,
      saved: 4200,
      timeline: "12",
      started: "Mar 2026",
    },
  });
  return user;
}

export async function signupUser(
  name: string,
  email: string,
  _password: string,
): Promise<AuthUser> {
  await delay();
  const user = createUserFromSignup(name, email);
  setStore({ user, hasCampaign: false, campaign: null });
  return user;
}

export async function verifyUser(): Promise<AuthUser> {
  await delay();
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const user = { ...store.user, verified: true };
  setStore({ user });
  return user;
}

export async function completeOnboarding(
  categoryId?: string,
): Promise<AuthUser> {
  await delay();
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const user = { ...store.user, onboardingComplete: true };
  setStore({ user });
  if (categoryId) {
    void categoryId;
  }
  return user;
}

export async function getSession(): Promise<AuthUser | null> {
  await delay(100);
  return getStore().user;
}

export async function logoutUser(): Promise<void> {
  await delay(100);
  clearStore();
}

export async function sendResetEmail(_email: string): Promise<void> {
  await delay();
}

export async function resetPassword(_password: string): Promise<void> {
  await delay();
}
