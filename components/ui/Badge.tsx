"use client";

import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "maroon"
  | "sand"
  | "critical"
  | "warning"
  | "success"
  | "neutral"
  | "copper"
  | "legacy-slate"
  | "legacy-blue";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; dot: string; border: string }
> = {
  maroon: {
    bg: "bg-[#8B2635]/10",
    text: "text-[#8B2635]",
    dot: "bg-[#8B2635]",
    border: "border-[#8B2635]/20",
  },
  sand: {
    bg: "bg-[#F0E5D8]",
    text: "text-[#8B2635]",
    dot: "bg-[#8B2635]",
    border: "border-[#D6C2A3]",
  },
  critical: {
    bg: "bg-[#FDEDED]",
    text: "text-[#B83A3A]",
    dot: "bg-[#B83A3A]",
    border: "border-[#B83A3A]/25",
  },
  warning: {
    bg: "bg-[#FEF6E9]",
    text: "text-[#C58B32]",
    dot: "bg-[#C58B32]",
    border: "border-[#C58B32]/25",
  },
  success: {
    bg: "bg-[#EEF5EE]",
    text: "text-[#5E8061]",
    dot: "bg-[#5E8061]",
    border: "border-[#5E8061]/25",
  },
  neutral: {
    bg: "bg-[#FFFFFF]",
    text: "text-[#625E59]",
    dot: "bg-[#88827A]",
    border: "border-[#DED8CD]",
  },
  copper: {
    bg: "bg-[#8B2635]/10",
    text: "text-[#8B2635]",
    dot: "bg-[#8B2635]",
    border: "border-[#8B2635]/20",
  },
  "legacy-slate": {
    bg: "bg-[#FFFFFF]",
    text: "text-[#625E59]",
    dot: "bg-[#88827A]",
    border: "border-[#DED8CD]",
  },
  "legacy-blue": {
    bg: "bg-[#8B2635]/10",
    text: "text-[#8B2635]",
    dot: "bg-[#8B2635]",
    border: "border-[#8B2635]/20",
  },
};

export function Badge({
  label,
  variant = "maroon",
  dot = true,
  className,
  pulse = false,
}: BadgeProps) {
  const styles = variantStyles[variant] || variantStyles.maroon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
                styles.dot
              )}
            />
          )}
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", styles.dot)} />
        </span>
      )}
      {label}
    </span>
  );
}
