import { useState } from "react";
import { Check, ClipboardCheck, History, RotateCcw, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import {
  AdminDetailRow,
  AdminDetailSection,
} from "@/components/admin/AdminDetailRows";
import { AdminSectionTitle } from "@/components/admin/AdminSectionTitle";
import { AdminStatusPill } from "@/components/admin/AdminStatusPill";
import { RecommendationAdjustForm } from "@/components/admin/RecommendationAdjustForm";
import { DialogCommon } from "@/components/common/DialogCommon";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import {
  PROJECTION_FALLBACK_NOTICE,
  PROJECTION_UNAVAILABLE,
  formatProjectionDate,
} from "@/lib/activation/labels";
import { effectiveOptionsByKey } from "@/lib/admin-recommendations/adjustForm";
import {
  ADMIN_PROJECTION_BASIS_LABELS,
  AFFORDABILITY_STATUS_LABELS,
  INPUT_FIGURE_LABELS,
  OPTION_KEY_LABELS,
  RULE_LABELS,
  adjustmentFieldLabel,
  isDateField,
} from "@/lib/admin-recommendations/labels";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatCurrency } from "@/lib/app/greeting";
import { cn } from "@/lib/utils";
import {
  useApproveRecommendationMutation,
  useGetAdminRecommendationQuery,
  useResetRecommendationMutation,
} from "@/store/api/adminRecommendationsApi";
import type { AffordabilityStatus, OptionProjection } from "@/types/activation";
import type {
  AdjustableOptionKey,
  AdminRecommendationDetail,
  AdminRecommendationRow,
} from "@/types/adminRecommendations";

const DEFAULT_CURRENCY = "USD";

/** Review one recommendation: figures, labeled projections, and admin actions. */
export function RecommendationReviewDrawer({
  open,
  onOpenChange,
  recommendation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: Pick<AdminRecommendationRow, "_id" | "participant" | "programName"> | null;
}) {
  const query = useGetAdminRecommendationQuery(recommendation?._id ?? "", {
    skip: !open || !recommendation,
  });
  const detail = query.currentData;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={recommendation?.participant.name || "Recommendation"}
      description={[recommendation?.programName, recommendation?.participant.email]
        .filter(Boolean)
        .join(" · ")}
      className="md:max-w-3xl"
    >
      {query.isError ? (
        <EmptyState
          icon={ClipboardCheck}
          variant="error"
          size="compact"
          title="Could not load this recommendation"
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
        // Keyed so edit mode and forms reset when another row is opened.
        <ReviewBody key={detail._id} detail={detail} />
      )}
    </DrawerCommon>
  );
}

