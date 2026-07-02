import { Award } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import type { RedeemOption } from "@/types";
import { cn } from "@/lib/utils";

type RedeemCreditsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: RedeemOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
};

export function RedeemCreditsModal({
  open,
  onOpenChange,
  options,
  selected,
  onSelect,
  onConfirm,
}: RedeemCreditsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,720px)] max-w-[min(100vw-1rem,32rem)] overflow-hidden rounded-panel border-line p-0 shadow-[0_30px_60px_-24px_rgba(12,31,68,0.4)] sm:max-w-lg">
        <div className="border-b border-line bg-bg-gold px-4 py-4 text-center sm:px-6 sm:py-5">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl border border-border-gold bg-white">
            <Award className="size-6 text-gold-dark" />
          </div>
          <Typography variant="h4" className="font-bold text-ink-heading">
            Redeem credits
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-1">
            Choose how to use your balance
          </Typography>
        </div>
        <div className="max-h-[min(50vh,360px)] space-y-2 overflow-y-auto p-4 sm:p-5">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={cn(
                "flex w-full flex-col gap-2 rounded-lg border p-3.5 text-left transition-colors sm:flex-row sm:items-start sm:gap-4 sm:p-4",
                selected === opt.id
                  ? "border-gold-dark bg-bg-gold"
                  : "border-line bg-input-bg hover:border-gold-chip",
              )}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <Typography
                  as="p"
                  variant="label"
                  className="font-bold leading-snug text-ink-heading"
                >
                  {opt.title}
                </Typography>
                <Typography as="p" variant="body-sm" color="muted" className="leading-snug">
                  {opt.description}
                </Typography>
              </div>
              <Typography
                as="p"
                variant="label"
                className="shrink-0 font-semibold text-gold-dark sm:pt-0.5"
              >
                {opt.cost} credits
              </Typography>
            </button>
          ))}
        </div>
        <DialogFooter className="mx-0 mb-0 flex flex-col-reverse gap-2 border-t border-line bg-transparent px-4 pt-3 pb-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-5 sm:pt-4 sm:pb-5">
          <GoldButton
            variant="ghost-outline"
            size="app"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </GoldButton>
          <GoldButton
            size="app"
            className="w-full sm:w-auto"
            onClick={onConfirm}
            disabled={!selected}
          >
            Confirm
          </GoldButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
