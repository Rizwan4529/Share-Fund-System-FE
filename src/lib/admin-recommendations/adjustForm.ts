import { toDateInputValue } from "@/lib/activation/labels";
import {
  numberToInput,
  parseOptionalNumber,
} from "@/lib/schemas/successCenters";
import type {
  AdjustOptionFormValues,
  AdjustRecommendationFormValues,
} from "@/lib/schemas/adminRecommendations";
import type { OptionProjection } from "@/types/activation";
import type {
  AdjustableOptionKey,
  AdjustRecommendationRequest,
  AdminRecommendationDetail,
  OptionOverrides,
} from "@/types/adminRecommendations";

type EffectiveOptionLike = {
  totalActivationRequirement: number;
  scheduledPayment?: number;
  months?: number;
  growthPeriodDays?: number | null;
  projection?: OptionProjection;
  adjustedFields?: string[];
};

/** Each adjustable option of the effective result, keyed for the form. */
export function effectiveOptionsByKey(
  effective: AdminRecommendationDetail["effective"],
): [AdjustableOptionKey, EffectiveOptionLike][] {
  return [
    ...effective.options.map(
      (option) => [option.label, option] as [AdjustableOptionKey, EffectiveOptionLike],
    ),
    ["one_time", effective.oneTimeOption],
  ];
}

const toOptionFormValues = (option: EffectiveOptionLike): AdjustOptionFormValues => ({
  totalActivationRequirement: numberToInput(option.totalActivationRequirement),
  scheduledPayment: numberToInput(option.scheduledPayment),
  months: numberToInput(option.months),
  growthPeriodCompletionDate: toDateInputValue(option.projection?.growthPeriodCompletionDate),
  eligibilityDate: toDateInputValue(option.projection?.eligibilityDate),
  activationCompletionDate: toDateInputValue(option.projection?.activationCompletionDate),
  fundingEarliest: toDateInputValue(option.projection?.estimatedFundingRange?.earliest),
  fundingLatest: toDateInputValue(option.projection?.estimatedFundingRange?.latest),
});

/** Form starts from what's currently in effect. */
export function toAdjustFormValues(
  detail: AdminRecommendationDetail,
): AdjustRecommendationFormValues {
  return {
    reason: "",
    affordabilityStatus: detail.effective.affordabilityStatus,
    options: Object.fromEntries(
      effectiveOptionsByKey(detail.effective).map(([key, option]) => [
        key,
        toOptionFormValues(option),
      ]),
    ),
  };
}

/** Only fields that differ from the effective values; blank = unchanged. */
function optionChanges(
  values: AdjustOptionFormValues,
  current: AdjustOptionFormValues,
): OptionOverrides | null {
  const changes: OptionOverrides = {};
  const projection: NonNullable<OptionOverrides["projection"]> = {};
  const changed = (key: keyof AdjustOptionFormValues) =>
    values[key].trim() !== "" && values[key].trim() !== current[key];

  for (const key of ["totalActivationRequirement", "scheduledPayment", "months"] as const) {
    // Blank values never reach here, so the parse always yields a number.
    if (changed(key)) changes[key] = parseOptionalNumber(values[key]) ?? undefined;
  }
  for (const key of [
    "growthPeriodCompletionDate",
    "eligibilityDate",
    "activationCompletionDate",
  ] as const) {
    if (changed(key)) projection[key] = values[key];
  }
  if (changed("fundingEarliest") || changed("fundingLatest")) {
    projection.estimatedFundingRange = {
      ...(changed("fundingEarliest") && { earliest: values.fundingEarliest }),
      ...(changed("fundingLatest") && { latest: values.fundingLatest }),
    };
  }
  if (Object.keys(projection).length) changes.projection = projection;
  return Object.keys(changes).length ? changes : null;
}

/** Form values → adjust request, or null when nothing changed. */
export function toAdjustRequest(
  values: AdjustRecommendationFormValues,
  detail: AdminRecommendationDetail,
): AdjustRecommendationRequest | null {
  const current = toAdjustFormValues(detail);
  const options: AdjustRecommendationRequest["options"] = {};
  for (const [key] of effectiveOptionsByKey(detail.effective)) {
    const changes = optionChanges(values.options[key], current.options[key]);
    if (changes) options[key] = changes;
  }
  const affordabilityChanged = values.affordabilityStatus !== current.affordabilityStatus;
  if (!affordabilityChanged && !Object.keys(options).length) return null;

  return {
    reason: values.reason.trim(),
    ...(affordabilityChanged && { affordabilityStatus: values.affordabilityStatus }),
    ...(Object.keys(options).length && { options }),
  };
}
