import type { Metadata } from "next";
import MapPageClient from "./_components/MapPageClient";

export const metadata: Metadata = {
  title: "Live Map Dashboard",
  description:
    "Interactive real-time map of civic infrastructure issues across Mumbai wards. Filter by severity, track government response, and file new reports.",
};

export default function MapPage() {
  return <MapPageClient />;
}
