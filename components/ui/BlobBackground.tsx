"use client";

import { useEffect, useRef } from "react";

export function BlobBackground() {
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gray-soft">
      <div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(37,99,235,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: prefersReduced ? "none" : "blob-float 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(16,185,129,0.05) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: prefersReduced ? "none" : "blob-float 34s ease-in-out infinite reverse",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}
