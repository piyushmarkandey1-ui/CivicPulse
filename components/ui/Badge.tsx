"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BadgeVariant = "teal" | "amber" | "red" | "green" | "slate";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
  teal: {
    bg:     "bg-teal/10",
    text:   "text-teal-light",
    dot:    "bg-teal",
    border: "border-teal/25",
  },
  amber: {
    bg:     "bg-amber/10",
    text:   "text-amber-light",
    dot:    "bg-amber",
    border: "border-amber/25",
  },
  red: {
    bg:     "bg-red-500/10",
    text:   "text-red-400",
    dot:    "bg-red-500",
    border: "border-red-500/25",
  },
  green: {
    bg:     "bg-green-500/10",
    text:   "text-green-400",
    dot:    "bg-green-500",
    border: "border-green-500/25",
  },
  slate: {
    bg:     "bg-slate-700/40",
    text:   "text-slate-300",
    dot:    "bg-slate-400",
    border: "border-slate-600/40",
  },
};

export function Badge({ label, variant = "teal", dot = true, className, pulse = false }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
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
