"use client";

/**
 * BlobBackground — Ambient floating spatial atmospheric canvas
 */
export function BlobBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Top warm sand glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[1000px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(214,194,163,0.22) 0%, rgba(247,244,237,0) 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Middle subtle maroon ambient breath */}
      <div
        className="absolute top-[40%] right-[-10%] h-[600px] w-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,38,53,0.035) 0%, rgba(247,244,237,0) 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Lower left warm sand glow */}
      <div
        className="absolute top-[70%] left-[-10%] h-[600px] w-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(214,194,163,0.18) 0%, rgba(247,244,237,0) 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Soft spatial grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(36,34,34,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(36,34,34,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
