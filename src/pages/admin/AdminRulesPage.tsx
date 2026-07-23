import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminPageContainer, AdminPageHeader } from "@/components/admin";
import { GoldButton } from "@/components/common/GoldButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "@/lib/api/settings";
import type { PlatformSettings } from "@/types";

export default function AdminRulesPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);

  useEffect(() => {
    void getPlatformSettings().then(setSettings);
  }, []);

  if (!settings) {
    return (
      <AdminPageContainer>
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </AdminPageContainer>
    );
  }

  const r = settings.rules;

  const save = async () => {
    await updatePlatformSettings(settings);
    toast.success("Rules saved.");
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Rules"
        subtitle="Fees, percentages, caps, limits, timelines, and recommendation placeholders."
        actions={
          <GoldButton size="sm" onClick={() => void save()}>
            Save rules
          </GoldButton>
        }
      />
      <div className="grid max-w-3xl gap-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <Num
          label="Platform fee %"
          value={r.platformFeePercent}
          onChange={(n) =>
            setSettings({ ...settings, rules: { ...r, platformFeePercent: n } })
          }
        />
        <Num
          label="Refund reserve %"
          value={r.refundReservePercent}
          onChange={(n) =>
            setSettings({
              ...settings,
              rules: { ...r, refundReservePercent: n },
            })
          }
        />
        <Num
          label="Refund window (days)"
          value={r.refundWindowDays}
          onChange={(n) =>
            setSettings({ ...settings, rules: { ...r, refundWindowDays: n } })
          }
        />
        <Num
          label="Max centers / participant"
          value={r.maxCentersPerParticipant}
          onChange={(n) =>
            setSettings({
              ...settings,
              rules: { ...r, maxCentersPerParticipant: n },
            })
          }
        />
        <Num
          label="Default timeline (months)"
          value={r.defaultTimelineMonths}
          onChange={(n) =>
            setSettings({
              ...settings,
              rules: { ...r, defaultTimelineMonths: n },
            })
          }
        />
        <Num
          label="Budget factor (placeholder)"
          value={r.recommendationBudgetFactor}
          onChange={(n) =>
            setSettings({
              ...settings,
              rules: { ...r, recommendationBudgetFactor: n },
            })
          }
        />
        <Num
          label="Timeline factor (placeholder)"
          value={r.recommendationTimelineFactor}
          onChange={(n) =>
            setSettings({
              ...settings,
              rules: { ...r, recommendationTimelineFactor: n },
            })
          }
        />
        <Num
          label="Max recommended budget"
          value={r.caps.maxRecommendedBudget}
          onChange={(n) =>
            setSettings({
              ...settings,
              rules: { ...r, caps: { ...r.caps, maxRecommendedBudget: n } },
            })
          }
        />
        <Num
          label="Min monthly set-aside"
          value={r.caps.minMonthlySetAside}
          onChange={(n) =>
            setSettings({
              ...settings,
              rules: { ...r, caps: { ...r.caps, minMonthlySetAside: n } },
            })
          }
        />
      </div>
    </AdminPageContainer>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
