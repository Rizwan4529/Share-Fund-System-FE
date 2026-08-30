import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";

import {
  AuthCountryCombobox,
  AuthErrorBanner,
  AuthFieldLabel,
  AuthFormBack,
  AuthPasswordField,
  AuthPhoneField,
  AuthSocialButtons,
  SignupLegalStep,
} from "@/components/auth";
import {
  authFieldItemClass,
  authInputClass,
} from "@/components/auth/authStyles";
import { FormCommon, Input, Checkbox } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { postLoginPath } from "@/lib/auth/sessionUser";
import {
  loginSchema,
  signupSchema,
  type LoginFormValues,
  type SignupFormValues,
} from "@/lib/schemas/auth";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation, useRegisterMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { stripAuthToken } from "@/types/auth";
import type { CountryOption } from "@/utils/countries";
import { ROUTES } from "@/utils/constants";

type Mode = "login" | "signup";

export default function LoginSignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mode: Mode = location.pathname === ROUTES.SIGNUP ? "signup" : "login";
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [phoneSyncCountry, setPhoneSyncCountry] =
    useState<CountryOption | null>(null);
  const [login, loginState] = useLoginMutation();
  const [registerUser, registerState] = useRegisterMutation();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      country: "",
      acceptTerms: false,
      acceptPrivacy: false,
      acceptFounding: false,
    },
  });

  const busy = loginState.isLoading || registerState.isLoading;

  const onLogin = async (data: LoginFormValues) => {
    setError("");
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(
        setCredentials({
          user: stripAuthToken(result),
          token: result.token,
          remember: Boolean(data.remember),
        }),
      );
      navigate(postLoginPath(result), { replace: true });
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Invalid email or password. Please try again."),
      );
    }
  };

  const onSignupDetails = async () => {
    setError("");
    const valid = await signupForm.trigger([
      "firstName",
      "lastName",
      "email",
      "password",
      "phone",
      "country",
    ]);
    if (valid) setSignupStep(2);
  };

  const goSignupDetails = useCallback(() => setSignupStep(1), []);

  const switchMode = (next: Mode) => {
    setSignupStep(1);
    setError("");
    navigate(next === "signup" ? ROUTES.SIGNUP : ROUTES.LOGIN, {
      replace: true,
    });
  };

  const onSignup = async (data: SignupFormValues) => {
    if (signupStep === 1) {
      await onSignupDetails();
      return;
    }
    setError("");
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        country: data.country,
      }).unwrap();
      navigate(ROUTES.VERIFY, { state: { email: data.email } });
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Could not create account. Please try again."),
      );
    }
  };

  return (
    <div>
      {mode === "signup" ? (
        <AuthFormBack
          to={signupStep === 1 ? ROUTES.LOGIN : undefined}
          onClick={signupStep === 2 ? goSignupDetails : undefined}
        />
      ) : null}

      <Typography
        variant="h3"
        className="text-[27px] font-bold tracking-[-0.6px] text-ink-heading"
      >
        {mode === "login"
          ? "Welcome back"
          : signupStep === 1
            ? "Create your account"
            : "Review and accept"}
      </Typography>
      <Typography
        variant="body-sm"
        color="muted"
        className="mt-1.5 mb-[26px] text-[15px]"
      >
        {mode === "login"
          ? "Log in to continue your Founding Participant account."
          : signupStep === 1
            ? "Create a participant account to start BMIS planning."
            : "Review the documents below and accept them to finish signup."}
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
            itemClassName={authFieldItemClass}
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
              required
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
          <GoldButton
            type="submit"
            size="auth"
            className="mt-1 w-full"
            disabled={busy}
          >
            {loginState.isLoading ? <ButtonSpinner /> : null}
            Log in <ArrowRight className="size-[17px]" strokeWidth={2.3} />
          </GoldButton>
        </FormCommon>
      ) : (
        <FormCommon
          form={signupForm}
          onSubmit={onSignup}
          className="flex flex-col gap-4"
        >
          {signupStep === 1 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  control={signupForm.control}
                  name="firstName"
                  label="First name"
                  required
                  className={authInputClass}
                  itemClassName={authFieldItemClass}
                />
                <Input
                  control={signupForm.control}
                  name="lastName"
                  label="Last name"
                  required
                  className={authInputClass}
                  itemClassName={authFieldItemClass}
                />
              </div>
              <Input
                control={signupForm.control}
                name="email"
                label="Email"
                type="email"
                required
                className={authInputClass}
                itemClassName={authFieldItemClass}
              />
              <AuthCountryCombobox
                control={signupForm.control}
                name="country"
                required
                itemClassName={authFieldItemClass}
                onCountrySelected={setPhoneSyncCountry}
              />
              <AuthPhoneField
                control={signupForm.control}
                name="phone"
                countryFieldName="country"
                required
                itemClassName={authFieldItemClass}
                syncCountry={phoneSyncCountry}
              />
              <AuthPasswordField
                control={signupForm.control}
                name="password"
                required
                showStrength
                showToggle
                showPw={showPw}
                onToggle={() => setShowPw(!showPw)}
              />
              <GoldButton
                type="button"
                size="auth"
                className="mt-1 w-full"
                onClick={() => void onSignupDetails()}
              >
                Continue{" "}
                <ArrowRight className="size-[17px]" strokeWidth={2.3} />
              </GoldButton>
            </>
          ) : (
            <>
              <SignupLegalStep control={signupForm.control} />
              <GoldButton
                type="submit"
                size="auth"
                className="mt-1 w-full"
                disabled={busy}
              >
                {registerState.isLoading ? <ButtonSpinner /> : null}
                Create account{" "}
                <ArrowRight className="size-[17px]" strokeWidth={2.3} />
              </GoldButton>
            </>
          )}
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
          onClick={() => switchMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </Typography>
    </div>
  );
}
