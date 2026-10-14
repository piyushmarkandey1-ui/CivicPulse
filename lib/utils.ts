import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Issue } from "@/lib/types";

/** Merge Tailwind classes safely (clsx + twMerge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Compute a 0–100 priority score for a road-damage issue.
 *
 * Breakdown:
 *  - Severity      → up to 40 pts  (critical=40, moderate=20, resolved=0)
 *  - Upvotes       → up to 20 pts  (capped at 100 upvotes → 20 pts)
 *  - Traffic Impact→ up to 20 pts  (High=20, Medium=10, Low=5, unknown=0)
 *  - Days overdue  → up to 20 pts  (1 pt per day, capped at 20)
 */
export function computePriorityScore(issue: Issue): number {
  // Severity component
  const sevPts =
    issue.severity === "critical" ? 40 :
    issue.severity === "moderate" ? 20 : 0;

  // Upvotes component (0–20)
  const upvotePts = Math.min((issue.upvotes ?? 0), 100) * 0.2;

  // Traffic impact component
  const trafficPts =
    issue.trafficImpact === "High"   ? 20 :
    issue.trafficImpact === "Medium" ? 10 :
    issue.trafficImpact === "Low"    ? 5  : 0;

  // Days overdue component (only for unresolved issues)
  let daysPts = 0;
  if (issue.status !== "Resolved" && issue.reportedAt) {
    const reportedMs = new Date(issue.reportedAt).getTime();
    const daysOpen = (Date.now() - reportedMs) / (1000 * 60 * 60 * 24);
    daysPts = Math.min(Math.floor(daysOpen), 20);
  }

  return Math.round(sevPts + upvotePts + trafficPts + daysPts);
}
