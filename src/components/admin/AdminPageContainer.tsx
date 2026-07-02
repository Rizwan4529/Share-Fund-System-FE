import { cn } from "@/lib/utils";

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
        "mx-auto max-w-admin px-4 pb-10 pt-5 lg:px-[30px] lg:pb-[60px] lg:pt-7",
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
