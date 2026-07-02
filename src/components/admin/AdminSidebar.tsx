import { NavLink, useLocation } from "react-router-dom";

import { AdminNavIcon } from "@/components/admin/AdminNavIcons";
import { Typography } from "@/components/common/Typography";
import { useAdminShell } from "@/context/AdminShellContext";
import { useAuth } from "@/context/AuthContext";
import { GoldAvatar } from "@/components/member/app/GoldAvatar";
import { ROUTES } from "@/utils/constants";
import { ASSETS } from "@/utils/assets";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{
  to: string;
  label: string;
  icon: string;
  end?: boolean;
  badge?: string;
  ownerOnly?: boolean;
}> = [
  { to: ROUTES.ADMIN, label: "Overview", icon: "overview", end: true },
  { to: ROUTES.ADMIN_MEMBERS, label: "Members", icon: "members", badge: "3" },
  { to: ROUTES.ADMIN_CAMPAIGNS, label: "Campaigns", icon: "campaigns", badge: "1" },
  { to: ROUTES.ADMIN_REWARDS, label: "Rewards", icon: "rewards" },
  { to: ROUTES.ADMIN_CONTENT, label: "Content", icon: "content" },
  { to: ROUTES.ADMIN_ANALYTICS, label: "Analytics", icon: "analytics" },
  { to: ROUTES.ADMIN_MARKETING, label: "Marketing", icon: "marketing" },
  { to: ROUTES.ADMIN_SETTINGS, label: "Settings", icon: "settings", ownerOnly: true },
];

export function AdminSidebar() {
  const { user } = useAuth();
  const { viewRole } = useAdminShell();
  const location = useLocation();

  const items = NAV_ITEMS.filter(
    (item) => !("ownerOnly" in item && item.ownerOnly) || viewRole === "Owner",
  );

  return (
    <aside className="sticky top-0 flex h-svh w-[250px] flex-col bg-gradient-to-b from-[#0a1730] via-[#0b1d3f] to-[#0c2148] text-white">
      <div className="flex items-center gap-2.5 border-b border-white/7 px-[22px] py-[22px] pb-[18px]">
        <img src={ASSETS.logoLight} alt="SFS" className="h-[30px] w-auto" />
        <span className="inline-flex h-[21px] items-center rounded-[5px] border border-gold/42 bg-gold/16 px-2 text-[11px] font-bold tracking-[0.09em] text-gold-pale uppercase">
          Admin
        </span>
      </div>

      <nav className="admin-scroll flex flex-1 flex-col gap-[3px] overflow-y-auto px-3 py-3.5">
        {items.map((item) => {
          const active = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={cn(
                "flex w-full items-center gap-3 rounded-[7px] border-none px-[13px] py-2.5 text-left text-sm font-semibold transition-colors",
                active
                  ? "bg-gradient-to-r from-gold/18 to-gold/6 text-gold-pale shadow-[inset_3px_0_0_#cf9f34]"
                  : "text-[#aebfdf] hover:bg-white/5",
              )}
            >
              <span className={cn("flex size-[19px] items-center justify-center", active ? "text-gold-pale" : "text-[#9fb4dc]")}>
                <AdminNavIcon name={item.icon} />
              </span>
              <span className="flex-1">{item.label}</span>
              {!active && item.badge ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-gold/16 px-1.5 py-0.5 text-[11px] font-bold text-gold-pale">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {user ? (
        <div className="border-t border-white/7 px-4 py-3.5">
          <div className="flex items-center gap-2.5 rounded-[7px] bg-white/4 p-2">
            <GoldAvatar initials={user.avatarInitials} size="sm" />
            <div className="min-w-0 flex-1">
              <Typography variant="label" className="truncate text-[13.5px] font-semibold text-[#eaf0fb]">
                {user.name}
              </Typography>
              <Typography variant="caption" className="text-[11.5px] text-[#8ba0c6]">
                {viewRole}
              </Typography>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
