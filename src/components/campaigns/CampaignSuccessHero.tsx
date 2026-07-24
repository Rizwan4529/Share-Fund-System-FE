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
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-hero-card p-5 text-center shadow-app-hero-lg sm:p-8 lg:p-10">
      <svg
        className="pointer-events-none absolute top-0 left-1/2 hidden -translate-x-1/2 opacity-30 sm:block"
        width="320"
        height="120"
        viewBox="0 0 320 120"
        aria-hidden
      >
        <path
          d="M20 100 Q160 10 300 100"
          fill="none"
          stroke="#d9b74a"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>
      <div className="relative mx-auto mb-5 flex size-16 items-center justify-center sm:mb-6 sm:size-20">
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-gradient-gold shadow-[0_12px_30px_rgba(207,159,52,0.4)] sm:size-20">
          <Check className="size-8 text-navy sm:size-10" strokeWidth={2.5} />
        </span>
      </div>
      <h2 className="relative font-display text-2xl font-bold tracking-tight text-white sm:text-[30px]">
        Your campaign is active.
      </h2>
      <p className="relative mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/75 sm:text-[15.5px]">
        Marketing support is on. Track progress from your dashboard anytime.
      </p>
      <div className="relative mx-auto mt-6 max-w-md space-y-2.5 text-left sm:mt-8">
        {NEXT_STEPS.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-3.5 py-3 sm:items-center sm:px-4"
          >
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-gold/14">
              <Icon className="size-4 text-gold" />
            </span>
            <span className="min-w-0 text-[14px] leading-snug text-white/90 sm:text-[14.5px]">
              {text}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center">
        <GoldButton size="app" className="w-full sm:w-auto" asChild>
          <Link to={ROUTES.DASHBOARD}>Go to dashboard</Link>
        </GoldButton>
        <GoldButton
          size="app"
          variant="ghost-outline"
          className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
          asChild
        >
          <Link to={ROUTES.CAMPAIGNS}>Browse more</Link>
        </GoldButton>
      </div>
    </div>
  );
}
