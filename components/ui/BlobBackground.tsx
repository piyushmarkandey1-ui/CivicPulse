"use client";

/**
 * BlobBackground — dramatically reduced.
 * One single very subtle teal atmospheric gradient.
 * The amber blob is gone. No bouncing/floating.
 */
export function BlobBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Single subtle teal atmospheric glow — top center */}
      <div
        className="absolute -top-60 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(79,209,165,0.06) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      {/* Very subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />
    </div>
  );
}
