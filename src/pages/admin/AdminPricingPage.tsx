import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AdminPageHeader,
  AdminSectionTitle,
  AdminSurfaceCard,
} from "@/components/admin";
import { GoldButton } from "@/components/common/GoldButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "@/lib/api/settings";
import type { PlatformSettings } from "@/types";

export default function AdminPricingPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);

  useEffect(() => {
    void getPlatformSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  const p = settings.pricing;

  const save = async () => {
    await updatePlatformSettings(settings);
    toast.success("Pricing settings saved.");
  };

  return (
    <>
      <AdminPageHeader
        title="Pricing"
        subtitle="Administrator-configurable Founding and Founder Stack pricing."
        actions={
          <GoldButton size="sm" onClick={() => void save()}>
            Save pricing
          </GoldButton>
        }
      />

      <div className="grid max-w-3xl gap-5 mt-7">
        <AdminSurfaceCard className="space-y-3 p-5">
          <AdminSectionTitle>Founding Introductory Pricing</AdminSectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Regular price / center"
              value={p.regularPricePerCenter}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: { ...p, regularPricePerCenter: n },
                })
              }
            />
            <Field
              label="Founding — 1 center"
              value={p.foundingPriceOne}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: { ...p, foundingPriceOne: n },
                })
              }
            />
            <Field
              label="Founding — bundle price"
              value={p.foundingPriceBundle}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: { ...p, foundingPriceBundle: n },
                })
              }
            />
            <Field
              label="Bundle center count"
              value={p.bundleCenterCount}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: { ...p, bundleCenterCount: n },
                })
              }
            />
            <div className="space-y-1.5">
              <Label>Promo start</Label>
              <Input
                type="date"
                value={p.promoStart}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pricing: { ...p, promoStart: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Promo end</Label>
              <Input
                type="date"
                value={p.promoEnd}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pricing: { ...p, promoEnd: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </AdminSurfaceCard>

        <AdminSurfaceCard className="space-y-3 p-5">
          <AdminSectionTitle>Pricing tiers</AdminSectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label="Personal"
              value={p.tiers.personal}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: {
                    ...p,
                    tiers: { ...p.tiers, personal: n },
                  },
                })
              }
            />
            <Field
              label="Professional partner"
              value={p.tiers.professional_partner}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: {
                    ...p,
                    tiers: { ...p.tiers, professional_partner: n },
                  },
                })
              }
            />
            <Field
              label="Organizational"
              value={p.tiers.organizational}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: {
                    ...p,
                    tiers: { ...p.tiers, organizational: n },
                  },
                })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Billing structure stored as “{p.billing}”. Live recurring billing is
            not included in Phase 1.
          </p>
        </AdminSurfaceCard>

        <AdminSurfaceCard className="space-y-3 border-gold/30 bg-gold/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <AdminSectionTitle>Founder Stack (separate)</AdminSectionTitle>
            <div className="flex items-center gap-2">
              <Label>Active</Label>
              <Switch
                checked={p.founderStack.active}
                onCheckedChange={(v) =>
                  setSettings({
                    ...settings,
                    pricing: {
                      ...p,
                      founderStack: { ...p.founderStack, active: v },
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Price"
              value={p.founderStack.price}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: {
                    ...p,
                    founderStack: { ...p.founderStack, price: n },
                  },
                })
              }
            />
            <Field
              label="Success Centers included"
              value={p.founderStack.successCenterCount}
              onChange={(n) =>
                setSettings({
                  ...settings,
                  pricing: {
                    ...p,
                    founderStack: {
                      ...p.founderStack,
                      successCenterCount: n,
                    },
                  },
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Benefits</Label>
            <Textarea
              value={p.founderStack.benefits}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  pricing: {
                    ...p,
                    founderStack: {
                      ...p.founderStack,
                      benefits: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </AdminSurfaceCard>
      </div>
    </>
  );
}

function Field({
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
