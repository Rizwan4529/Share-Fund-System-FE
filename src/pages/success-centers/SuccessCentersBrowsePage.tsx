import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Lock } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "../../components/common/EmptyState";
import { GoldButton } from "../../components/common/GoldButton";
import { Typography } from "../../components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
  StatusChip,
} from "../../components/member/app";
import { useAuth } from "../../context/AuthContext";
import { selectSuccessCenters } from "../../lib/api/successCenters";
import { cn } from "../../lib/utils";
import {
  useListSuccessCenterCategoriesQuery,
  useListSuccessCenterProgramsQuery,
} from "../../store/api/successCentersApi";
import { ROUTES } from "../../utils/constants";

export default function SuccessCentersBrowsePage() {
  const { user, refresh } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const categoriesQuery = useListSuccessCenterCategoriesQuery();
  const programsQuery = useListSuccessCenterProgramsQuery({
    status: "published",
  });

  const categories = useMemo(
    () =>
      (categoriesQuery.data ?? [])
        .filter((c) => c.status === "active")
        .slice()
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [categoriesQuery.data],
  );

  const programCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const program of programsQuery.data ?? []) {
      const key = String(program.categoryId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [programsQuery.data]);

  useEffect(() => {
    setSelected(user?.selectedCenterIds ?? []);
  }, [user?.selectedCenterIds]);

  const limit = user?.centerLimit ?? 0;
  const canSelect = limit > 0;
  const loading = categoriesQuery.isLoading || programsQuery.isLoading;

  const toggle = (id: string) => {
    if (!canSelect) {
      toast.message(
        "Get Founding Access first to unlock Success Center selection.",
      );
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
        subtitle="Explore Success Center categories and specialized programs with education, planning tools, and BMIS recommendations."
        actions={
          !canSelect ? (
            <GoldButton asChild>
              <Link to={ROUTES.ENROLLMENT}>Get Founding Access</Link>
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
          Selection unlocks with Founding Access. Founding plans include 1, 3, or
          up to 8 categories depending on the offer.
        </InfoCallout>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-panel bg-muted" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No Success Centers available"
          description="Check back after an admin activates categories."
          variant="muted"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((center) => {
            const isOn = selected.includes(center._id);
            const programCount = programCountByCategory.get(center._id) ?? 0;
            return (
              <AppSurfaceCard
                key={center._id}
                className={cn(
                  "flex flex-col transition",
                  isOn && "border-info/40 ring-2 ring-info/25",
                )}
                padding="md"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <SectionLabel tone="navy">
                    {center.icon?.trim() || "Category"}
                  </SectionLabel>
                  {center.slug ? (
                    <StatusChip tone="gold">{center.slug}</StatusChip>
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
                  {center.description || "Explore programs in this category."}
                </Typography>
                <Typography
                  variant="caption"
                  className="mt-3 block font-semibold text-info"
                >
                  {programCount} program
                  {programCount === 1 ? "" : "s"}
                </Typography>
                <div className="mt-4 flex flex-wrap gap-2">
                  <GoldButton
                    variant={isOn ? "ghost-outline" : "gold"}
                    onClick={() => toggle(center._id)}
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
                    <Link to={`/success-centers/${center._id}`}>
                      Explore Programs
                    </Link>
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
