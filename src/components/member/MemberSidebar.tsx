import {
  GoldAvatar,
  MemberNavLink,
  NavIconAccount,
  NavIconCampaigns,
  NavIconDashboard,
  NavIconLearn,
  NavIconRewards,
} from "@/components/member/app";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/utils/constants";
import { ASSETS } from "@/utils/assets";

const NAV = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: <NavIconDashboard /> },
  { to: ROUTES.CAMPAIGNS, label: "Campaigns", icon: <NavIconCampaigns /> },
  { to: ROUTES.REWARDS, label: "Rewards", icon: <NavIconRewards /> },
  { to: ROUTES.LEARN, label: "Learn", icon: <NavIconLearn /> },
  { to: ROUTES.ACCOUNT, label: "Account", icon: <NavIconAccount /> },
];

export function MemberSidebar() {
  const { user } = useAuth();

  return (
    <aside className="sticky top-0 flex h-svh w-[250px] flex-col border-r border-navy-border bg-gradient-navy-section px-[18px] py-[26px]">
      <div className="px-2.5 pb-[26px]">
        <img
          src={ASSETS.logoLight}
          alt="SFS"
          className="h-[30px] w-auto"
        />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ to, label, icon }) => (
          <MemberNavLink key={to} to={to} label={label} icon={icon} />
        ))}
      </nav>
      {user ? (
        <div className="rounded-card border border-gold/22 bg-gold/8 p-3.5">
          <div className="flex items-center gap-3">
            <GoldAvatar initials={user.avatarInitials} />
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-bold text-white">
                {user.name}
              </div>
              <div className="truncate text-xs text-white/70">
                {user.membership}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
