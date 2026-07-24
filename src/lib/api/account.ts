import { delay } from "@/lib/delay";
import { appendAudit, getStore, setStore } from "@/lib/mock/store";
import type {
  AuthUser,
  BmisProfile,
  CommunicationPrefs,
  NotificationPrefs,
  UserProfile,
} from "@/types";

export type AccountPayload = {
  profile: UserProfile & {
    bmisProfile: BmisProfile;
    foundingStatus: AuthUser["foundingStatus"];
    questionnaireComplete: boolean;
    selectedCenterIds: string[];
    centerLimit: number;
    paused: boolean;
  };
  twoFA: boolean;
  notifPrefs: NotificationPrefs;
  commPrefs: CommunicationPrefs;
};

export async function getAccountData(): Promise<AccountPayload> {
  await delay(120);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const u = store.user;
  return {
    profile: {
      name: u.name,
      email: u.email,
      phone: u.phone,
      location: u.location,
      avatarInitials: u.avatarInitials,
      membership: u.membership,
      bmisProfile: u.bmisProfile,
      foundingStatus: u.foundingStatus,
      questionnaireComplete: u.questionnaireComplete,
      selectedCenterIds: u.selectedCenterIds,
      centerLimit: u.centerLimit,
      paused: Boolean(u.paused),
    },
    twoFA: store.twoFA,
    notifPrefs: store.notifPrefs,
    commPrefs: store.commPrefs,
  };
}

export async function saveProfile(
  input: Partial<UserProfile> & { bmisProfile?: Partial<BmisProfile> },
): Promise<AuthUser> {
  await delay(200);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const user: AuthUser = {
    ...store.user,
    ...input,
    bmisProfile: {
      ...store.user.bmisProfile,
      ...(input.bmisProfile ?? {}),
    },
  };
  if (input.name) {
    user.avatarInitials = input.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  setStore({ user });
  appendAudit(user.email, "Updated BMIS profile");
  return user;
}

export async function saveNotificationPrefs(
  prefs: NotificationPrefs,
): Promise<NotificationPrefs> {
  await delay(150);
  setStore({ notifPrefs: prefs });
  return prefs;
}

export async function saveCommunicationPrefs(
  prefs: CommunicationPrefs,
): Promise<CommunicationPrefs> {
  await delay(150);
  setStore({ commPrefs: prefs });
  return prefs;
}

export async function getNotifications() {
  await delay(80);
  return getStore().notifications;
}

export async function markAllNotificationsRead() {
  await delay(80);
  const store = getStore();
  setStore({
    notifications: store.notifications.map((n) => ({ ...n, read: true })),
  });
}

export async function setTwoFA(enabled: boolean): Promise<boolean> {
  await delay(150);
  setStore({ twoFA: enabled });
  return enabled;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await delay(200);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Use at least 8 characters for the new password.");
  }
  const key = store.user.email.toLowerCase();
  const stored = store.credentials[key];
  if (stored && stored !== currentPassword) {
    throw new Error("Current password is incorrect.");
  }
  setStore({
    credentials: { ...store.credentials, [key]: newPassword },
  });
  appendAudit(store.user.email, "Changed password (demo)");
}

export async function setAccountPaused(paused: boolean): Promise<AuthUser> {
  await delay(150);
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const user: AuthUser = { ...store.user, paused };
  setStore({ user });
  appendAudit(
    user.email,
    paused ? "Paused account (demo)" : "Resumed account (demo)",
  );
  return user;
}

export async function deleteAccount(): Promise<void> {
  await delay(200);
  const store = getStore();
  if (store.user) {
    appendAudit(store.user.email, "Requested account deletion (demo)", "warn");
  }
  setStore({
    user: null,
    accounts: store.accounts.filter((a) => a.id !== store.user?.id),
  });
}
