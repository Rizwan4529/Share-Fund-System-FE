import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ActivationWizardShellProps = {
  step: number;
  totalSteps: number;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
};

export function ActivationWizardShell({
  step,
  totalSteps,
  children,
  footer,
  className,
}: ActivationWizardShellProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className={cn("overflow-hidden rounded-panel border border-line bg-white shadow-app-card", className)}>
      <div className="h-1.5 bg-line">
        <div
          className="h-full bg-gradient-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="p-4 sm:p-6 lg:p-7 lg:px-8">{children}</div>
      <div className="border-t border-line px-4 py-4 sm:px-6 sm:py-5 lg:px-8">{footer}</div>
    </div>
  );
}
