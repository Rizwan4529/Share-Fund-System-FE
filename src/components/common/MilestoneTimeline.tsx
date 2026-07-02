import { Check } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types";

export function MilestoneTimeline({ items }: { items: Milestone[] }) {
  return (
    <div className="relative space-y-0">
      {items.map((item, i) => (
        <div key={item.title} className="relative flex gap-4 pb-8 last:pb-0">
          {i < items.length - 1 ? (
            <div className="absolute top-8 left-4 h-[calc(100%-8px)] w-0.5 bg-line" />
          ) : null}
          <div
            className={cn(
              "relative z-1 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
              item.state === "done"
                ? "border-success bg-success-bg text-success"
                : item.state === "current"
                  ? "border-gold-dark bg-bg-gold text-gold-dark"
                  : "border-line bg-white text-muted-light",
            )}
          >
            {item.state === "done" ? <Check className="size-4" /> : null}
          </div>
          <div className="pt-0.5">
            <Typography variant="label" className="font-bold text-ink-heading">
              {item.title}
            </Typography>
            <Typography variant="body-sm" color="muted" className="mt-1">
              {item.note}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
