import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppSurfaceCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "md" | "lg";
};

export function AppSurfaceCard({
  children,
  className,
  padding = "lg",
}: AppSurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-line bg-white shadow-app-card",
        padding === "lg" ? "p-4 sm:p-6 lg:p-7 lg:px-8" : "p-4 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
