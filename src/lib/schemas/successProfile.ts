import { z } from "zod";

import { DISCRETIONARY_RULES } from "@/lib/success-profile/labels";
import {
  DISCRETIONARY_RULE_LABELS,
  SUCCESS_PROFILE_FINANCIAL_FIELDS,
  SUCCESS_PROFILE_TYPES,
  type SuccessProfileFinancials,
  type SuccessProfileRecord,
  type UpdateSuccessProfileRequest,
} from "@/types/successProfile";

/** Number inputs hold strings; empty means "not answered yet". */
const amountField = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter an amount of 0 or more",
  );

const answerField = z.string().max(2000, "Keep this under 2000 characters");

export const successProfileFormSchema = z.object({
  profileType: z
    .union([z.enum(SUCCESS_PROFILE_TYPES), z.literal("")])
    // `.length` (not `!== ""`) so TS doesn't infer a type predicate and make
    // the schema's output type differ from the form's input type.
    .refine((value) => value.length > 0, "Select who this profile is for"),
  employmentSource: z.string().max(200, "Keep this under 200 characters"),
  financials: z.object({
    netMonthlyIncome: amountField,
    essentialExpenses: amountField,
    monthlyDebt: amountField,
    currentSavings: amountField,
    emergencySavings: amountField,
    existingCommitments: amountField,
    comfortableMonthlyAmount: amountField,
  }),
  discretionaryRule: z
    .object({
      label: z.union([z.enum(DISCRETIONARY_RULE_LABELS), z.literal("")]),
      customPercentage: z.string().trim(),
    })
    .superRefine((rule, ctx) => {
      if (rule.label !== "custom") return;
      const value = Number(rule.customPercentage);
      if (rule.customPercentage === "" || !(value >= 0 && value <= 100)) {
        ctx.addIssue({
          code: "custom",
          path: ["customPercentage"],
          message: "Enter a percentage between 0 and 100",
        });
      }
    }),
  planningAnswers: z.object({
    desiredResult: answerField,
    whatIsBlocking: answerField,
    wouldReducingExpenseHelp: z.string(),
    wouldIncreasingIncomeHelp: z.string(),
    willingToConsiderLongerTimeline: z.string(),
    goalPriorities: answerField,
  }),
  accuracyConfirmed: z
    .boolean()
    .refine(Boolean, "Please confirm your information is accurate"),
});

export type SuccessProfileFormValues = z.infer<typeof successProfileFormSchema>;

const amountToInput = (value?: number) => (value ? String(value) : "");
const inputToAmount = (value: string) => (value === "" ? 0 : Number(value));

export function successProfileToFormValues(
  profile: SuccessProfileRecord | null | undefined,
): SuccessProfileFormValues {
  const financials = profile?.financials;
  const rule = profile?.discretionaryRule;
  const answers = profile?.planningAnswers;

  return {
    profileType: profile?.profileType ?? "",
    employmentSource: profile?.employmentSource ?? "",
    financials: {
      netMonthlyIncome: amountToInput(financials?.netMonthlyIncome),
      essentialExpenses: amountToInput(financials?.essentialExpenses),
      monthlyDebt: amountToInput(financials?.monthlyDebt),
      currentSavings: amountToInput(financials?.currentSavings),
      emergencySavings: amountToInput(financials?.emergencySavings),
      existingCommitments: amountToInput(financials?.existingCommitments),
      comfortableMonthlyAmount: amountToInput(
        financials?.comfortableMonthlyAmount,
      ),
    },
    discretionaryRule: {
      label: rule?.label ?? "",
      customPercentage:
        rule?.customPercentage == null ? "" : String(rule.customPercentage),
    },
    planningAnswers: {
      desiredResult: answers?.desiredResult ?? "",
      whatIsBlocking: answers?.whatIsBlocking ?? "",
      wouldReducingExpenseHelp: answers?.wouldReducingExpenseHelp ?? "",
      wouldIncreasingIncomeHelp: answers?.wouldIncreasingIncomeHelp ?? "",
      willingToConsiderLongerTimeline:
        answers?.willingToConsiderLongerTimeline ?? "",
      goalPriorities: answers?.goalPriorities ?? "",
    },
    accuracyConfirmed: profile?.accuracyConfirmed ?? false,
  };
}

/** Maps the whole form to an API body; callers pick the sections they save. */
export function formValuesToSuccessProfileRequest(
  values: SuccessProfileFormValues,
): UpdateSuccessProfileRequest {
  const financials = Object.fromEntries(
    SUCCESS_PROFILE_FINANCIAL_FIELDS.map((key) => [
      key,
      inputToAmount(values.financials[key]),
    ]),
  ) as SuccessProfileFinancials;

  const { label, customPercentage } = values.discretionaryRule;
  const selectedPercentage =
    label === "custom"
      ? Number(customPercentage)
      : label
        ? DISCRETIONARY_RULES[label].percentage
        : undefined;

  return {
    profileType: values.profileType || undefined,
    employmentSource: values.employmentSource.trim(),
    financials,
    discretionaryRule: label
      ? {
          label,
          selectedPercentage,
          ...(label === "custom"
            ? { customPercentage: Number(customPercentage) }
            : {}),
        }
      : undefined,
    planningAnswers: {
      ...values.planningAnswers,
      desiredResult: values.planningAnswers.desiredResult.trim(),
      whatIsBlocking: values.planningAnswers.whatIsBlocking.trim(),
      goalPriorities: values.planningAnswers.goalPriorities.trim(),
    },
  };
}
