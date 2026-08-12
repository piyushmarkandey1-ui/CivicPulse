import type { Metadata } from "next";
import GovDashboardClient from "./_components/GovDashboardClient";

export const metadata: Metadata = {
  title: "Government Dashboard | CivicPulse",
  description: "Accountability and operations dashboard for city officials to track civic issue resolution.",
};

export default function GovDashboardPage() {
  return <GovDashboardClient />;
}
