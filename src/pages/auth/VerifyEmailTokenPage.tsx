import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";

import {
  authFieldItemClass,
  authInputClass,
} from "@/components/auth/authStyles";
import { EmptyState } from "@/components/common/EmptyState";
import { FormCommon, Input } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { forgotEmailSchema } from "@/lib/schemas/auth";
import { useResendLinkMutation, useVerifyEmailMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { ROUTES } from "@/utils/constants";

const FALLBACK_ERROR = "This verification link isn't valid. Request a new one below.";

function tokenFromParam(raw: string | undefined): string {
  if (!raw) return "";
  return decodeURIComponent(raw).replace(/\/+$/, "");
}

export default function VerifyEmailTokenPage() {
  const { token: rawToken } = useParams();
  const token = tokenFromParam(rawToken);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [verify, { isError, error, isSuccess, isLoading }] =
    useVerifyEmailMutation();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    if (!token) return;
    void verify({ token })
      .unwrap()
      .then((result) => {
        toast.success(
          result?.alreadyVerified
            ? "Your email is already verified. You can log in."
            : "Email verified successfully. Please log in.",
        );
        dispatch(logout());
        navigate(ROUTES.LOGIN, { replace: true });
      })
      .catch(() => {
        // The failure card below explains what happened and offers a new link.
      });
  }, [dispatch, navigate, token, verify]);

  if (token && (isLoading || (!isError && !isSuccess))) {
    return <LoadingScreen />;
  }

  if (!token || isError) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-app-canvas p-6">
        <EmptyState
          icon={CircleAlert}
          variant="error"
          size="page"
          title="We couldn't verify your email"
          description={
            token
              ? getApiErrorMessage(error, FALLBACK_ERROR)
              : "This verification link is incomplete. Request a new one below."
          }
          action={<ResendLinkForm />}
        />
      </div>
    );
  }

  return <LoadingScreen />;
}

/** Request a fresh link right from the failure page. */
function ResendLinkForm() {
  const [resend, { isLoading, isSuccess }] = useResendLinkMutation();
  const form = useForm<{ email: string }>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await resend({ email: email.trim() }).unwrap();
      toast.success("If your email still needs verifying, a new link is on its way.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not send a new link. Please try again."));
    }
  };

  return (
    <div className="w-[320px] max-w-full space-y-3 text-left">
      <FormCommon form={form} onSubmit={onSubmit} className="space-y-3">
        <Input
          control={form.control}
          name="email"
          label="Email used to register"
          type="email"
          required
          className={authInputClass}
          itemClassName={authFieldItemClass}
        />
        <GoldButton type="submit" size="auth" className="w-full" disabled={isLoading}>
          {isLoading ? <ButtonSpinner /> : null}
          {isSuccess ? "Send another link" : "Send me a new link"}
        </GoldButton>
      </FormCommon>
      <div className="text-center">
        <Link to={ROUTES.LOGIN} className="text-sm font-semibold text-gold-dark">
          Back to log in
        </Link>
      </div>
    </div>
  );
}
