"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "copper" | "none";
  padding?: "none" | "sm" | "md" | "lg";
  animate?: boolean;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function GlassCard({
  children,
  className,
  hover   = true,
  glow    = "none",
  padding = "md",
  animate = true,
}: GlassCardProps) {
  const Wrapper = animate ? motion.div : "div";

  const animProps = animate
    ? {
        initial:    { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport:   { once: true, margin: "-40px" },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        whileHover: hover ? { 
          y: -2, 
          backgroundColor: "#211D19", // surface-raised
          borderColor: "#403932", // border-strong
          boxShadow: glow === "copper"
                  ? "0 0 20px rgba(217,139,82,0.08), 0 0 40px rgba(217,139,82,0.04), 0 4px 24px rgba(0,0,0,0.4)"
                  : "0 4px 24px rgba(0,0,0,0.45)",
          transition: { duration: 0.2, ease: EASE_OUT_QUAD } 
        } : undefined,
      }
    : {
        whileHover: hover ? { 
          y: -2, 
          backgroundColor: "#211D19", // surface-raised
          borderColor: "#403932", // border-strong
          boxShadow: glow === "copper"
                  ? "0 0 20px rgba(217,139,82,0.08), 0 0 40px rgba(217,139,82,0.04), 0 4px 24px rgba(0,0,0,0.4)"
                  : "0 4px 24px rgba(0,0,0,0.45)",
          transition: { duration: 0.2, ease: EASE_OUT_QUAD } 
        } : undefined,
      };

  return (
    <Wrapper
      {...animProps as any}
      className={cn(
        /* unified surface */
        "relative rounded-xl overflow-hidden",
        "bg-surface border border-border",
        "transition-all duration-300",
        paddingMap[padding],
        className
      )}
    >
      {/* Very subtle top highlight — barely visible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent)",
        }}
      />
      {children}
    </Wrapper>
  );
}
