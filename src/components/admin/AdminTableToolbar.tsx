import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AdminTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  resultCount: number;
  className?: string;
  /** Optional right-side filter slot (selects, etc.) */
  endSlot?: React.ReactNode;
};

/** Shared admin table search — same height + vertical padding on every list page. */
export function AdminTableToolbar({
  search,
  onSearchChange,
  placeholder = "Search…",
  resultCount,
  className,
  endSlot,
}: AdminTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-3 py-2.5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 border-border-input bg-white py-2.5 pr-24 pl-10 text-sm leading-normal shadow-none"
        />
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-medium text-muted-foreground tabular-nums">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>
      {endSlot ? <div className="w-full sm:w-auto">{endSlot}</div> : null}
    </div>
  );
}
