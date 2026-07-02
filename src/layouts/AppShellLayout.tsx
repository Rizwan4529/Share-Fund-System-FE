import { Outlet } from "react-router-dom";

import { AppPageContainer } from "@/components/member/app";
import { AppTopBar } from "@/components/member/AppTopBar";
import { MemberSidebar } from "@/components/member/MemberSidebar";

export function AppShellLayout() {
  return (
    <div className="grid min-h-svh grid-cols-[250px_1fr] bg-app-canvas">
      <MemberSidebar />
      <div className="flex min-h-svh min-w-0 flex-col overflow-hidden">
        <AppTopBar />
        <main className="flex-1 overflow-y-auto px-9 py-6">
          <AppPageContainer>
            <Outlet />
          </AppPageContainer>
        </main>
      </div>
    </div>
  );
}
