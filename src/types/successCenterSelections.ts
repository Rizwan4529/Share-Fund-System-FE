import type {
  SuccessCenterCategory,
  SuccessCenterProgram,
} from "@/types/successCenters";

/** Participant browse responses are trimmed versions of the admin shapes. */
export type BrowseCategory = Omit<
  SuccessCenterCategory,
  "status" | "createdAt" | "updatedAt"
>;

export type BrowseProgram = Omit<
  SuccessCenterProgram,
  "activationRules" | "createdAt" | "updatedAt"
>;

export type CategoryProgramsResponse = {
  category: BrowseCategory;
  programs: BrowseProgram[];
};

export type ProgramDetail = BrowseProgram & { category: BrowseCategory };

export const OBLIGATION_TYPES = ["existing_obligation", "new_goal"] as const;
export type ObligationType = (typeof OBLIGATION_TYPES)[number];

export const PRICING_SOURCES = ["estimated", "verified"] as const;
export type PricingSource = (typeof PRICING_SOURCES)[number];

export const PAYEE_TYPES = [
  "landlord",
  "lender",
  "dealer",
  "vendor",
  "provider",
  "self",
] as const;
export type PayeeType = (typeof PAYEE_TYPES)[number];

export type SelectionStatus = "active" | "removed";

export type SuccessCenterSelection = {
  _id: string;
  userId: string;
  programId: Pick<
    BrowseProgram,
    "_id" | "name" | "programType" | "goalNature" | "status"
  > | null;
  categoryId: Pick<BrowseCategory, "_id" | "name" | "slug" | "icon"> | null;
  purchaseId: string | null;
  obligationType: ObligationType;
  pricingSource: PricingSource;
  verifiedQuoteAmount?: number;
  goalAmount?: number;
  payee?: { name?: string; payeeType?: PayeeType; verified?: boolean };
  status: SelectionStatus;
  /** "paid" only after a webhook-confirmed activation payment. */
  activationStatus?: "unpaid" | "paid";
  activationPaymentId?: string | null;
  activationPaidAt?: string;
  selectedAt: string;
};

export type CreateSelectionRequest = {
  programId: string;
  obligationType: ObligationType;
  goalAmount?: number;
  pricingSource?: PricingSource;
  verifiedQuoteAmount?: number;
  payee?: { name?: string; payeeType?: PayeeType };
};
