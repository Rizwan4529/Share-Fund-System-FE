import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, Layers, Search, Users, X } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchAdminEnrollments,
  fetchAdminParticipants,
  fetchAdminSuccessCenters,
} from "@/lib/api/admin";
import { foundingStatusLabel } from "@/lib/auth/roles";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

type AdminSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

type SearchResult = {
  id: string;
  type: "participant" | "enrollment" | "center";
  title: string;
  subtitle: string;
  route: string;
};

const TYPE_META = {
  participant: { label: "Participant", icon: Users },
  enrollment: { label: "Enrollment", icon: FileText },
  center: { label: "Center", icon: Layers },
} as const;

export function AdminSearchModal({ open, onClose }: AdminSearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: participants = [] } = useQuery({
    queryKey: ["admin-search-participants"],
    queryFn: fetchAdminParticipants,
    enabled: open,
  });
  const { data: enrollmentData } = useQuery({
    queryKey: ["admin-search-enrollments"],
    queryFn: fetchAdminEnrollments,
    enabled: open,
  });
  const { data: centers = [] } = useQuery({
    queryKey: ["admin-search-centers"],
    queryFn: fetchAdminSuccessCenters,
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
      setQuery("");
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
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResult[] = [];

    participants.forEach((participant) => {
      const haystack =
        `${participant.name} ${participant.email} ${foundingStatusLabel(participant.foundingStatus)}`.toLowerCase();
      if (haystack.includes(q)) {
        items.push({
          id: `participant-${participant.id}`,
          type: "participant",
          title: participant.name,
          subtitle: `${participant.email} · ${foundingStatusLabel(participant.foundingStatus)}`,
          route: ROUTES.ADMIN_PARTICIPANTS,
        });
      }
    });

    enrollmentData?.enrollments.forEach((enrollment) => {
      const haystack =
        `${enrollment.userName} ${enrollment.userEmail} ${enrollment.plan} ${enrollment.status}`.toLowerCase();
      if (haystack.includes(q)) {
        items.push({
          id: `enrollment-${enrollment.id}`,
          type: "enrollment",
          title: enrollment.userName,
          subtitle: `${enrollment.plan.replaceAll("_", " ")} · $${enrollment.amount} · ${enrollment.status}`,
          route: ROUTES.ADMIN_ENROLLMENTS,
        });
      }
    });

    centers.forEach((center) => {
      const haystack =
        `${center.name} ${center.filter} ${center.blurb}`.toLowerCase();
      if (haystack.includes(q)) {
        items.push({
          id: `center-${center.id}`,
          type: "center",
          title: center.name,
          subtitle: `${center.filter} · ${center.active ? "Active" : "Inactive"}`,
          route: ROUTES.ADMIN_SUCCESS_CENTERS,
        });
      }
    });

    return items.slice(0, 12);
  }, [query, participants, enrollmentData, centers]);

  const handleSelect = (result: SearchResult) => {
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search participants, enrollments, centers…"
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
            {query.trim() === "" ? (
              <div className="px-3 py-8 text-center">
                <Typography variant="body-sm" className="text-[#8496b7]">
                  Search participants, enrollments, and Success Centers.
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
                            result.type === "participant" &&
                              "bg-info-bg text-[#2b5299]",
                            result.type === "enrollment" &&
                              "bg-bg-card text-[#7386a8]",
                            result.type === "center" &&
                              "bg-bg-icon text-[#8a6413]",
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
