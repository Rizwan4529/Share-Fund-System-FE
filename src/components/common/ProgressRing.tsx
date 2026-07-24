import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

const PRESETS = {
  md: { size: 132, stroke: 13, radius: 54, percentSize: "text-[28px]", subSize: "text-[11.5px]" },
  lg: { size: 168, stroke: 15, radius: 70, percentSize: "text-[40px]", subSize: "text-[12.5px]" },
} as const;

type ProgressRingProps = {
  percent: number;
  preset?: keyof typeof PRESETS;
  variant?: "light" | "dark";
  subLabel?: string;
  size?: number;
  stroke?: number;
  className?: string;
  label?: string;
};

export function ProgressRing({
  percent,
  preset = "md",
  variant = "light",
  subLabel,
  size: sizeOverride,
  stroke: strokeOverride,
  className,
  label,
}: ProgressRingProps) {
  const presetConfig = PRESETS[preset];
  const size = sizeOverride ?? presetConfig.size;
  const stroke = strokeOverride ?? presetConfig.stroke;
  const r = preset === "md" && !sizeOverride ? presetConfig.radius : (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const trackStroke = variant === "dark" ? "rgba(255,255,255,0.09)" : "#eef2f8";
  const percentColor = variant === "dark" ? "text-white" : "text-ink-heading";
  const subColor = variant === "dark" ? "text-white/70" : "text-[#8496b7]";
  const displayLabel = subLabel ?? label;

  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackStroke}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#goldRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 drop-shadow-[0_2px_6px_rgba(207,159,52,0.4)]"
        />
        <defs>
          <linearGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9b74a" />
            <stop offset="100%" stopColor="#c4a33a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Typography
          variant="h3"
          className={cn(
            "font-display font-bold tracking-tight",
            presetConfig.percentSize,
            percentColor,
          )}
        >
          {Math.round(percent)}%
        </Typography>
        {displayLabel ? (
          <span className={cn("font-semibold", presetConfig.subSize, subColor)}>
            {displayLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
