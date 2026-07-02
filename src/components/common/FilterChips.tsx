import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type FilterChipsProps<T extends string> = {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

function getGridColumnCount(count: number): number {
  if (count <= 3) return count;
  if (count === 4) return 2;
  if (count === 5) return 2;
  if (count === 6) return 3;
  return 2;
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  const mobileColumns = getGridColumnCount(options.length);

  return (
    <>
      <div
        className={cn("grid w-full gap-2 lg:hidden", className)}
        style={{
          gridTemplateColumns: `repeat(${mobileColumns}, minmax(0, 1fr))`,
        }}
      >
        {options.map((opt) => (
          <FilterChipButton
            key={opt.id}
            label={opt.label}
            active={opt.id === value}
            onClick={() => onChange(opt.id)}
            compact
          />
        ))}
      </div>

      <div className={cn("hidden flex-wrap gap-2 lg:flex", className)}>
        {options.map((opt) => (
          <FilterChipButton
            key={opt.id}
            label={opt.label}
            active={opt.id === value}
            onClick={() => onChange(opt.id)}
          />
        ))}
      </div>
    </>
  );
}

function FilterChipButton({
  label,
  active,
  onClick,
  compact = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-0 rounded-full font-semibold transition-colors",
        compact
          ? "px-2 py-2 text-center text-xs leading-tight sm:text-sm"
          : "whitespace-nowrap px-4 py-2 text-sm",
        active
          ? "bg-gradient-gold text-navy-deep shadow-[0_4px_14px_rgba(207,159,52,0.35)]"
          : "border border-line bg-white text-muted-soft hover:border-gold-dark/35 hover:bg-bg-gold",
      )}
    >
      <Typography as="span" variant="label" color="inherit">
        {label}
      </Typography>
    </button>
  );
}
