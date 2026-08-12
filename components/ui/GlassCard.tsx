"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "teal" | "amber" | "none";
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const glowMap = {
  teal:  "hover:shadow-[0_0_30px_rgba(20,184,166,0.25),0_0_60px_rgba(20,184,166,0.1)]",
  amber: "hover:shadow-[0_0_30px_rgba(245,158,11,0.25),0_0_60px_rgba(245,158,11,0.1)]",
  none:  "",
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      className={cn(
        "glass rounded-2xl relative overflow-hidden",
        "transition-shadow duration-500",
        paddingMap[padding],
        glowMap[glow],
        className
      )}
    >
      {/* Subtle inner top-highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      {children}
    </motion.div>
  );
}
