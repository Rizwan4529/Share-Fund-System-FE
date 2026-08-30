import { Lock } from "lucide-react";

import { AuthFormBack, AuthStepIcon } from "@/components/auth";
import { Typography } from "@/components/common/Typography";
import { ROUTES } from "@/utils/constants";

export default function ForgotPasswordPage() {
  return (
    <div>
      <AuthFormBack to={ROUTES.LOGIN}>Back to log in</AuthFormBack>
      <AuthStepIcon variant="neutral">
        <Lock className="size-6" strokeWidth={1.7} />
      </AuthStepIcon>
      <Typography variant="h3" className="text-[26px] font-bold text-ink-heading">
        Password reset unavailable
      </Typography>
      <Typography
        variant="body-sm"
        color="muted"
        className="mt-1 mb-6 text-[15px]"
      >
        Password reset is not available yet. If you cannot access your account,
        contact support or try signing in again.
      </Typography>
    </div>
  );
}
