import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AdminViewRole } from "@/lib/auth/roles";
import type { AdminDateRange } from "@/utils/constants";

type AdminShellContextValue = {
  search: string;
  setSearch: (value: string) => void;
  range: AdminDateRange;
  setRange: (value: AdminDateRange) => void;
  viewRole: AdminViewRole;
  setViewRole: (role: AdminViewRole) => void;
  hasNotifications: boolean;
  markAllNotificationsRead: () => void;
};

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export function AdminShellProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<AdminDateRange>("30d");
  const [viewRole, setViewRole] = useState<AdminViewRole>("Owner");
  const [hasNotifications, setHasNotifications] = useState(true);

  const markAllNotificationsRead = useCallback(() => {
    setHasNotifications(false);
  }, []);

  const value = useMemo(
    () => ({
      search,
      setSearch,
      range,
      setRange,
      viewRole,
      setViewRole,
      hasNotifications,
      markAllNotificationsRead,
    }),
    [search, range, viewRole, hasNotifications, markAllNotificationsRead],
  );

  return (
    <AdminShellContext.Provider value={value}>{children}</AdminShellContext.Provider>
  );
}

export function useAdminShell() {
  const ctx = useContext(AdminShellContext);
  if (!ctx) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }
  return ctx;
}
