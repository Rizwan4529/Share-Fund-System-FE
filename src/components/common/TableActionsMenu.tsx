import type { ComponentProps, ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TableActionsMenuProps = {
  children: ReactNode;
  align?: "start" | "center" | "end";
};

export function TableActionsMenu({
  children,
  align = "end",
}: TableActionsMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <MoreHorizontal />
          <span className="sr-only">Open actions menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align={align}>
        <div className="flex min-w-[10rem] flex-col gap-1">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

type IconProps = { className?: string };

type TableActionMenuItemProps = ComponentProps<typeof Button> & {
  icon?: ComponentType<IconProps>;
};

export function TableActionMenuItem({
  icon: Icon,
  className,
  children,
  ...props
}: TableActionMenuItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-9 w-full justify-start gap-2 px-2 font-normal",
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {children}
    </Button>
  );
}

type TableActionMenuLinkProps = ComponentProps<typeof Link> & {
  icon?: ComponentType<IconProps>;
  className?: string;
};

export function TableActionMenuLink({
  icon: Icon,
  className,
  children,
  ...props
}: TableActionMenuLinkProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-9 w-full justify-start gap-2 px-2 font-normal",
        className,
      )}
      asChild
    >
      <Link
        {...props}
        className={cn("inline-flex w-full items-center gap-2", className)}
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
        {children}
      </Link>
    </Button>
  );
}
