import { useForm } from "react-hook-form";
import { UserCog } from "lucide-react";
import { toast } from "sonner";

import { DrawerCommon } from "@/components/common/DrawerCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { Checkbox, FormCommon, Select } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  useGetAdminParticipantQuery,
  useUpdateParticipantAccessMutation,
} from "@/store/api/adminParticipantsApi";
import {
  FOUNDER_TIERS,
  type AdminParticipantDetail,
  type AdminParticipantRow,
  type FounderTier,
  type PlanningAccessStatus,
} from "@/types/adminParticipants";

type AccessFormValues = {
  founderTier: FounderTier;
  foundingParticipant: boolean;
  planningAccessStatus: PlanningAccessStatus;
};

const TIER_LABELS: Record<FounderTier, string> = {
  none: "None",
  essential_100: "Essential",
  expanded_500: "Expanded",
  premium_1000: "Premium",
};

const TIER_OPTIONS = FOUNDER_TIERS.map((tier) => ({ value: tier, label: TIER_LABELS[tier] }));

const PLANNING_OPTIONS: { value: PlanningAccessStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Not active" },
];

/** Manually adjust a participant's founder / planning access (audited). */
export function ParticipantAccessDrawer({
  open,
  onOpenChange,
  participant,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Pick<AdminParticipantRow, "_id" | "name" | "email"> | null;
}) {
  const query = useGetAdminParticipantQuery(participant?._id ?? "", {
    skip: !open || !participant,
  });
  const detail = query.currentData;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={`Update access${participant ? ` — ${participant.name}` : ""}`}
      description="Changes take effect immediately and are recorded in the audit log."
    >
      {query.isError ? (
        <EmptyState
          icon={UserCog}
          variant="error"
          size="compact"
          title="Could not load this participant"
          description={getApiErrorMessage(query.error, "Please try again.")}
        />
      ) : !detail ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        // Keyed by participant so the form starts from their current values.
        <AccessForm
          key={detail.participant._id}
          detail={detail}
          onDone={() => onOpenChange(false)}
        />
      )}
    </DrawerCommon>
  );
}

function AccessForm({
  detail,
  onDone,
}: {
  detail: AdminParticipantDetail;
  onDone: () => void;
}) {
  const [updateAccess, updateState] = useUpdateParticipantAccessMutation();
  const current = detail.participant;
  const form = useForm<AccessFormValues>({
    defaultValues: {
      founderTier: (FOUNDER_TIERS as readonly string[]).includes(current.founderTier)
        ? (current.founderTier as FounderTier)
        : "none",
      foundingParticipant: current.foundingParticipant,
      planningAccessStatus: current.planningAccessStatus ?? "inactive",
    },
  });

  const onSubmit = async (values: AccessFormValues) => {
    try {
      const result = await updateAccess({ userId: current._id, ...values }).unwrap();
      toast.success(`Access updated — ${result.statusLabel}.`);
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update access."));
    }
  };

  return (
    <FormCommon form={form} onSubmit={onSubmit} className="space-y-5">
      <Select
        control={form.control}
        name="founderTier"
        label="Founder tier"
        options={TIER_OPTIONS}
        description="Does not assign a founder number — that runs with founder qualification later."
      />
      <Checkbox
        control={form.control}
        name="foundingParticipant"
        label="Founding Participant"
      />
      <Select
        control={form.control}
        name="planningAccessStatus"
        label="Planning access"
        options={PLANNING_OPTIONS}
      />
      <Typography variant="caption" color="muted" className="block">
        Use this for manual corrections. Paid access is normally set automatically
        when a payment is confirmed.
      </Typography>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onDone} disabled={updateState.isLoading}>
          Cancel
        </Button>
        <GoldButton type="submit" disabled={updateState.isLoading}>
          {updateState.isLoading ? <ButtonSpinner /> : null}
          Save access
        </GoldButton>
      </div>
    </FormCommon>
  );
}
