import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { ASSETS } from "@/utils/assets";

type NavyHeroCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "md" | "lg";
  showWorldMap?: boolean;
};

export function NavyHeroCard({
  children,
  className,
  padding = "md",
  showWorldMap = true,
}: NavyHeroCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-hero-card shadow-app-hero",
        padding === "lg" ? "px-10 py-9" : "px-10 py-8",
        className,
      )}
    >
      {showWorldMap ? (
        <img
          src={ASSETS.worldWhite}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-[-40px] w-[360px] -translate-y-1/2 opacity-[0.12]"
        />
      ) : null}
      <div className="pointer-events-none absolute top-[-40%] right-[10%] size-[320px] animate-glow-pulse rounded-full bg-[radial-gradient(closest-side,rgba(207,159,52,0.2),transparent_72%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
