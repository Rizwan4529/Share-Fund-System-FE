import { cn } from "@/lib/utils";

/** Compact status badge for dashboards — uses info/navy/gold tones, not gold-only. */
export function MarketingBadge({
  className,
  title = "Founding Participant Phase 1",
  subtitle = "Planning projections only — funding not live",
}: {
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-info/20 bg-info-bg px-4 py-3 sm:w-auto",
        className,
      )}
    >
      <span className="relative size-2 shrink-0 rounded-full bg-info" />
      <div>
        <div className="font-display text-[13px] font-bold text-ink-heading">
          {title}
        </div>
        <div className="text-xs text-muted-soft">{subtitle}</div>
      </div>
    </div>
  );
}
