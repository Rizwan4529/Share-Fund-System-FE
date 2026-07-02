import { cn } from "@/lib/utils";

/** Auth form field styles — matched to SFS App.dc.html login panel */
export const authInputClass = cn(
  "h-[52px] rounded-brand border-border-input bg-input-bg px-[15px] text-[15.5px]",
  "placeholder:text-muted-light shadow-none",
  "focus-visible:border-gold-dark focus-visible:ring-[3px] focus-visible:ring-gold/15",
);

export const authSocialButtonClass = cn(
  "h-[52px] flex-1 gap-2 rounded-brand border-border-input bg-white text-[14.5px] font-semibold",
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

export const authTabClass = (active: boolean) =>
  cn(
    "flex-1 rounded-md py-2.5 text-sm font-bold transition-all",
    active
      ? "bg-white text-ink-heading shadow-sm"
      : "text-muted-soft hover:text-ink-heading",
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
