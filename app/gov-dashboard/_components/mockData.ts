// ─── Ward Performance Data ──────────────────────────────────────────────────────
export interface WardPerformance {
  id: string;
  name: string;
  totalReports: number;
  resolvedPercent: number;
  avgResponseDays: number;
  status: "Excellent" | "Good" | "Needs Improvement" | "Critical";
}

export const WARD_DATA: WardPerformance[] = [
  { id: "W12", name: "Ward 12 — Andheri East", totalReports: 1240, resolvedPercent: 94, avgResponseDays: 2.1, status: "Excellent" },
  { id: "W07", name: "Ward 7 — Bandra West", totalReports: 890, resolvedPercent: 88, avgResponseDays: 3.4, status: "Good" },
  { id: "W23", name: "Ward 23 — Powai", totalReports: 650, resolvedPercent: 85, avgResponseDays: 3.8, status: "Good" },
  { id: "W31", name: "Ward 31 — Versova", totalReports: 512, resolvedPercent: 76, avgResponseDays: 5.2, status: "Needs Improvement" },
  { id: "W08", name: "Ward 8 — Juhu", totalReports: 420, resolvedPercent: 71, avgResponseDays: 6.1, status: "Needs Improvement" },
  { id: "W10", name: "Ward 10 — Sion", totalReports: 1105, resolvedPercent: 62, avgResponseDays: 8.5, status: "Critical" },
  { id: "W17", name: "Ward 17 — Jogeshwari", totalReports: 780, resolvedPercent: 58, avgResponseDays: 9.2, status: "Critical" },
  { id: "W03", name: "Ward 3 — Colaba", totalReports: 210, resolvedPercent: 96, avgResponseDays: 1.8, status: "Excellent" },
  { id: "W14", name: "Ward 14 — Dadar", totalReports: 950, resolvedPercent: 82, avgResponseDays: 4.5, status: "Good" },
  { id: "W21", name: "Ward 21 — Malad West", totalReports: 840, resolvedPercent: 68, avgResponseDays: 7.3, status: "Needs Improvement" },
];

// ─── Escalation Alerts ────────────────────────────────────────────────────────
export interface Escalation {
  id: string;
  title: string;
  ward: string;
  daysOverdue: number;
  category: string;
  description: string;
}

export const ESCALATIONS: Escalation[] = [
  { id: "ESC-001", title: "Severe Waterlogging on S.V. Road", ward: "Ward 10 — Sion", daysOverdue: 14, category: "Water Clogging", description: "Major waterlogging reported 3 weeks ago. Drain appears completely blocked. Immediate desilting required." },
  { id: "ESC-002", title: "Bridge Parapet Crack", ward: "Ward 17 — Jogeshwari", daysOverdue: 9, category: "Crack", description: "Deep structural crack observed on pedestrian bridge. High risk of partial collapse. Engineer visit pending." },
  { id: "ESC-003", title: "Multiple Pothole Cluster", ward: "Ward 21 — Malad West", daysOverdue: 6, category: "Pothole", description: "Cluster of 8-10 massive potholes causing traffic snarls and accidents. Temporary patching washed away." },
  { id: "ESC-004", title: "Open Manhole near School", ward: "Ward 31 — Versova", daysOverdue: 4, category: "Other", description: "Manhole cover stolen. Reported multiple times by parents. Extremely dangerous for children." },
];

// ─── KPI Data ─────────────────────────────────────────────────────────────────
export const KPI_DATA = {
  resolutionRate: 78, // %
  avgResponseTime: 4.2, // days
  pendingEscalations: 24,
  trustScore: 8.4, // out of 10
};

// Data for sparklines (last 7 days)
export const SPARKLINE_RESOLUTION = [{v: 60}, {v: 65}, {v: 70}, {v: 68}, {v: 75}, {v: 76}, {v: 78}];
export const SPARKLINE_RESPONSE = [{v: 6.5}, {v: 6.0}, {v: 5.8}, {v: 5.2}, {v: 4.8}, {v: 4.5}, {v: 4.2}];
export const SPARKLINE_ESCALATIONS = [{v: 45}, {v: 40}, {v: 35}, {v: 38}, {v: 30}, {v: 26}, {v: 24}];
export const SPARKLINE_TRUST = [{v: 7.2}, {v: 7.4}, {v: 7.5}, {v: 7.8}, {v: 8.0}, {v: 8.2}, {v: 8.4}];

// ─── Chart Data ───────────────────────────────────────────────────────────────
export const TREND_DATA = [
  { month: "Jan", submitted: 4000, resolved: 3200 },
  { month: "Feb", submitted: 3500, resolved: 3400 },
  { month: "Mar", submitted: 4200, resolved: 3800 },
  { month: "Apr", submitted: 4800, resolved: 4000 },
  { month: "May", submitted: 5500, resolved: 4500 },
  { month: "Jun", submitted: 6200, resolved: 5800 }, // Monsoon start
];

export const DEPT_RESOLUTION_DATA = [
  { dept: "Roads & Traffic", rate: 65 },
  { dept: "Water & Sanitation", rate: 82 },
  { dept: "Solid Waste", rate: 88 },
  { dept: "Parks & Trees", rate: 91 },
  { dept: "Bridges", rate: 54 },
];

// ─── Before/After Slider Data ────────────────────────────────────────────────
export const BEFORE_AFTER_EXAMPLES = [
  {
    id: "BA-1",
    title: "D.N. Nagar Pothole Repair",
    ward: "Ward 12",
    beforeImg: "/pothole-combined.jpg",
    afterImg: "/pothole-combined.jpg",
    combinedImg: "/pothole-combined.jpg",
  },
  {
    id: "BA-2",
    title: "Goregaon Market Drain Clearance",
    ward: "Ward 19",
    beforeImg: "/drain-combined.jpg",
    afterImg: "/drain-combined.jpg",
    combinedImg: "/drain-combined.jpg",
  },
];
