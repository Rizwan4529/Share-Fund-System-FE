import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TrendingUp } from "lucide-react";

import { FormCommon, Input } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { ActivationWizardShell } from "@/components/campaigns";
import {
  BackNavLink,
  InfoCallout,
} from "@/components/member/app";
import { getCategoryIcon } from "@/lib/app/categoryIcons";
import { Slider } from "@/components/ui/slider";
import { useActivateCampaign, useCategory } from "@/hooks/queries/useCampaigns";
import { activateSchema, type ActivateFormValues } from "@/lib/schemas/auth";
import { ROUTES, TIMELINE_OPTIONS, getCategoryLabel } from "@/utils/constants";
import { cn } from "@/lib/utils";

const STEP_TITLES = [
  "Name your goal",
  "Set your target",
  "Review & activate",
];

const STEP_DESCS = [
  "Give your campaign a name you'll recognize on your dashboard.",
  "Choose a target and timeline that feel realistic for you.",
  "Confirm the details before you activate.",
];

export default function CampaignActivatePage() {
  const { categoryId = "" } = useParams();
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState(5000);
  const [timeline, setTimeline] = useState("12");
  const navigate = useNavigate();
  const { data: category } = useCategory(categoryId);
  const activate = useActivateCampaign();
  const Icon = getCategoryIcon(categoryId);

  const form = useForm<ActivateFormValues>({
    resolver: zodResolver(activateSchema),
    defaultValues: {
      goalName: category ? `${category.name} goal` : "",
      target: 5000,
      timeline: "12",
    },
  });

  const goalName = form.watch("goalName");
  const monthly = Math.round(target / Number(timeline));

  const onConfirm = async () => {
    await activate.mutateAsync({
      categoryId,
      goalName,
      target,
      timeline,
    });
    navigate(ROUTES.CAMPAIGN_SUCCESS);
  };

  const footer = (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {step > 0 ? (
        <GoldButton variant="ghost-outline" className="w-full sm:w-auto" onClick={() => setStep(step - 1)}>
          Back
        </GoldButton>
      ) : (
        <div className="hidden sm:block" />
      )}
      {step < 2 ? (
        <GoldButton
          className="w-full sm:ml-auto sm:flex-1"
          onClick={() => {
            if (step === 0) {
              void form.handleSubmit(() => setStep(1))();
            } else {
              setStep(step + 1);
            }
          }}
        >
          Continue
        </GoldButton>
      ) : (
        <GoldButton
          className="w-full sm:ml-auto sm:flex-1"
          onClick={() => void onConfirm()}
          disabled={activate.isPending}
        >
          Confirm & activate
        </GoldButton>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[720px] min-w-0 space-y-5">
      <BackNavLink to={`/campaigns/${categoryId}`}>Cancel</BackNavLink>
      <h1 className="font-display text-xl font-bold text-ink-heading sm:text-[26px]">
        Activate {category?.name ?? "campaign"}
      </h1>

      <ActivationWizardShell step={step} totalSteps={3} footer={footer}>
        <h2 className="font-display text-lg font-bold text-ink-heading sm:text-[22px]">
          {STEP_TITLES[step]}
        </h2>
        <p className="mt-1 text-[14.5px] text-muted-soft">{STEP_DESCS[step]}</p>

        {step === 0 ? (
          <FormCommon form={form} onSubmit={() => setStep(1)} className="mt-6 space-y-4">
            <Input control={form.control} name="goalName" label="Goal name" required />
            <div className="flex items-center gap-3 rounded-lg border border-line bg-bg-card px-4 py-3">
              <span className="flex size-10 items-center justify-center rounded-lg border border-border-gold bg-bg-icon">
                <Icon className="size-5 text-gold-dark" />
              </span>
              <div>
                <div className="text-[12px] font-semibold text-muted-soft">Category</div>
                <div className="font-bold text-ink-heading">{getCategoryLabel(categoryId)}</div>
              </div>
            </div>
          </FormCommon>
        ) : null}

        {step === 1 ? (
          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-2 text-[13px] font-semibold text-muted-soft">Target amount</div>
              <div className="font-display text-[32px] font-bold tracking-tight text-ink-heading sm:text-[40px]">
                ${target.toLocaleString()}
              </div>
              <Slider
                className="mt-4"
                min={500}
                max={50000}
                step={500}
                value={[target]}
                onValueChange={(v) => setTarget(v[0] ?? 5000)}
              />
            </div>
            <div>
              <div className="mb-3 text-[13px] font-semibold text-muted-soft">Timeline</div>
              <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-3">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTimeline(opt.value)}
                    className={cn(
                      "flex-1 rounded-brand border px-2 py-2.5 text-[13px] font-semibold sm:text-sm",
                      timeline === opt.value
                        ? "border-gold-dark bg-bg-gold text-gold-dark"
                        : "border-line bg-white text-muted-soft",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-3 rounded-lg border border-border-gold bg-gradient-to-br from-bg-gold to-bg-gold-alt px-4 py-3">
              <TrendingUp className="size-5 shrink-0 text-gold-dark" />
              <span className="min-w-0 text-[14px] leading-snug text-muted-soft sm:text-[14.5px]">
                Estimated monthly pace:{" "}
                <strong className="text-ink-heading">${monthly.toLocaleString()}/mo</strong>
              </span>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-6 space-y-4">
            <div className="divide-y divide-line rounded-lg border border-line">
              {[
                ["Category", getCategoryLabel(categoryId)],
                ["Goal name", goalName],
                ["Target", `$${target.toLocaleString()}`],
                ["Timeline", `${timeline} months`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-3 text-[14.5px]">
                  <span className="text-muted-soft">{k}</span>
                  <span className="font-semibold text-ink-heading">{v}</span>
                </div>
              ))}
            </div>
            <InfoCallout>
              You can adjust your target and timeline later from your dashboard.
            </InfoCallout>
          </div>
        ) : null}
      </ActivationWizardShell>
    </div>
  );
}
