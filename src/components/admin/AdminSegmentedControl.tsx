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

/** Equal-width grid columns on mobile/tablet; single row on desktop. */
function getGridColumnCount(count: number): number {
  if (count <= 3) return count;
  if (count === 4) return 2;
  if (count === 5) return 2;
  if (count === 6) return 3;
  return 2;
}

export function AdminSegmentedControl({
  options,
  value,
  onChange,
  className,
  size = "md",
}: AdminSegmentedControlProps) {
  const mobileColumns = getGridColumnCount(options.length);

  return (
    <>
      <div
        className={cn(
          "grid w-full gap-[3px] rounded-md border border-line bg-white p-[3px] lg:hidden",
          className,
        )}
        style={{
          gridTemplateColumns: `repeat(${mobileColumns}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => (
          <SegmentButton
            key={option.id}
            option={option}
            active={option.id === value}
            size={size}
            onChange={onChange}
            compact
          />
        ))}
      </div>

      <div
        className={cn(
          "hidden w-auto rounded-md border border-line bg-white p-[3px] lg:inline-flex",
          className,
        )}
      >
        {options.map((option) => (
          <SegmentButton
            key={option.id}
            option={option}
            active={option.id === value}
            size={size}
            onChange={onChange}
          />
        ))}
      </div>
    </>
  );
}

function SegmentButton({
  option,
  active,
  size,
  onChange,
  compact = false,
}: {
  option: AdminSegmentOption;
  active: boolean;
  size: "sm" | "md";
  onChange: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(option.id)}
      className={cn(
        "min-w-0 rounded-[5px] border-none font-semibold transition-colors",
        compact
          ? "px-2 py-2 text-center text-[12px] leading-tight sm:text-[12.5px]"
          : "whitespace-nowrap px-3.5 text-[13px]",
        size === "sm" ? "h-8" : compact ? "min-h-9" : "h-[34px]",
        active
          ? "bg-navy-deep text-white"
          : "bg-transparent text-muted-soft hover:text-ink-heading",
      )}
    >
      {option.label}
    </button>
  );
}
