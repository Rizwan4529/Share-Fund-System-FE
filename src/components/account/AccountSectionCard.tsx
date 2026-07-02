import type { ReactNode } from "react";

import { AppSurfaceCard } from "@/components/member/app";

type AccountSectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AccountSectionCard({
  title,
  subtitle,
  children,
}: AccountSectionCardProps) {
  return (
    <AppSurfaceCard>
      <h2 className="font-display text-[22px] font-bold tracking-tight text-ink-heading">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-[14.5px] text-muted-soft">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </AppSurfaceCard>
  );
}

type AccountDangerCardProps = {
  title: string;
  description: string;
  action: ReactNode;
};

export function AccountDangerCard({ title, description, action }: AccountDangerCardProps) {
  return (
    <div className="rounded-panel border border-error/20 bg-error-bg/50 p-6">
      <h3 className="font-display text-[17px] font-bold text-ink-heading">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-soft">{description}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}
