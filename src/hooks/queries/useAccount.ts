import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteAccount,
  getAccountData,
  getNotifications,
  markAllNotificationsRead,
  saveCommunicationPrefs,
  saveNotificationPrefs,
  saveProfile,
  setTwoFA,
} from "@/lib/api/account";
import type { CommunicationPrefs, NotificationPrefs, UserProfile } from "@/types";

export function useAccount() {
  return useQuery({ queryKey: ["account"], queryFn: getAccountData });
}

export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: getNotifications });
}

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => saveProfile(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["account"] });
    },
  });
}

export function useSaveNotificationPrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: NotificationPrefs) => saveNotificationPrefs(prefs),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["account"] }),
  });
}

export function useSaveCommunicationPrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: CommunicationPrefs) => saveCommunicationPrefs(prefs),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["account"] }),
  });
}

export function useSetTwoFA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => setTwoFA(enabled),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["account"] }),
  });
}

export function useDeleteAccount() {
  return useMutation({ mutationFn: deleteAccount });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
