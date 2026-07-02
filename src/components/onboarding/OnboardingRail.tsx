import { OnboardingStepDots } from "@/components/onboarding/OnboardingStepDots";
import { SectionLabel } from "@/components/member/app";
import { ASSETS } from "@/utils/assets";

type OnboardingRailProps = {
  steps: string[];
  current: number;
  onSkip: () => void;
};

export function OnboardingRail({ steps, current, onSkip }: OnboardingRailProps) {
  return (
    <aside className="hidden flex-col bg-gradient-navy-section px-10 py-10 lg:flex">
      <img src={ASSETS.logoLight} alt="SFS" className="h-[30px] w-auto self-start" />
      <div className="mt-10">
        <SectionLabel tone="light">Getting started</SectionLabel>
        <h2 className="mt-3 font-display text-[26px] font-bold leading-snug tracking-tight text-white">
          A few quick things and you&apos;re set.
        </h2>
      </div>
      <div className="mt-10 flex-1">
        <OnboardingStepDots steps={steps} current={current} />
      </div>
      <button
        type="button"
        className="text-left text-sm font-semibold text-white/70 transition-colors hover:text-white"
        onClick={onSkip}
      >
        Skip for now →
      </button>
    </aside>
  );
}
