import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success-bg text-[#1f7a55]",
  pending: "bg-bg-gold text-[#9a6a15]",
  suspended: "bg-error-bg text-[#a2453b]",
  paused: "bg-bg-gold text-[#9a6a15]",
  completed: "bg-info-bg text-[#2b5299]",
  draft: "bg-bg-card text-muted-soft",
  published: "bg-success-bg text-[#1f7a55]",
  live: "bg-success-bg text-[#1f7a55]",
  scheduled: "bg-bg-card text-muted-soft",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  paused: "Paused",
  completed: "Completed",
  draft: "Draft",
  published: "Published",
  live: "Live",
  scheduled: "Scheduled",
};

export function AdminStatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11.5px] font-bold capitalize",
        STATUS_STYLES[status] ?? "bg-bg-card text-muted-soft",
        className,
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
