import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthBackLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthBackLink({ to, children, className }: AuthBackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "mb-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-muted-soft",
        className,
      )}
    >
      <ArrowLeft className="size-[17px]" strokeWidth={2.2} />
      {children}
    </Link>
  );
}
