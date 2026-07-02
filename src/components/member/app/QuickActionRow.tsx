import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type QuickActionRowProps = {
  to: string;
  label: string;
  icon: ReactNode;
};

export function QuickActionRow({ to, label, icon }: QuickActionRowProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border border-line/80 bg-input-bg px-3.5 py-3.5",
        "text-[14.5px] font-semibold text-[#33425f] transition-colors",
        "hover:border-border-input hover:bg-bg-alt",
      )}
    >
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-lg border border-border-gold bg-bg-icon text-gold-dark">
        {icon}
      </span>
      {label}
      <ChevronRight className="ml-auto size-4 text-[#c3cede]" strokeWidth={2.2} />
    </Link>
  );
}
