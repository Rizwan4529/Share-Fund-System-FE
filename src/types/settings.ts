export const SETTING_CATEGORIES = [
  "founder",
  "activation",
  "allocation",
  "reserve",
  "platformFee",
  "threshold",
  "discretionary",
  "pricing",
  "avalanche",
  "followMe",
  "growthPeriod",
  "queue",
  "statisticalPricing",
] as const;

export const SETTING_DATA_TYPES = [
  "number",
  "percentage",
  "object",
  "array",
] as const;

export type SettingCategory = (typeof SETTING_CATEGORIES)[number];
export type SettingDataType = (typeof SETTING_DATA_TYPES)[number];

export type SettingVersionEntry = {
  value: unknown;
  updatedBy?: string;
  at?: string;
  reason?: string;
};

export type Setting = {
  _id: string;
  key: string;
  category: SettingCategory;
  value: unknown;
  dataType: SettingDataType;
  description?: string;
  versionHistory?: SettingVersionEntry[];
  effectiveDate?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InsertSettingRequest = {
  key: string;
  category: SettingCategory;
  value: unknown;
  dataType: SettingDataType;
  description?: string;
  effectiveDate?: string;
};

export type UpdateSettingRequest = {
  value: unknown;
  reason?: string;
  effectiveDate?: string;
};
