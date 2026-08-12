"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "maroon" | "copper" | "none";
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
  hover = true,
  glow = "none",
  padding = "md",
  animate = true,
}: GlassCardProps) {
  const Wrapper = animate ? motion.div : "div";

  const animProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        whileHover: hover
          ? {
              y: -2,
              borderColor: "#C9C0B3",
              boxShadow:
                glow === "maroon" || glow === "copper"
                  ? "0 8px 30px rgba(139, 38, 53, 0.08), 0 2px 8px rgba(36, 34, 34, 0.04)"
                  : "0 8px 30px rgba(36, 34, 34, 0.08)",
              transition: { duration: 0.2, ease: EASE_OUT_QUAD },
            }
          : undefined,
      }
    : {
        whileHover: hover
          ? {
              y: -2,
              borderColor: "#C9C0B3",
              boxShadow:
                glow === "maroon" || glow === "copper"
                  ? "0 8px 30px rgba(139, 38, 53, 0.08), 0 2px 8px rgba(36, 34, 34, 0.04)"
                  : "0 8px 30px rgba(36, 34, 34, 0.08)",
              transition: { duration: 0.2, ease: EASE_OUT_QUAD },
            }
          : undefined,
      };

  return (
    <Wrapper
      {...(animProps as any)}
      className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-white border border-[#DED8CD]",
        "shadow-[0_4px_20px_rgba(36,34,34,0.06)]",
        "transition-all duration-300",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </Wrapper>
  );
}
