"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  animate?: boolean;
}

const paddingMap = {
  none: "",
  sm:   "p-4",
  md:   "p-5",
  lg:   "p-6 md:p-8",
};

export function GlassCard({
  children,
  className,
  hover   = true,
  padding = "md",
  animate = true,
}: GlassCardProps) {
  const Wrapper = animate ? motion.div : "div";

  const animProps = animate
    ? {
        initial:    { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport:   { once: true, margin: "-40px" },
        transition: { duration: 0.4, ease: EASE_OUT_QUAD },
        whileHover: hover ? { y: -3, transition: { duration: 0.2, ease: EASE_OUT_QUAD } } : undefined,
      }
    : {
        whileHover: hover ? { y: -3, transition: { duration: 0.2, ease: EASE_OUT_QUAD } } : undefined,
      };

  return (
    <Wrapper
      {...animProps}
      className={cn(
        "surface rounded-lg relative overflow-hidden transition-shadow duration-200 hover:shadow-md",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </Wrapper>
  );
}
