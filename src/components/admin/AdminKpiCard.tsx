import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type AdminKpiCardProps = {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean | null;
  sub?: string;
  icon?: ReactNode;
  iconClassName?: string;
  className?: string;
};

export function AdminKpiCard({
  label,
  value,
  trend,
  trendUp = true,
  sub,
  icon,
  iconClassName,
  className,
}: AdminKpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-white p-[17px] shadow-[0_1px_0_rgba(12,31,68,0.03)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-20px_rgba(12,31,68,0.35)]",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon ? (
          <span
            className={cn(
              "flex size-[30px] shrink-0 items-center justify-center rounded-lg",
              iconClassName,
            )}
          >
            {icon}
          </span>
        ) : null}
        <Typography variant="label" className="text-[12.5px] font-semibold text-[#7386a8]">
          {label}
        </Typography>
      </div>
      <Typography
        variant="h3"
        className="font-display text-[27px] font-bold leading-none tracking-[-0.6px] text-ink-heading"
      >
        {value}
      </Typography>
      {trend || sub ? (
        <div className="mt-2.5 flex items-center gap-1.5">
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-[5px] px-1.5 py-0.5 text-xs font-bold",
                trendUp === true && "bg-success-bg text-[#1f7a55]",
                trendUp === false && "bg-error-bg text-[#a2453b]",
                trendUp === null && "bg-bg-card text-muted-soft",
              )}
            >
              {trendUp === true ? <TrendingUp className="size-3" /> : null}
              {trendUp === false ? <TrendingDown className="size-3" /> : null}
              {trend}
            </span>
          ) : null}
          {sub ? (
            <Typography variant="caption" className="text-[#93a3c2]">
              {sub}
            </Typography>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
