import type { SuccessProfile } from "@/types";

export type FieldType =
  | "text"
  | "number"
  | "currency"
  | "textarea"
  | "select"
  | "boolean"
  | "date"
  | "category"
  | "program";

export type FieldDef = {
  key: keyof SuccessProfile;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  /** Show only when this key resolves truthy (used for program after category). */
  showWhen?: keyof SuccessProfile;
};

export type StepDef = {
  id: string;
  title: string;
  description: string;
  fields: FieldDef[];
};

/**
 * Multi-step Success Profile schema. Program-specific questions are handled
 * separately, so this core schema stays stable as new programs are added.
 */
export const SUCCESS_PROFILE_STEPS: StepDef[] = [
  {
    id: "participant",
    title: "Participant information",
    description:
      "Tell us who is planning and get a clear picture of your monthly finances.",
    fields: [
      {
        key: "participantType",
        label: "Who is this plan for?",
        type: "select",
        required: true,
        options: [
          { value: "individual", label: "Individual" },
          { value: "household", label: "Household" },
          { value: "group", label: "Group" },
          { value: "professional", label: "Professional / Partner" },
          { value: "business", label: "Business" },
          { value: "organizational", label: "Organization" },
        ],
      },
      { key: "country", label: "Country", type: "text", placeholder: "United States" },
      { key: "region", label: "State / Region", type: "text", placeholder: "California" },
      {
        key: "currency",
        label: "Preferred currency",
        type: "select",
        options: [
          { value: "USD", label: "USD — US Dollar" },
          { value: "CAD", label: "CAD — Canadian Dollar" },
          { value: "EUR", label: "EUR — Euro" },
          { value: "GBP", label: "GBP — British Pound" },
          { value: "AUD", label: "AUD — Australian Dollar" },
          { value: "MXN", label: "MXN — Mexican Peso" },
        ],
      },
      {
        key: "incomeSource",
        label: "Primary income source",
        type: "text",
        placeholder: "Employment, self-employed, benefits…",
      },
      {
        key: "netMonthlyIncome",
        label: "Net monthly income",
        type: "currency",
        required: true,
        placeholder: "4000",
      },
      {
        key: "essentialExpenses",
        label: "Essential monthly expenses",
        type: "currency",
        required: true,
        placeholder: "2200",
        help: "Rent, utilities, food, transport, and other must-pay costs.",
      },
      {
        key: "monthlyDebt",
        label: "Monthly debt payments",
        type: "currency",
        placeholder: "300",
      },
      {
        key: "existingCommitments",
        label: "Other monthly commitments",
        type: "currency",
        placeholder: "150",
      },
      {
        key: "currentSavings",
        label: "Current savings",
        type: "currency",
        placeholder: "1500",
      },
      {
        key: "emergencySavings",
        label: "Emergency savings",
        type: "currency",
        placeholder: "1000",
      },
      {
        key: "comfortableMonthlyActivation",
        label: "Comfortable monthly amount toward this goal",
        type: "currency",
        placeholder: "250",
        help: "What you feel you can commit each month without strain.",
      },
    ],
  },
  {
    id: "goal",
    title: "Your goal",
    description: "Pick a Success Center category and program, then describe the goal.",
    fields: [
      {
        key: "selectedCategoryId",
        label: "Success Center category",
        type: "category",
        required: true,
      },
      {
        key: "selectedProgramId",
        label: "Program",
        type: "program",
        required: true,
        showWhen: "selectedCategoryId",
      },
      {
        key: "goalCadence",
        label: "Is this a one-time or recurring goal?",
        type: "select",
        options: [
          { value: "one_time", label: "One-time" },
          { value: "recurring", label: "Recurring" },
        ],
      },
      {
        key: "goalAmount",
        label: "Goal amount",
        type: "currency",
        required: true,
        placeholder: "12000",
      },
      {
        key: "monthlyObligation",
        label: "Related monthly obligation (if any)",
        type: "currency",
        placeholder: "0",
        help: "For recurring goals, the monthly bill this goal supports.",
      },
      {
        key: "desiredCompletionDate",
        label: "Target completion date",
        type: "date",
      },
      {
        key: "preferredFundingMonths",
        label: "Preferred funding window (months)",
        type: "number",
        placeholder: "12",
      },
      {
        key: "goalPriority",
        label: "How urgent is this goal?",
        type: "select",
        options: [
          { value: "urgent", label: "Urgent" },
          { value: "important", label: "Important" },
          { value: "long_term", label: "Long term" },
        ],
      },
      {
        key: "hasVerifiedProvider",
        label: "I already have a provider / vendor for this goal.",
        type: "boolean",
      },
      {
        key: "activationCadence",
        label: "Preferred activation option",
        type: "select",
        options: [
          { value: "monthly", label: "Monthly" },
          { value: "3_month", label: "Every 3 months" },
          { value: "6_month", label: "Every 6 months" },
          { value: "full_term", label: "Full term" },
        ],
        help: "How often you prefer to schedule activation toward this goal.",
      },
    ],
  },
  {
    id: "financial",
    title: "Financial planning",
    description: "Help the engine tailor your plan and next steps.",
    fields: [
      {
        key: "desiredResult",
        label: "What result do you want from this plan?",
        type: "textarea",
        placeholder: "Move into a stable home within a year…",
      },
      {
        key: "currentObstacle",
        label: "What is the biggest obstacle right now?",
        type: "textarea",
        placeholder: "Irregular income, high rent…",
      },
      {
        key: "wouldReduceExpense",
        label: "I'm open to reducing an expense to reach this goal sooner.",
        type: "boolean",
      },
      {
        key: "wouldIncreaseIncome",
        label: "I'm open to increasing income to reach this goal sooner.",
        type: "boolean",
      },
      {
        key: "openToLowerCostOrLongerTimeline",
        label:
          "If needed, I'm open to a lower goal amount or a longer timeline.",
        type: "boolean",
      },
      {
        key: "priorityNote",
        label: "Anything else we should prioritize?",
        type: "textarea",
        placeholder: "Optional",
      },
    ],
  },
  {
    id: "attestation",
    title: "Attestation",
    description: "Confirm your information so we can generate accurate projections.",
    fields: [
      {
        key: "infoAccurate",
        label:
          "I confirm the information above is accurate to the best of my knowledge.",
        type: "boolean",
        required: true,
      },
      {
        key: "understandsEstimates",
        label:
          "I understand recommendations and timelines are estimates, not guarantees.",
        type: "boolean",
        required: true,
      },
    ],
  },
];

/** Fields that must be provided for the profile to count as complete. */
export const REQUIRED_PROFILE_FIELDS: (keyof SuccessProfile)[] = [
  "participantType",
  "netMonthlyIncome",
  "essentialExpenses",
  "selectedCategoryId",
  "selectedProgramId",
  "goalAmount",
  "infoAccurate",
  "understandsEstimates",
];

/** 0–100 completion percentage across the required profile fields. */
export function profileCompletion(profile: SuccessProfile): number {
  const total = REQUIRED_PROFILE_FIELDS.length;
  const done = REQUIRED_PROFILE_FIELDS.filter((key) => {
    const value = profile[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    return String(value ?? "").trim().length > 0;
  }).length;
  return Math.round((done / total) * 100);
}
