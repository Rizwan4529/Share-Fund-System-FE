import { Outlet } from "react-router-dom";

import { AuthBrandPanel, AuthFormShell } from "@/components/auth";

export function AuthSplitLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <AuthBrandPanel />
      <AuthFormShell>
        <Outlet />
      </AuthFormShell>
    </div>
  );
}
