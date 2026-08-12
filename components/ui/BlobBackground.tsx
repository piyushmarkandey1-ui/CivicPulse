"use client";

import { motion } from "framer-motion";

/**
 * BlobBackground — fixed, full-screen animated gradient blobs.
 * Purely decorative; aria-hidden. Sits at z-0 behind all page content.
 */
export function BlobBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Blob 1 — Teal, top-left */}
      <motion.div
        className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(20,184,166,0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x:     [0, 50, -20, 35, 0],
          y:     [0, -40, 30, 50, 0],
          scale: [1, 1.06, 0.97, 1.04, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 2 — Amber, bottom-right */}
      <motion.div
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 60% 60%, rgba(245,158,11,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x:     [0, -40, 25, -30, 0],
          y:     [0, 35, -20, -40, 0],
          scale: [1, 0.96, 1.08, 0.98, 1],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Blob 3 — Teal-muted, center-right */}
      <motion.div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x:     [0, 30, -15, 25, 0],
          y:     [0, -25, 40, -30, 0],
          scale: [1, 1.04, 0.96, 1.02, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8,
        }}
      />

      {/* Static noise/grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
