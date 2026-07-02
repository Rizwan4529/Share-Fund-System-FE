import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type FilterChipsProps<T extends string> = {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-gradient-gold text-navy-deep shadow-[0_4px_14px_rgba(207,159,52,0.35)]"
                : "border border-line bg-white text-muted-soft hover:border-gold-dark/35 hover:bg-bg-gold",
            )}
          >
            <Typography as="span" variant="label" color="inherit">
              {opt.label}
            </Typography>
          </button>
        );
      })}
    </div>
  );
}
