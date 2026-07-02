import { cn } from "@/lib/utils";

type AdminSegmentOption = {
  id: string;
  label: string;
};

type AdminSegmentedControlProps = {
  options: AdminSegmentOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
};

export function AdminSegmentedControl({
  options,
  value,
  onChange,
  className,
  size = "md",
}: AdminSegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-md border border-line bg-white p-[3px]",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-[5px] border-none font-semibold transition-colors",
              size === "sm" ? "h-8 px-3.5 text-[13px]" : "h-[34px] px-4 text-[13px]",
              active
                ? "bg-navy-deep text-white"
                : "bg-transparent text-muted-soft hover:text-ink-heading",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
