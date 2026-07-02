import { Link } from "react-router-dom";
import { Check, TrendingUp } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { ROUTES } from "@/utils/constants";

const NEXT_STEPS = [
  { icon: TrendingUp, text: "Track your progress on the dashboard" },
  { icon: Check, text: "Earn credits as you hit milestones" },
];

export function CampaignSuccessHero() {
  return (
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-hero-card p-10 text-center shadow-app-hero-lg">
      <svg
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 opacity-30"
        width="320"
        height="120"
        viewBox="0 0 320 120"
        aria-hidden
      >
        <path
          d="M20 100 Q160 10 300 100"
          fill="none"
          stroke="#e8c25a"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>
      <div className="relative mx-auto mb-6 flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-gold shadow-[0_12px_30px_rgba(207,159,52,0.4)]">
          <Check className="size-10 text-navy" strokeWidth={2.5} />
        </span>
      </div>
      <h2 className="relative font-display text-[30px] font-bold tracking-tight text-white">
        Your campaign is active.
      </h2>
      <p className="relative mx-auto mt-3 max-w-md text-[15.5px] text-white/75">
        Marketing support is on. Track progress from your dashboard anytime.
      </p>
      <div className="relative mx-auto mt-8 max-w-md space-y-2 text-left">
        {NEXT_STEPS.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
          >
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-gold/14">
              <Icon className="size-4 text-gold" />
            </span>
            <span className="text-[14.5px] text-white/90">{text}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <GoldButton size="app" asChild>
          <Link to={ROUTES.DASHBOARD}>Go to dashboard</Link>
        </GoldButton>
        <GoldButton
          size="app"
          variant="ghost-outline"
          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          asChild
        >
          <Link to={ROUTES.CAMPAIGNS}>Browse more</Link>
        </GoldButton>
      </div>
    </div>
  );
}
