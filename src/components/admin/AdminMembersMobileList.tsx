import { ChevronRight } from "lucide-react";

import { AdminStatusPill } from "@/components/admin/AdminStatusPill";
import { Typography } from "@/components/common/Typography";
import { Checkbox } from "@/components/ui/checkbox";
import { getMemberInitials, type AdminMember } from "@/lib/mock/adminData";
import { GoldAvatar } from "@/components/member/app/GoldAvatar";

type AdminMembersMobileListProps = {
  members: AdminMember[];
  selected: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (member: AdminMember) => void;
};

export function AdminMembersMobileList({
  members,
  selected,
  onToggle,
  onSelect,
}: AdminMembersMobileListProps) {
  return (
    <div className="divide-y divide-[#f2f5fa] md:hidden">
      {members.map((member) => (
        <div
          key={member.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(member)}
          onKeyDown={(e) => e.key === "Enter" && onSelect(member)}
          className="flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-bg-card"
        >
          <span
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="pt-1"
          >
            <Checkbox
              checked={!!selected[member.id]}
              onCheckedChange={() => onToggle(member.id)}
            />
          </span>
          <GoldAvatar initials={getMemberInitials(member.name)} size="md" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Typography variant="label" className="truncate text-sm font-semibold text-[#1a2c4e]">
                {member.name}
              </Typography>
              <AdminStatusPill status={member.status} className="shrink-0" />
            </div>
            <Typography variant="caption" className="mt-0.5 truncate text-[#93a3c2]">
              {member.email}
            </Typography>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-[#8496b7]">
              <span>{member.campaigns} campaigns</span>
              <span>{member.credits.toLocaleString()} credits</span>
              <span>{member.source}</span>
            </div>
          </div>
          <ChevronRight className="mt-2 size-4 shrink-0 text-[#c3cee0]" />
        </div>
      ))}
    </div>
  );
}
