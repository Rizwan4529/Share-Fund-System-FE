import { z } from "zod";

import { parseSettingValue } from "@/lib/settings/value";
import { SETTING_CATEGORIES, SETTING_DATA_TYPES } from "@/types/settings";

export const insertSettingFormSchema = z
  .object({
    key: z.string().min(1, "Key is required"),
    category: z.enum(SETTING_CATEGORIES, {
      error: "Category is required",
    }),
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

export type InsertSettingFormValues = z.infer<typeof insertSettingFormSchema>;
export type UpdateSettingFormValues = z.infer<typeof updateSettingFormSchema>;
