import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

type MemberNavLinkProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

export function MemberNavLink({ to, label, icon }: MemberNavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex w-full items-center gap-3 rounded-lg border-none px-3.5 py-3 text-[15px] transition-all",
          isActive
            ? "bg-gold/13 font-bold text-gold-chip shadow-[inset_3px_0_0_#e8c25a]"
            : "font-medium text-white/72 hover:bg-white/5 hover:text-white",
        )
      }
    >
      <span className="shrink-0 [&_svg]:size-5">{icon}</span>
      {label}
    </NavLink>
  );
}
