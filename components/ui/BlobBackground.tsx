"use client";

/**
 * BlobBackground — Subtle institutional atmospheric background
 */
export function BlobBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Subtle Sand atmospheric glow at top */}
      <div
        className="absolute -top-60 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(214,194,163,0.18) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Subtle municipal grid lines */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(36,34,34,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(36,34,34,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
