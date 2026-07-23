import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, Layers, Search, Users, X } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminShell } from "@/context/AdminShellContext";
import {
  fetchAdminCampaigns,
  fetchAdminContent,
  fetchAdminMembers,
} from "@/lib/api/admin";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

type AdminSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

type SearchResult = {
  id: string;
  type: "member" | "campaign" | "content";
  title: string;
  subtitle: string;
  route: string;
  query: string;
};

const TYPE_META = {
  member: { label: "Member", icon: Users },
  campaign: { label: "Campaign", icon: Layers },
  content: { label: "Content", icon: FileText },
} as const;

export function AdminSearchModal({ open, onClose }: AdminSearchModalProps) {
  const navigate = useNavigate();
  const { search, setSearch } = useAdminShell();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: membersData } = useQuery({
    queryKey: ["admin-members"],
    queryFn: fetchAdminMembers,
    enabled: open,
  });
  const { data: campaignsData } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: fetchAdminCampaigns,
    enabled: open,
  });
  const { data: contentData } = useQuery({
    queryKey: ["admin-content"],
    queryFn: fetchAdminContent,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResult[] = [];

    membersData?.members.forEach((member) => {
      if (
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q)
      ) {
        items.push({
          id: `member-${member.id}`,
          type: "member",
          title: member.name,
          subtitle: member.email,
          route: ROUTES.ADMIN_PARTICIPANTS,
          query: member.name,
        });
      }
    });

    campaignsData?.campaigns.forEach((campaign) => {
      if (
        campaign.name.toLowerCase().includes(q) ||
        campaign.owner.toLowerCase().includes(q)
      ) {
        items.push({
          id: `campaign-${campaign.id}`,
          type: "campaign",
          title: campaign.name,
          subtitle: campaign.owner,
          route: ROUTES.ADMIN_SUCCESS_CENTERS,
          query: campaign.name,
        });
      }
    });

    contentData?.content.forEach((item) => {
      if (item.title.toLowerCase().includes(q)) {
        items.push({
          id: `content-${item.id}`,
          type: "content",
          title: item.title,
          subtitle: `${item.type} · ${item.cat}`,
          route: ROUTES.ADMIN_DISCLOSURES,
          query: item.title,
        });
      }
    });

    return items.slice(0, 12);
  }, [search, membersData, campaignsData, contentData]);

  const handleSelect = (result: SearchResult) => {
    setSearch(result.query);
    navigate(result.route);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(9,18,42,0.52)] backdrop-blur-[2px]"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="relative mx-auto flex max-h-[min(85vh,640px)] w-full max-w-lg flex-col px-4 pt-4 sm:pt-10">
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_30px_70px_-24px_rgba(9,18,42,0.55)]">
          <div className="flex items-center gap-2 border-b border-line px-3 py-3 sm:px-4">
            <Search className="size-[17px] shrink-0 text-muted-light" />
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members, campaigns, content…"
              className="h-10 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close search"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="admin-scroll max-h-[min(60vh,420px)] overflow-y-auto p-2">
            {search.trim() === "" ? (
              <div className="px-3 py-8 text-center">
                <Typography variant="body-sm" className="text-[#8496b7]">
                  Search across members, campaigns, and content.
                </Typography>
              </div>
            ) : results.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <Typography variant="label" className="font-semibold text-ink-heading">
                  No results found
                </Typography>
                <Typography variant="body-sm" className="mt-1 text-[#8496b7]">
                  Try a different name or keyword.
                </Typography>
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((result) => {
                  const meta = TYPE_META[result.type];
                  const Icon = meta.icon;
                  return (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(result)}
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-bg-card"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-card text-[#7386a8]">
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <Typography
                            variant="label"
                            className="truncate text-[13.5px] font-semibold text-[#22314f]"
                          >
                            {result.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="truncate text-[#93a3c2]"
                          >
                            {result.subtitle}
                          </Typography>
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide",
                            result.type === "member" && "bg-info-bg text-[#2b5299]",
                            result.type === "campaign" && "bg-bg-icon text-[#8a6413]",
                            result.type === "content" && "bg-bg-card text-[#7386a8]",
                          )}
                        >
                          {meta.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
