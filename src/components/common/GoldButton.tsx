import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoldButton({
  className,
  variant = "gold",
  size = "app",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(variant === "gold" && "tracking-wide", className)}
      {...props}
    />
  );
}
