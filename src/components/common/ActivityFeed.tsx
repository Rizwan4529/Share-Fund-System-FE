import {
  ArrowUpRight,
  BookOpen,
  Check,
  Flag,
  RefreshCw,
  Star,
} from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types";

const ICONS = {
  up: ArrowUpRight,
  star: Star,
  book: BookOpen,
  flag: Flag,
  check: Check,
};

const TONES = {
  gold: "bg-bg-gold text-gold-dark",
  blue: "bg-info-bg text-info",
  green: "bg-success-bg text-success",
};

type ActivityFeedProps = {
  items: ActivityItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
  title?: string;
};

export function ActivityFeed({
  items,
  isLoading,
  onRefresh,
  title = "Recent activity",
}: ActivityFeedProps) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-7 px-8 shadow-[0_16px_40px_-30px_rgba(12,31,68,0.4)]">
      <div className="mb-5 flex items-center justify-between">
        <Typography variant="h5" className="text-[19px] font-bold tracking-tight">
          {title}
        </Typography>
        {onRefresh ? (
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          </Button>
        ) : null}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-line bg-bg-card p-3"
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    TONES[item.tone],
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <Typography variant="body-sm">{item.text}</Typography>
                  <Typography variant="caption" color="muted" className="mt-1">
                    {item.date}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
