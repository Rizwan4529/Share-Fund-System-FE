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
        "h-10 min-h-10 cursor-pointer rounded-md border font-semibold transition-colors",
        compact
          ? "min-w-0 px-3 text-center text-xs leading-tight sm:text-sm"
          : "whitespace-nowrap px-4 text-sm",
        active
          ? "border-info/30 bg-info-bg text-info"
          : "border-line bg-white text-muted-soft hover:border-info/25 hover:bg-info-bg/50 hover:text-ink-heading",
      )}
    >
      <Typography as="span" variant="label" color="inherit">
        {label}
      </Typography>
    </button>
  );
}
