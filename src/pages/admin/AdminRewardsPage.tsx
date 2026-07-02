import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import {
  AdminGhostButton,
  AdminPageHeader,
  AdminSegmentedControl,
  AdminStatusPill,
  AdminSurfaceCard,
  AdminTableScroll,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminRewards } from "@/lib/api/admin";
import { getMemberInitials } from "@/lib/mock/adminData";
import { GoldAvatar } from "@/components/member/app/GoldAvatar";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "rules", label: "Rules" },
  { id: "ledger", label: "Ledger" },
  { id: "marketplace", label: "Marketplace" },
];

export default function AdminRewardsPage() {
  const [tab, setTab] = useState("overview");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-rewards"],
    queryFn: fetchAdminRewards,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  const showLedger = tab === "overview" || tab === "ledger";
  const showRules = tab === "rules";
  const showMarketplace = tab === "marketplace";

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        title="Rewards"
        subtitle="Run the rewards credits system — issuance, rules, and history."
      />

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-navy-deep to-[#122c5c] p-5 text-white">
          <Typography variant="label" className="text-[12.5px] font-semibold text-[#9fb4dc]">
            Credits issued
          </Typography>
          <Typography
            variant="h3"
            className="mt-2 font-display text-[28px] font-bold text-transparent bg-gradient-to-r from-gold to-gold-light bg-clip-text"
          >
            1.24M
          </Typography>
          <Typography variant="caption" className="mt-1.5 text-[#8ba0c6]">
            Lifetime across all members
          </Typography>
        </div>
        <AdminSurfaceCard className="p-5">
          <Typography variant="label" className="text-[12.5px] font-semibold text-[#7386a8]">
            Redeemed
          </Typography>
          <Typography variant="h3" className="mt-2 font-display text-[28px] font-bold text-ink-heading">
            486,200
          </Typography>
          <Typography variant="caption" className="mt-1.5 font-semibold text-[#2f8f66]">
            39% redemption rate
          </Typography>
        </AdminSurfaceCard>
        <AdminSurfaceCard className="p-5">
          <Typography variant="label" className="text-[12.5px] font-semibold text-[#7386a8]">
            Outstanding
          </Typography>
          <Typography variant="h3" className="mt-2 font-display text-[28px] font-bold text-ink-heading">
            757,800
          </Typography>
          <Typography variant="caption" className="mt-1.5 text-[#93a3c2]">
            Held in member balances
          </Typography>
        </AdminSurfaceCard>
      </div>

      <AdminSegmentedControl
        className="mb-4"
        options={TABS}
        value={tab}
        onChange={setTab}
      />

      {showLedger ? (
        <AdminSurfaceCard>
          <AdminTableScroll minWidth="640px">
          <div className="grid grid-cols-[1.6fr_1.4fr_1fr_1fr_40px] gap-3 border-b border-[#e9edf5] bg-bg-card px-5 py-3 text-[11.5px] font-bold tracking-[0.05em] text-[#8092b3] uppercase">
            <span>Member</span>
            <span>Reason</span>
            <span>Date</span>
            <span>Amount</span>
            <span />
          </div>
          {data.ledger.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[1.6fr_1.4fr_1fr_1fr_40px] items-center gap-3 border-b border-[#f2f5fa] px-5 py-3 transition-colors hover:bg-bg-card"
            >
              <div className="flex items-center gap-2.5">
                <GoldAvatar initials={getMemberInitials(entry.name)} size="sm" />
                <Typography variant="label" className="text-[13.5px] font-semibold text-[#1a2c4e]">
                  {entry.name}
                </Typography>
              </div>
              <Typography variant="body-sm" className="text-[#33425f]">
                {entry.reason}
              </Typography>
              <Typography variant="body-sm" className="text-[#8496b7]">
                {entry.date}
              </Typography>
              <Typography
                variant="label"
                className={`font-display font-bold ${entry.positive ? "text-[#1f7a55]" : "text-[#a2453b]"}`}
              >
                {entry.positive ? "+" : "−"}
                {entry.delta.toLocaleString()}
              </Typography>
              <AdminGhostButton
                className="h-7 px-2.5 text-xs"
                onClick={() => toast.message("Adjust credits")}
              >
                Adjust
              </AdminGhostButton>
            </div>
          ))}
          </AdminTableScroll>
        </AdminSurfaceCard>
      ) : null}

      {showRules ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AdminSurfaceCard className="p-5">
            <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
              Earning rules
            </Typography>
            <Typography variant="body-sm" color="muted" className="mb-4">
              How members earn credits for participation.
            </Typography>
            {data.earnRules.map((rule) => (
              <div
                key={rule.label}
                className="flex items-center justify-between border-b border-[#f2f5fa] py-3"
              >
                <div>
                  <Typography variant="label" className="text-[13.5px] font-semibold text-[#22314f]">
                    {rule.label}
                  </Typography>
                  <Typography variant="caption" className="text-[#93a3c2]">
                    {rule.note}
                  </Typography>
                </div>
                <span className="rounded-md border border-border-gold bg-bg-gold px-2.5 py-1 font-display text-sm font-bold text-[#8a6413]">
                  {rule.value}
                </span>
              </div>
            ))}
          </AdminSurfaceCard>
          <AdminSurfaceCard className="p-5">
            <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
              Redemption options
            </Typography>
            <Typography variant="body-sm" color="muted" className="mb-4">
              What credits can be used for.
            </Typography>
            {data.redeemRules.map((rule) => (
              <div
                key={rule.label}
                className="flex items-center justify-between border-b border-[#f2f5fa] py-3"
              >
                <div>
                  <Typography variant="label" className="text-[13.5px] font-semibold text-[#22314f]">
                    {rule.label}
                  </Typography>
                  <Typography variant="caption" className="text-[#93a3c2]">
                    {rule.note}
                  </Typography>
                </div>
                <AdminStatusPill status={rule.badge === "Live" ? "live" : "scheduled"} />
              </div>
            ))}
          </AdminSurfaceCard>
        </div>
      ) : null}

      {showMarketplace ? (
        <AdminSurfaceCard className="border-dashed border-[#d3ddec] px-8 py-12 text-center">
          <div className="mx-auto mb-4 flex size-[60px] items-center justify-center rounded-[14px] bg-bg-gold text-gold-dark">
            <ShoppingCart className="size-7" />
          </div>
          <span className="mb-2 inline-flex rounded-full bg-bg-card px-2.5 py-0.5 text-[11.5px] font-bold tracking-wide text-[#7386a8] uppercase">
            Future feature
          </span>
          <Typography variant="h5" className="font-display text-[19px] font-bold text-ink-heading">
            Marketplace management
          </Typography>
          <Typography variant="body-sm" color="muted" className="mx-auto mt-2 max-w-md leading-relaxed">
            The rewards marketplace is on the roadmap. When it launches, you&apos;ll manage listings,
            promotions, and redemption inventory from here.
          </Typography>
          <AdminGhostButton className="mt-5">Draft a promotion</AdminGhostButton>
        </AdminSurfaceCard>
      ) : null}
    </div>
  );
}
