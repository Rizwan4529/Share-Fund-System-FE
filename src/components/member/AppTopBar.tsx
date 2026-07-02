import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import { NotificationDropdown } from "@/components/member/NotificationDropdown";
import { UserMenuDropdown } from "@/components/member/UserMenuDropdown";
import { Button } from "@/components/ui/button";
import { useShellSidebar } from "@/context/ShellSidebarContext";
import { getPageTitle } from "@/utils/constants";

export function AppTopBar() {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);
  const { openMobile } = useShellSidebar();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-line bg-white/82 px-4 py-3 backdrop-blur-[14px] backdrop-saturate-[1.4] sm:gap-4 sm:py-4 lg:gap-6 lg:px-9 lg:py-5">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
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
        <h1 className="min-w-0 truncate font-display text-lg font-bold tracking-tight text-ink-heading lg:text-[23px]">
          {title}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <NotificationDropdown />
        <UserMenuDropdown />
      </div>
    </header>
  );
}
