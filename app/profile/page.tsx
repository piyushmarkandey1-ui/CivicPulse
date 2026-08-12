import type { Metadata } from "next";
import ProfileClient from "./_components/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | CivicPulse",
  description: "View your civic impact, track submitted reports, and unlock community badges.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
