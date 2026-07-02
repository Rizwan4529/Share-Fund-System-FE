import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Settings, Shield } from "lucide-react";

import {
  AdminGhostButton,
  AdminPageHeader,
  AdminSegmentedControl,
  AdminSurfaceCard,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminSettings } from "@/lib/api/admin";
import { getMemberInitials } from "@/lib/mock/adminData";
import { GoldAvatar } from "@/components/member/app/GoldAvatar";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "team", label: "Team & roles" },
  { id: "platform", label: "Platform" },
  { id: "audit", label: "Audit log" },
];

const ROLE_STYLES: Record<string, string> = {
  Owner: "bg-bg-icon text-[#8a6413]",
  Admin: "bg-info-bg text-[#2b5299]",
  Operator: "bg-bg-card text-muted-soft",
};

const AUDIT_TONE: Record<string, string> = {
  ok: "bg-[#1f7a55]",
  warn: "bg-[#9a6a15]",
  danger: "bg-error",
};

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("team");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: fetchAdminSettings,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        title="Settings & roles"
        subtitle="Team access, platform configuration, and the admin audit log."
      />

      <AdminSegmentedControl className="mb-4" options={TABS} value={tab} onChange={setTab} />

      {tab === "team" ? (
        <AdminSurfaceCard>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
              Team & roles
            </Typography>
            <AdminGhostButton className="h-[34px] text-[13px]">Invite teammate</AdminGhostButton>
          </div>
          <div className="grid grid-cols-[2fr_1.3fr_1fr_40px] gap-3 border-b border-[#e9edf5] bg-bg-card px-5 py-3 text-[11.5px] font-bold tracking-[0.05em] text-[#8092b3] uppercase">
            <span>Member</span>
            <span>Role</span>
            <span>Access</span>
            <span />
          </div>
          {data.team.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[2fr_1.3fr_1fr_40px] items-center gap-3 border-b border-[#f2f5fa] px-5 py-3 transition-colors hover:bg-bg-card"
            >
              <div className="flex items-center gap-2.5">
                <GoldAvatar initials={getMemberInitials(member.name)} size="sm" />
                <div>
                  <Typography variant="label" className="text-[13.5px] font-semibold text-[#1a2c4e]">
                    {member.name}
                  </Typography>
                  <Typography variant="caption" className="text-[#93a3c2]">
                    {member.email}
                  </Typography>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex w-fit rounded-md px-2.5 py-0.5 text-xs font-bold",
                  ROLE_STYLES[member.role] ?? ROLE_STYLES.Operator,
                )}
              >
                {member.role}
              </span>
              <Typography variant="body-sm" className="text-muted-soft">
                {member.access}
              </Typography>
              <MoreHorizontal className="size-[18px] justify-self-end text-[#c3cee0]" />
            </div>
          ))}
        </AdminSurfaceCard>
      ) : null}

      {tab === "platform" ? (
        <div className="grid grid-cols-2 gap-4">
          {data.platformCards.map((card) => (
            <AdminSurfaceCard key={card.title} className="p-5">
              <div className="mb-1.5 flex items-center gap-2.5">
                <span className="flex size-[34px] items-center justify-center rounded-[7px] bg-bg-card text-[#3f5580]">
                  <Settings className="size-4" />
                </span>
                <Typography variant="label" className="font-display text-[15px] font-bold text-ink-heading">
                  {card.title}
                </Typography>
              </div>
              <Typography variant="body-sm" color="muted" className="mb-3.5 leading-relaxed">
                {card.desc}
              </Typography>
              <AdminGhostButton className="h-[34px] text-[13px]">{card.cta}</AdminGhostButton>
            </AdminSurfaceCard>
          ))}
        </div>
      ) : null}

      {tab === "audit" ? (
        <AdminSurfaceCard>
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Shield className="size-[18px] text-[#3f5580]" />
            <Typography variant="label" className="font-display text-base font-bold text-ink-heading">
              Audit log
            </Typography>
          </div>
          {data.audit.map((entry) => (
            <div
              key={`${entry.actor}-${entry.time}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5 border-b border-[#f4f6fb] px-5 py-3"
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  AUDIT_TONE[entry.tone] ?? "bg-muted-soft",
                )}
              />
              <Typography variant="body-sm" className="text-[13.5px] text-[#22314f]">
                <strong className="font-bold">{entry.actor}</strong> {entry.action}
              </Typography>
              <Typography variant="caption" className="whitespace-nowrap text-[#93a3c2]">
                {entry.time}
              </Typography>
            </div>
          ))}
        </AdminSurfaceCard>
      ) : null}
    </div>
  );
}
