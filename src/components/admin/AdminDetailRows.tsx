import type { ReactNode } from "react";

import { AdminSectionTitle } from "@/components/admin/AdminSectionTitle";
import { Typography } from "@/components/common/Typography";

/** Titled group of label/value rows for admin detail drawers. */
export function AdminDetailSection({
  title,
  columns = 2,
  children,
}: {
  title: string;
  columns?: 1 | 2;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <AdminSectionTitle as="h3">{title}</AdminSectionTitle>
      <div className={columns === 2 ? "grid gap-2 sm:grid-cols-2" : "grid gap-2"}>
        {children}
      </div>
    </div>
  );
}

export function AdminDetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2.5">
      <Typography variant="caption" color="muted" className="block font-medium">
        {label}
      </Typography>
      <Typography
        variant="body-sm"
        className="mt-0.5 font-semibold break-words whitespace-pre-line text-ink-heading"
      >
        {value?.trim() ? value : "—"}
      </Typography>
    </div>
  );
}
