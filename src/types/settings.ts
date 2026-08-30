export const SETTING_DATA_TYPES = [
  "number",
  "percentage",
  "object",
  "array",
] as const;

export type SettingDataType = (typeof SETTING_DATA_TYPES)[number];

export type SettingCategory = {
  _id: string;
  slug: string;
  label: string;
  description?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type SettingVersionEntry = {
  value: unknown;
  updatedBy?: string;
  at?: string;
  reason?: string;
};

export type Setting = {
  _id: string;
  key: string;
  category: string;
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
  category: string;
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

export type CreateSettingCategoryRequest = {
  slug: string;
  label: string;
  description?: string;
  order?: number;
};

export type UpdateSettingCategoryRequest = Partial<CreateSettingCategoryRequest>;
