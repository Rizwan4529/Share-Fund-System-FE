import { z } from "zod";

import { WAITLIST_STATUSES } from "../../types/waitlist";

const optionalNumberString = z
  .string()
  .optional()
  .refine((value) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) return true;
    return Number.isFinite(Number(trimmed));
  }, "Must be a valid number");

export const waitlistFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer"),
  email: z.string().email("Enter a valid email"),
  campaignCategory: z.string().min(1, "Campaign is required"),
  message: z.string().max(500, "Message must be 500 characters or fewer"),
  status: z.enum(WAITLIST_STATUSES, { error: "Status is required" }),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

export const waitlistCampaignCategoryFormSchema = z.object({
  label: z.string().min(1, "Label is required").max(120),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z][a-z0-9_]*$/,
      "Slug must start with a letter and use lowercase letters, numbers, and underscores",
    ),
  description: z.string().max(500).optional(),
  order: optionalNumberString,
  isActive: z.boolean(),
});

export type WaitlistCampaignCategoryFormValues = z.infer<
  typeof waitlistCampaignCategoryFormSchema
>;

export function slugFromWaitlistLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export function parseOptionalNumber(
  value?: string,
): number | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function numberToInput(value?: number | null): string {
  if (value == null) return "";
  return String(value);
}
