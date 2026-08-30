import type { SettingDataType } from "@/types/settings";

export function parseSettingValue(
  raw: string,
  dataType: SettingDataType,
): unknown {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Value is required");
  }

  if (dataType === "number" || dataType === "percentage") {
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      throw new Error("Value must be a number");
    }
    return parsed;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(
      dataType === "array"
        ? "Value must be valid JSON array"
        : "Value must be valid JSON object",
    );
  }

  if (dataType === "array" && !Array.isArray(parsed)) {
    throw new Error("Value must be an array");
  }
  if (
    dataType === "object" &&
    (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
  ) {
    throw new Error("Value must be an object");
  }

  return parsed;
}

export function formatSettingValue(value: unknown): string {
  if (typeof value === "number") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function settingValueToInput(
  value: unknown,
  dataType: SettingDataType,
): string {
  if (dataType === "number" || dataType === "percentage") {
    return typeof value === "number" && Number.isFinite(value)
      ? String(value)
      : "";
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

export function toDateInput(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function optionalTrimmed(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function settingCategoryLabel(category: string): string {
  return category
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export function formatSettingDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}
