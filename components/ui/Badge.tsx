"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    bg:     "bg-teal/[0.08]",
    text:   "text-teal",
    dot:    "bg-teal",
    border: "border-teal/20",
  },
  amber: {
    bg:     "bg-warning/[0.08]",
    text:   "text-warning",
    dot:    "bg-warning",
    border: "border-warning/20",
  },
  red: {
    bg:     "bg-danger/[0.08]",
    text:   "text-danger",
    dot:    "bg-danger",
    border: "border-danger/20",
  },
  green: {
    bg:     "bg-teal/[0.08]",
    text:   "text-teal",
    dot:    "bg-teal",
    border: "border-teal/20",
  },
  slate: {
    bg:     "bg-white/[0.04]",
    text:   "text-slate-400",
    dot:    "bg-slate-500",
    border: "border-white/[0.08]",
  },
};

export function Badge({ label, variant = "teal", dot = true, className, pulse = false }: BadgeProps) {
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
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-60",
                styles.dot
              )}
              style={{ animation: "pulse-ring 2s ease-out infinite" }}
            />
          )}
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", styles.dot)} />
        </span>
      )}
      {label}
    </span>
  );
}
