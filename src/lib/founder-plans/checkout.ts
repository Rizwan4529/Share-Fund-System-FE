import {
  founderPlanBmisLabel,
  founderPlanNameLabel,
  includedProgramCount,
} from "@/lib/founder-plans/labels";
import type { CheckoutPlanOption } from "@/lib/api/enrollment";
import type { FounderPlan } from "@/types/founderPlans";

export function toCheckoutOption(plan: FounderPlan): CheckoutPlanOption {
  const included = includedProgramCount(plan);
  return {
    plan: plan._id,
    name: plan.name,
    title: founderPlanNameLabel(plan.name),
    subtitle: `${founderPlanBmisLabel(plan.bmisPlanningLevel)} BMIS planning`,
    price: plan.price,
    centerLimit: included,
    foundingStatus:
      plan.name === "premium_1000" ? "founder_stack" : "founding_participant",
    separateOffer: plan.name === "premium_1000",
  };
}
