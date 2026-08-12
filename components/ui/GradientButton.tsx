"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

const sizeMap = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export function GradientButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
  icon,
}: GradientButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
    "cursor-pointer select-none transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    sizeMap[size],
    disabled && "opacity-40 cursor-not-allowed pointer-events-none",
    className
  );

  const content = (
    <>
      {/* Primary: solid teal, clean */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg"
          style={{ background: "#4FD1A5" }}
        />
      )}

      {/* Primary hover: slightly brighter teal */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "#7BE3BE" }}
        />
      )}

      {/* Outline variant */}
      {variant === "outline" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg border border-slate-600 bg-transparent group-hover:border-teal/50 group-hover:bg-teal/[0.04] transition-all duration-200"
        />
      )}

      {/* Ghost variant */}
      {variant === "ghost" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg bg-transparent group-hover:bg-white/[0.04] transition-colors duration-200"
        />
      )}

      {/* Text */}
      <span
        className={cn(
          "relative z-10 flex items-center gap-2",
          variant === "primary" ? "text-[#070B14] font-semibold" : "text-slate-200"
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    </>
  );

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.015 },
    whileTap: disabled ? undefined : { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 500, damping: 30 },
  };

  if (href) {
    return (
      <motion.a href={href} className={cn(baseStyles, "group")} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, "group")}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
