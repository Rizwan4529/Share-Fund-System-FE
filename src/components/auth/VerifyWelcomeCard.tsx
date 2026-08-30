import { useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { AuthBackLink } from "@/components/auth/AuthBackLink";
import {
  authFieldItemClass,
  authInputClass,
} from "@/components/auth/authStyles";
import { FormCommon, Input } from "@/components/common/FormCommon";
import { Typography } from "@/components/common/Typography";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { forgotEmailSchema } from "@/lib/schemas/auth";
import { useResendLinkMutation } from "@/store/api/authApi";
import { ASSETS } from "@/utils/assets";
import { ROUTES } from "@/utils/constants";

function emailFromState(state: unknown): string {
  if (state && typeof state === "object" && "email" in state) {
    const email = (state as { email?: unknown }).email;
    return typeof email === "string" ? email : "";
  }
  return "";
}

export function VerifyWelcomeCard() {
  const location = useLocation();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const initialEmail = emailFromState(location.state) || user?.email || "";
  const showEmailField = !initialEmail;
  const [resend, { isLoading: resending }] = useResendLinkMutation();

  const resendForm = useForm<{ email: string }>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: initialEmail },
  });

  const sendTo = showEmailField ? resendForm.watch("email") : initialEmail;

  const onResend = async (data?: { email: string }) => {
    const email = (data?.email ?? sendTo).trim();
    if (!email) {
      toast.error("Enter the email you used to register.");
      return;
    }
    try {
      await resend({ email }).unwrap();
      toast.success("Verification email resent. Check your inbox.");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not resend the verification email."),
      );
    }
  };

  return (
    <div className="relative flex min-h-svh flex-col bg-[radial-gradient(ellipse_at_center,#eef2f8_0%,#e4e9f2_100%)] p-6">
      <AuthBackLink
        to={ROUTES.LOGIN}
        className="absolute top-5 left-5 z-10 sm:top-8 sm:left-8"
      >
        Back
      </AuthBackLink>
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
            <Typography
              variant="h2"
              className="relative text-[26px] font-bold text-white"
            >
              Welcome to SFS, {firstName}.
            </Typography>
            <Typography
              variant="body"
              className="relative mt-2 text-[15px] text-white/75"
            >
              One quick step before you dive in.
            </Typography>
          </div>
          <div className="px-10 py-9 text-center">
            <Typography
              variant="body"
              className="text-[15px] leading-relaxed text-muted-soft"
            >
              We&apos;ve sent a verification link
              {sendTo ? (
                <>
                  {" "}
                  to <strong className="text-ink-heading">{sendTo}</strong>
                </>
              ) : null}
              . Open the email and click the link to confirm your address.
            </Typography>
            {showEmailField ? (
              <FormCommon
                form={resendForm}
                onSubmit={onResend}
                className="mt-5 text-left"
              >
                <Input
                  control={resendForm.control}
                  name="email"
                  label="Email"
                  type="email"
                  required
                  placeholder="Email used to register"
                  className={authInputClass}
                  itemClassName={authFieldItemClass}
                />
              </FormCommon>
            ) : null}
            <Typography
              variant="body-sm"
              color="muted"
              className="mt-6 text-[14px]"
            >
              Didn&apos;t get it?{" "}
              <button
                type="button"
                className="font-semibold text-gold-dark disabled:opacity-60"
                disabled={resending}
                onClick={() =>
                  showEmailField
                    ? void resendForm.handleSubmit(onResend)()
                    : void onResend()
                }
              >
                {resending ? "Sending…" : "Resend email"}
              </button>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
