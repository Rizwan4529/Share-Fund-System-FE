import { useState } from "react";
import { ArrowRight, BookOpen, Sparkles, Target, TrendingUp } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { OnboardingCategoryPicker } from "@/components/onboarding/OnboardingCategoryPicker";
import { OnboardingHowItWorksList } from "@/components/onboarding/OnboardingHowItWorksList";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingRail } from "@/components/onboarding/OnboardingRail";
import { useAuth } from "@/context/AuthContext";

const STEPS = ["Welcome", "Choose your goal", "How SFS works"];

const HOW_ITEMS = [
  {
    icon: Target,
    title: "Activate a campaign",
    desc: "Pick a category and set your goal.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    desc: "Follow where you stand from your dashboard.",
  },
  {
    icon: BookOpen,
    title: "Earn rewards",
    desc: "Participation earns credits you can put to use.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const { user, finishOnboarding } = useAuth();

  return (
    <OnboardingLayout
      rail={
        <OnboardingRail
          steps={STEPS}
          current={step}
          onSkip={() => void finishOnboarding()}
        />
      }
    >
      {step === 0 ? (
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-[76px] animate-[floatY_4s_ease-in-out_infinite] items-center justify-center rounded-panel border border-border-gold bg-gradient-to-br from-[#fdf6e6] to-[#faf0d8] shadow-[0_16px_36px_-18px_rgba(207,159,52,0.5)]">
            <Sparkles className="size-9 text-gold-dark" />
          </div>
          <Typography variant="h2" className="text-[28px] font-bold tracking-tight text-ink-heading">
            Great to have you, {user?.name?.split(" ")[0] ?? "there"}.
          </Typography>
          <Typography variant="body" color="muted" className="mx-auto mt-3 max-w-md text-[15.5px] leading-relaxed">
            SFS helps you organize real-life financial goals with campaigns,
            progress tracking, and rewards built in.
          </Typography>
          <GoldButton size="app" className="mt-8" onClick={() => setStep(1)}>
            Let&apos;s begin
          </GoldButton>
        </div>
      ) : null}

      {step === 1 ? (
        <div>
          <Typography variant="h2" className="text-[26px] font-bold tracking-tight text-ink-heading">
            Which goal matches you best?
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-2 mb-6 text-[15px]">
            Pick a starting category — you can explore others anytime.
          </Typography>
          <OnboardingCategoryPicker selected={selectedCat} onSelect={setSelectedCat} />
          <div className="mt-8 flex gap-3">
            <GoldButton variant="ghost-outline" onClick={() => setStep(0)}>
              Back
            </GoldButton>
            <GoldButton disabled={!selectedCat} onClick={() => setStep(2)}>
              Continue
            </GoldButton>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <Typography variant="h2" className="text-[26px] font-bold tracking-tight text-ink-heading">
            Here&apos;s how SFS works.
          </Typography>
          <div className="mt-6">
            <OnboardingHowItWorksList items={HOW_ITEMS} />
          </div>
          <div className="mt-8 flex gap-3">
            <GoldButton variant="ghost-outline" onClick={() => setStep(1)}>
              Back
            </GoldButton>
            <GoldButton
              className="flex-1"
              onClick={() => void finishOnboarding(selectedCat ?? undefined)}
            >
              Explore campaigns
              <ArrowRight className="size-4" />
            </GoldButton>
          </div>
        </div>
      ) : null}
    </OnboardingLayout>
  );
}
