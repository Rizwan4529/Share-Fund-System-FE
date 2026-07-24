import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
  tone?: "gold" | "info" | "navy" | "light";
};

export function SectionLabel({
  children,
  className,
  tone = "info",
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.14em]",
        tone === "gold" && "text-gold-deep",
        tone === "info" && "text-info",
        tone === "navy" && "text-ink-tag",
        tone === "light" && "text-gold-chip",
        className,
      )}
    >
      {children}
    </span>
  );
}
