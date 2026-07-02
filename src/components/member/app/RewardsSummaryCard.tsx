import { Link } from "react-router-dom";
import { Award } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { SectionLabel } from "@/components/member/app/SectionLabel";
import { ROUTES } from "@/utils/constants";

type RewardsSummaryCardProps = {
  balance: number;
  hint?: string;
};

export function RewardsSummaryCard({
  balance,
  hint = "Earn credits every time you check in, hit a milestone, or finish a guide.",
}: RewardsSummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-rewards p-7 shadow-app-hero">
      <div className="pointer-events-none absolute top-[-30%] right-[-10%] size-[220px] animate-glow-pulse rounded-full bg-[radial-gradient(closest-side,rgba(207,159,52,0.26),transparent_72%)]" />
      <div className="relative mb-3.5 flex items-center gap-2.5">
        <Award className="size-[18px] text-gold" strokeWidth={1.8} />
        <SectionLabel tone="light">Rewards credits</SectionLabel>
      </div>
      <div className="relative flex items-baseline gap-2">
        <span className="font-display text-[44px] font-extrabold tracking-tight text-shimmer-gold">
          {balance.toLocaleString()}
        </span>
        <span className="text-sm text-white/70">credits</span>
      </div>
      <p className="relative mt-2 text-[13.5px] text-white/72">{hint}</p>
      <GoldButton size="app" className="relative mt-5 w-full" asChild>
        <Link to={ROUTES.REWARDS}>Open rewards center</Link>
      </GoldButton>
    </div>
  );
}
