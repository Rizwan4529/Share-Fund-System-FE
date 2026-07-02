import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Download, Inbox, Layers, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  AdminConfirmModal,
  AdminGhostButton,
  AdminGoldButton,
  AdminMemberDrawer,
  AdminPageHeader,
  AdminSegmentedControl,
  AdminStatusPill,
  AdminSurfaceCard,
  type AdminModalKind,
} from "@/components/admin";
import { EmptyState } from "@/components/common/EmptyState";
import { Typography } from "@/components/common/Typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminShell } from "@/context/AdminShellContext";
import { fetchAdminMembers } from "@/lib/api/admin";
import {
  getMemberInitials,
  type AdminMember,
} from "@/lib/mock/adminData";
import { GoldAvatar } from "@/components/member/app/GoldAvatar";

type ViewState = "populated" | "loading" | "empty" | "error";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "suspended", label: "Suspended" },
];

export default function AdminMembersPage() {
  const { search } = useAdminShell();
  const [filter, setFilter] = useState("all");
  const [viewState, setViewState] = useState<ViewState>("populated");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [drawerMember, setDrawerMember] = useState<AdminMember | null>(null);
  const [modal, setModal] = useState<{
    kind: AdminModalKind;
    name?: string;
  } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-members"],
    queryFn: fetchAdminMembers,
  });

  const members = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.members.filter((member) => {
      if (filter !== "all" && member.status !== filter) return false;
      if (!q) return true;
      return (
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q)
      );
    });
  }, [data, filter, search]);

  const selectedCount = Object.keys(selected).length;
  const allSelected =
    members.length > 0 && members.every((m) => selected[m.id]);

  const toggleAll = () => {
    if (allSelected) {
      setSelected({});
      return;
    }
    const next: Record<string, boolean> = {};
    members.forEach((m) => {
      next[m.id] = true;
    });
    setSelected(next);
  };

  const cycleState = () => {
    const order: ViewState[] = ["populated", "loading", "empty", "error"];
    setViewState((current) => order[(order.indexOf(current) + 1) % order.length]);
  };

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  const showPopulated = viewState === "populated" && members.length > 0;
  const showLoading = viewState === "loading";
  const showEmpty = viewState === "empty" || (viewState === "populated" && members.length === 0);
  const showError = viewState === "error";

  return (
    <div className="animate-fade-up">
      <AdminPageHeader
        title="Members"
        subtitle={`${data.total.toLocaleString()} members on the platform`}
        actions={
          <>
            <AdminGhostButton onClick={() => toast.success("Exported member list")}>
              <Download className="size-4" />
              Export CSV
            </AdminGhostButton>
            <AdminGoldButton onClick={() => toast.success("Invite sent")}>
              <Plus className="size-4" />
              Invite member
            </AdminGoldButton>
          </>
        }
      />

      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <AdminSegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
        <div className="flex-1" />
        {selectedCount > 0 ? (
          <div className="flex animate-fade-in items-center gap-2.5 rounded-md bg-navy-deep px-3.5 py-1.5">
            <Typography variant="label" className="text-[13px] font-semibold text-[#dbe6fa]">
              {selectedCount} selected
            </Typography>
            <button
              type="button"
              className="h-[30px] rounded-[5px] border border-white/16 bg-white/6 px-2.5 text-[12.5px] font-semibold text-[#eaf0fb]"
              onClick={() => {
                toast.success("Exported selected members");
                setSelected({});
              }}
            >
              Export
            </button>
            <button
              type="button"
              className="h-[30px] rounded-[5px] border border-gold/40 bg-gold/14 px-2.5 text-[12.5px] font-semibold text-gold-pale"
              onClick={() => setModal({ kind: "bulkSuspend" })}
            >
              Suspend
            </button>
          </div>
        ) : null}
        <AdminGhostButton
          className="h-9 border-dashed text-[12.5px] text-[#7386a8]"
          onClick={cycleState}
        >
          <Layers className="size-3.5" />
          State: {viewState}
        </AdminGhostButton>
      </div>

      <AdminSurfaceCard>
        {showPopulated ? (
          <>
            <div className="grid grid-cols-[38px_2.4fr_1fr_1.1fr_1fr_1fr_40px] gap-3 border-b border-[#e9edf5] bg-bg-card px-5 py-3 text-[11.5px] font-bold tracking-[0.05em] text-[#8092b3] uppercase">
              <span>
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </span>
              <span>Member</span>
              <span>Status</span>
              <span>Campaigns</span>
              <span>Credits</span>
              <span>Source</span>
              <span />
            </div>
            {members.map((member) => (
              <div
                key={member.id}
                role="button"
                tabIndex={0}
                onClick={() => setDrawerMember(member)}
                onKeyDown={(e) => e.key === "Enter" && setDrawerMember(member)}
                className="grid cursor-pointer grid-cols-[38px_2.4fr_1fr_1.1fr_1fr_1fr_40px] items-center gap-3 border-b border-[#f2f5fa] px-5 py-3 transition-colors hover:bg-bg-card"
              >
                <span
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={!!selected[member.id]}
                    onCheckedChange={() =>
                      setSelected((prev) => {
                        const next = { ...prev };
                        if (next[member.id]) delete next[member.id];
                        else next[member.id] = true;
                        return next;
                      })
                    }
                  />
                </span>
                <div className="flex min-w-0 items-center gap-3">
                  <GoldAvatar initials={getMemberInitials(member.name)} size="md" />
                  <div className="min-w-0">
                    <Typography variant="label" className="truncate text-sm font-semibold text-[#1a2c4e]">
                      {member.name}
                    </Typography>
                    <Typography variant="caption" className="truncate text-[#93a3c2]">
                      {member.email}
                    </Typography>
                  </div>
                </div>
                <AdminStatusPill status={member.status} />
                <Typography variant="body-sm" className="text-[#33425f]">
                  {member.campaigns}
                </Typography>
                <Typography variant="label" className="font-display font-semibold text-[#1a2c4e]">
                  {member.credits.toLocaleString()}
                </Typography>
                <Typography variant="body-sm" className="text-muted-soft">
                  {member.source}
                </Typography>
                <ChevronRight className="size-4 justify-self-end text-[#c3cee0]" />
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3">
              <Typography variant="body-sm" className="text-[#8496b7]">
                Showing {members.length} of {data.total.toLocaleString()} members
              </Typography>
              <div className="flex gap-1.5">
                <AdminGhostButton className="h-8 min-w-8 px-2.5 text-[#8496b7]">Prev</AdminGhostButton>
                <button type="button" className="h-8 min-w-8 rounded-md border border-gold-dark bg-bg-gold px-2.5 text-[13px] font-bold text-[#8a6413]">
                  1
                </button>
                <AdminGhostButton className="h-8 min-w-8 px-2.5">2</AdminGhostButton>
                <AdminGhostButton className="h-8 min-w-8 px-2.5">3</AdminGhostButton>
                <AdminGhostButton className="h-8 min-w-8 px-2.5">Next</AdminGhostButton>
              </div>
            </div>
          </>
        ) : null}

        {showLoading ? (
          <div className="space-y-3 px-5 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-md" />
            ))}
          </div>
        ) : null}

        {showEmpty ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No members match these filters"
              description="Try clearing filters or adjusting your search."
              action={
                <AdminGhostButton
                  onClick={() => {
                    setFilter("all");
                    setViewState("populated");
                  }}
                >
                  Clear filters
                </AdminGhostButton>
              }
            />
          </div>
        ) : null}

        {showError ? (
          <div className="px-5 py-10 text-center">
            <Typography variant="h5" className="font-display font-bold text-ink-heading">
              Couldn&apos;t load members
            </Typography>
            <Typography variant="body-sm" color="muted" className="mt-2">
              Check your connection and try again.
            </Typography>
            <AdminGoldButton className="mt-4" onClick={() => void refetch()}>
              Retry
            </AdminGoldButton>
          </div>
        ) : null}
      </AdminSurfaceCard>

      <AdminMemberDrawer
        member={drawerMember}
        open={!!drawerMember}
        onClose={() => setDrawerMember(null)}
        onAdjust={() => setModal({ kind: "adjust", name: drawerMember?.name })}
        onSuspend={() =>
          setModal({
            kind: drawerMember?.status === "suspended" ? "reactivate" : "suspend",
            name: drawerMember?.name,
          })
        }
      />

      <AdminConfirmModal
        open={!!modal}
        kind={modal?.kind ?? null}
        name={modal?.name}
        count={selectedCount}
        onClose={() => setModal(null)}
        onConfirm={() => {
          toast.success("Action completed");
          setModal(null);
          setDrawerMember(null);
          setSelected({});
        }}
      />
    </div>
  );
}
