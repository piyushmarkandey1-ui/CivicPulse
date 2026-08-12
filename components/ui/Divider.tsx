import { cn } from "@/lib/utils";

/**
 * Thin, reusable divider with optional gradient fade on edges.
 */
export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent",
        className
      )}
    />
  );
}
