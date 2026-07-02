import { useState } from "react";
import { Bell, Check, ChevronDown, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AdminSegmentedControl } from "@/components/admin/AdminSegmentedControl";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminShell } from "@/context/AdminShellContext";
import { useAuth } from "@/context/AuthContext";
import type { AdminViewRole } from "@/lib/auth/roles";
import { fetchAdminNotifications } from "@/lib/api/admin";
import { ADMIN_DATE_RANGES, ROUTES } from "@/utils/constants";
import type { AdminDateRange } from "@/utils/constants";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const RANGE_OPTIONS = ADMIN_DATE_RANGES.map((id) => ({
  id,
  label: id.toUpperCase(),
}));

const NOTIF_DOT: Record<string, string> = {
  gold: "bg-gold-dark",
  slate: "bg-muted-soft",
  danger: "bg-error",
  blue: "bg-info",
};

export function AdminTopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    search,
    setSearch,
    range,
    setRange,
    viewRole,
    setViewRole,
    hasNotifications,
    markAllNotificationsRead,
  } = useAdminShell();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Awaited<ReturnType<typeof fetchAdminNotifications>>
  >([]);

  useEffect(() => {
    void fetchAdminNotifications().then(setNotifications);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-white/86 px-[26px] backdrop-blur-[10px]">
      <div className="relative max-w-[440px] flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2 text-muted-light" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members, campaigns, transactions…"
          className="h-10 rounded-md border-[#e0e7f1] bg-bg-card pr-3.5 pl-10 text-sm text-ink-heading shadow-none focus-visible:border-gold-dark focus-visible:ring-gold/15"
        />
      </div>

      <div className="flex-1" />

      <AdminSegmentedControl
        options={RANGE_OPTIONS}
        value={range}
        onChange={(id) => setRange(id as AdminDateRange)}
        size="sm"
        className="bg-[#f1f4fa] border-[#e4e9f2]"
      />

      <div className="relative">
        <Button
          type="button"
          variant="ghost-outline"
          size="icon"
          className="relative size-10 rounded-md border-[#e0e7f1]"
          onClick={() => {
            setNotifOpen((open) => !open);
            setUserOpen(false);
          }}
          aria-label="Notifications"
        >
          <Bell className="size-[18px] text-[#33425f]" />
          {hasNotifications ? (
            <span className="absolute top-2 right-2 size-2 rounded-full border-2 border-white bg-gold-dark" />
          ) : null}
        </Button>
        {notifOpen ? (
          <div className="absolute top-12 right-0 z-40 w-[340px] animate-fade-up overflow-hidden rounded-[9px] border border-line bg-white shadow-[0_24px_60px_-24px_rgba(12,31,68,0.4)]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <Typography variant="label" className="font-display text-[14.5px] font-bold">
                Notifications
              </Typography>
              <button
                type="button"
                className="text-[12.5px] font-semibold text-gold-dark"
                onClick={markAllNotificationsRead}
              >
                Mark all read
              </button>
            </div>
            <div className="admin-scroll max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.text}
                  className="flex gap-2.5 border-b border-[#f2f5fa] px-4 py-3"
                >
                  <span
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      NOTIF_DOT[n.tone] ?? "bg-muted-soft",
                    )}
                  />
                  <div>
                    <Typography variant="body-sm" className="text-[13px] leading-snug text-[#22314f]">
                      {n.text}
                    </Typography>
                    <Typography variant="caption" className="mt-0.5 text-[11.5px] text-[#93a3c2]">
                      {n.time}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative">
        <Button
          type="button"
          variant="ghost-outline"
          className="h-10 gap-2 rounded-md border-[#e0e7f1] px-1.5 pr-2.5"
          onClick={() => {
            setUserOpen((open) => !open);
            setNotifOpen(false);
          }}
        >
          <span className="flex size-[29px] items-center justify-center rounded-full bg-gradient-to-br from-navy-deep to-[#1c3768] font-display text-xs font-bold text-gold">
            {user?.avatarInitials ?? "AD"}
          </span>
          <span className="text-[13.5px] font-semibold text-[#22314f]">
            {user?.name.split(" ")[0] ?? "Admin"}
          </span>
          <ChevronDown className="size-[15px] text-[#8496b7]" />
        </Button>
        {userOpen ? (
          <div className="absolute top-12 right-0 z-40 w-[246px] animate-fade-up overflow-hidden rounded-[9px] border border-line bg-white shadow-[0_24px_60px_-24px_rgba(12,31,68,0.4)]">
            <div className="border-b border-line px-4 py-3.5">
              <Typography variant="label" className="text-sm font-bold text-ink-heading">
                {user?.name}
              </Typography>
              <Typography variant="caption" className="text-[12.5px] text-[#8496b7]">
                {user?.email}
              </Typography>
              <span className="mt-2 inline-flex rounded-[5px] border border-gold/32 bg-gold/12 px-2 py-0.5 text-[11px] font-bold text-[#8a6413]">
                {viewRole}
              </span>
            </div>
            <div className="p-1.5">
              <Typography
                variant="overline"
                className="px-2.5 py-1.5 text-[11px] font-bold tracking-[0.06em] text-[#a3b1cd]"
              >
                View as role
              </Typography>
              {(["Owner", "Operator"] as AdminViewRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setViewRole(role);
                    setUserOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[13.5px] font-semibold text-[#33425f]",
                    viewRole === role ? "bg-bg-card" : "hover:bg-bg-card/60",
                  )}
                >
                  <span>
                    {role}
                    {role === "Owner" ? " — full access" : " — scoped"}
                  </span>
                  {viewRole === role ? <Check className="size-[15px] text-gold-dark" /> : null}
                </button>
              ))}
              <div className="mx-1 my-1.5 h-px bg-line" />
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[13.5px] font-semibold text-[#b4453a] hover:bg-error-bg/40"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
