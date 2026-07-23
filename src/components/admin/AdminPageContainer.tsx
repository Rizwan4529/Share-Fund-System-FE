import { cn } from "@/lib/utils";

/**
 * Shared horizontal inset for admin content + top bar.
 * Matches Bidalotcoins Tags `SIDEBAR_PAGE_PADDING` (px-7) — identical L/R.
 */
export const ADMIN_PAGE_GUTTER = "px-7";

export function AdminPageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-admin flex-col pb-4 pt-3",
        ADMIN_PAGE_GUTTER,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminSurfaceCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-white shadow-[0_1px_0_rgba(12,31,68,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
