import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-[#EFE9DE]/80 border border-[#DED8CD] rounded-xl",
        className
      )}
      {...props}
    />
  );
}
