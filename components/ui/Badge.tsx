"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "teal" | "amber" | "red" | "green" | "slate" | "blue";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
  blue: {
    bg:     "bg-blue-muted",
    text:   "text-blue-dark",
    dot:    "bg-blue",
    border: "border-blue/20",
  },
  teal: {
    bg:     "bg-blue-muted",
    text:   "text-blue-dark",
    dot:    "bg-blue",
    border: "border-blue/20",
  },
  amber: {
    bg:     "bg-gray-muted",
    text:   "text-gray-mid",
    dot:    "bg-gray-mid",
    border: "border-gray-border",
  },
  red: {
    bg:     "bg-red-500/10",
    text:   "text-red-500",
    dot:    "bg-red-500",
    border: "border-red-500/20",
  },
  green: {
    bg:     "bg-green-muted",
    text:   "text-green-dark",
    dot:    "bg-green",
    border: "border-green/20",
  },
  slate: {
    bg:     "bg-gray-muted",
    text:   "text-gray-mid",
    dot:    "bg-gray-mid",
    border: "border-gray-border",
  },
};

export function Badge({ label, variant = "blue", dot = true, className, pulse = false }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium tracking-wide border",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {dot && (
        <span className={cn("inline-flex rounded-full h-1.5 w-1.5 flex-shrink-0", styles.dot)} />
      )}
      {label}
    </span>
  );
}
