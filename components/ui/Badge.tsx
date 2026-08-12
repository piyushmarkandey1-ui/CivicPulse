"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type BadgeVariant = "copper" | "critical" | "warning" | "success" | "neutral" | "legacy-slate" | "legacy-blue";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  pulse?: boolean;
}

// Map variants to new color tokens.
// Note: tailwind needs classes to exist, but since these use arbitrary values, we map them directly to our css vars.
const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
  copper: {
    bg:     "bg-copper/[0.08]",
    text:   "text-copper",
    dot:    "bg-copper",
    border: "border-copper/20",
  },
  critical: {
    bg:     "bg-danger/[0.08]",
    text:   "text-danger",
    dot:    "bg-danger",
    border: "border-danger/20",
  },
  warning: {
    bg:     "bg-warning/[0.08]",
    text:   "text-warning",
    dot:    "bg-warning",
    border: "border-warning/20",
  },
  success: {
    bg:     "bg-success/[0.08]",
    text:   "text-success",
    dot:    "bg-success",
    border: "border-success/20",
  },
  neutral: {
    bg:     "bg-white/[0.04]",
    text:   "text-text-muted",
    dot:    "bg-text-subtle",
    border: "border-border-strong",
  },
  // temporary fallbacks to prevent immediate breaks
  "legacy-slate": {
    bg:     "bg-white/[0.04]",
    text:   "text-text-muted",
    dot:    "bg-text-subtle",
    border: "border-border-strong",
  },
  "legacy-blue": {
    bg:     "bg-copper/[0.08]",
    text:   "text-copper",
    dot:    "bg-copper",
    border: "border-copper/20",
  },
};

export function Badge({ label, variant = "copper", dot = true, className, pulse = false }: BadgeProps) {
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
