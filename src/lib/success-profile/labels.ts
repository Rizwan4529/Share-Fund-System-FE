import type {
  DiscretionaryRuleLabel,
  SuccessProfileFinancialField,
  SuccessProfilePlanningAnswers,
  SuccessProfileType,
} from "@/types/successProfile";

export const PROFILE_TYPE_LABELS: Record<SuccessProfileType, string> = {
  individual: "Individual",
  household: "Household",
  group: "Group",
  professional: "Professional / Partner",
  business: "Business",
  organizational: "Organization",
};

/** Preset rules carry a fixed percentage; `custom` uses the participant's own. */
export const DISCRETIONARY_RULES: Record<
  DiscretionaryRuleLabel,
  { label: string; percentage?: number; description: string }
> = {
  wealth_preservation_10: {
    label: "Wealth preservation — 10%",
    percentage: 10,
    description: "Commit a small share and keep most of your flexibility.",
  },
  conservative_20: {
    label: "Conservative — 20%",
    percentage: 20,
    description: "A careful pace that leaves plenty of room for surprises.",
  },
  moderate_30: {
    label: "Moderate — 30%",
    percentage: 30,
    description: "A balanced pace between progress and flexibility.",
  },
  flexible_40: {
    label: "Flexible — 40%",
    percentage: 40,
    description: "Faster progress if your budget can absorb it.",
  },
  custom: {
    label: "Custom percentage",
    description: "Set your own share of discretionary income.",
  },
};

export const FINANCIAL_FIELDS: {
  key: SuccessProfileFinancialField;
  label: string;
  placeholder: string;
  description?: string;
}[] = [
  { key: "netMonthlyIncome", label: "Net monthly income", placeholder: "4000" },
  {
    key: "essentialExpenses",
    label: "Essential monthly expenses",
    placeholder: "2200",
    description: "Rent, utilities, food, transport and other must-pay costs.",
  },
  { key: "monthlyDebt", label: "Monthly debt payments", placeholder: "300" },
  {
    key: "existingCommitments",
    label: "Other monthly commitments",
    placeholder: "150",
  },
  { key: "currentSavings", label: "Current savings", placeholder: "1500" },
  { key: "emergencySavings", label: "Emergency savings", placeholder: "1000" },
  {
    key: "comfortableMonthlyAmount",
    label: "Comfortable monthly amount toward your goals",
    placeholder: "250",
    description: "What you can commit each month without strain.",
  },
];

type PlanningAnswerKey = keyof SuccessProfilePlanningAnswers;

export const PLANNING_TEXT_QUESTIONS: {
  key: PlanningAnswerKey;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "desiredResult",
    label: "What result do you want from your plan?",
    placeholder: "Move into a stable home within a year…",
  },
  {
    key: "whatIsBlocking",
    label: "What is blocking you right now?",
    placeholder: "Irregular income, high rent…",
  },
  {
    key: "goalPriorities",
    label: "How would you rank your goal priorities?",
    placeholder: "1. Pay off the car  2. Build an emergency fund…",
  },
];

export const PLANNING_CHOICE_QUESTIONS: {
  key: PlanningAnswerKey;
  label: string;
}[] = [
  {
    key: "wouldReducingExpenseHelp",
    label: "Would reducing an expense help you reach your goal sooner?",
  },
  {
    key: "wouldIncreasingIncomeHelp",
    label: "Would increasing your income help you reach your goal sooner?",
  },
  {
    key: "willingToConsiderLongerTimeline",
    label: "Would you consider a longer timeline if needed?",
  },
];

export const PLANNING_CHOICE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
];

export function planningChoiceLabel(value?: string): string {
  return (
    PLANNING_CHOICE_OPTIONS.find((option) => option.value === value)?.label ??
    value ??
    ""
  );
}
