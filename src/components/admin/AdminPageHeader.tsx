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
        "mb-5 flex items-end justify-between gap-4",
        className,
      )}
    >
      <div>
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
          className="font-display text-[27px] font-bold tracking-[-0.6px] text-ink-heading"
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body-sm" color="muted" className="mt-1.5 text-sm text-muted-soft">
            {subtitle}
          </Typography>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}
