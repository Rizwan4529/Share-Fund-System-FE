import { z } from "zod";

import { parseSettingValue } from "@/lib/settings/value";
import { SETTING_DATA_TYPES } from "@/types/settings";

export const insertSettingFormSchema = z
  .object({
    key: z.string().min(1, "Key is required"),
    category: z.string().min(1, "Category is required"),
    dataType: z.enum(SETTING_DATA_TYPES, {
      error: "Data type is required",
    }),
    valueInput: z.string().min(1, "Value is required"),
    description: z.string().optional(),
    effectiveDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    try {
      parseSettingValue(data.valueInput, data.dataType);
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        path: ["valueInput"],
        message:
          error instanceof Error ? error.message : "Value is invalid",
      });
    }
  });

export const updateSettingFormSchema = z
  .object({
    dataType: z.enum(SETTING_DATA_TYPES),
    valueInput: z.string().min(1, "Value is required"),
    reason: z.string().optional(),
    effectiveDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    try {
      parseSettingValue(data.valueInput, data.dataType);
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        path: ["valueInput"],
        message:
          error instanceof Error ? error.message : "Value is invalid",
      });
    }
  });

const categorySlugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(
    /^[a-zA-Z][a-zA-Z0-9]*$/,
    "Slug must start with a letter and contain only letters and numbers",
  );

export const settingCategoryFormSchema = z.object({
  label: z.string().min(1, "Label is required"),
  slug: categorySlugSchema,
  description: z.string().optional(),
});

export type InsertSettingFormValues = z.infer<typeof insertSettingFormSchema>;
export type UpdateSettingFormValues = z.infer<typeof updateSettingFormSchema>;
export type SettingCategoryFormValues = z.infer<typeof settingCategoryFormSchema>;
