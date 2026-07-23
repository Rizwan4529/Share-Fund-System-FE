import { isAdminEmail } from "@/lib/auth/roles";
import { delay } from "@/lib/delay";
import {
  appendAudit,
  createUserFromSignup,
  emptyBmisProfile,
  findAccountByEmail,
  getStore,
  setStore,
} from "@/lib/mock/store";
import type { AuthUser, DisclosureAcceptance } from "@/types";

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
    foundingStatus: "none",
    selectedCenterIds: [],
    centerLimit: 0,
    questionnaireComplete: false,
    questionnaireAnswers: [],
    bmisProfile: emptyBmisProfile(),
    recommendationId: null,
  };
}

function normalizeUser(user: AuthUser): AuthUser {
  return {
    ...user,
    role: user.role === "admin" ? "admin" : "participant",
    foundingStatus: user.foundingStatus ?? "none",
    selectedCenterIds: user.selectedCenterIds ?? [],
    centerLimit: user.centerLimit ?? 0,
    questionnaireComplete: user.questionnaireComplete ?? false,
    questionnaireAnswers: user.questionnaireAnswers ?? [],
    bmisProfile: user.bmisProfile ?? emptyBmisProfile(),
    recommendationId: user.recommendationId ?? null,
    membership:
      user.role === "admin"
        ? "Platform admin"
        : user.foundingStatus === "founder_stack"
          ? "Founder Stack"
          : user.foundingStatus === "founding_participant"
            ? "Founding Participant"
            : "Participant",
  };
}

export async function loginUser(
  email: string,
  _password: string,
): Promise<AuthUser> {
  // Mock: password accepted in form but not validated until real JWT auth.
  await delay();
  const existing = findAccountByEmail(email);
  if (existing) {
    const user = normalizeUser(existing);
    setStore({ user });
    appendAudit(user.email, "Signed in");
    return user;
  }

  if (isAdminEmail(email)) {
    const user = buildAdminUser(email);
    setStore({ user });
    appendAudit(user.email, "Admin signed in");
    return user;
  }

  const user = normalizeUser({
    ...createUserFromSignup(email.split("@")[0] ?? "Participant", email),
    verified: true,
    onboardingComplete: true,
  });
  setStore({ user });
  appendAudit(user.email, "Signed in (demo session)");
  return user;
}

export async function signupUser(
  name: string,
  email: string,
  _password: string,
): Promise<AuthUser> {
  await delay();
  const user = createUserFromSignup(name, email);
  setStore({ user });
  appendAudit(email, "Registered new participant account");
  return user;
}

export async function verifyUser(): Promise<AuthUser> {
  await delay();
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const user = normalizeUser({ ...store.user, verified: true });
  setStore({ user });
  appendAudit(user.email, "Email verified (demo)");
  return user;
}

export async function completeOnboarding(
  _categoryId?: string,
): Promise<AuthUser> {
  await delay();
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const user = normalizeUser({ ...store.user, onboardingComplete: true });
  setStore({ user });
  appendAudit(user.email, "Completed onboarding");
  return user;
}

export async function getSession(): Promise<AuthUser | null> {
  await delay(100);
  const user = getStore().user;
  if (!user) return null;
  const updated = normalizeUser({
    ...user,
    role: isAdminEmail(user.email) ? "admin" : (user.role ?? "participant"),
    ...(isAdminEmail(user.email)
      ? { verified: true, onboardingComplete: true, role: "admin" as const }
      : {}),
  });
  setStore({ user: updated });
  return updated;
}

export async function logoutUser(): Promise<void> {
  await delay(100);
  const store = getStore();
  const email = store.user?.email;
  if (store.user) {
    const others = store.accounts.filter(
      (a) => a.email.toLowerCase() !== store.user!.email.toLowerCase(),
    );
    setStore({
      user: null,
      accounts: [...others, store.user],
    });
  } else {
    setStore({ user: null });
  }
  if (email) appendAudit(email, "Signed out");
}

export async function acceptDisclosures(
  kinds: DisclosureAcceptance["kind"][],
): Promise<DisclosureAcceptance[]> {
  await delay(150);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const now = new Date().toISOString();
  const created: DisclosureAcceptance[] = [];
  for (const kind of kinds) {
    const doc = store.disclosures.find((d) => d.kind === kind);
    if (!doc) continue;
    const acceptance: DisclosureAcceptance = {
      id: crypto.randomUUID(),
      userId: store.user.id,
      docId: doc.id,
      kind,
      version: doc.version,
      acceptedAt: now,
    };
    created.push(acceptance);
  }
  setStore({ acceptances: [...created, ...store.acceptances] });
  appendAudit(store.user.email, `Accepted disclosures: ${kinds.join(", ")}`);
  return created;
}

export async function sendResetEmail(_email: string): Promise<void> {
  await delay();
}

export async function resetPassword(_password: string): Promise<void> {
  await delay();
}
