import { type Issue } from "@/lib/types";

export interface BadgeEarned {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  isLocked: boolean;
}

export const USER_PROFILE = {
  name: "Vikram Sharma",
  avatarSeed: "vikram99",
  joinDate: "March 2026",
  totalReports: 12,
  reputationScore: 840,
  level: "Active Reporter",
  nextBadge: "Ward Guardian",
  reportsNeededForNextBadge: 3,
  reportsForNextBadgeTotal: 15, // e.g., 12 out of 15
};

export const USER_BADGES: BadgeEarned[] = [
  { id: "B1", name: "First Report", icon: "🌱", description: "Submitted your first civic issue.", unlockedAt: "2026-03-12", isLocked: false },
  { id: "B2", name: "Eagle Eye", icon: "👁️", description: "Reported 5 critical severity issues.", unlockedAt: "2026-05-04", isLocked: false },
  { id: "B3", name: "Community Helper", icon: "🤝", description: "Upvoted 10 issues from others.", unlockedAt: "2026-06-22", isLocked: false },
  { id: "B4", name: "Verified Citizen", icon: "✅", description: "Had 3 reports verified by officials.", unlockedAt: "2026-08-01", isLocked: false },
  { id: "B5", name: "Ward Guardian", icon: "🛡️", description: "Submit 15 valid reports in a single ward.", isLocked: true },
  { id: "B6", name: "City Legend", icon: "👑", description: "Reach a reputation score of 5000.", isLocked: true },
];

export const MY_REPORTS: Issue[] = [
  {
    id: "ISS-012", lat: 19.0910, lng: 72.8650,
    category: "Pothole", severity: "critical",
    title: "Accident-prone pothole at crossroads",
    description: "Massive pothole at busy SEEPZ crossroads. Two accidents in past week, one resulting in hospitalization. Depth approximately 14 inches.",
    ward: "Ward 14 — Andheri East", status: "In Progress",
    reportedAt: "2026-08-08T11:00:00Z", upvotes: 73,
    address: "SEEPZ Crossroads, Andheri East", photoSeed: 59,
  },
  {
    id: "ISS-007", lat: 19.0760, lng: 72.8777,
    category: "Crack", severity: "moderate",
    title: "Crumbling retaining wall on arterial road",
    description: "The retaining wall along the main road shows deep horizontal cracks and is bulging outward. Risk of partial collapse in heavy rain.",
    ward: "Ward 15 — Dharavi", status: "Reported",
    reportedAt: "2026-08-11T08:00:00Z", upvotes: 55,
    address: "Dharavi Main Road", photoSeed: 33,
  },
  {
    id: "ISS-018", lat: 19.1550, lng: 72.8710,
    category: "Other", severity: "resolved",
    title: "Manhole cover replaced — issue closed",
    description: "Missing manhole cover on Jogeshwari main road was a major safety hazard. Reported 10 days ago with photographic evidence.",
    ward: "Ward 17 — Jogeshwari", status: "Resolved",
    reportedAt: "2026-08-02T12:00:00Z", upvotes: 9,
    address: "Jogeshwari West Main Road", photoSeed: 71,
  },
];
