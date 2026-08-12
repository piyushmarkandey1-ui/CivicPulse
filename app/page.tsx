import type { Metadata } from "next";
import LandingPage from "./_components/LandingPage";

export const metadata: Metadata = {
  title: "CivicPulse — Geospatial Infrastructure Accountability",
  description:
    "Report potholes, water clogging, and unsafe structures with geotagged photos. Track government response in real time. Hold officials publicly accountable.",
  keywords: [
    "civic issues", "pothole reporting", "infrastructure accountability",
    "geospatial", "live map", "government transparency", "ward leaderboard",
  ],
  openGraph: {
    title: "CivicPulse — Geospatial Infrastructure Accountability",
    description:
      "Report civic issues on a live map. Track government response. Score accountability publicly.",
    type: "website",
  },
};

export default function Page() {
  return <LandingPage />;
}
