import { cn } from "@/lib/utils";

type AdminPaginationProps = {
  summary: string;
  className?: string;
};

export function AdminPagination({ summary, className }: AdminPaginationProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-[#f2f5fa] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className,
      )}
    >
      <p className="text-[13px] text-[#8496b7]">{summary}</p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          className="h-8 min-w-8 rounded-md border border-border-input bg-white px-2.5 text-[13px] font-semibold text-[#8496b7]"
        >
          Prev
        </button>
        <button
          type="button"
          className="h-8 min-w-8 rounded-md border border-gold-dark bg-bg-gold px-2.5 text-[13px] font-bold text-[#8a6413]"
        >
          1
        </button>
        <button
          type="button"
          className="h-8 min-w-8 rounded-md border border-border-input bg-white px-2.5 text-[13px] font-semibold text-[#33425f]"
        >
          2
        </button>
        <button
          type="button"
          className="h-8 min-w-8 rounded-md border border-border-input bg-white px-2.5 text-[13px] font-semibold text-[#33425f]"
        >
          3
        </button>
        <button
          type="button"
          className="h-8 min-w-8 rounded-md border border-border-input bg-white px-2.5 text-[13px] font-semibold text-[#33425f]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
