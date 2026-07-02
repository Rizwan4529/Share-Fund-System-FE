import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminGhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function AdminGhostButton({
  children,
  className,
  ...props
}: AdminGhostButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost-outline"
      className={cn(
        "h-[38px] rounded-md border-border-input bg-white px-3 text-[13px] font-semibold text-[#33425f] hover:bg-bg-card sm:px-3.5 sm:text-[13.5px]",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

export function AdminGoldButton({
  children,
  className,
  ...props
}: AdminGhostButtonProps) {
  return (
    <Button
      type="button"
      variant="gold"
      className={cn(
        "h-[38px] gap-1.5 rounded-md px-3 text-[13px] font-bold shadow-[0_6px_16px_-8px_rgba(207,159,52,0.7)] sm:gap-2 sm:px-4 sm:text-[13.5px]",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
