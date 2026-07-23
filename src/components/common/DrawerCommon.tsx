import type { ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type DrawerCommonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Optional footer actions (Save / Cancel, etc.) */
  footer?: ReactNode;
  className?: string;
  /** Content area class for form fields */
  bodyClassName?: string;
};

/**
 * Right-side admin drawer shell — layout/height only.
 * Pass form fields and actions as children / footer.
 */
export function DrawerCommon({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  bodyClassName,
}: DrawerCommonProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        className={cn(
          "flex h-full max-h-svh flex-col sm:max-w-md md:max-w-lg",
          className,
        )}
      >
        <DrawerHeader className="shrink-0">
          <DrawerTitle className="text-lg font-bold tracking-[-0.3px]">
            {title}
          </DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 py-4",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer ? (
          <DrawerFooter className="shrink-0 sm:flex-row sm:justify-end">
            {footer}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
