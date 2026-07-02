import { Play } from "lucide-react";

import { ASSETS } from "@/utils/assets";

type VideoPlayerHeroProps = {
  title?: string;
};

export function VideoPlayerHero({ title }: VideoPlayerHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-hero-card shadow-app-hero">
      <img
        src={ASSETS.worldWhite}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
      />
      <div className="relative flex aspect-video items-center justify-center">
        <button
          type="button"
          aria-label={title ? `Play ${title}` : "Play video"}
          className="relative flex size-[84px] items-center justify-center rounded-full bg-gradient-gold shadow-[0_0_0_12px_rgba(232,194,90,0.25)]"
        >
          <Play className="size-9 fill-navy text-navy" />
        </button>
      </div>
      <div className="relative h-1 bg-white/10">
        <div className="h-full w-[35%] bg-gradient-gold" />
      </div>
    </div>
  );
}
