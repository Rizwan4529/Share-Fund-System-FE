import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AdminPageHeader,
  AdminSectionTitle,
  AdminSurfaceCard,
} from "@/components/admin";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "@/lib/api/settings";
import type { CustomPlatformRule, PlatformSettings } from "@/types";

type DraftRule = {
  id: string;
  label: string;
  value: string;
  description: string;
};

const emptyDraft = (): DraftRule => ({
  id: "",
  label: "",
  value: "0",
  description: "",
});

export default function AdminRulesPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<DraftRule>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    void getPlatformSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  const r = settings.rules;
  const customRules = r.customRules ?? [];

  const patchRules = (next: Partial<typeof r>) => {
    setSettings({ ...settings, rules: { ...r, ...next } });
  };

  const save = async () => {
    await updatePlatformSettings(settings);
    toast.success("Rules saved.");
  };

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setDrawerOpen(true);
  };

  const openEdit = (rule: CustomPlatformRule) => {
    setEditingId(rule.id);
    setDraft({
      id: rule.id,
      label: rule.label,
      value: String(rule.value),
      description: rule.description ?? "",
    });
    setDrawerOpen(true);
  };

  const closeDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setEditingId(null);
      setDraft(emptyDraft());
    }
  };

  const saveDraft = () => {
    const label = draft.label.trim();
    if (!label) {
      toast.error("Rule name is required.");
      return;
    }
    const value = Number(draft.value);
    if (Number.isNaN(value)) {
      toast.error("Enter a valid number.");
      return;
    }

    const nextRule: CustomPlatformRule = {
      id: editingId ?? `rule-${Date.now()}`,
      label,
      value,
      description: draft.description.trim() || undefined,
    };

    const nextCustom = editingId
      ? customRules.map((rule) => (rule.id === editingId ? nextRule : rule))
      : [...customRules, nextRule];

    patchRules({ customRules: nextCustom });
    closeDrawer(false);
    toast.success(editingId ? "Rule updated." : "Rule added.");
  };

  const removeCustom = (id: string) => {
    patchRules({ customRules: customRules.filter((rule) => rule.id !== id) });
    toast.success("Rule removed.");
  };

  return (
    <>
      <AdminPageHeader
        title="Rules"
        subtitle="Fees, percentages, caps, limits, timelines, and recommendation placeholders."
        actions={
          <div className="flex flex-wrap gap-2">
            {/* <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openCreate}
            >
              <Plus className="size-4" />
              Add rule
            </Button> */}
            {/* <GoldButton size="sm" onClick={() => void save()}>
              Save rules
            </GoldButton> */}
          </div>
        }
      />

      <AdminSurfaceCard className="mt-6 w-full space-y-6 p-5 sm:p-6">
        <div>
          <AdminSectionTitle>Platform rules</AdminSectionTitle>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Num
              label="Platform fee %"
              value={r.platformFeePercent}
              onChange={(n) => patchRules({ platformFeePercent: n })}
            />
            <Num
              label="Refund reserve %"
              value={r.refundReservePercent}
              onChange={(n) => patchRules({ refundReservePercent: n })}
            />
            <Num
              label="Refund window (days)"
              value={r.refundWindowDays}
              onChange={(n) => patchRules({ refundWindowDays: n })}
            />
            <Num
              label="Max centers / participant"
              value={r.maxCentersPerParticipant}
              onChange={(n) => patchRules({ maxCentersPerParticipant: n })}
            />
            <Num
              label="Default timeline (months)"
              value={r.defaultTimelineMonths}
              onChange={(n) => patchRules({ defaultTimelineMonths: n })}
            />
            <Num
              label="Budget factor (placeholder)"
              value={r.recommendationBudgetFactor}
              onChange={(n) => patchRules({ recommendationBudgetFactor: n })}
            />
            <Num
              label="Timeline factor (placeholder)"
              value={r.recommendationTimelineFactor}
              onChange={(n) => patchRules({ recommendationTimelineFactor: n })}
            />
            <Num
              label="Max recommended budget"
              value={r.caps.maxRecommendedBudget}
              onChange={(n) =>
                patchRules({ caps: { ...r.caps, maxRecommendedBudget: n } })
              }
            />
            <Num
              label="Min monthly set-aside"
              value={r.caps.minMonthlySetAside}
              onChange={(n) =>
                patchRules({ caps: { ...r.caps, minMonthlySetAside: n } })
              }
            />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AdminSectionTitle>Custom rules</AdminSectionTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openCreate}
            >
              <Plus className="size-4" />
              Add rule
            </Button>
          </div>

          {customRules.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No custom rules yet. Use Add rule to define additional numeric
              limits or factors.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {customRules.map((rule) => (
                <div
                  key={rule.id}
                  className="space-y-1.5 rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      className="min-w-0 text-left"
                      onClick={() => openEdit(rule)}
                    >
                      <span className="block text-sm font-semibold text-ink-heading">
                        {rule.label}
                      </span>
                      {rule.description ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {rule.description}
                        </span>
                      ) : null}
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-error hover:bg-error-bg/50 hover:text-error"
                      onClick={() => removeCustom(rule.id)}
                      aria-label={`Remove ${rule.label}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <Input
                    type="number"
                    step="any"
                    value={rule.value}
                    onChange={(e) =>
                      patchRules({
                        customRules: customRules.map((item) =>
                          item.id === rule.id
                            ? { ...item, value: Number(e.target.value) }
                            : item,
                        ),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminSurfaceCard>

      <DrawerCommon
        open={drawerOpen}
        onOpenChange={closeDrawer}
        title={editingId ? "Edit rule" : "Add rule"}
        description="Define a custom numeric platform rule."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDrawer(false)}
            >
              Cancel
            </Button>
            <GoldButton type="button" onClick={saveDraft}>
              {editingId ? "Update rule" : "Add rule"}
            </GoldButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rule-label">Name</Label>
            <Input
              id="rule-label"
              value={draft.label}
              placeholder="e.g. Max refunds per month"
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, label: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rule-value">Value</Label>
            <Input
              id="rule-value"
              type="number"
              step="any"
              value={draft.value}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, value: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rule-description">Description (optional)</Label>
            <Textarea
              id="rule-description"
              value={draft.description}
              placeholder="Short note for other admins"
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        </div>
      </DrawerCommon>
    </>
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
