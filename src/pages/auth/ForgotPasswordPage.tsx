import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, CheckCircle2, Inbox, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import {
  AuthBackLink,
  AuthStepIcon,
} from "@/components/auth";
import { authInputClass } from "@/components/auth/authStyles";
import { FormCommon, Input } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { sendResetEmail, resetPassword } from "@/lib/api/auth";
import { forgotEmailSchema, resetPasswordSchema } from "@/lib/schemas/auth";
import { ROUTES } from "@/utils/constants";

type Step = "email" | "sent" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<{ password: string; confirm: string }>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSendEmail = async (data: { email: string }) => {
    await sendResetEmail(data.email);
    setEmail(data.email);
    setStep("sent");
  };

  const onResend = async () => {
    setResending(true);
    try {
      await sendResetEmail(email);
      toast.success("Reset email resent (demo).");
    } finally {
      setResending(false);
    }
  };

  const onReset = async (data: { password: string }) => {
    await resetPassword(email, data.password);
    resetForm.reset();
    setStep("done");
  };

  return (
    <div>
      <AuthBackLink to={ROUTES.LOGIN}>Back to log in</AuthBackLink>

      {step === "email" ? (
        <>
          <AuthStepIcon variant="gold">
            <Mail className="size-6" strokeWidth={1.7} />
          </AuthStepIcon>
          <Typography variant="h3" className="text-[26px] font-bold text-ink-heading">
            Reset your password
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-1 mb-6 text-[15px]">
            Enter your email and we&apos;ll send a reset link.
          </Typography>
          <FormCommon form={emailForm} onSubmit={onSendEmail} className="space-y-4">
            <Input
              control={emailForm.control}
              name="email"
              label="Email"
              type="email"
              required
              className={authInputClass}
              itemClassName="gap-[7px] [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#33425f]"
            />
            <GoldButton type="submit" size="auth" className="w-full">
              Send reset link <ArrowRight className="size-4" />
            </GoldButton>
          </FormCommon>
        </>
      ) : null}

      {step === "sent" ? (
        <div className="text-center">
          <AuthStepIcon variant="green">
            <Inbox className="size-6" strokeWidth={1.7} />
          </AuthStepIcon>
          <Typography variant="h3" className="text-[26px] font-bold text-ink-heading">
            Check your inbox
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-2 mb-2 text-[15px]">
            We sent a reset link to <strong className="text-ink-heading">{email}</strong>.
          </Typography>
          <Typography variant="caption" color="muted" className="mb-6 block text-[13px]">
            The link expires in 30 minutes. Check spam if you don&apos;t see it.
          </Typography>
          <Button
            variant="ghost-outline"
            className="mb-3 h-[52px] w-full rounded-brand text-[15px] font-semibold"
            onClick={() => setStep("reset")}
          >
            Open reset screen (demo)
          </Button>
          <button
            type="button"
            className="text-[13px] font-semibold text-gold-dark disabled:opacity-60"
            disabled={resending}
            onClick={() => void onResend()}
          >
            {resending ? "Sending…" : "Resend email"}
          </button>
        </div>
      ) : null}

      {step === "reset" ? (
        <>
          <AuthStepIcon variant="neutral">
            <Lock className="size-6" strokeWidth={1.7} />
          </AuthStepIcon>
          <Typography variant="h3" className="text-[26px] font-bold text-ink-heading">
            Choose a new password
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-1 mb-6 text-[14px]">
            Use at least 8 characters with a mix of letters and numbers.
          </Typography>
          <FormCommon form={resetForm} onSubmit={onReset} className="space-y-4">
            <Input
              control={resetForm.control}
              name="password"
              label="New password"
              type="password"
              required
              className={authInputClass}
              itemClassName="gap-[7px] [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#33425f]"
            />
            <Input
              control={resetForm.control}
              name="confirm"
              label="Confirm password"
              type="password"
              required
              className={authInputClass}
              itemClassName="gap-[7px] [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#33425f]"
            />
            <GoldButton type="submit" size="auth" className="w-full">
              Update password
            </GoldButton>
          </FormCommon>
        </>
      ) : null}

      {step === "done" ? (
        <div className="text-center">
          <AuthStepIcon variant="green">
            <CheckCircle2 className="size-6" strokeWidth={1.7} />
          </AuthStepIcon>
          <Typography variant="h3" className="text-[26px] font-bold text-ink-heading">
            Password updated
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-2 mb-6 text-[15px]">
            Your password has been reset. You can sign in with your new credentials.
          </Typography>
          <GoldButton size="auth" className="w-full" asChild>
            <Link to={ROUTES.LOGIN}>
              Back to log in <ArrowRight className="size-4" />
            </Link>
          </GoldButton>
        </div>
      ) : null}
    </div>
  );
}
