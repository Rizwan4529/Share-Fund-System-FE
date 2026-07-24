import { useEffect, useState } from "react";
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
  const {
    register: registerSignup,
    formState: { errors: signupErrors },
  } = signupForm;

  useEffect(() => {
    setMode(location.pathname === ROUTES.SIGNUP ? "signup" : "login");
  }, [location.pathname]);

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
      <Typography
        variant="body-sm"
        color="muted"
        className="mt-1.5 mb-[26px] text-[15px]"
      >
        {mode === "login"
          ? "Log in to continue your Founding Participant account."
          : "Create a participant account to start BMIS planning."}
      </Typography>

      {error ? <AuthErrorBanner message={error} /> : null}

      {mode === "login" ? (
        <FormCommon
          form={loginForm}
          onSubmit={onLogin}
          className="flex flex-col gap-4"
        >
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
        <FormCommon
          form={signupForm}
          onSubmit={onSignup}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="signup-full-name"
              className="text-[13px] font-semibold text-[#33425f]"
            >
              Full name <span className="text-destructive">*</span>
            </label>
            <input
              id="signup-full-name"
              type="text"
              autoComplete="off"
              className={authInputClass}
              {...registerSignup("fullName")}
            />
            {signupErrors.fullName ? (
              <p className="text-sm text-destructive">
                {signupErrors.fullName.message}
              </p>
            ) : null}
          </div>
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
            Create account{" "}
            <ArrowRight className="size-[17px]" strokeWidth={2.3} />
          </GoldButton>
          <Typography
            variant="caption"
            className="text-center text-muted-foreground"
          >
            By creating an account you agree to the{" "}
            <Link to="/legal/terms" className="font-semibold underline">
              Terms
            </Link>
            ,{" "}
            <Link to="/legal/privacy" className="font-semibold underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              to="/legal/founding_disclosure"
              className="font-semibold underline"
            >
              Founding Participant disclosure
            </Link>
            .
          </Typography>
        </FormCommon>
      )}

      <AuthSocialButtons />
      <Typography
        variant="body-sm"
        color="muted"
        className="mt-[26px] text-center text-sm"
      >
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
