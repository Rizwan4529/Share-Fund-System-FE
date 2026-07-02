import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminTableScrollProps = {
  children: ReactNode;
  className?: string;
  minWidth?: string;
};

export function AdminTableScroll({
  children,
  className,
  minWidth = "640px",
}: AdminTableScrollProps) {
  return (
    <div className={cn("max-w-full overflow-x-auto", className)}>
      <div className="w-max min-w-full" style={{ minWidth }}>
        {children}
      </div>
    </div>
  );
}
