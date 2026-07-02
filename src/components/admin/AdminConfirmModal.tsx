import { Ban, Check, Gift } from "lucide-react";

import { AdminGhostButton, AdminGoldButton } from "@/components/admin/AdminGhostButton";
import { Typography } from "@/components/common/Typography";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AdminModalKind =
  | "suspend"
  | "reactivate"
  | "bulkSuspend"
  | "adjust";

type AdminConfirmModalProps = {
  open: boolean;
  kind: AdminModalKind | null;
  name?: string;
  count?: number;
  onClose: () => void;
  onConfirm: () => void;
};

function getModalContent(kind: AdminModalKind, name?: string, count = 0) {
  switch (kind) {
    case "suspend":
      return {
        title: `Suspend ${name}?`,
        body: "They will lose access to the platform until reactivated. Their campaigns and credits are preserved. This action is logged in the audit trail.",
        confirmLabel: "Suspend member",
        danger: true,
        icon: Ban,
        iconClass: "bg-error-bg text-error",
      };
    case "reactivate":
      return {
        title: `Reactivate ${name}?`,
        body: "Access will be restored immediately. The member will be able to sign in and resume their campaigns.",
        confirmLabel: "Reactivate",
        danger: false,
        icon: Check,
        iconClass: "bg-success-bg text-[#1f7a55]",
      };
    case "bulkSuspend":
      return {
        title: `Suspend ${count} members?`,
        body: "The selected members will lose access until reactivated. All data is preserved and the action is logged.",
        confirmLabel: `Suspend ${count} members`,
        danger: true,
        icon: Ban,
        iconClass: "bg-error-bg text-error",
      };
    case "adjust":
      return {
        title: "Adjust credit balance",
        body: "Enter a positive or negative amount. Adjustments are recorded in the ledger and require audit sign-off.",
        confirmLabel: "Apply adjustment",
        danger: false,
        icon: Gift,
        iconClass: "bg-bg-icon text-[#8a6413]",
        hasInput: true,
      };
    default:
      return null;
  }
}

export function AdminConfirmModal({
  open,
  kind,
  name,
  count,
  onClose,
  onConfirm,
}: AdminConfirmModalProps) {
  if (!open || !kind) return null;
  const content = getModalContent(kind, name, count);
  if (!content) return null;
  const Icon = content.icon;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(9,18,42,0.5)] p-6 backdrop-blur-[3px]">
      <button type="button" className="absolute inset-0" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-full max-w-[420px] animate-fade-up overflow-hidden rounded-xl bg-white shadow-[0_40px_90px_-30px_rgba(9,18,42,0.6)]">
        <div className="px-[26px] pt-[26px] pb-[22px]">
          <span
            className={cn(
              "flex size-11 items-center justify-center rounded-[11px]",
              content.iconClass,
            )}
          >
            <Icon className="size-[22px]" />
          </span>
          <Typography variant="h5" className="mt-4 font-display text-[19px] font-bold text-ink-heading">
            {content.title}
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-2 leading-relaxed">
            {content.body}
          </Typography>
          {content.hasInput ? (
            <Input
              placeholder="e.g. +100 or −50"
              className="mt-4 h-[42px] rounded-md border-border-input bg-input-bg"
            />
          ) : null}
        </div>
        <div className="flex gap-2.5 border-t border-line bg-bg-card px-[26px] py-4">
          <AdminGhostButton className="h-[42px] flex-1" onClick={onClose}>
            Cancel
          </AdminGhostButton>
          {content.danger ? (
            <button
              type="button"
              onClick={onConfirm}
              className="h-[42px] flex-1 rounded-md border-none bg-[#b4453a] text-sm font-bold text-white"
            >
              {content.confirmLabel}
            </button>
          ) : (
            <AdminGoldButton className="h-[42px] flex-1" onClick={onConfirm}>
              {content.confirmLabel}
            </AdminGoldButton>
          )}
        </div>
      </div>
    </div>
  );
}
