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
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
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
    "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
    "cursor-pointer select-none overflow-hidden transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
    sizeMap[size],
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const content = (
    <>
      {/* Animated gradient background */}
      {variant === "primary" && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-teal to-amber opacity-100 transition-opacity duration-300"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-teal-light to-amber-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </>
      )}

      {/* Outline variant */}
      {variant === "outline" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl border border-teal/60 bg-teal/5 group-hover:bg-teal/10 transition-colors duration-300"
        />
      )}

      {/* Ghost variant */}
      {variant === "ghost" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300"
        />
      )}

      {/* Glow layer (primary only) */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: "0 0 30px rgba(20,184,166,0.5), 0 0 60px rgba(20,184,166,0.2)",
          }}
        />
      )}

      {/* Text + icon (above pseudo-elements) */}
      <span
        className={cn(
          "relative z-10 flex items-center gap-2",
          variant === "primary" ? "text-navy font-bold" : "text-slate-200"
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    </>
  );

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.04 },
    whileTap:   disabled ? undefined : { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
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
