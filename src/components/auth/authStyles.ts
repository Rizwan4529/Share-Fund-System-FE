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

export const authErrorClass = cn(
  "mb-4 flex items-center gap-2.5 rounded-brand border border-error/20 bg-error-bg px-3.5 py-2.5",
);

export const authDividerClass = "my-6 flex items-center gap-3.5";

export const authStepIconClass = cn(
  "mx-auto mb-5 flex size-[52px] items-center justify-center rounded-xl border",
);

export function passwordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
