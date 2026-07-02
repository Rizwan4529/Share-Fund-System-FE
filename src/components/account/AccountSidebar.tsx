import {
  Bell,
  HelpCircle,
  Lock,
  Mail,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppSurfaceCard, GoldAvatar } from "@/components/member/app";
import { ACCOUNT_SECTIONS } from "@/utils/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  profile: User,
  security: Lock,
  notifications: Bell,
  communication: Mail,
  management: Trash2,
};

type AccountSidebarProps = {
  section: string;
  name: string;
  membership: string;
  avatarInitials: string;
};

export function AccountSidebar({
  section,
  name,
  membership,
  avatarInitials,
}: AccountSidebarProps) {
  const navigate = useNavigate();

  return (
    <AppSurfaceCard padding="md" className="w-full lg:sticky lg:top-24 lg:w-60">
      <div className="mb-5 flex items-center gap-3 border-b border-line pb-5">
        <GoldAvatar initials={avatarInitials} className="size-[52px] text-lg" />
        <div className="min-w-0">
          <div className="truncate font-display text-sm font-bold text-ink-heading">
            {name}
          </div>
          <div className="truncate text-xs text-muted-soft">{membership}</div>
        </div>
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ACCOUNT_SECTIONS.map((s) => {
          const Icon = ICONS[s.id] ?? HelpCircle;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => navigate(`/account/${s.id}`)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px] font-semibold transition-all lg:w-full",
                active
                  ? "bg-gradient-to-r from-bg-gold to-bg-gold-alt text-gold-dark shadow-[inset_3px_0_0_#cf9f34]"
                  : "text-muted-soft hover:bg-bg-card hover:text-ink-heading",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {s.label}
            </button>
          );
        })}
      </nav>
    </AppSurfaceCard>
  );
}
