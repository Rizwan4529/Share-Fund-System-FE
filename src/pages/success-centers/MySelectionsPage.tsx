import { useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks } from "lucide-react";
import { toast } from "sonner";

import { DialogCommon } from "@/components/common/DialogCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  ParticipantPageHeader,
  StatusChip,
} from "@/components/member/app";
import { CategoryIconBadge } from "@/components/success-centers/SuccessCenterBadges";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatCurrency } from "@/lib/app/greeting";
import {
  OBLIGATION_TYPE_LABELS,
  PAYEE_TYPE_LABELS,
  PRICING_SOURCE_LABELS,
} from "@/lib/success-centers/labels";
import { useAppSelector } from "@/store/hooks";
import {
  useListMySelectionsQuery,
  useRemoveSelectionMutation,
} from "@/store/api/successCenterBrowseApi";
import type { SuccessCenterSelection } from "@/types/successCenterSelections";
import {
  ROUTES,
  activationPlanPath,
  successCenterProgramPath,
} from "@/utils/constants";

export default function MySelectionsPage() {
  const selectionsQuery = useListMySelectionsQuery();
  const [removeSelection, removeState] = useRemoveSelectionMutation();
  const [removing, setRemoving] = useState<SuccessCenterSelection | null>(null);
  const currency = useAppSelector((state) => state.auth.user?.preferredCurrency);
  const selections = selectionsQuery.data ?? [];

  const confirmRemove = async () => {
    if (!removing) return;
    try {
      await removeSelection(removing._id).unwrap();
      toast.success("Program removed from your selections.");
      setRemoving(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not remove this program."));
    }
  };

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Success Centers"
        title="My selections"
        subtitle="Programs you've activated. Removing one keeps its history — you can select it again later."
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.SUCCESS_CENTERS}>Browse Success Centers</Link>
          </GoldButton>
        }
      />

      {selectionsQuery.isLoading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      ) : selectionsQuery.isError ? (
        <EmptyState
          icon={ListChecks}
          variant="error"
          title="Could not load your selections"
          description={getApiErrorMessage(
            selectionsQuery.error,
            "Please try again in a moment.",
          )}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => void selectionsQuery.refetch()}
            >
              Try again
            </Button>
          }
        />
      ) : selections.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          variant="muted"
          title="You haven't selected any programs yet"
          description="Browse Success Centers and activate a program to see it here."
          action={
            <GoldButton asChild>
              <Link to={ROUTES.SUCCESS_CENTERS}>Browse Success Centers</Link>
            </GoldButton>
          }
        />
      ) : (
        <div className="space-y-3">
          {selections.map((selection) => (
            <SelectionCard
              key={selection._id}
              selection={selection}
              currency={currency}
              onRemove={() => setRemoving(selection)}
            />
          ))}
        </div>
      )}

      <DialogCommon
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open && !removeState.isLoading) setRemoving(null);
        }}
        title="Remove this program?"
        description={`${removing?.programId?.name ?? "This program"} will be removed from your selections. You can activate it again later.`}
        confirmLabel="Remove program"
        onConfirm={confirmRemove}
        confirmLoading={removeState.isLoading}
      />
    </AppPageContainer>
  );
}

function SelectionCard({
  selection,
  currency,
  onRemove,
}: {
  selection: SuccessCenterSelection;
  currency?: string;
  onRemove: () => void;
}) {
  const { programId: program, categoryId: category, payee } = selection;
  const payeeText = [
    payee?.name,
    payee?.payeeType ? PAYEE_TYPE_LABELS[payee.payeeType] : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  const details = [
    {
      label: "Goal amount",
      value:
        selection.goalAmount != null
          ? formatCurrency(selection.goalAmount, currency)
          : undefined,
    },
    {
      label: "Pricing",
      value:
        PRICING_SOURCE_LABELS[selection.pricingSource] +
        (selection.verifiedQuoteAmount != null
          ? ` · ${formatCurrency(selection.verifiedQuoteAmount, currency)}`
          : ""),
    },
    { label: "Payee", value: payeeText || undefined },
    {
      label: "Selected",
      value: new Date(selection.selectedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
  ];

  return (
    <AppSurfaceCard padding="md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <CategoryIconBadge icon={category?.icon} slug={category?.slug} />
          <div className="min-w-0">
            <Typography
              as="h2"
              variant="h6"
              className="font-display text-[16px] font-bold text-ink-heading"
            >
              {program?.name ?? "Program no longer available"}
            </Typography>
            <Typography variant="body-sm" className="text-muted-soft">
              {category?.name ?? "—"}
            </Typography>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusChip tone="success">
                {selection.status === "active" ? "Active" : "Removed"}
              </StatusChip>
              <StatusChip tone="navy">
                {OBLIGATION_TYPE_LABELS[selection.obligationType]}
              </StatusChip>
              {selection.activationStatus === "paid" ? (
                <StatusChip tone="gold">Activation paid</StatusChip>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <GoldButton asChild>
            <Link to={activationPlanPath(selection._id)}>View activation plan</Link>
          </GoldButton>
          {program ? (
            <GoldButton variant="ghost-outline" asChild>
              <Link to={successCenterProgramPath(program._id)}>View program</Link>
            </GoldButton>
          ) : null}
          <Button type="button" variant="destructive" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-4">
        {details.map((detail) => (
          <div key={detail.label}>
            <Typography as="dt" variant="caption" color="muted">
              {detail.label}
            </Typography>
            <Typography
              as="dd"
              variant="body-sm"
              className="font-semibold text-ink-heading"
            >
              {detail.value ?? "—"}
            </Typography>
          </div>
        ))}
      </dl>
    </AppSurfaceCard>
  );
}
