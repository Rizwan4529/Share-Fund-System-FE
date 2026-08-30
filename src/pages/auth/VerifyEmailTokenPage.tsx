import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useVerifyEmailMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { ROUTES } from "@/utils/constants";

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
    if (!token) {
      toast.error("This verification link is missing a token.");
      return;
    }
    void verify({ token })
      .unwrap()
      .then(() => {
        toast.success("Email verified successfully");
        dispatch(logout());
        navigate(ROUTES.LOGIN, { replace: true });
      })
      .catch((err) => {
        toast.error(
          getApiErrorMessage(
            err,
            "Invalid or expired token. Request a new verification email.",
          ),
        );
      });
  }, [dispatch, navigate, token, verify]);

  if (!token) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-app-canvas p-6">
        <EmptyState
          icon={CircleAlert}
          variant="error"
          size="page"
          title="Verification failed"
          description="This verification link is missing a token."
          action={
            <GoldButton size="auth" asChild>
              <Link to={ROUTES.LOGIN}>Back to log in</Link>
            </GoldButton>
          }
        />
      </div>
    );
  }

  if (isLoading || (!isError && !isSuccess)) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-app-canvas p-6">
        <EmptyState
          icon={CircleAlert}
          variant="error"
          size="page"
          title="Verification failed"
          description={getApiErrorMessage(
            error,
            "Invalid or expired token. Request a new verification email.",
          )}
          action={
            <GoldButton size="auth" asChild>
              <Link to={ROUTES.LOGIN}>Back to log in</Link>
            </GoldButton>
          }
        />
      </div>
    );
  }

  return <LoadingScreen />;
}
