import { cn } from "@/lib/utils";

export function MarketingBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-full border border-gold/28 bg-gold/10 px-4 py-3 sm:w-auto",
        className,
      )}
    >
      <span className="relative size-[9px] shrink-0">
        <span className="absolute inset-0 rounded-full bg-gold" />
        <span className="absolute -inset-1 rounded-full bg-gold/40 animate-node-blink" />
      </span>
      <div>
        <div className="font-display text-[13px] font-bold text-gold-chip">
          Marketing support active
        </div>
        <div className="text-xs text-white/60">
          Working behind the scenes for you
        </div>
      </div>
    </div>
  );
}
