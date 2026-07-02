import { Outlet } from "react-router-dom";

import { AdminSidebar, AdminTopBar } from "@/components/admin";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminShellProvider } from "@/context/AdminShellContext";

export function AdminShellLayout() {
  return (
    <AdminShellProvider>
      <div className="grid min-h-svh grid-cols-[250px_1fr] bg-app-canvas">
        <AdminSidebar />
        <div className="flex min-h-svh min-w-0 flex-col overflow-hidden">
          <AdminTopBar />
          <main className="admin-scroll flex-1 overflow-y-auto">
            <AdminPageContainer>
              <Outlet />
            </AdminPageContainer>
          </main>
        </div>
      </div>
    </AdminShellProvider>
  );
}
