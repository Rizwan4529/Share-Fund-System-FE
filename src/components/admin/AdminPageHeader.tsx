import type { ReactNode } from "react";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  overline?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminPageHeader({
  overline,
  title,
  subtitle,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        {overline ? (
          <Typography
            variant="overline"
            className="mb-1.5 text-[12.5px] font-bold tracking-[0.09em] text-[#9a6a15]"
          >
            {overline}
          </Typography>
        ) : null}
        <Typography
          as="h1"
          variant="h3"
          className="font-display text-xl font-bold tracking-[-0.6px] text-ink-heading sm:text-[27px]"
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body-sm" color="muted" className="mt-1.5 text-sm text-muted-soft">
            {subtitle}
          </Typography>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
