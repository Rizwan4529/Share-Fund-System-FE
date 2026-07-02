import { Award } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { SectionLabel } from "@/components/member/app";

type RewardsBalanceCardProps = {
  balance: number;
  monthEarned: number;
  lifetime: number;
  onRedeem: () => void;
};

export function RewardsBalanceCard({
  balance,
  monthEarned,
  lifetime,
  onRedeem,
}: RewardsBalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-panel border border-navy-border-alt bg-gradient-navy-rewards p-8 shadow-app-hero">
      <div className="pointer-events-none absolute top-[-30%] right-[-10%] size-[220px] animate-glow-pulse rounded-full bg-[radial-gradient(closest-side,rgba(207,159,52,0.26),transparent_72%)]" />
      <div className="relative mb-3 flex items-center gap-2.5">
        <Award className="size-[18px] text-gold" strokeWidth={1.8} />
        <SectionLabel tone="light">Your balance</SectionLabel>
      </div>
      <div className="relative flex items-baseline gap-2">
        <span className="font-display text-[52px] font-extrabold tracking-tight text-shimmer-gold">
          {balance.toLocaleString()}
        </span>
        <span className="text-sm text-white/70">credits</span>
      </div>
      <div className="relative mt-4 flex flex-wrap gap-6">
        <div>
          <div className="text-[12.5px] text-white/62">This month</div>
          <div className="font-display text-lg font-bold text-white">+{monthEarned}</div>
        </div>
        <div>
          <div className="text-[12.5px] text-white/62">Lifetime</div>
          <div className="font-display text-lg font-bold text-white">
            {lifetime.toLocaleString()}
          </div>
        </div>
      </div>
      <GoldButton size="app" className="relative mt-6" onClick={onRedeem}>
        Redeem credits
      </GoldButton>
    </div>
  );
}
