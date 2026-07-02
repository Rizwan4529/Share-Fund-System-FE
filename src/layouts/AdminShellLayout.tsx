import { Outlet } from "react-router-dom";

import { AdminSidebar, AdminTopBar } from "@/components/admin";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminShellProvider } from "@/context/AdminShellContext";
import { ShellSidebarProvider } from "@/context/ShellSidebarContext";

export function AdminShellLayout() {
  return (
    <AdminShellProvider>
      <ShellSidebarProvider>
        <div className="grid min-h-svh grid-cols-1 bg-app-canvas lg:grid-cols-[250px_1fr]">
          <AdminSidebar />
          <div className="flex min-h-svh min-w-0 flex-col overflow-hidden">
            <AdminTopBar />
            <main className="admin-scroll flex-1 overflow-x-hidden overflow-y-auto">
              <AdminPageContainer>
                <Outlet />
              </AdminPageContainer>
            </main>
          </div>
        </div>
      </ShellSidebarProvider>
    </AdminShellProvider>
  );
}
