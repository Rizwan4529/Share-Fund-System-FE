import { z } from "zod";

import {
  FOUNDER_PLAN_BMIS_LEVELS,
  FOUNDER_PLAN_NAMES,
  FOUNDER_PLAN_PRIORITY_LEVELS,
  FOUNDER_PLAN_STATUSES,
} from "@/types/founderPlans";

const optionalCap = z
  .string()
  .optional()
  .refine((value) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) return true;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) && parsed >= 0;
  }, "Cap must be a number that is 0 or greater");

export const founderPlanFormSchema = z.object({
  name: z.enum(FOUNDER_PLAN_NAMES, { error: "Plan name is required" }),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      "Price cannot be negative",
    ),
  includedSuccessCenters: z
    .array(z.string().min(1))
    .min(1, "At least one included program is required"),
  eligiblePrograms: z.array(z.string()).optional(),
  fundingCapStandard: optionalCap,
  fundingCapPremium: optionalCap,
  majorOneTimeProgramsEligible: z.boolean(),
  priorityLevel: z.enum(FOUNDER_PLAN_PRIORITY_LEVELS),
  bmisPlanningLevel: z.enum(FOUNDER_PLAN_BMIS_LEVELS),
  founderBenefitsVersion: z.string().optional(),
  status: z.enum(FOUNDER_PLAN_STATUSES),
});

export type FounderPlanFormValues = z.infer<typeof founderPlanFormSchema>;

export function parseOptionalCap(value?: string): number | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  return Number(trimmed);
}
