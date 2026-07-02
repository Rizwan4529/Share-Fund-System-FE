import { Ban, Gift, RefreshCw, X } from "lucide-react";

import { AdminGhostButton } from "@/components/admin/AdminGhostButton";
import { AdminStatusPill } from "@/components/admin/AdminStatusPill";
import { Typography } from "@/components/common/Typography";
import { GoldAvatar } from "@/components/member/app/GoldAvatar";
import { Button } from "@/components/ui/button";
import {
  getMemberCampaignName,
  getMemberInitials,
  type AdminMember,
} from "@/lib/mock/adminData";
import { cn } from "@/lib/utils";

type AdminMemberDrawerProps = {
  member: AdminMember | null;
  open: boolean;
  onClose: () => void;
  onAdjust: () => void;
  onSuspend: () => void;
};

export function AdminMemberDrawer({
  member,
  open,
  onClose,
  onAdjust,
  onSuspend,
}: AdminMemberDrawerProps) {
  if (!open || !member) return null;

  const campaignName = getMemberCampaignName(member.name);
  const timeline = [
    {
      text: `Progress updated on "${campaignName}".`,
      date: "Today, 9:24 AM",
    },
    { text: "Earned 40 credits for a monthly check-in.", date: "Yesterday" },
    { text: "Completed a learning guide.", date: "2 days ago" },
    { text: `Account created via ${member.source}.`, date: member.join },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(9,18,42,0.42)] backdrop-blur-[2px]">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <aside className="admin-scroll absolute top-0 right-0 flex h-svh w-[440px] animate-draw-in flex-col overflow-y-auto bg-white shadow-[-30px_0_70px_-30px_rgba(9,18,42,0.5)]">
        <div className="relative bg-gradient-to-br from-navy-deep to-[#122c5c] px-6 py-6 text-white">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-4 right-4 border border-white/16 bg-white/6 text-[#dbe6fa] hover:bg-white/10"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
          <div className="flex items-center gap-3.5">
            <GoldAvatar initials={getMemberInitials(member.name)} size="lg" className="size-14 text-xl" />
            <div>
              <Typography variant="h5" className="font-display font-bold text-white">
                {member.name}
              </Typography>
              <Typography variant="body-sm" className="text-[#9fb4dc]">
                {member.email}
              </Typography>
            </div>
          </div>
          <div className="mt-5 flex gap-5">
            <div>
              <Typography variant="caption" className="text-[#8ba0c6]">
                Joined
              </Typography>
              <Typography variant="label" className="mt-0.5 font-semibold text-white">
                {member.join}
              </Typography>
            </div>
            <div>
              <Typography variant="caption" className="text-[#8ba0c6]">
                Status
              </Typography>
              <div className="mt-1">
                <AdminStatusPill
                  status={member.status}
                  className="bg-white/14 text-white"
                />
              </div>
            </div>
            <div>
              <Typography variant="caption" className="text-[#8ba0c6]">
                Source
              </Typography>
              <Typography variant="label" className="mt-0.5 font-semibold text-white">
                {member.source}
              </Typography>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-[7px] border border-line bg-bg-card p-3.5">
              <Typography variant="caption" className="text-[#8496b7]">
                Active campaigns
              </Typography>
              <Typography variant="h5" className="mt-1 font-display font-bold text-ink-heading">
                {member.campaigns}
              </Typography>
            </div>
            <div className="rounded-[7px] border border-line bg-bg-card p-3.5">
              <Typography variant="caption" className="text-[#8496b7]">
                Credit balance
              </Typography>
              <Typography variant="h5" className="mt-1 font-display font-bold text-[#8a6413]">
                {member.credits.toLocaleString()}
              </Typography>
            </div>
          </div>

          <Typography
            variant="overline"
            className="mb-3 text-[11.5px] font-bold tracking-[0.06em] text-[#a3b1cd]"
          >
            Activity timeline
          </Typography>
          <div className="mb-5 space-y-4">
            {timeline.map((item) => (
              <div key={item.text} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 size-2 rounded-full bg-gold-dark" />
                  <span className="mt-1 w-px flex-1 bg-line" />
                </div>
                <div>
                  <Typography variant="body-sm" className="text-[13.5px] leading-snug text-[#22314f]">
                    {item.text}
                  </Typography>
                  <Typography variant="caption" className="mt-0.5 text-[#93a3c2]">
                    {item.date}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <Typography
            variant="overline"
            className="mb-3 text-[11.5px] font-bold tracking-[0.06em] text-[#a3b1cd]"
          >
            Admin actions
          </Typography>
          <div className="flex flex-col gap-2">
            <AdminGhostButton
              className="h-auto justify-start gap-2.5 px-3.5 py-3 text-left"
              onClick={onAdjust}
            >
              <Gift className="size-4" />
              Adjust credit balance
            </AdminGhostButton>
            <AdminGhostButton className="h-auto justify-start gap-2.5 px-3.5 py-3 text-left">
              <RefreshCw className="size-4" />
              Reset access
            </AdminGhostButton>
            <button
              type="button"
              onClick={onSuspend}
              className={cn(
                "flex items-center gap-2.5 rounded-[7px] border border-[#f0dad5] bg-[#fdf6f4] px-3.5 py-3 text-left text-[13.5px] font-semibold text-[#b4453a]",
              )}
            >
              <Ban className="size-4" />
              {member.status === "suspended" ? "Reactivate account" : "Suspend account"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
