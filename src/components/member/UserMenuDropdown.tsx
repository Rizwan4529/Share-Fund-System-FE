import { HelpCircle, LogOut, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { GoldAvatar } from "@/components/member/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/utils/constants";

export function UserMenuDropdown() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pr-2 pl-1.5 transition-colors hover:bg-bg-card"
        >
          <GoldAvatar initials={user.avatarInitials} size="sm" />
          <span className="text-[14.5px] font-semibold text-ink-heading">
            {user.name}
          </span>
          <ChevronDown className="size-4 text-[#8496b7]" strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-xl border-line p-2 shadow-[0_24px_50px_-20px_rgba(12,31,68,0.35)]"
      >
        <div className="border-b border-line/80 px-3 py-3 pb-3.5">
          <div className="font-display text-[15px] font-bold text-ink-heading">
            {user.name}
          </div>
          <div className="truncate text-[13px] text-[#8496b7]">{user.email}</div>
        </div>
        <DropdownMenuItem asChild className="rounded-md px-3 py-2.5 text-[14.5px] font-medium text-[#33425f]">
          <Link to={ROUTES.ACCOUNT} className="flex items-center gap-3">
            <Settings className="size-[18px] text-[#8496b7]" strokeWidth={1.8} />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-md px-3 py-2.5 text-[14.5px] font-medium text-[#33425f]">
          <HelpCircle className="size-[18px] text-[#8496b7]" strokeWidth={1.8} />
          Help center
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-md px-3 py-2.5 text-[14.5px] font-medium text-error"
          onClick={() => void logout()}
        >
          <LogOut className="size-[18px]" strokeWidth={1.8} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
