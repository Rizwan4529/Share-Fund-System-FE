import { cn } from "@/lib/utils";

type GoldAvatarProps = {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-8 text-[13px]",
  md: "size-[38px] text-[15px]",
  lg: "size-10 text-sm",
};

export function GoldAvatar({ initials, size = "md", className }: GoldAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-gold font-display font-bold text-navy",
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