function ReviewBody({ detail }: { detail: AdminRecommendationDetail }) {
  const [mode, setMode] = useState<"view" | "adjust">("view");
  const [confirmReset, setConfirmReset] = useState(false);
  const [approve, approveState] = useApproveRecommendationMutation();
  const [reset, resetState] = useResetRecommendationMutation();
  const currency = detail.participant?.preferredCurrency || DEFAULT_CURRENCY;
  const approved = detail.reviewStatus === "approved";

  const onApprove = async () => {
    try {
      await approve(detail._id).unwrap();
      toast.success(
        detail.adminAdjusted
          ? "Recommendation approved with your adjustments."
          : "Recommendation approved.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not approve this recommendation."));
    }
  };

  const onReset = async () => {
    try {
      await reset({ id: detail._id }).unwrap();
      toast.success("Overrides removed. The computed figures are back in effect.");
      setConfirmReset(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not reset the overrides."));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <AdminStatusPill status={detail.reviewStatus} />
            {/* e.g. "Approved" + "Adjusted" when approved with overrides. */}
            {detail.adminAdjusted && detail.reviewStatus !== "adjusted" ? (
              <AdminStatusPill status="adjusted" />
            ) : null}
          </div>
          {approved && detail.approvedAt ? (
            <Typography variant="caption" color="muted" className="block">
              Approved {formatDateTime(detail.approvedAt)}
              {detail.approvedBy ? ` by ${personName(detail.approvedBy)}` : ""}
            </Typography>
          ) : null}
        </div>
        {mode === "view" ? (
          <div className="flex flex-wrap gap-2">
            {detail.overrides.length ? (
              <Button type="button" variant="ghost" onClick={() => setConfirmReset(true)}>
                <RotateCcw />
                Reset overrides
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={() => setMode("adjust")}>
              <SlidersHorizontal />
              Adjust
            </Button>
            <GoldButton
              type="button"
              size="sm"
              disabled={approved || approveState.isLoading}
              onClick={() => void onApprove()}
            >
              {approveState.isLoading ? <ButtonSpinner /> : <Check />}
              {approved ? "Approved" : "Approve"}
            </GoldButton>
          </div>
        ) : null}
      </div>

      {mode === "adjust" ? (
        <RecommendationAdjustForm detail={detail} onDone={() => setMode("view")} />
      ) : (
        <ReviewDetails detail={detail} currency={currency} />
      )}

      <DialogCommon
        open={confirmReset}
        onOpenChange={(next) => {
          if (!next && !resetState.isLoading) setConfirmReset(false);
        }}
        title="Reset overrides?"
        description="All admin overrides are removed and the computed figures go back into effect. The recommendation returns to pending review. This is recorded in the audit log."
        confirmLabel="Reset overrides"
        confirmLoading={resetState.isLoading}
        onConfirm={() => void onReset()}
      />
    </div>
  );
}

function ReviewDetails({
  detail,
  currency,
}: {
  detail: AdminRecommendationDetail;
  currency: string;
}) {
  const { computed, effective, selection } = detail;
  const projection = computed.projection;
  const affordabilityOverridden = effective.affordabilityStatus !== computed.affordabilityStatus;
  const computedByKey = new Map(effectiveOptionsByKey(computed));

  return (
    <div className="space-y-6">
      <AdminDetailSection title="Program">
        <AdminDetailRow label="Program" value={selection?.programId?.name} />
        <AdminDetailRow label="Category" value={selection?.categoryId?.name} />
        <AdminDetailRow
          label="Goal amount"
          value={
            selection?.goalAmount != null ? formatCurrency(selection.goalAmount, currency) : undefined
          }
        />
        <AdminDetailRow
          label="Pricing"
          value={
            selection?.pricingSource === "verified" && selection.verifiedQuoteAmount != null
              ? `Verified quote · ${formatCurrency(selection.verifiedQuoteAmount, currency)}`
              : "Estimated"
          }
        />
        <AdminDetailRow label="Last updated" value={formatDateTime(detail.updatedAt)} />
        <AdminDetailRow
          label="Selection"
          value={selection?.status === "removed" ? "Removed by participant" : "Active"}
        />
      </AdminDetailSection>

      <div className="space-y-3">
        <AdminSectionTitle as="h3">Affordability</AdminSectionTitle>
        <ComparedValue
          value={AFFORDABILITY_STATUS_LABELS[effective.affordabilityStatus]}
          original={
            affordabilityOverridden
              ? AFFORDABILITY_STATUS_LABELS[computed.affordabilityStatus]
              : undefined
          }
        />
        {computed.suggestedAlternatives.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {computed.suggestedAlternatives.map((text) => (
              <li key={text}>
                <Typography variant="caption" color="muted">
                  {text}
                </Typography>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="space-y-3">
        <AdminSectionTitle as="h3">Activation options</AdminSectionTitle>
        <div className="rounded-lg border border-gold/35 bg-bg-gold px-3 py-2.5">
          <Typography variant="caption" className="block text-ink-heading">
            {projection?.notice ?? PROJECTION_FALLBACK_NOTICE}
            {projection?.status === "projected"
              ? ` ${ADMIN_PROJECTION_BASIS_LABELS[projection.basis]} ${formatProjectionDate(projection.basisDate)}.`
              : null}
          </Typography>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {effectiveOptionsByKey(effective).map(([key, option]) => (
            <OptionReviewCard
              key={key}
              optionKey={key}
              effective={option}
              computed={computedByKey.get(key)}
              adjustedFields={option.adjustedFields ?? []}
              currency={currency}
            />
          ))}
        </div>
      </div>

      {detail.inputSnapshot ? (
        <AdminDetailSection title="Input figures used">
          {Object.entries(INPUT_FIGURE_LABELS).map(([key, label]) => (
            <AdminDetailRow
              key={key}
              label={label}
              value={
                detail.inputSnapshot?.[key] != null
                  ? formatCurrency(detail.inputSnapshot[key], currency)
                  : undefined
              }
            />
          ))}
        </AdminDetailSection>
      ) : null}

      <RulesUsed detail={detail} />
      <AdjustmentHistory detail={detail} currency={currency} />
    </div>
  );
}

type OptionLike = ReturnType<typeof effectiveOptionsByKey>[number][1];

function OptionReviewCard({
  optionKey,
  effective,
  computed,
  adjustedFields,
  currency,
}: {
  optionKey: AdjustableOptionKey;
  effective: OptionLike;
  computed?: OptionLike;
  adjustedFields: string[];
  currency: string;
}) {
  const paced = optionKey !== "one_time";
  const adjusted = (path: string) => adjustedFields.includes(path);
  const money = (value?: number) => (value != null ? formatCurrency(value, currency) : undefined);
  const range = (p?: OptionProjection) =>
    p?.estimatedFundingRange
      ? `${formatProjectionDate(p.estimatedFundingRange.earliest)} – ${formatProjectionDate(p.estimatedFundingRange.latest)}`
      : undefined;
  const p = effective.projection;
  const cp = computed?.projection;
  const projected = p?.status === "projected";

  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border bg-background px-3 py-3",
        adjustedFields.length ? "border-gold/50" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Typography variant="label" className="text-ink-heading">
          {OPTION_KEY_LABELS[optionKey]}
        </Typography>
        {adjustedFields.length ? <AdminStatusPill status="adjusted" /> : null}
      </div>
      <FigureRow
        label="Activation amount"
        value={money(effective.totalActivationRequirement)}
        original={adjusted("totalActivationRequirement") ? money(computed?.totalActivationRequirement) : undefined}
      />
      {paced ? (
        <>
          <FigureRow
            label="Scheduled payment"
            value={money(effective.scheduledPayment)}
            original={adjusted("scheduledPayment") ? money(computed?.scheduledPayment) : undefined}
          />
          <FigureRow
            label="Months"
            value={effective.months != null ? String(effective.months) : undefined}
            original={adjusted("months") ? String(computed?.months ?? "—") : undefined}
          />
          <FigureRow
            label="Growth period"
            value={effective.growthPeriodDays != null ? `${effective.growthPeriodDays} days` : undefined}
          />
        </>
      ) : null}

      <div className="mt-2 space-y-2 border-t border-border pt-2">
        <div className="flex items-center justify-between gap-2">
          <Typography variant="overline" className="text-gold-deep">
            Projected timeline
          </Typography>
          <AdminStatusPill status="estimate" />
        </div>
        {projected ? (
          <>
            <FigureRow
              label="Growth period ends"
              value={formatProjectionDate(p?.growthPeriodCompletionDate)}
              original={
                adjusted("projection.growthPeriodCompletionDate")
                  ? formatProjectionDate(cp?.growthPeriodCompletionDate)
                  : undefined
              }
            />
            <FigureRow
              label="Eligibility"
              value={formatProjectionDate(p?.eligibilityDate)}
              original={
                adjusted("projection.eligibilityDate")
                  ? formatProjectionDate(cp?.eligibilityDate)
                  : undefined
              }
            />
            {paced ? (
              <FigureRow
                label="Activation complete"
                value={formatProjectionDate(p?.activationCompletionDate)}
                original={
                  adjusted("projection.activationCompletionDate")
                    ? formatProjectionDate(cp?.activationCompletionDate)
                    : undefined
                }
              />
            ) : null}
            <FigureRow
              label="Est. funding window"
              value={range(p)}
              original={
                adjusted("projection.estimatedFundingRange.earliest") ||
                adjusted("projection.estimatedFundingRange.latest")
                  ? (range(cp) ?? "—")
                  : undefined
              }
            />
          </>
        ) : (
          <Typography variant="caption" color="muted" className="block">
            {PROJECTION_UNAVAILABLE}
          </Typography>
        )}
      </div>
    </div>
  );
}

/** Effective value, with the computed original struck through when overridden. */
function FigureRow({ label, value, original }: { label: string; value?: string; original?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <Typography variant="caption" color="muted">
        {label}
      </Typography>
      <ComparedValue value={value} original={original} compact />
    </div>
  );
}

function ComparedValue({
  value,
  original,
  compact = false,
}: {
  value?: string;
  original?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex flex-wrap items-baseline gap-2",
        // In a label/value row the value sits right; standalone it reads left.
        compact && "justify-end text-right",
      )}
    >
      {original !== undefined ? (
        <Typography as="span" variant="caption" color="muted" className="line-through">
          {original}
        </Typography>
      ) : null}
      <Typography
        as="span"
        variant={compact ? "caption" : "body-sm"}
        className={cn("font-semibold", original !== undefined ? "text-gold-deep" : "text-ink-heading")}
      >
        {value ?? "—"}
      </Typography>
    </span>
  );
}

function RulesUsed({ detail }: { detail: AdminRecommendationDetail }) {
  const rules = Object.entries(detail.rulesVersionUsed?.resolvedRules ?? {}).filter(
    ([, rule]) => rule && rule.value != null,
  );
  if (!rules.length) return null;
  return (
    <AdminDetailSection title="Rules used">
      {rules.map(([name, rule]) => (
        <AdminDetailRow
          key={name}
          label={`${RULE_LABELS[name] ?? name} · ${rule?.source === "program" ? "program" : "setting"}`}
          value={Array.isArray(rule?.value) ? rule.value.join(", ") : String(rule?.value)}
        />
      ))}
    </AdminDetailSection>
  );
}

function AdjustmentHistory({
  detail,
  currency,
}: {
  detail: AdminRecommendationDetail;
  currency: string;
}) {
  return (
    <div className="space-y-3">
      <AdminSectionTitle as="h3">Adjustment history</AdminSectionTitle>
      {detail.adjustments.length === 0 ? (
        <EmptyState
          icon={History}
          variant="muted"
          size="compact"
          title="No admin adjustments yet."
        />
      ) : (
        <ul className="space-y-2">
          {detail.adjustments.map((entry, index) => (
            <li
              key={`${entry.field}-${entry.adjustedAt}-${index}`}
              className="rounded-lg border border-border bg-background px-3 py-2.5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Typography variant="label" className="text-ink-heading">
                  {adjustmentFieldLabel(entry.field)}
                </Typography>
                <Typography variant="caption" color="muted">
                  {formatDateTime(entry.adjustedAt)}
                  {entry.adjustedBy ? ` · ${personName(entry.adjustedBy)}` : ""}
                </Typography>
              </div>
              <Typography variant="body-sm" className="mt-1 block text-ink-heading">
                {formatAdjustmentValue(entry.field, entry.previousValue, currency)} →{" "}
                {formatAdjustmentValue(entry.field, entry.newValue, currency)}
                <Typography as="span" variant="caption" color="muted">
                  {" "}
                  (computed: {formatAdjustmentValue(entry.field, entry.originalValue, currency)})
                </Typography>
              </Typography>
              {entry.reason ? (
                <Typography variant="caption" color="muted" className="mt-1 block">
                  Reason: {entry.reason}
                </Typography>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatAdjustmentValue(field: string, value: unknown, currency: string): string {
  if (value == null || value === "") return "—";
  if (field === "affordabilityStatus")
    return AFFORDABILITY_STATUS_LABELS[value as AffordabilityStatus] ?? String(value);
  if (isDateField(field)) return formatProjectionDate(String(value));
  if (field.endsWith(".months")) return String(value);
  return typeof value === "number" ? formatCurrency(value, currency) : String(value);
}

function personName(person: { firstName?: string; lastName?: string; email?: string }) {
  return `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim() || person.email || "an admin";
}

function formatDateTime(value?: string): string {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
