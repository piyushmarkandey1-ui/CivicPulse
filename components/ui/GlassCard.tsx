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
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        whileHover: hover
          ? {
              y: -3,
              borderColor: "rgba(139, 38, 53, 0.25)",
              boxShadow:
                glow === "maroon" || glow === "copper"
                  ? "0 16px 40px rgba(139, 38, 53, 0.1), 0 4px 12px rgba(36, 34, 34, 0.04)"
                  : "0 16px 40px rgba(36, 34, 34, 0.08), 0 2px 8px rgba(36, 34, 34, 0.03)",
              transition: { duration: 0.2, ease: EASE_OUT_QUAD },
            }
          : undefined,
      }
    : {
        whileHover: hover
          ? {
              y: -3,
              borderColor: "rgba(139, 38, 53, 0.25)",
              boxShadow:
                glow === "maroon" || glow === "copper"
                  ? "0 16px 40px rgba(139, 38, 53, 0.1), 0 4px 12px rgba(36, 34, 34, 0.04)"
                  : "0 16px 40px rgba(36, 34, 34, 0.08), 0 2px 8px rgba(36, 34, 34, 0.03)",
              transition: { duration: 0.2, ease: EASE_OUT_QUAD },
            }
          : undefined,
      };

  return (
    <Wrapper
      {...(animProps as any)}
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-white/85 backdrop-blur-md border border-[#DED8CD]/60",
        "shadow-[0_8px_30px_rgba(36,34,34,0.06),0_1px_3px_rgba(36,34,34,0.03)]",
        "transition-all duration-300",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </Wrapper>
  );
}
