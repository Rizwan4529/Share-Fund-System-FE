import { useLocation } from "react-router-dom";

import { NotificationDropdown } from "@/components/member/NotificationDropdown";
import { UserMenuDropdown } from "@/components/member/UserMenuDropdown";
import { getPageTitle } from "@/utils/constants";

export function AppTopBar() {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-6 border-b border-line bg-white/82 px-9 py-5 backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <h1 className="font-display text-[23px] font-bold tracking-tight text-ink-heading">
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <UserMenuDropdown />
      </div>
    </header>
  );
}
