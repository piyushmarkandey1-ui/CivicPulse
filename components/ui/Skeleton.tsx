import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-white/[0.04] border border-white/[0.04] rounded-xl",
        className
      )}
      {...props}
    />
  );
}
