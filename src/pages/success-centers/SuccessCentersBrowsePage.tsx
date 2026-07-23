import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { FilterChips } from "@/components/common/FilterChips";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
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

  useEffect(() => {
    void listSuccessCenters({ activeOnly: true }).then(setCenters);
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Typography variant="h2">Success Centers</Typography>
          <Typography variant="body" className="mt-2 text-muted-foreground">
            Goal categories powered by BMIS. Phase 1 provides planning tools
            only — figures are projections, not live funding.
          </Typography>
        </div>
        {!canSelect ? (
          <GoldButton asChild>
            <Link to={ROUTES.ENROLLMENT}>Enroll to unlock</Link>
          </GoldButton>
        ) : (
          <GoldButton onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : `Save selection (${selected.length}/${limit})`}
          </GoldButton>
        )}
      </div>

      <FilterChips
        options={SUCCESS_CENTER_FILTERS}
        value={filter}
        onChange={setFilter}
        className="mb-5"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((center) => {
          const isOn = selected.includes(center.id);
          return (
            <AppSurfaceCard
              key={center.id}
              className={cn(
                "flex flex-col p-5 transition",
                isOn && "ring-2 ring-gold",
              )}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <Typography variant="h3">{center.name}</Typography>
                {center.tag ? (
                  <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold-dark">
                    {center.tag}
                  </span>
                ) : null}
              </div>
              <Typography variant="body" className="flex-1 text-muted-foreground">
                {center.blurb}
              </Typography>
              <div className="mt-4 flex flex-wrap gap-2">
                <GoldButton
                  variant={isOn ? "outline" : "gold"}
                  size="sm"
                  onClick={() => toggle(center.id)}
                >
                  {isOn ? "Selected" : "Select"}
                </GoldButton>
                <Link
                  to={`/success-centers/${center.id}`}
                  className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  Details
                </Link>
              </div>
            </AppSurfaceCard>
          );
        })}
      </div>
    </AppPageContainer>
  );
}
