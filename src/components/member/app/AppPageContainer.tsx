import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppPageContainerProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: "page" | "progress";
};

export function AppPageContainer({
  children,
  className,
  maxWidth = "page",
}: AppPageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0",
        maxWidth === "page" ? "max-w-page" : "max-w-[1120px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
