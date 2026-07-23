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

/**
 * Tags-style page chrome: title + actions (breadcrumbs live in AdminTopBar).
 */
export function AdminPageHeader({
  overline,
  title,
  subtitle,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("mb-0 shrink-0 space-y-1 pt-2 pb-0", className)}>
      {overline ? (
        <Typography
          variant="overline"
          className="text-[12.5px] font-bold tracking-[0.09em] text-primary"
        >
          {overline}
        </Typography>
      ) : null}

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <Typography
            as="h1"
            variant="h3"
            className="font-display text-2xl font-bold tracking-[-0.4px] text-ink-heading sm:text-[28px]"
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body-sm"
              color="muted"
              className="mt-1 max-w-2xl text-sm text-muted-soft"
            >
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
    </div>
  );
}
