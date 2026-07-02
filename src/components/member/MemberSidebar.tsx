import {
  GoldAvatar,
  MemberNavLink,
  NavIconAccount,
  NavIconCampaigns,
  NavIconDashboard,
  NavIconLearn,
  NavIconRewards,
} from "@/components/member/app";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useShellSidebar } from "@/context/ShellSidebarContext";
import { ROUTES } from "@/utils/constants";
import { ASSETS } from "@/utils/assets";
import { cn } from "@/lib/utils";

const NAV = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: <NavIconDashboard /> },
  { to: ROUTES.CAMPAIGNS, label: "Campaigns", icon: <NavIconCampaigns /> },
  { to: ROUTES.REWARDS, label: "Rewards", icon: <NavIconRewards /> },
  { to: ROUTES.LEARN, label: "Learn", icon: <NavIconLearn /> },
  { to: ROUTES.ACCOUNT, label: "Account", icon: <NavIconAccount /> },
];

type MemberSidebarContentProps = {
  onNavigate?: () => void;
  className?: string;
};

export function MemberSidebarContent({
  onNavigate,
  className,
}: MemberSidebarContentProps) {
  const { user } = useAuth();

  return (
    <div className={cn("flex h-full flex-col px-[18px] py-[26px]", className)}>
      <div className="px-2.5 pb-[26px]">
        <img src={ASSETS.logoLight} alt="SFS" className="h-[30px] w-auto" />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ to, label, icon }) => (
          <MemberNavLink
            key={to}
            to={to}
            label={label}
            icon={icon}
            onNavigate={onNavigate}
          />
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
    </div>
  );
}

export function MemberSidebar() {
  const { mobileOpen, setMobileOpen, closeMobile } = useShellSidebar();

  return (
    <>
      <aside className="sticky top-0 hidden h-svh w-[250px] flex-col border-r border-navy-border bg-gradient-navy-section lg:flex">
        <MemberSidebarContent />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton
          className="w-[250px] max-w-[85vw] gap-0 border-navy-border bg-gradient-navy-section p-0 text-white sm:max-w-[250px]"
        >
          <MemberSidebarContent onNavigate={closeMobile} />
        </SheetContent>
      </Sheet>
    </>
  );
}
