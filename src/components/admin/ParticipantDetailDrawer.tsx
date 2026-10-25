import { ClipboardList, LayoutGrid, UserRoundX } from "lucide-react";

import {
  AdminDetailRow,
  AdminDetailSection,
} from "@/components/admin/AdminDetailRows";
import { AdminSectionTitle } from "@/components/admin/AdminSectionTitle";
import { AdminStatusPill } from "@/components/admin/AdminStatusPill";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatCurrency } from "@/lib/app/greeting";
import {
  DISCRETIONARY_RULES,
  FINANCIAL_FIELDS,
  PLANNING_CHOICE_QUESTIONS,
  PLANNING_TEXT_QUESTIONS,
  PROFILE_TYPE_LABELS,
  planningChoiceLabel,
} from "@/lib/success-profile/labels";
import { useGetAdminParticipantQuery } from "@/store/api/adminParticipantsApi";
import type {
  AdminParticipantDetail,
  AdminParticipantRow,
} from "@/types/adminParticipants";
import type { SuccessProfileRecord } from "@/types/successProfile";

const DEFAULT_CURRENCY = "USD";

type ParticipantDetailDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The list row — gives the header a name/email while the detail loads. */
  participant: Pick<AdminParticipantRow, "_id" | "name" | "email"> | null;
};

/** Read-only view of a participant and their Success Profile. */
export function ParticipantDetailDrawer({
  open,
  onOpenChange,
  participant,
}: ParticipantDetailDrawerProps) {
  const query = useGetAdminParticipantQuery(participant?._id ?? "", {
    skip: !open || !participant,
  });
  // currentData is only ever this participant's — never a previous row's.
  const detail = query.currentData;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={participant?.name ?? "Participant"}
      description={participant?.email}
      className="md:max-w-xl"
      footer={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      }
    >
      {query.isError ? (
        <EmptyState
          icon={UserRoundX}
          variant="error"
          size="compact"
          title="Could not load this participant"
          description={getApiErrorMessage(query.error, "Please try again.")}
          action={
            <Button type="button" variant="outline" onClick={query.refetch}>
              Try again
            </Button>
          }
        />
      ) : !detail ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <ParticipantDetailBody detail={detail} />
      )}
    </DrawerCommon>
  );
}

function ParticipantDetailBody({ detail }: { detail: AdminParticipantDetail }) {
  const { participant, successProfile, selections, centers } = detail;
  const currency = participant.preferredCurrency || DEFAULT_CURRENCY;
  const location = [participant.stateRegion, participant.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <AdminStatusPill status={participant.accountStatus} />
        <Typography variant="body-sm" className="font-semibold text-ink-heading">
          {participant.statusLabel}
        </Typography>
      </div>

      <AdminDetailSection title="Participant">
        <AdminDetailRow label="Founder status" value={participant.statusLabel} />
        <AdminDetailRow label="Centers" value={centers.label} />
        <AdminDetailRow label="Phone" value={participant.phone} />
        <AdminDetailRow label="Location" value={location} />
        <AdminDetailRow label="Preferred currency" value={participant.preferredCurrency} />
        <AdminDetailRow label="Joined" value={formatDate(participant.createdAt)} />
        <AdminDetailRow label="Last active" value={formatDate(participant.lastActiveAt)} />
      </AdminDetailSection>

      {successProfile ? (
        <SuccessProfileSections profile={successProfile} currency={currency} />
      ) : (
        <div className="space-y-3">
          <AdminSectionTitle as="h3">Success Profile</AdminSectionTitle>
          <EmptyState
            icon={ClipboardList}
            variant="muted"
            size="compact"
            title="This participant has not started their Success Profile."
          />
        </div>
      )}

      <div className="space-y-3">
        <AdminSectionTitle as="h3">Selected Success Centers</AdminSectionTitle>
        {selections.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            variant="muted"
            size="compact"
            title="No Success Centers selected yet."
          />
        ) : (
          <ul className="space-y-2">
            {selections.map((selection) => (
              <li
                key={selection._id}
                className="rounded-lg border border-border bg-background px-3 py-2.5"
              >
                <Typography variant="label" className="text-ink-heading">
                  {selection.programId?.name ?? "Unknown program"}
                </Typography>
                <Typography variant="caption" color="muted" className="mt-1 block">
                  {selection.categoryId?.name ?? "Unknown category"}
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SuccessProfileSections({
  profile,
  currency,
}: {
  profile: SuccessProfileRecord;
  currency: string;
}) {
  const rule = profile.discretionaryRule;
  const answers = profile.planningAnswers;

  return (
    <>
      <AdminDetailSection title="Success Profile">
        <AdminDetailRow
          label="Profile type"
          value={PROFILE_TYPE_LABELS[profile.profileType]}
        />
        <AdminDetailRow label="Completion" value={`${profile.completionPercentage}%`} />
        <AdminDetailRow
          label="Status"
          value={profile.status === "complete" ? "Complete" : "Incomplete"}
        />
        <AdminDetailRow
          label="Accuracy confirmed"
          value={profile.accuracyConfirmed ? "Yes" : "No"}
        />
        <AdminDetailRow label="Primary income source" value={profile.employmentSource} />
      </AdminDetailSection>

      <AdminDetailSection title="Financials">
        {FINANCIAL_FIELDS.map((field) => (
          <AdminDetailRow
            key={field.key}
            label={field.label}
            value={formatCurrency(profile.financials?.[field.key] ?? 0, currency)}
          />
        ))}
      </AdminDetailSection>

      <AdminDetailSection title="Discretionary rule">
        <AdminDetailRow
          label="Rule"
          value={rule?.label ? DISCRETIONARY_RULES[rule.label].label : undefined}
        />
        <AdminDetailRow
          label="Percentage"
          value={
            rule?.selectedPercentage != null
              ? `${rule.selectedPercentage}%`
              : undefined
          }
        />
      </AdminDetailSection>

      <AdminDetailSection title="Planning answers" columns={1}>
        {PLANNING_TEXT_QUESTIONS.map((question) => (
          <AdminDetailRow
            key={question.key}
            label={question.label}
            value={answers?.[question.key]}
          />
        ))}
        {PLANNING_CHOICE_QUESTIONS.map((question) => (
          <AdminDetailRow
            key={question.key}
            label={question.label}
            value={planningChoiceLabel(answers?.[question.key])}
          />
        ))}
      </AdminDetailSection>
    </>
  );
}

function formatDate(value?: string): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
