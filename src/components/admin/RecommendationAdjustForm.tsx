import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AdminSectionTitle } from "@/components/admin/AdminSectionTitle";
import {
  DatePicker,
  FormCommon,
  Input,
  Select,
  Textarea,
} from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import {
  effectiveOptionsByKey,
  toAdjustFormValues,
  toAdjustRequest,
} from "@/lib/admin-recommendations/adjustForm";
import {
  AFFORDABILITY_STATUS_OPTIONS,
  OPTION_KEY_LABELS,
} from "@/lib/admin-recommendations/labels";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  adjustRecommendationFormSchema,
  type AdjustOptionFormValues,
  type AdjustRecommendationFormValues,
} from "@/lib/schemas/adminRecommendations";
import { useAdjustRecommendationMutation } from "@/store/api/adminRecommendationsApi";
import type { AdminRecommendationDetail } from "@/types/adminRecommendations";

// Projected dates can sit years ahead (longer plans).
const DATE_YEARS_AHEAD = 10;

/**
 * Override figures/projections on top of the computed result. Starts from
 * the effective values; only changed fields are sent, and a reason is
 * required. The computed originals are kept by the server.
 */
export function RecommendationAdjustForm({
  detail,
  onDone,
}: {
  detail: AdminRecommendationDetail;
  onDone: () => void;
}) {
  const [adjust, adjustState] = useAdjustRecommendationMutation();
  const form = useForm<AdjustRecommendationFormValues>({
    resolver: zodResolver(adjustRecommendationFormSchema),
    defaultValues: toAdjustFormValues(detail),
  });

  const onSubmit = async (values: AdjustRecommendationFormValues) => {
    const request = toAdjustRequest(values, detail);
    if (!request) {
      toast.info("Nothing changed — edit a figure or date to adjust.");
      return;
    }
    try {
      await adjust({ id: detail._id, ...request }).unwrap();
      toast.success("Recommendation adjusted. The original figures are kept.");
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not adjust this recommendation."));
    }
  };

  return (
    <FormCommon form={form} onSubmit={onSubmit} className="space-y-6">
      <Typography variant="body-sm" color="muted" className="block">
        Change only what needs overriding. The participant will see these
        values; the computed originals stay on record and can be restored.
        Dates remain projections, not guarantees.
      </Typography>

      <Select
        control={form.control}
        name="affordabilityStatus"
        label="Affordability status"
        options={AFFORDABILITY_STATUS_OPTIONS}
      />

      {effectiveOptionsByKey(detail.effective).map(([key]) => {
        const paced = key !== "one_time";
        const field = <K extends keyof AdjustOptionFormValues>(name: K) =>
          `options.${key}.${name}` as const;
        return (
          <div key={key} className="space-y-3 border-t border-border pt-4">
            <AdminSectionTitle as="h3">{OPTION_KEY_LABELS[key]}</AdminSectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                control={form.control}
                name={field("totalActivationRequirement")}
                label="Activation amount"
                type="number"
                step="any"
              />
              {paced ? (
                <>
                  <Input
                    control={form.control}
                    name={field("scheduledPayment")}
                    label="Scheduled payment"
                    type="number"
                    step="any"
                  />
                  <Input
                    control={form.control}
                    name={field("months")}
                    label="Months"
                    type="number"
                  />
                </>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <DatePicker
                control={form.control}
                name={field("growthPeriodCompletionDate")}
                label="Growth period ends (projected)"
                calendarYearsFuture={DATE_YEARS_AHEAD}
              />
              <DatePicker
                control={form.control}
                name={field("eligibilityDate")}
                label="Eligibility (projected)"
                calendarYearsFuture={DATE_YEARS_AHEAD}
              />
              {paced ? (
                <DatePicker
                  control={form.control}
                  name={field("activationCompletionDate")}
                  label="Activation complete (projected)"
                  calendarYearsFuture={DATE_YEARS_AHEAD}
                />
              ) : null}
              <DatePicker
                control={form.control}
                name={field("fundingEarliest")}
                label="Funding window from (projected)"
                calendarYearsFuture={DATE_YEARS_AHEAD}
              />
              <DatePicker
                control={form.control}
                name={field("fundingLatest")}
                label="Funding window to (projected)"
                calendarYearsFuture={DATE_YEARS_AHEAD}
              />
            </div>
          </div>
        );
      })}

      <div className="border-t border-border pt-4">
        <Textarea
          control={form.control}
          name="reason"
          label="Reason for adjustment"
          required
          placeholder="e.g. Verified quote received; timeline aligned with lender approval."
          description="Recorded with the change in the audit log."
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onDone} disabled={adjustState.isLoading}>
          Cancel
        </Button>
        <GoldButton type="submit" disabled={adjustState.isLoading}>
          {adjustState.isLoading ? <ButtonSpinner /> : null}
          Save adjustment
        </GoldButton>
      </div>
    </FormCommon>
  );
}
