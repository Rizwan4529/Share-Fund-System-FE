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
        padding === "lg" ? "p-7 px-8" : "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
