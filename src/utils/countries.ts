import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

export type CountryOption = {
  code: CountryCode;
  name: string;
  dialCode: string;
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const COUNTRY_DIRECTORY: CountryOption[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) ?? code,
    dialCode: String(getCountryCallingCode(code)),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const COUNTRIES = COUNTRY_DIRECTORY.map((country) => country.name);

export const COUNTRY_OPTIONS = COUNTRY_DIRECTORY.map((country) => ({
  label: country.name,
  value: country.name,
}));

export function findCountryByName(name: string): CountryOption | undefined {
  const needle = name.trim().toLowerCase();
  if (!needle) return undefined;
  return COUNTRY_DIRECTORY.find((country) => country.name.toLowerCase() === needle);
}

export function formatDialPrefix(country: CountryOption): string {
  return `+${country.dialCode}`;
}

export function dialCodeLabel(country: CountryOption): string {
  return `${country.code} +${country.dialCode}`;
}

export function composeInternationalPhone(
  country: CountryOption | undefined,
  national: string,
): string {
  if (!country) return national.trim();
  const digits = national.replace(/\D/g, "");
  if (!digits) return formatDialPrefix(country);
  return `${formatDialPrefix(country)}${digits}`;
}

export function stripDialPrefix(raw: string, country: CountryOption): string {
  const prefix = formatDialPrefix(country);
  let value = raw.trim();
  if (value.startsWith(prefix)) {
    value = value.slice(prefix.length);
  } else if (value.startsWith(`+${country.dialCode}`)) {
    value = value.slice(`+${country.dialCode}`.length);
  }
  return value.trim();
}
