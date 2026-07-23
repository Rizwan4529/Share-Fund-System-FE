import type {
  AuthUser,
  CommunicationPrefs,
  DisclosureAcceptance,
  Enrollment,
  NotificationItem,
  NotificationPrefs,
  PaymentRecord,
  PlatformSettings,
  Recommendation,
  SuccessCenter,
  AuditEvent,
  DisclosureDoc,
  BmisProfile,
} from "@/types";

import {
  DEFAULT_PRICING_SETTINGS,
  SEED_ACCEPTANCES,
  SEED_AUDIT,
  SEED_DISCLOSURES,
  SEED_ENROLLMENTS,
  SEED_PAYMENTS,
  SEED_RECOMMENDATIONS,
  SEED_SUCCESS_CENTERS,
  formatAuditTime,
} from "./phase1Seed";

const STORAGE_KEY = "sfs-phase1-store";

export type Phase1Store = {
  user: AuthUser | null;
  /** Persisted accounts so logout/login restores the same participant. */
  accounts: AuthUser[];
  settings: PlatformSettings;
  successCenters: SuccessCenter[];
  disclosures: DisclosureDoc[];
  acceptances: DisclosureAcceptance[];
  enrollments: Enrollment[];
  payments: PaymentRecord[];
  recommendations: Recommendation[];
  audit: AuditEvent[];
  notifications: NotificationItem[];
  twoFA: boolean;
  notifPrefs: NotificationPrefs;
  commPrefs: CommunicationPrefs;
};

const emptyBmis: BmisProfile = {
  goalSummary: "",
  preferredContact: "",
  notes: "",
};

const defaultStore: Phase1Store = {
  user: null,
  accounts: [],
  settings: structuredClone(DEFAULT_PRICING_SETTINGS),
  successCenters: structuredClone(SEED_SUCCESS_CENTERS),
  disclosures: structuredClone(SEED_DISCLOSURES),
  acceptances: structuredClone(SEED_ACCEPTANCES),
  enrollments: structuredClone(SEED_ENROLLMENTS),
  payments: structuredClone(SEED_PAYMENTS),
  recommendations: structuredClone(SEED_RECOMMENDATIONS),
  audit: structuredClone(SEED_AUDIT),
  notifications: [
    {
      id: "n1",
      title: "Welcome to Founding Participant Phase 1",
      body: "Complete your BMIS profile and questionnaire to receive planning projections.",
      time: "Just now",
      read: false,
    },
  ],
  twoFA: false,
  notifPrefs: {
    platform: true,
    campaign: true,
    education: true,
    announce: false,
  },
  commPrefs: { email: true, product: true, promos: false },
};

function readStore(): Phase1Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultStore);
    const parsed = JSON.parse(raw) as Partial<Phase1Store>;
    return {
      ...structuredClone(defaultStore),
      ...parsed,
      settings: {
        ...structuredClone(DEFAULT_PRICING_SETTINGS),
        ...(parsed.settings ?? {}),
        pricing: {
          ...DEFAULT_PRICING_SETTINGS.pricing,
          ...(parsed.settings?.pricing ?? {}),
          founderStack: {
            ...DEFAULT_PRICING_SETTINGS.pricing.founderStack,
            ...(parsed.settings?.pricing?.founderStack ?? {}),
          },
          tiers: {
            ...DEFAULT_PRICING_SETTINGS.pricing.tiers,
            ...(parsed.settings?.pricing?.tiers ?? {}),
          },
        },
        rules: {
          ...DEFAULT_PRICING_SETTINGS.rules,
          ...(parsed.settings?.rules ?? {}),
          caps: {
            ...DEFAULT_PRICING_SETTINGS.rules.caps,
            ...(parsed.settings?.rules?.caps ?? {}),
          },
          customRules:
            parsed.settings?.rules?.customRules ??
            DEFAULT_PRICING_SETTINGS.rules.customRules,
        },
      },
    };
  } catch {
    return structuredClone(defaultStore);
  }
}

function writeStore(store: Phase1Store): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getStore(): Phase1Store {
  return readStore();
}

export function setStore(partial: Partial<Phase1Store>): Phase1Store {
  const current = readStore();
  const next = { ...current, ...partial };
  if (partial.user) {
    const others = next.accounts.filter(
      (a) => a.email.toLowerCase() !== partial.user!.email.toLowerCase(),
    );
    next.accounts = [...others, partial.user];
  }
  writeStore(next);
  return next;
}

export function findAccountByEmail(email: string): AuthUser | null {
  const store = readStore();
  return (
    store.accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    ) ?? null
  );
}

export function clearStore(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function appendAudit(
  actor: string,
  action: string,
  tone: AuditEvent["tone"] = "ok",
): void {
  const store = readStore();
  const entry: AuditEvent = {
    id: crypto.randomUUID(),
    actor,
    action,
    time: formatAuditTime(),
    tone,
  };
  writeStore({ ...store, audit: [entry, ...store.audit] });
}

export function createUserFromSignup(name: string, email: string): AuthUser {
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
    membership: "Participant",
    onboardingComplete: false,
    verified: false,
    role: "participant",
    foundingStatus: "none",
    selectedCenterIds: [],
    centerLimit: 0,
    questionnaireComplete: false,
    questionnaireAnswers: [],
    bmisProfile: { ...emptyBmis },
    recommendationId: null,
  };
}

export function emptyBmisProfile(): BmisProfile {
  return { ...emptyBmis };
}

/* ─── PHASE2_PARKED: legacy helpers kept for parked campaign/rewards modules ─── */
export function seedDemoCampaign(
  categoryId: string,
  goalName: string,
  target: number,
  timeline: string,
) {
  return {
    cat: categoryId,
    name: goalName,
    target,
    saved: Math.round(target * 0.35),
    timeline,
    started: "Mar 2026",
  };
}
