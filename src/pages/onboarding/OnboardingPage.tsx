import { useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  LayoutGrid,
  Sparkles,
  Wallet,
} from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { OnboardingHowItWorksList } from "@/components/onboarding/OnboardingHowItWorksList";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingRail } from "@/components/onboarding/OnboardingRail";
import { useAuth } from "@/context/AuthContext";

const STEPS = ["Welcome", "How Phase 1 works", "Next steps"];

const HOW_ITEMS = [
  {
    icon: ClipboardList,
    title: "Complete your BMIS profile & questionnaire",
    desc: "Short answers shape your planning projections.",
  },
  {
    icon: Wallet,
    title: "Enroll as a Founding Participant",
    desc: "Pay once for Success Center access ($50 / $100 / Founder Stack).",
  },
  {
    icon: LayoutGrid,
    title: "Choose Success Centers & review projections",
    desc: "Budgets and timelines are simulations — funding is not live yet.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
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
          <Typography
            variant="h2"
            className="text-[28px] font-bold tracking-tight text-ink-heading"
          >
            Welcome, {user?.name?.split(" ")[0] ?? "there"}.
          </Typography>
          <Typography
            variant="body"
            color="muted"
            className="mx-auto mt-3 max-w-md text-[15.5px] leading-relaxed"
          >
            You are joining the Founding Participant program on BMIS. Phase 1 is
            a planning and enrollment platform — live funding is not active.
          </Typography>
          <GoldButton size="app" className="mt-8" onClick={() => setStep(1)}>
            Let&apos;s begin
          </GoldButton>
        </div>
      ) : null}

      {step === 1 ? (
        <div>
          <Typography
            variant="h2"
            className="text-[26px] font-bold tracking-tight text-ink-heading"
          >
            How Phase 1 works
          </Typography>
          <Typography
            variant="body-sm"
            color="muted"
            className="mt-2 mb-6 text-[15px]"
          >
            Three steps to a working participant account.
          </Typography>
          <OnboardingHowItWorksList items={HOW_ITEMS} />
          <div className="mt-8 flex gap-3">
            <GoldButton variant="ghost-outline" onClick={() => setStep(0)}>
              Back
            </GoldButton>
            <GoldButton onClick={() => setStep(2)}>Continue</GoldButton>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="text-center">
          <Typography
            variant="h2"
            className="text-[26px] font-bold tracking-tight text-ink-heading"
          >
            Ready for your questionnaire
          </Typography>
          <Typography
            variant="body"
            color="muted"
            className="mx-auto mt-3 max-w-md text-[15.5px] leading-relaxed"
          >
            Next you will answer placeholder BMIS questions. Final question text
            and recommendation formulas will replace these when Todd provides
            them.
          </Typography>
          <GoldButton
            size="app"
            className="mt-8"
            onClick={() => void finishOnboarding()}
          >
            Continue to questionnaire
            <ArrowRight className="ml-2 size-4" />
          </GoldButton>
        </div>
      ) : null}
    </OnboardingLayout>
  );
}
