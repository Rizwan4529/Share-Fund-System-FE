export const WAITLIST_STATUSES = [
  "pending",
  "contacted",
  "converted",
  "archived",
] as const;

export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

export type WaitlistCampaignCategory = {
  _id: string;
  slug: string;
  label: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WaitlistEntry = {
  _id: string;
  name: string;
  email: string;
  /** Campaign category slug (e.g. housing, debt_reduction). */
  campaignCategory: string;
  message?: string;
  status: WaitlistStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateWaitlistEntryRequest = {
  name?: string;
  email?: string;
  campaignCategory?: string;
  message?: string;
  status?: WaitlistStatus;
};

export type ListWaitlistParams = {
  campaignCategory?: string;
  status?: WaitlistStatus;
  search?: string;
};

export type CreateWaitlistCampaignCategoryRequest = {
  slug: string;
  label: string;
  description?: string;
  order?: number;
  isActive?: boolean;
};

export type UpdateWaitlistCampaignCategoryRequest =
  Partial<CreateWaitlistCampaignCategoryRequest>;

export type ListWaitlistCampaignCategoriesParams = {
  includeInactive?: boolean;
};
