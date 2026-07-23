import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatusChipTone = "navy" | "gold" | "info" | "success" | "muted";

const TONE: Record<StatusChipTone, string> = {
  navy: "border-navy/15 bg-navy/5 text-ink-heading",
  gold: "border-gold/35 bg-bg-gold text-gold-deep",
  info: "border-info/25 bg-info-bg text-info",
  success: "border-success/25 bg-success-bg text-success",
  muted: "border-line bg-bg-card text-muted-soft",
};

export function StatusChip({
  children,
  tone = "info",
  className,
}: {
  children: ReactNode;
  tone?: StatusChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
