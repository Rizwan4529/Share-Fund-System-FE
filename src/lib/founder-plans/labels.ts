import type {
  FounderPlan,
  FounderPlanBmisLevel,
  FounderPlanName,
  FounderPlanPriorityLevel,
  FounderPlanProgramRef,
} from "@/types/founderPlans";

export const FOUNDER_PLAN_NAME_LABELS: Record<FounderPlanName, string> = {
  essential_100: "Essential $100",
  expanded_500: "Expanded $500",
  premium_1000: "Premium $1,000",
};

export function founderPlanNameLabel(name: FounderPlanName): string {
  return FOUNDER_PLAN_NAME_LABELS[name] ?? name;
}

export function titleCase(value?: string): string {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function founderPlanPriorityLabel(
  value?: FounderPlanPriorityLevel,
): string {
  return titleCase(value);
}

export function founderPlanBmisLabel(value?: FounderPlanBmisLevel): string {
  return titleCase(value);
}

export function programIds(
  value: Array<string | FounderPlanProgramRef> | undefined,
): string[] {
  if (!value) return [];
  return value.map((item) => (typeof item === "string" ? item : item._id));
}

export function programNames(
  value: Array<string | FounderPlanProgramRef> | undefined,
): string {
  if (!value?.length) return "—";
  return value
    .map((item) => (typeof item === "string" ? item : item.name))
    .join(", ");
}

export function includedProgramCount(plan: FounderPlan): number {
  return plan.includedSuccessCenters?.length ?? 0;
}

export function formatFundingCap(value?: number | null): string {
  if (value == null) return "—";
  return `$${value.toLocaleString()}`;
}

export function formatPlanPrice(value: number): string {
  return `$${value.toLocaleString()}`;
}
