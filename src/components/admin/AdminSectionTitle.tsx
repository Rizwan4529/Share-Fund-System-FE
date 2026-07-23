import type { ReactNode } from "react";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type AdminSectionTitleProps = {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
};

/** Compact section heading — avoids marketing-scale Typography h3. */
export function AdminSectionTitle({
  children,
  className,
  as = "h2",
}: AdminSectionTitleProps) {
  return (
    <Typography
      as={as}
      variant="h6"
      className={cn(
        "font-display text-base font-semibold tracking-[-0.2px] text-ink-heading",
        className,
      )}
    >
      {children}
    </Typography>
  );
}
