import type { ReactNode } from "react";
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

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
  onClick?: () => void;
  href?: string;
};

const cardClassName =
  "rounded-lg border border-line bg-white p-3.5 shadow-[0_1px_0_rgba(12,31,68,0.03)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-20px_rgba(12,31,68,0.35)] sm:p-[17px]";

const interactiveClassName =
  "relative w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2";

export function AdminKpiCard({
  label,
  value,
  trend,
  trendUp = true,
  sub,
  icon,
  iconClassName,
  className,
  onClick,
  href,
}: AdminKpiCardProps) {
  const isInteractive = Boolean(onClick || href);

  const content = (
    <>
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
        {isInteractive ? (
          <ChevronRight className="ml-auto size-4 shrink-0 text-[#c3cee0]" />
        ) : null}
      </div>
      <Typography
        variant="h3"
        className="font-display text-2xl font-bold leading-none tracking-[-0.6px] text-ink-heading sm:text-[27px]"
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
    </>
  );

  if (href) {
    return (
      <Link to={href} className={cn(cardClassName, interactiveClassName, className)}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(cardClassName, interactiveClassName, className)}
      >
        {content}
      </button>
    );
  }

  return <div className={cn(cardClassName, className)}>{content}</div>;
}
