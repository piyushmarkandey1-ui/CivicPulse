export type Severity    = "critical" | "moderate" | "resolved";
export type Category    = "Pothole" | "Water Clogging" | "Crack" | "Road Damage" | "Other";
export type IssueStatus = "Reported" | "Verified" | "In Progress" | "Resolved";

export interface Issue {
  id:          string;
  lat:         number;
  lng:         number;
  category:    Category;
  severity:    Severity;
  title:       string;
  description: string;
  ward:        string;
  status:      IssueStatus;
  reportedAt:  string;   // ISO-8601
  upvotes:     number;
  address:     string;
  photoSeed:   number;
}
