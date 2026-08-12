"use client";

import dynamic from "next/dynamic";

// dynamic with ssr:false must live inside a Client Component
const MapDashboard = dynamic(() => import("./MapDashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-background">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 rounded-full border-2 border-copper border-t-transparent animate-spin"
          aria-label="Loading map"
        />
        <p className="text-text-muted text-sm font-medium tracking-wide">
          Loading live map…
        </p>
      </div>
    </div>
  ),
});

export default function MapPageClient() {
  return (
    <div className="relative overflow-hidden" style={{ height: "calc(100vh - 80px)" }}>
      <MapDashboard />
    </div>
  );
}
