import type { ReactNode } from "react";

import { authStepIconClass } from "@/components/auth/authStyles";
import { cn } from "@/lib/utils";

type AuthStepIconProps = {
  children: ReactNode;
  variant?: "gold" | "green" | "neutral";
};

const variants = {
  gold: "border-border-gold bg-bg-gold text-gold-dark",
  green: "border-[#cbe8d4] bg-success-bg text-success",
  neutral: "border-line bg-bg-alt text-muted-soft",
};

export function AuthStepIcon({ children, variant = "gold" }: AuthStepIconProps) {
  return (
    <div className={cn(authStepIconClass, variants[variant])}>{children}</div>
  );
}
