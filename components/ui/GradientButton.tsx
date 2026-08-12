"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
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
  "aria-label": ariaLabel,
}: GradientButtonProps) {
  const baseStyles = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
    "cursor-pointer select-none transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4ED]",
    sizeMap[size],
    variant === "primary" &&
      "bg-[#8B2635] text-white hover:bg-[#641B27] shadow-[0_2px_8px_rgba(139,38,53,0.2)] hover:shadow-[0_4px_16px_rgba(139,38,53,0.3)]",
    variant === "outline" &&
      "bg-white text-[#242222] border border-[#C9C0B3] hover:bg-[#F0E5D8] hover:border-[#8B2635] hover:text-[#8B2635] shadow-sm",
    variant === "ghost" &&
      "bg-transparent text-[#625E59] hover:bg-[#F0E5D8]/60 hover:text-[#8B2635]",
    disabled && "opacity-40 cursor-not-allowed pointer-events-none",
    className
  );

  const content = (
    <span className="relative z-10 flex items-center gap-2">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.01 },
    whileTap: disabled ? undefined : { scale: 0.98 },
    transition: { duration: 0.15 },
  };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link
          href={href}
          className={baseStyles}
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {content}
        </Link>
      </motion.div>
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
