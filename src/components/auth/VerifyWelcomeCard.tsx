import { Mail } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { useAuth } from "@/context/AuthContext";
import { ASSETS } from "@/utils/assets";

export function VerifyWelcomeCard() {
  const { user, verify } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex min-h-svh flex-col bg-[radial-gradient(ellipse_at_center,#eef2f8_0%,#e4e9f2_100%)] p-6">
      <img src={ASSETS.logo} alt="SFS" className="mb-6 h-9 w-auto self-start" />
      <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-[560px] overflow-hidden rounded-panel border border-line bg-white shadow-[0_30px_60px_-24px_rgba(12,31,68,0.4)]">
        <div className="relative overflow-hidden bg-gradient-navy-hero-card px-10 py-12 text-center">
          <img
            src={ASSETS.worldWhite}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-[-40px] w-[280px] -translate-y-1/2 opacity-[0.12]"
          />
          <div className="pointer-events-none absolute top-[-30%] right-[10%] size-[200px] animate-glow-pulse rounded-full bg-[radial-gradient(closest-side,rgba(207,159,52,0.2),transparent_72%)]" />
          <div className="relative mx-auto mb-5 flex size-[82px] items-center justify-center rounded-full bg-gradient-gold shadow-[0_16px_36px_-12px_rgba(207,159,52,0.5)]">
            <Mail className="size-9 text-navy" strokeWidth={1.8} />
          </div>
          <Typography variant="h2" className="relative text-[26px] font-bold text-white">
            Welcome to SFS, {firstName}.
          </Typography>
          <Typography variant="body" className="relative mt-2 text-[15px] text-white/75">
            One quick step before you dive in.
          </Typography>
        </div>
        <div className="px-10 py-9 text-center">
          <Typography variant="body" className="text-[15px] leading-relaxed text-muted-soft">
            We&apos;ve sent a verification link to{" "}
            <strong className="text-ink-heading">{user?.email}</strong>. Click the
            link in your email, then continue below.
          </Typography>
          <GoldButton size="auth" className="mt-6 w-full" onClick={() => void verify()}>
            I&apos;ve verified — let&apos;s go
          </GoldButton>
          <Typography variant="body-sm" color="muted" className="mt-4 text-[14px]">
            Didn&apos;t get it?{" "}
            <button type="button" className="font-semibold text-gold-dark">
              Resend email
            </button>
          </Typography>
        </div>
      </div>
      </div>
    </div>
  );
}
