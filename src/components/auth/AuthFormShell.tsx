import type { ReactNode } from "react";

import { ASSETS } from "@/utils/assets";

export function AuthFormShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <img
        src={ASSETS.logo}
        alt="SFS"
        className="mb-8 h-9 w-auto self-start lg:hidden"
      />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[404px]">{children}</div>
      </div>
    </div>
  );
}
