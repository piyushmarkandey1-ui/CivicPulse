export type Severity      = "critical" | "moderate" | "resolved";
export type Category      = "Pothole" | "Water Clogging" | "Crack" | "Road Damage" | "Other";
export type IssueStatus   = "Reported" | "Verified" | "In Progress" | "Resolved" | "Escalated";
export type TrafficImpact = "low" | "medium" | "high";
export type RepairScale   = "small_patch" | "road_section" | "full_road";

/** Human-readable cost band mapped from RepairScale */
export const REPAIR_COST_MAP: Record<RepairScale, string> = {
  small_patch:   "₹10k – ₹50k",
  road_section:  "₹50k – ₹5L",
  full_road:     "₹5L – ₹25L",
};

export interface Issue {
  id:                  string;
  lat:                 number;
  lng:                 number;
  category:            Category;
  severity:            Severity;
  title:               string;
  description:         string;
  ward:                string;
  status:              IssueStatus;
  reportedAt:          string;   // ISO-8601
  upvotes:             number;
  address:             string;
  photoUrl?:           string;
  reporterUid?:        string;
  escalatedAt?:        string;
  resolutionPhotoUrl?: string;
  /** Added by the Impact step */
  trafficImpact?:      TrafficImpact;
  repairCostEstimate?: string;   // e.g. "₹50k – ₹5L"
  duplicateCount?:     number;
  priorityScore?:      number;
}
