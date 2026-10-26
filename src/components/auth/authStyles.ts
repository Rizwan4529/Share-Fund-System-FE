import { cn } from "@/lib/utils";

/** Auth form field styles — matched to SFS App.dc.html login panel */
export const authInputClass = cn(
  "h-10 w-full rounded-md border border-border-input bg-input-bg px-3 text-sm text-ink-heading",
  "placeholder:text-muted-light shadow-none outline-none",
  "focus-visible:border-info/40 focus-visible:ring-[3px] focus-visible:ring-info/15",
);

export const authSocialButtonClass = cn(
  "h-10 flex-1 cursor-pointer gap-2 rounded-md border-border-input bg-white text-sm font-semibold",
  "text-ink-heading hover:bg-bg-card hover:border-muted-light",
);

export const authLabelClass = "text-[13px] font-semibold text-[#33425f]";

export const authFieldItemClass =
  "gap-[7px] [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#33425f]";

export const authErrorClass = cn(
  "mb-4 flex items-center gap-2.5 rounded-brand border border-error/20 bg-error-bg px-3.5 py-2.5",
);

export const authDividerClass = "my-6 flex items-center gap-3.5";

export const authStepIconClass = cn(
  "mx-auto mb-5 flex size-[52px] items-center justify-center rounded-xl border",
);

/** The same four rules the signup schema enforces (lib/schemas/auth.ts). */
const PASSWORD_RULES = [
  { label: "8+ characters", test: (pw: string) => pw.length >= 8 },
  { label: "an uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "a number", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "a special character", test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

/** Rules met (0–4) and the ones still missing, for the strength meter. */
export function passwordStrength(pw: string): { score: number; missing: string[] } {
  const missing = PASSWORD_RULES.filter((rule) => !rule.test(pw)).map((rule) => rule.label);
  return { score: PASSWORD_RULES.length - missing.length, missing };
}

/** "Strong" only when every rule passes; otherwise says what's missing. */
export function passwordStrengthLabel(pw: string): string {
  if (!pw) return "Enter a password";
  const { missing } = passwordStrength(pw);
  return missing.length ? `Add ${missing.join(", ")}` : "Strong";
}
