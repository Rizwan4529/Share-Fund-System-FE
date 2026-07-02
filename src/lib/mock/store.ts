import type {
  ActiveCampaign,
  AuthUser,
  CommunicationPrefs,
  NotificationPrefs,
  RewardsBalance,
} from "@/types";

import {
  DEFAULT_ACTIVITY,
  DEFAULT_MILESTONES,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_REWARD_HISTORY,
} from "./data";

const STORAGE_KEY = "sfs-member-store";

export type MemberStore = {
  user: AuthUser | null;
  hasCampaign: boolean;
  campaign: ActiveCampaign | null;
  rewards: RewardsBalance;
  rewardHistory: typeof DEFAULT_REWARD_HISTORY;
  activity: typeof DEFAULT_ACTIVITY;
  milestones: typeof DEFAULT_MILESTONES;
  notifications: typeof DEFAULT_NOTIFICATIONS;
  twoFA: boolean;
  notifPrefs: NotificationPrefs;
  commPrefs: CommunicationPrefs;
};

const defaultStore: MemberStore = {
  user: null,
  hasCampaign: false,
  campaign: null,
  rewards: { balance: 1240, monthEarned: 180, lifetime: 3060 },
  rewardHistory: DEFAULT_REWARD_HISTORY,
  activity: DEFAULT_ACTIVITY,
  milestones: DEFAULT_MILESTONES,
  notifications: DEFAULT_NOTIFICATIONS,
  twoFA: false,
  notifPrefs: {
    platform: true,
    campaign: true,
    education: true,
    announce: false,
  },
  commPrefs: { email: true, product: true, promos: false },
};

function readStore(): MemberStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultStore };
    return { ...defaultStore, ...JSON.parse(raw) };
  } catch {
    return { ...defaultStore };
  }
}

function writeStore(store: MemberStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getStore(): MemberStore {
  return readStore();
}

export function setStore(partial: Partial<MemberStore>): MemberStore {
  const next = { ...readStore(), ...partial };
  writeStore(next);
  return next;
}

export function clearStore(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createUserFromSignup(
  name: string,
  email: string,
): AuthUser {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return {
    id: crypto.randomUUID(),
    name,
    email,
    phone: "",
    location: "",
    avatarInitials: initials || "SFS",
    membership: "Free member",
    onboardingComplete: false,
    verified: false,
    role: "member",
  };
}

export function seedDemoCampaign(
  categoryId: string,
  goalName: string,
  target: number,
  timeline: string,
): ActiveCampaign {
  return {
    cat: categoryId,
    name: goalName,
    target,
    saved: Math.round(target * 0.35),
    timeline,
    started: "Mar 2026",
  };
}
