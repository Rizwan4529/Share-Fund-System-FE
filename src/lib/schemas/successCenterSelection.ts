import { z } from "zod";

import {
  OBLIGATION_TYPES,
  PAYEE_TYPES,
  PRICING_SOURCES,
  type CreateSelectionRequest,
} from "@/types/successCenterSelections";

const isAmount = (value: string) =>
  Number.isFinite(Number(value)) && Number(value) >= 0;

/** Number inputs hold strings; empty means "not provided". */
const optionalAmount = z
  .string()
  .trim()
  .refine((value) => value === "" || isAmount(value), "Enter an amount of 0 or more");

export const activateProgramFormSchema = z
  .object({
    // `.length` (not `!== ""`) keeps the output type equal to the input type.
    obligationType: z
      .union([z.enum(OBLIGATION_TYPES), z.literal("")])
      .refine((value) => value.length > 0, "Choose an existing bill or a new goal"),
    goalAmount: optionalAmount,
    pricingSource: z.enum(PRICING_SOURCES),
    verifiedQuoteAmount: optionalAmount,
    payeeName: z.string().trim().max(120, "Keep this under 120 characters"),
    payeeType: z.union([z.enum(PAYEE_TYPES), z.literal("")]),
  })
  .superRefine((values, ctx) => {
    if (values.pricingSource === "verified" && values.verifiedQuoteAmount === "") {
      ctx.addIssue({
        code: "custom",
        path: ["verifiedQuoteAmount"],
        message: "Enter the verified quote amount",
      });
    }
  });

export type ActivateProgramFormValues = z.infer<typeof activateProgramFormSchema>;

export const ACTIVATE_PROGRAM_DEFAULTS: ActivateProgramFormValues = {
  obligationType: "",
  goalAmount: "",
  pricingSource: "estimated",
  verifiedQuoteAmount: "",
  payeeName: "",
  payeeType: "",
};

export function toCreateSelectionRequest(
  programId: string,
  values: ActivateProgramFormValues,
): CreateSelectionRequest {
  const verified = values.pricingSource === "verified";
  const payee = {
    ...(values.payeeName ? { name: values.payeeName } : {}),
    ...(values.payeeType ? { payeeType: values.payeeType } : {}),
  };

  return {
    programId,
    // Guaranteed non-empty by the schema refine above.
    obligationType: values.obligationType as CreateSelectionRequest["obligationType"],
    pricingSource: values.pricingSource,
    ...(values.goalAmount ? { goalAmount: Number(values.goalAmount) } : {}),
    // The API only accepts a quote amount alongside verified pricing.
    ...(verified ? { verifiedQuoteAmount: Number(values.verifiedQuoteAmount) } : {}),
    ...(Object.keys(payee).length ? { payee } : {}),
  };
}
