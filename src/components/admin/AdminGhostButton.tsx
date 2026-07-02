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
        "h-[38px] rounded-md border-border-input bg-white px-3.5 text-[13.5px] font-semibold text-[#33425f] hover:bg-bg-card",
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
        "h-[38px] gap-2 rounded-md px-4 text-[13.5px] font-bold shadow-[0_6px_16px_-8px_rgba(207,159,52,0.7)]",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
