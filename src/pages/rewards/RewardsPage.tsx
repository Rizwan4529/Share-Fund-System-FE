import { useState } from "react";
import { toast } from "sonner";

import {
  CreditActivitySection,
} from "@/components/rewards/CreditActivitySection";
import { EarnCreditsSection } from "@/components/rewards/EarnCreditsSection";
import { RedeemCreditsModal } from "@/components/rewards/RedeemCreditsModal";
import { RewardsBalanceCard } from "@/components/rewards/RewardsBalanceCard";
import {
  MarketplacePreview,
  UseCreditsSection,
} from "@/components/rewards/UseCreditsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedeemCredits, useRewards } from "@/hooks/queries/useRewards";
import { EARN_CARDS, USE_CREDITS_CARDS } from "@/utils/constants";

export default function RewardsPage() {
  const { data, isLoading } = useRewards();
  const redeem = useRedeemCredits();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleRedeem = async () => {
    if (!selected) return;
    try {
      await redeem.mutateAsync(selected);
      toast.success("Credits redeemed successfully.");
      setModalOpen(false);
      setSelected(null);
    } catch {
      toast.error("Insufficient credits for this redemption.");
    }
  };

  if (isLoading) return <Skeleton className="h-96 rounded-panel" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <RewardsBalanceCard
          balance={data?.balance.balance ?? 0}
          monthEarned={data?.balance.monthEarned ?? 0}
          lifetime={data?.balance.lifetime ?? 0}
          onRedeem={() => setModalOpen(true)}
        />
        <EarnCreditsSection cards={EARN_CARDS} />
      </div>

      <UseCreditsSection cards={USE_CREDITS_CARDS} />
      <CreditActivitySection items={data?.history ?? []} />
      <MarketplacePreview />

      <RedeemCreditsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        options={data?.redeemOptions ?? []}
        selected={selected}
        onSelect={setSelected}
        onConfirm={() => void handleRedeem()}
      />
    </div>
  );
}
