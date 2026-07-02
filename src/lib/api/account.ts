import { delay } from "@/lib/delay";
import { getStore, setStore } from "@/lib/mock/store";
import type {
  CommunicationPrefs,
  NotificationPrefs,
  UserProfile,
} from "@/types";

export async function getAccountData() {
  await delay();
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  return {
    profile: store.user,
    twoFA: store.twoFA,
    notifPrefs: store.notifPrefs,
    commPrefs: store.commPrefs,
  };
}

export async function saveProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  await delay();
  const store = getStore();
  if (!store.user) throw new Error("Not authenticated");
  const user = { ...store.user, ...data };
  setStore({ user });
  return user;
}

export async function saveNotificationPrefs(
  prefs: NotificationPrefs,
): Promise<void> {
  await delay();
  setStore({ notifPrefs: prefs });
}

export async function saveCommunicationPrefs(
  prefs: CommunicationPrefs,
): Promise<void> {
  await delay();
  setStore({ commPrefs: prefs });
}

export async function setTwoFA(enabled: boolean): Promise<void> {
  await delay();
  setStore({ twoFA: enabled });
}

export async function deleteAccount(): Promise<void> {
  await delay();
  setStore({ user: null, hasCampaign: false, campaign: null });
}

export async function getNotifications() {
  await delay();
  return getStore().notifications;
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay();
  const store = getStore();
  setStore({
    notifications: store.notifications.map((n) => ({ ...n, read: true })),
  });
}
