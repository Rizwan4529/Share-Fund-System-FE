import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InfoCalloutProps = {
  children: ReactNode;
  className?: string;
};

export function InfoCallout({ children, className }: InfoCalloutProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-info/20 bg-info-bg px-4 py-3.5 text-[13.5px] leading-relaxed text-[#33425f]",
        className,
      )}
    >
      {children}
    </div>
  );
}
