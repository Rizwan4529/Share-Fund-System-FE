import type { ReactNode } from "react";

type OnboardingLayoutProps = {
  rail: ReactNode;
  children: ReactNode;
};

export function OnboardingLayout({ rail, children }: OnboardingLayoutProps) {
  return (
    <div className="grid min-h-svh bg-app-canvas lg:grid-cols-[400px_1fr]">
      {rail}
      <main className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[560px]">{children}</div>
      </main>
    </div>
  );
}
