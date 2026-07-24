import type { ReactNode } from "react";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type ParticipantPageHeaderProps = {
  overline?: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/** Participant shell page title — matches admin scale (not raw Typography h2). */
export function ParticipantPageHeader({
  overline,
  title,
  subtitle,
  actions,
  className,
}: ParticipantPageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {overline ? (
          <Typography
            variant="overline"
            className="mb-1.5 text-[11px] font-bold tracking-[0.12em] text-info"
          >
            {overline}
          </Typography>
        ) : null}
        <Typography
          as="h1"
          variant="h4"
          className="font-display text-[22px] font-bold tracking-[-0.4px] text-ink-heading sm:text-[26px]"
        >
          {title}
        </Typography>
        {subtitle ? (
          <div className="mt-1.5 text-sm leading-relaxed text-muted-soft">
            {typeof subtitle === "string" ? (
              <Typography variant="body-sm" className="text-inherit">
                {subtitle}
              </Typography>
            ) : (
              subtitle
            )}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
