import { useState, useEffect } from "react";
import { Bell, ChevronDown, LogOut, Menu, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { useAdminShell } from "@/context/AdminShellContext";
import { useAuth } from "@/context/AuthContext";
import { useShellSidebar } from "@/context/ShellSidebarContext";
import { fetchAdminNotifications } from "@/lib/api/admin";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

const NOTIF_DOT: Record<string, string> = {
  gold: "bg-gold-dark",
  slate: "bg-muted-soft",
  danger: "bg-error",
  blue: "bg-info",
};

export function AdminTopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openMobile } = useShellSidebar();
  const { hasNotifications, markAllNotificationsRead } = useAdminShell();
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
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b border-line bg-white/86 py-3 backdrop-blur-[10px] lg:h-16 lg:gap-4 lg:py-0",
          "px-7",
        )}
      >
        <Button
          type="button"
          variant="ghost-outline"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={openMobile}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <AdminBreadcrumbs />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* PHASE2: date-range filter parked
          <div className="hidden overflow-x-auto sm:block">
            <AdminSegmentedControl ... />
          </div>
          */}

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
              <div className="absolute top-12 right-0 z-40 w-[min(100vw-2rem,340px)] animate-fade-up overflow-hidden rounded-[9px] border border-line bg-white shadow-[0_24px_60px_-24px_rgba(12,31,68,0.4)]">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <Typography
                    variant="label"
                    className="font-display text-[14.5px] font-bold"
                  >
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
                        <Typography
                          variant="body-sm"
                          className="text-[13px] leading-snug text-[#22314f]"
                        >
                          {n.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="mt-0.5 text-[11.5px] text-[#93a3c2]"
                        >
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
              <span className="hidden text-[13.5px] font-semibold text-[#22314f] sm:inline">
                {user?.name.split(" ")[0] ?? "Admin"}
              </span>
              <ChevronDown className="size-[15px] text-[#8496b7]" />
            </Button>
            {userOpen ? (
              <div className="absolute top-12 right-0 z-40 w-[min(100vw-2rem,240px)] animate-fade-up overflow-hidden rounded-lg border border-line bg-white shadow-[0_24px_60px_-24px_rgba(12,31,68,0.4)]">
                <div className="space-y-1 border-b border-line px-4 py-3.5">
                  <Typography
                    variant="label"
                    className="text-sm font-bold text-ink-heading"
                  >
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="block truncate text-[12.5px] text-[#8496b7]"
                  >
                    {user?.email}
                  </Typography>
                </div>
                <div className="flex flex-col gap-1 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUserOpen(false);
                      navigate(ROUTES.ADMIN_SETTINGS);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13.5px] font-semibold text-[#33425f] hover:bg-muted"
                  >
                    <Settings className="size-4 text-[#8496b7]" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13.5px] font-semibold text-error hover:bg-error-bg/40"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}
