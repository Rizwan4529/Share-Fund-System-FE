import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

const styles = {
  active: "bg-success-bg text-success border-[#cbe8d4] normal-case tracking-normal text-[12.5px] px-[11px] py-1",
  pending: "bg-bg-gold text-gold-dark border-border-gold",
  success: "bg-success-bg text-success border-success/20",
  soon: "bg-bg-alt text-muted-soft border-line",
  live: "bg-success-bg text-success border-success/20",
};

type StatusPillProps = {
  status: keyof typeof styles;
  children: React.ReactNode;
  className?: string;
};

export function StatusPill({ status, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide",
        status !== "active" && "uppercase",
        styles[status],
        className,
      )}
    >
      <Typography as="span" variant="caption" color="inherit">
        {children}
      </Typography>
    </span>
  );
}
