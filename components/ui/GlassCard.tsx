"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "teal" | "amber" | "none";
  padding?: "none" | "sm" | "md" | "lg";
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
  hover = true,
  glow = "none",
  padding = "md",
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hover
          ? {
              y: -2,
              boxShadow:
                glow === "teal"
                  ? "0 0 20px rgba(79,209,165,0.10), 0 0 40px rgba(79,209,165,0.05), 0 4px 24px rgba(0,0,0,0.4)"
                  : "0 4px 24px rgba(0,0,0,0.45)",
            }
          : undefined
      }
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
    </motion.div>
  );
}
