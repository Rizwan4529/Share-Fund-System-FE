import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminTableScrollProps = {
  children: ReactNode;
  className?: string;
  minWidth?: string;
};

/** Shared row styles — pair with a page-specific `grid-cols-[…]` template. */
export const adminTableHeaderClass =
  "grid w-full gap-3 border-b border-line bg-bg-card px-4 py-3 text-[11.5px] font-bold tracking-[0.05em] text-muted-soft uppercase sm:px-5";

export const adminTableRowClass =
  "grid w-full items-center gap-3 border-b border-[#f2f5fa] px-4 py-3 transition-colors hover:bg-bg-card sm:px-5";

export function AdminTableScroll({
  children,
  className,
  minWidth = "640px",
}: AdminTableScrollProps) {
  return (
    <div className={cn("w-full min-w-0 max-w-full overflow-x-auto", className)}>
      <div className="w-full min-w-full" style={{ minWidth }}>
        {children}
      </div>
    </div>
  );
}
