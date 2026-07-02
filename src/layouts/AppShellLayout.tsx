import { Outlet } from "react-router-dom";

import { AppPageContainer } from "@/components/member/app";
import { AppTopBar } from "@/components/member/AppTopBar";
import { MemberSidebar } from "@/components/member/MemberSidebar";
import { ShellSidebarProvider } from "@/context/ShellSidebarContext";

export function AppShellLayout() {
  return (
    <ShellSidebarProvider>
      <div className="grid min-h-svh grid-cols-1 bg-app-canvas lg:grid-cols-[250px_1fr]">
        <MemberSidebar />
        <div className="flex min-h-svh min-w-0 flex-col overflow-hidden">
          <AppTopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-9 lg:py-6">
            <AppPageContainer>
              <Outlet />
            </AppPageContainer>
          </main>
        </div>
      </div>
    </ShellSidebarProvider>
  );
}
