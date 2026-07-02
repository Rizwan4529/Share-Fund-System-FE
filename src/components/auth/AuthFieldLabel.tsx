import type { ReactNode } from "react";

import { authLabelClass } from "@/components/auth/authStyles";
import { cn } from "@/lib/utils";

type AuthFieldLabelProps = {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function AuthFieldLabel({ children, action, className }: AuthFieldLabelProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <label className={authLabelClass}>{children}</label>
      {action}
    </div>
  );
}
