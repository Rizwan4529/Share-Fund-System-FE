import { z } from "zod";

import type { AffordabilityStatus } from "@/types/activation";

const AFFORDABILITY_STATUSES = [
  "eligible",
  "eligible_with_adjustment",
  "build_savings_first",
  "increase_income_first",
  "not_currently_eligible",
] as const satisfies readonly AffordabilityStatus[];

const isBlank = (value: string) => !value.trim();

// Blank = leave as is. Number inputs are held as strings in form state.
const amountString = z
  .string()
  .refine(
    (value) => isBlank(value) || (Number.isFinite(Number(value)) && Number(value) > 0),
    "Must be greater than 0",
  );

const monthsString = z
  .string()
  .refine(
    (value) =>
      isBlank(value) ||
      (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 1200),
    "Use a whole number of months",
  );

// "YYYY-MM-DD" from DatePicker, or "".
const dateString = z.string();

const optionFormSchema = z
  .object({
    totalActivationRequirement: amountString,
    scheduledPayment: amountString,
    months: monthsString,
    growthPeriodCompletionDate: dateString,
    eligibilityDate: dateString,
    activationCompletionDate: dateString,
    fundingEarliest: dateString,
    fundingLatest: dateString,
  })
  .superRefine((value, ctx) => {
    // ISO dates compare correctly as strings.
    if (value.fundingEarliest && value.fundingLatest && value.fundingEarliest > value.fundingLatest)
      ctx.addIssue({
        code: "custom",
        path: ["fundingLatest"],
        message: "Must be on or after the window start",
      });
    if (
      value.growthPeriodCompletionDate &&
      value.eligibilityDate &&
      value.eligibilityDate < value.growthPeriodCompletionDate
    )
      ctx.addIssue({
        code: "custom",
        path: ["eligibilityDate"],
        message: "Can't be before the growth period ends",
      });
  });

export const adjustRecommendationFormSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Enter a reason for this adjustment")
    .max(1000, "Keep the reason under 1000 characters"),
  affordabilityStatus: z.enum(AFFORDABILITY_STATUSES),
  options: z.record(z.string(), optionFormSchema),
});

export type AdjustOptionFormValues = z.infer<typeof optionFormSchema>;
export type AdjustRecommendationFormValues = z.infer<
  typeof adjustRecommendationFormSchema
>;
