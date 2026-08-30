import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-8 animate-spin rounded-full border-2 border-gold border-t-transparent",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-app-canvas">
      <Spinner />
    </div>
  );
}
