import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogCommonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  /** When set, renders standard Cancel / Confirm footer */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  confirmVariant?: "default" | "destructive" | "gold";
  confirmLoading?: boolean;
};

/**
 * shadcn Dialog shell for confirmations (delete / deactivate) and simple modals.
 */
export function DialogCommon({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmVariant = "destructive",
  confirmLoading = false,
}: DialogCommonProps) {
  const handleConfirm = async () => {
    await onConfirm?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[425px]", className)}
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {children ? <div className="py-1">{children}</div> : null}

        {onConfirm ? (
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={confirmLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={
                confirmVariant === "gold"
                  ? "gold"
                  : confirmVariant === "destructive"
                    ? "destructive"
                    : "default"
              }
              onClick={() => void handleConfirm()}
              disabled={confirmLoading}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
