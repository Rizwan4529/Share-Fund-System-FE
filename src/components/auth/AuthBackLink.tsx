import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthBackLinkProps = {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export function AuthBackLink({
  to,
  onClick,
  children,
  className,
}: AuthBackLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1 text-[13px] font-semibold text-muted-soft transition-colors hover:text-ink-heading",
    className,
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        <ArrowLeft className="size-3.5" strokeWidth={2.2} />
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <ArrowLeft className="size-3.5" strokeWidth={2.2} />
      {children}
    </button>
  );
}
