import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
  tone?: "gold" | "light";
};

export function SectionLabel({
  children,
  className,
  tone = "gold",
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "text-[12.5px] font-bold uppercase tracking-[0.16em]",
        tone === "gold" ? "text-gold-dark" : "text-gold-chip",
        className,
      )}
    >
      {children}
    </span>
  );
}
