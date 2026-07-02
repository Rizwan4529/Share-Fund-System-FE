import { AlertTriangle } from "lucide-react";

import { authErrorClass } from "@/components/auth/authStyles";
import { Typography } from "@/components/common/Typography";

export function AuthErrorBanner({ message }: { message: string }) {
  return (
    <div className={authErrorClass}>
      <AlertTriangle className="size-4 shrink-0 text-error" />
      <Typography variant="body-sm" className="text-error">
        {message}
      </Typography>
    </div>
  );
}
