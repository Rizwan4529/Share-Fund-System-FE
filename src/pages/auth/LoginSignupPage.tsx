import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";

import {
  AuthErrorBanner,
  AuthFieldLabel,
  AuthPasswordField,
  AuthSocialButtons,
  AuthTabSwitcher,
} from "@/components/auth";
import { authInputClass } from "@/components/auth/authStyles";
import { FormCommon, Input, Checkbox } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { useAuth } from "@/context/AuthContext";
import {
  loginSchema,
  signupSchema,
  type LoginFormValues,
  type SignupFormValues,
} from "@/lib/schemas/auth";
import { ROUTES } from "@/utils/constants";

type Mode = "login" | "signup";

export default function LoginSignupPage() {
  const location = useLocation();
  const [mode, setMode] = useState<Mode>(
    location.pathname === ROUTES.SIGNUP ? "signup" : "login",
  );
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const watchedFullName = useWatch({
    control: signupForm.control,
    name: "fullName",
  });

  useEffect(() => {
    if (mode !== "signup") return;
    // #region agent log
    fetch("http://127.0.0.1:7907/ingest/227e1692-4ea7-4e34-8def-aa35903da88f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "70cf5c",
      },
      body: JSON.stringify({
        sessionId: "70cf5c",
        runId: "pre-fix",
        hypothesisId: "B,E",
        location: "LoginSignupPage.tsx:useEffect",
        message: "signup fullName state changed",
        data: { mode, watchedFullName },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [mode, watchedFullName]);

  const onLogin = async (data: LoginFormValues) => {
    setError("");
    try {
      await login(data.email, data.password);
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  const onSignup = async (data: SignupFormValues) => {
    setError("");
    try {
      await signup(data.fullName, data.email, data.password);
    } catch {
      setError("Could not create account. Please try again.");
    }
  };

  return (
    <div>
      <AuthTabSwitcher mode={mode} onChange={setMode} />

      <Typography
        variant="h3"
        className="text-[27px] font-bold tracking-[-0.6px] text-ink-heading"
      >
        {mode === "login" ? "Welcome back" : "Create your account"}
      </Typography>
      <Typography variant="body-sm" color="muted" className="mt-1.5 mb-[26px] text-[15px]">
        {mode === "login"
          ? "Log in to continue toward your funding goal."
          : "Free to join. Start in under a minute."}
      </Typography>

      {error ? <AuthErrorBanner message={error} /> : null}

      {mode === "login" ? (
        <FormCommon form={loginForm} onSubmit={onLogin} className="flex flex-col gap-4">
          <Input
            control={loginForm.control}
            name="email"
            label="Email"
            type="email"
            required
            className={authInputClass}
            itemClassName="gap-[7px] [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#33425f]"
          />
          <div className="flex flex-col gap-[7px]">
            <AuthFieldLabel
              action={
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-[12.5px] font-semibold text-gold-dark"
                >
                  Forgot?
                </Link>
              }
            >
              Password
            </AuthFieldLabel>
            <AuthPasswordField
              control={loginForm.control}
              name="password"
              showLabel={false}
              showToggle
              showPw={showPw}
              onToggle={() => setShowPw(!showPw)}
            />
          </div>
          <Checkbox
            control={loginForm.control}
            name="remember"
            label="Remember me for 30 days"
          />
          <GoldButton type="submit" size="auth" className="mt-1 w-full">
            Log in <ArrowRight className="size-[17px]" strokeWidth={2.3} />
          </GoldButton>
        </FormCommon>
      ) : (
        <FormCommon form={signupForm} onSubmit={onSignup} className="flex flex-col gap-4">
          <Input
            control={signupForm.control}
            name="fullName"
            label="Full name"
            type="text"
            autoComplete="name"
            required
            className={authInputClass}
            itemClassName="gap-[7px] [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#33425f]"
          />
          <Input
            control={signupForm.control}
            name="email"
            label="Email"
            type="email"
            required
            className={authInputClass}
            itemClassName="gap-[7px] [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#33425f]"
          />
          <AuthPasswordField
            control={signupForm.control}
            name="password"
            showStrength
            showToggle
            showPw={showPw}
            onToggle={() => setShowPw(!showPw)}
          />
          <GoldButton type="submit" size="auth" className="mt-1 w-full">
            Create account <ArrowRight className="size-[17px]" strokeWidth={2.3} />
          </GoldButton>
        </FormCommon>
      )}

      <AuthSocialButtons />
      <Typography variant="body-sm" color="muted" className="mt-[26px] text-center text-sm">
        {mode === "login" ? "New to SFS?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="font-bold text-gold-dark"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </Typography>
    </div>
  );
}
