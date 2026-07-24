import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Lock } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { FilterChips } from "@/components/common/FilterChips";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
  StatusChip,
} from "@/components/member/app";
import { useAuth } from "@/context/AuthContext";
import {
  listSuccessCenters,
  selectSuccessCenters,
} from "@/lib/api/successCenters";
import type { SuccessCenter } from "@/types";
import { ROUTES, SUCCESS_CENTER_FILTERS } from "@/utils/constants";
import { cn } from "@/lib/utils";

type CenterFilter = (typeof SUCCESS_CENTER_FILTERS)[number]["id"];

export default function SuccessCentersBrowsePage() {
  const { user, refresh } = useAuth();
  const [centers, setCenters] = useState<SuccessCenter[]>([]);
  const [filter, setFilter] = useState<CenterFilter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listSuccessCenters({ activeOnly: true })
      .then(setCenters)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelected(user?.selectedCenterIds ?? []);
  }, [user?.selectedCenterIds]);

  const filtered = useMemo(() => {
    if (filter === "all") return centers;
    return centers.filter((c) => c.filter === filter);
  }, [centers, filter]);

  const limit = user?.centerLimit ?? 0;
  const canSelect = limit > 0;

  const toggle = (id: string) => {
    if (!canSelect) {
      toast.message("Enroll first to unlock Success Center selection.");
      return;
    }
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= limit) {
        toast.error(`Your plan allows up to ${limit} Success Center(s).`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await selectSuccessCenters(selected);
      await refresh();
      toast.success("Success Centers saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="BMIS"
        title="Success Centers"
        subtitle="Goal categories with planning tools. Figures shown later are projections, not live funding."
        actions={
          !canSelect ? (
            <GoldButton asChild>
              <Link to={ROUTES.ENROLLMENT}>Enroll to unlock</Link>
            </GoldButton>
          ) : (
            <GoldButton onClick={onSave} disabled={saving}>
              {saving
                ? "Saving…"
                : `Save selection (${selected.length}/${limit})`}
            </GoldButton>
          )
        }
      />

      {!canSelect ? (
        <InfoCallout className="mb-5">
          Selection is locked until you enroll. Founding plans unlock 1, 3, or 8
          centers depending on the offer.
        </InfoCallout>
      ) : null}

      <FilterChips
        options={SUCCESS_CENTER_FILTERS}
        value={filter}
        onChange={setFilter}
        className="mb-5"
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-panel bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No Success Centers in this filter"
          description="Try another category or check back after admin activates more centers."
          variant="muted"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((center) => {
            const isOn = selected.includes(center.id);
            return (
              <AppSurfaceCard
                key={center.id}
                className={cn(
                  "flex flex-col transition",
                  isOn && "border-info/40 ring-2 ring-info/25",
                )}
                padding="md"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <SectionLabel tone="navy">{center.filter}</SectionLabel>
                  {center.tag ? (
                    <StatusChip tone="gold">{center.tag}</StatusChip>
                  ) : null}
                </div>
                <Typography
                  as="h2"
                  variant="h5"
                  className="font-display text-[17px] font-bold text-ink-heading"
                >
                  {center.name}
                </Typography>
                <Typography
                  variant="body-sm"
                  className="mt-2 flex-1 text-muted-soft"
                >
                  {center.blurb}
                </Typography>
                <div className="mt-5 flex flex-wrap gap-2">
                  <GoldButton
                    variant={isOn ? "ghost-outline" : "gold"}
                    onClick={() => toggle(center.id)}
                  >
                    {!canSelect ? (
                      <>
                        <Lock className="size-3.5" /> Locked
                      </>
                    ) : isOn ? (
                      "Selected"
                    ) : (
                      "Select"
                    )}
                  </GoldButton>
                  <GoldButton variant="ghost-outline" asChild>
                    <Link to={`/success-centers/${center.id}`}>Details</Link>
                  </GoldButton>
                </div>
              </AppSurfaceCard>
            );
          })}
        </div>
      )}
    </AppPageContainer>
  );
}
