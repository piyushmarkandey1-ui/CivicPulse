"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  "aria-label"?: string;
}

const sizeMap = {
  xs: "px-3 py-1.5 text-xs  gap-1.5",
  sm: "px-4 py-2   text-sm  gap-2",
  md: "px-5 py-2.5 text-sm  gap-2",
  lg: "px-7 py-3   text-base gap-2.5",
};

export function GradientButton({
  children,
  onClick,
  href,
  variant = "primary",
  size    = "md",
  className,
  disabled,
  type = "button",
  icon,
  "aria-label": ariaLabel,
}: GradientButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center rounded-md font-semibold",
    "cursor-pointer select-none",
    "transition-[background-color,border-color] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-gray-soft",
    sizeMap[size],
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    variant === "primary" && "bg-blue text-white hover:bg-blue-dark",
    variant === "outline" && "border border-blue bg-transparent text-blue hover:bg-blue-muted/50",
    variant === "ghost" && "text-gray-dark hover:bg-gray-muted/60",
    className
  );

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.02, transition: { duration: 0.2, ease: EASE_OUT_QUAD } },
    whileTap:   disabled ? undefined : { scale: 0.98, transition: { duration: 0.15, ease: EASE_OUT_QUAD } },
  };

  const content = (
    <span className="relative z-10 flex items-center gap-2">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );

  if (href) {
    return (
      <motion.span className="inline-flex" {...motionProps}>
        <Link href={href} className={baseStyles} aria-label={ariaLabel}>
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={baseStyles}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
