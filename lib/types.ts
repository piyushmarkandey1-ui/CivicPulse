export type Severity          = "critical" | "moderate" | "resolved";
export type Category          = "Pothole" | "Water Clogging" | "Crack" | "Road Damage" | "Other";
export type IssueStatus       = "Reported" | "Verified" | "In Progress" | "Resolved";
export type TrafficImpact     = "Low" | "Medium" | "High";
export type RepairCostEstimate = "< ₹50k" | "₹50k–2L" | "> ₹2L";

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
  /** Smart prioritization fields */
  priorityScore?:      number;          // 0–100, computed by computePriorityScore()
  trafficImpact?:      TrafficImpact;
  repairCostEstimate?: RepairCostEstimate;
  duplicateCount?:     number;          // set by deduplication pass on the map
  officerNote?:        string;
  lastUpdated?:        string;
}
