import type { ComponentType, MouseEventHandler } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

type AdminTableIconActionProps = {
  label: string;
  icon: ComponentType<IconProps>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  tone?: "default" | "success" | "danger" | "info";
};

const toneClass: Record<NonNullable<AdminTableIconActionProps["tone"]>, string> =
  {
    default: "text-ink-heading hover:bg-muted",
    success: "text-success hover:bg-success-bg",
    danger: "text-error hover:bg-error-bg",
    info: "text-info hover:bg-info-bg",
  };

/** Icon-only table action with shadcn Tooltip label on hover. */
export function AdminTableIconAction({
  label,
  icon: Icon,
  onClick,
  disabled,
  className,
  tone = "default",
}: AdminTableIconActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          aria-label={label}
          onClick={onClick}
          className={cn(toneClass[tone], className)}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
