import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMarkAllNotificationsRead, useNotifications } from "@/hooks/queries/useAccount";
import { cn } from "@/lib/utils";

export function NotificationDropdown() {
  const { data: notifications = [] } = useNotifications();
  const markAll = useMarkAllNotificationsRead();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-[42px] items-center justify-center rounded-lg border border-line bg-white text-muted-soft transition-colors hover:bg-bg-card"
        >
          <Bell className="size-5" strokeWidth={1.8} />
          {unread > 0 ? (
            <span className="absolute top-[9px] right-2.5 size-[7px] rounded-full bg-gold-dark shadow-[0_0_0_2px_#fff]" />
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[360px] overflow-hidden rounded-[14px] border-line p-0 shadow-[0_30px_60px_-24px_rgba(12,31,68,0.4)]"
      >
        <div className="flex items-center justify-between border-b border-line/80 px-[18px] py-4">
          <span className="font-display text-[15px] font-bold text-ink-heading">
            Notifications
          </span>
          {unread > 0 ? (
            <button
              type="button"
              className="text-[12.5px] font-semibold text-gold-dark"
              onClick={() => markAll.mutate()}
            >
              Mark all read
            </button>
          ) : null}
        </div>
        {notifications.length === 0 ? (
          <div className="px-6 py-11 text-center">
            <div className="mx-auto mb-3.5 flex size-[52px] items-center justify-center rounded-xl bg-bg-alt">
              <Bell className="size-[26px] text-[#a4b1c9]" strokeWidth={1.7} />
            </div>
            <div className="font-display text-[15px] font-bold text-ink-heading">
              You&apos;re all caught up
            </div>
            <p className="mt-1.5 text-[13px] text-[#8496b7]">
              New activity will show up here.
            </p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex gap-3 border-b border-[#f4f7fb] px-[18px] py-3.5",
                  !n.read && "bg-bg-card",
                )}
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-gold text-gold-dark">
                  <Bell className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] leading-snug text-[#33425f]">
                    {n.title}
                  </div>
                  <div className="mt-0.5 text-xs text-[#a4b1c9]">{n.time}</div>
                </div>
                {!n.read ? (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold-dark" />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
