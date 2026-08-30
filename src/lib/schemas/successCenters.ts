import { z } from "zod";

import {
  SUCCESS_CENTER_CATEGORY_STATUSES,
  SUCCESS_CENTER_GOAL_NATURES,
  SUCCESS_CENTER_PROGRAM_STATUSES,
  SUCCESS_CENTER_PROGRAM_TYPES,
} from "../../types/successCenters";

const optionalNumberString = z
  .string()
  .optional()
  .refine((value) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) return true;
    return Number.isFinite(Number(trimmed));
  }, "Must be a valid number");

export const successCenterCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens",
    ),
  description: z.string().optional(),
  programsIntroduction: z.string().optional(),
  order: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(SUCCESS_CENTER_CATEGORY_STATUSES),
});

export type SuccessCenterCategoryFormValues = z.infer<
  typeof successCenterCategoryFormSchema
>;

export const successCenterProgramFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  educationalContent: z.string().optional(),
  status: z.enum(SUCCESS_CENTER_PROGRAM_STATUSES),
  programType: z.enum(SUCCESS_CENTER_PROGRAM_TYPES),
  goalNature: z.enum(SUCCESS_CENTER_GOAL_NATURES),
  order: z.string().optional(),
  activationPercentageMin: optionalNumberString,
  activationPercentageMax: optionalNumberString,
  defaultActivationPercentage: optionalNumberString,
  growthPeriodDays: optionalNumberString,
  roundingIncrement: optionalNumberString,
  minGoalAmount: optionalNumberString,
  maxGoalAmount: optionalNumberString,
});

export type SuccessCenterProgramFormValues = z.infer<
  typeof successCenterProgramFormSchema
>;

export function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseOptionalNumber(
  value?: string,
): number | null | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function numberToInput(value?: number | null): string {
  if (value == null) return "";
  return String(value);
}
