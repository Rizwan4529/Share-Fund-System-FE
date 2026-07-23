import { useEffect, useState } from "react";

import {
  AdminPageContainer,
  AdminPageHeader,
  AdminSegmentedControl,
  AdminSurfaceCard,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { fetchAdminAudit } from "@/lib/api/admin";
import type { AuditEvent } from "@/types";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "platform", label: "Platform" },
  { id: "audit", label: "Audit log" },
];

const AUDIT_TONE: Record<string, string> = {
  ok: "bg-[#1f7a55]",
  warn: "bg-[#9a6a15]",
  danger: "bg-error",
};

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("audit");
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  useEffect(() => {
    void fetchAdminAudit().then(setAudit);
  }, []);

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Settings"
        subtitle="Platform notes and the Phase 1 audit trail (mock)."
      />
      <AdminSegmentedControl
        className="mb-4 w-full"
        options={TABS}
        value={tab}
        onChange={setTab}
      />

      {tab === "platform" ? (
        <AdminSurfaceCard className="p-5">
          <Typography variant="h3">Platform</Typography>
          <Typography variant="body" className="mt-2 text-muted-foreground">
            Pricing, rules, Success Centers, and disclosures are managed from
            their dedicated admin pages. This Phase 1 build uses local mock
            storage (`sfs-phase1-store`). Real JWT/Mongo/Stripe come with the
            backend.
          </Typography>
        </AdminSurfaceCard>
      ) : (
        <AdminSurfaceCard className="p-0">
          <div className="border-b border-line px-5 py-4">
            <Typography variant="label" className="font-display text-base font-bold">
              Audit log
            </Typography>
          </div>
          <ul className="divide-y divide-line">
            {audit.length === 0 ? (
              <li className="px-5 py-6 text-sm text-muted-foreground">
                No audit events yet.
              </li>
            ) : (
              audit.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-start gap-3 px-5 py-3.5 text-sm"
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      AUDIT_TONE[entry.tone] ?? AUDIT_TONE.ok,
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-ink-heading">
                      {entry.action}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.actor} · {entry.time}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </AdminSurfaceCard>
      )}
    </AdminPageContainer>
  );
}
