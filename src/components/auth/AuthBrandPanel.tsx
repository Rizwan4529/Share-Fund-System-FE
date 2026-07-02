import { Check } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { ASSETS } from "@/utils/assets";

const VALUE_PROPS = [
  "Free to join — no payment to get started",
  "Seven campaign categories to choose from",
  "Education & rewards built in",
];

export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-darkest via-navy to-navy-mid px-14 py-[52px] lg:flex">
      <img
        src={ASSETS.worldWhite}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[52%] w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
      />
      <div className="pointer-events-none absolute top-[-8%] left-[40%] size-[620px] animate-glow-pulse rounded-full bg-[radial-gradient(closest-side,rgba(207,159,52,0.22),transparent_72%)]" />
      <img
        src={ASSETS.logoLight}
        alt="SFS"
        className="relative z-1 h-9 w-auto self-start"
      />
      <div className="relative z-1 max-w-md">
        <Typography
          variant="h1"
          className="text-4xl font-bold text-white lg:text-[42px] lg:leading-tight"
        >
          Funding goals,
          <br />
          <span className="text-shimmer-gold">simplified.</span>
        </Typography>
        <Typography variant="body-lg" className="mt-5 text-[15.5px] leading-relaxed text-white/80">
          Create an account to choose a campaign that matches your goal, track
          your progress, and earn rewards along the way.
        </Typography>
        <div className="mt-8 space-y-4">
          {VALUE_PROPS.map((text) => (
            <div key={text} className="flex items-center gap-3">
              <span className="flex size-[26px] items-center justify-center rounded-full border border-gold/40 bg-gold/15">
                <Check className="size-3.5 text-gold" strokeWidth={3} />
              </span>
              <Typography variant="body" className="text-[15px] text-white/90">
                {text}
              </Typography>
            </div>
          ))}
        </div>
      </div>
      <Typography variant="caption" className="relative z-1 self-start text-white/50">
        © 2026 SFS · Share Funding System
      </Typography>
    </div>
  );
}
