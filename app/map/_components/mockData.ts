import { type Issue } from "@/lib/types";

// ─── Mock Data — 18 issues around Mumbai Andheri/Bandra corridor ──────────────

// Helper to generate realistic recent dates
const now = Date.now();
const getPastDate = (daysAgo: number, hoursAgo: number) => {
  return new Date(now - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000)).toISOString();
};

/**
 * CivicPulse AI Priority Engine Scoring Model (0–100)
 * - Severity Weight: 40% (Critical: 40, Moderate: 24, Low/Resolved: 8)
 * - Traffic Impact:  30% (High: 30, Medium: 18, Low: 6)
 * - Citizen Upvotes: 20% (Normalized up to 20 pts)
 * - Duplicate Clustering: 10% (Cluster density up to 10 pts)
 */
export function calcPriorityScore(
  severity: "critical" | "moderate" | "resolved",
  trafficImpact: "high" | "medium" | "low" = "medium",
  upvotes: number = 20,
  duplicateCount: number = 2
): number {
  const sevScore = severity === "critical" ? 40 : severity === "moderate" ? 24 : 8;
  const trafScore = trafficImpact === "high" ? 30 : trafficImpact === "medium" ? 18 : 6;
  const upvScore = Math.min(20, Math.round((upvotes / 110) * 20));
  const dupScore = Math.min(10, duplicateCount * 2);
  return Math.min(100, Math.max(15, sevScore + trafScore + upvScore + dupScore));
}

export const MOCK_ISSUES: Issue[] = [
  {
    id: "ISS-001", lat: 19.1197, lng: 72.8468,
    category: "Pothole", severity: "critical",
    title: "Large pothole causing accidents",
    description: "A dangerous 2-foot deep pothole has formed near the Andheri station junction. Multiple two-wheelers have skidded. The asphalt has completely caved in following last week's rains. Immediate patching required.",
    ward: "Ward 12 — Andheri East", status: "In Progress",
    reportedAt: getPastDate(1, 21), upvotes: 47,
    address: "S.V. Road, near Andheri Station, Andheri East", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-002", lat: 19.0544, lng: 72.8405,
    category: "Water Clogging", severity: "critical",
    title: "Severe waterlogging blocking traffic",
    description: "Knee-deep water accumulation at Turner Road junction for over 3 days. Storm drain appears blocked. Businesses, schools and residential societies severely affected. BMC crew not seen.",
    ward: "Ward 7 — Bandra West", status: "Verified",
    reportedAt: getPastDate(3, 4), upvotes: 89,
    address: "Turner Road Junction, Bandra West", photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-003", lat: 19.1176, lng: 72.9060,
    category: "Crack", severity: "critical",
    title: "Structural crack in footbridge",
    description: "Visible crack running 4 metres along the footbridge over Powai Lake approach. Bridge sways under load. Multiple residents have reported it but no action taken for 6 weeks.",
    ward: "Ward 23 — Powai", status: "Reported",
    reportedAt: getPastDate(2, 14), upvotes: 63,
    address: "Hiranandani Gardens Footbridge, Powai", photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-004", lat: 19.1075, lng: 72.8263,
    category: "Water Clogging", severity: "moderate",
    title: "Waterlogging near school gate",
    description: "Children have to wade through ankle-deep water every morning. Blocked drain near school entrance. The problem occurs every monsoon but no permanent fix has been done.",
    ward: "Ward 8 — Juhu", status: "In Progress",
    reportedAt: getPastDate(2, 3), upvotes: 38,
    address: "JVPD Scheme School, Juhu", photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-005", lat: 19.1320, lng: 72.8181,
    category: "Road Damage", severity: "moderate",
    title: "Road collapsed after pipeline work",
    description: "BMC pipeline repair work left without proper road restoration. Large depression in road surface, about 6 inches deep over 15 sq metres. Creates hazardous driving conditions at night.",
    ward: "Ward 31 — Versova", status: "Verified",
    reportedAt: getPastDate(3, 11), upvotes: 29,
    address: "Versova Road near Andheri-Versova Link Road", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-006", lat: 19.1140, lng: 72.8557,
    category: "Pothole", severity: "resolved",
    title: "Pothole cluster patched — good work!",
    description: "Cluster of 5 potholes on D.N. Nagar main road. Reported 12 days ago, BMC team arrived within 4 days and completed proper hot-mix patching. Road now smooth.",
    ward: "Ward 12 — Andheri East", status: "Resolved",
    reportedAt: getPastDate(0, 5), upvotes: 21,
    address: "D.N. Nagar Main Road, Andheri West", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-007", lat: 19.0760, lng: 72.8777,
    category: "Crack", severity: "moderate",
    title: "Crumbling retaining wall on arterial road",
    description: "The retaining wall along the main road shows deep horizontal cracks and is bulging outward. Risk of partial collapse in heavy rain. Spans ~30 metres along the embankment.",
    ward: "Ward 15 — Dharavi", status: "Reported",
    reportedAt: getPastDate(0, 16), upvotes: 55,
    address: "Dharavi Main Road, near 90 Feet Road", photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-008", lat: 19.0663, lng: 72.8526,
    category: "Road Damage", severity: "critical",
    title: "Road surface completely destroyed",
    description: "Entire stretch of road (approx 200m) has broken up. No asphalt remaining, only loose gravel and potholes of varying sizes. Speed limit signs meaningless at this point.",
    ward: "Ward 10 — Sion", status: "Verified",
    reportedAt: getPastDate(1, 14), upvotes: 102,
    address: "Dharavi-Sion Link Road, Sion", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-009", lat: 19.1663, lng: 72.8526,
    category: "Water Clogging", severity: "resolved",
    title: "Drain cleared, waterlogging fixed",
    description: "Chronic waterlogging at Goregaon market reported. BMC desilted the drain within 7 days. No waterlogging during last heavy rain on August 8th. Excellent response.",
    ward: "Ward 19 — Goregaon", status: "Resolved",
    reportedAt: getPastDate(0, 15), upvotes: 18,
    address: "Goregaon West Market, Goregaon", photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-010", lat: 19.1874, lng: 72.8481,
    category: "Pothole", severity: "moderate",
    title: "Multiple potholes near market",
    description: "Stretch of road near Malad market has developed 8-10 medium-sized potholes over the past 2 weeks. Heavy truck traffic appears to be worsening them daily.",
    ward: "Ward 21 — Malad West", status: "Reported",
    reportedAt: getPastDate(1, 17), upvotes: 24,
    address: "Malad Market, S.V. Road, Malad West", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-011", lat: 19.2288, lng: 72.8566,
    category: "Other", severity: "moderate",
    title: "Damaged streetlights create dark stretch",
    description: "6 consecutive streetlights non-functional on Borivali main road. Stretch is completely dark after 8pm. Residents fear mugging. Multiple complaints made at ward office — no response.",
    ward: "Ward 25 — Borivali West", status: "Reported",
    reportedAt: getPastDate(1, 20), upvotes: 41,
    address: "Borivali West Main Road, near IC Colony", photoUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-012", lat: 19.0910, lng: 72.8650,
    category: "Pothole", severity: "critical",
    title: "Accident-prone pothole at crossroads",
    description: "Massive pothole at busy SEEPZ crossroads. Two accidents in past week, one resulting in hospitalization. Depth approximately 14 inches. Completely unmarked, no warning signs.",
    ward: "Ward 14 — Andheri East", status: "In Progress",
    reportedAt: getPastDate(0, 20), upvotes: 73,
    address: "SEEPZ Crossroads, Andheri East", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-013", lat: 19.0399, lng: 72.8553,
    category: "Water Clogging", severity: "moderate",
    title: "Underpass floods in moderate rain",
    description: "The Mahim underpass floods to 2-3 feet depth even in moderate rainfall. Commuters stranded for hours. Pumping infrastructure seems non-functional.",
    ward: "Ward 6 — Mahim", status: "Verified",
    reportedAt: getPastDate(3, 8), upvotes: 66,
    address: "Mahim Underpass, Western Express Highway", photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-014", lat: 19.1057, lng: 72.8369,
    category: "Crack", severity: "resolved",
    title: "Bridge parapet repaired successfully",
    description: "Cracked parapet wall on the pedestrian bridge at Versova Link Road. Reported 3 weeks ago. BMC engineers inspected and repaired within agreed timeline. Citizens appreciate the response.",
    ward: "Ward 8 — Juhu", status: "Resolved",
    reportedAt: getPastDate(3, 8), upvotes: 12,
    address: "Versova Link Road Bridge, Juhu", photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-015", lat: 19.1445, lng: 72.8287,
    category: "Road Damage", severity: "moderate",
    title: "Service road completely broken up",
    description: "Service road parallel to Western Express Highway has disintegrated. Residents use it daily to access housing societies. BMC seems unaware as this is a disputed road asset.",
    ward: "Ward 16 — Oshiwara", status: "Reported",
    reportedAt: getPastDate(1, 10), upvotes: 33,
    address: "WEH Service Road, Oshiwara, Andheri West", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-016", lat: 19.0839, lng: 72.8984,
    category: "Pothole", severity: "moderate",
    title: "School bus route pothole",
    description: "Two large potholes on the route used by school buses. Parents concerned about safety. School principal has written to BMC. No action for 2 weeks.",
    ward: "Ward 18 — Kurla", status: "Verified",
    reportedAt: getPastDate(3, 6), upvotes: 48,
    address: "Kurla West Station Road, Kurla", photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-017", lat: 19.0640, lng: 72.8350,
    category: "Water Clogging", severity: "critical",
    title: "Society basement flooded for 5 days",
    description: "Basement parking of Kalanagar society flooded due to broken drain. 45 cars submerged or damaged. BMC drain inspection team visited but no fix attempted. Citizens threatening legal action.",
    ward: "Ward 7 — Bandra East", status: "In Progress",
    reportedAt: getPastDate(0, 6), upvotes: 91,
    address: "Kalanagar, Bandra East", photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISS-018", lat: 19.1550, lng: 72.8710,
    category: "Other", severity: "resolved",
    title: "Manhole cover replaced — issue closed",
    description: "Missing manhole cover on Jogeshwari main road was a major safety hazard. Reported 10 days ago with photographic evidence. BMC replaced it within 5 days. Excellent turnaround.",
    ward: "Ward 17 — Jogeshwari", status: "Resolved",
    reportedAt: getPastDate(2, 16), upvotes: 9,
    address: "Jogeshwari West Main Road", photoUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=800",
    city: "Mumbai",
    assignedDepartment: "Municipal Road Maintenance",
    assignedOfficer: "Er. S. R. Patil",
    progressStage: "Resolved",
  },
  // ─── Durg, Chhattisgarh Municipal Corridor ──────────────────────────────────
  {
    id: "ISS-019", lat: 21.1985, lng: 81.2801,
    category: "Pothole", severity: "critical",
    title: "Dangerous crater on Station Road Durg",
    description: "Deep asphalt rupture outside Durg Junction railway station auto stand. Causing severe traffic bottlenecks during train arrivals and frequent two-wheeler skids. Urgent hot-mix patching required.",
    ward: "Ward 22 — Station Road, Durg", status: "In Progress",
    reportedAt: getPastDate(1, 14), upvotes: 56,
    address: "Station Road, outside Durg Junction (SEC Railway), Durg",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: "₹50k – ₹5L", duplicateCount: 6, priorityScore: 92,
    city: "Durg",
    assignedDepartment: "Roads & Highway Infrastructure (PWD - Durg Division)",
    assignedOfficer: "Er. A. K. Sahu (Executive Engineer)",
    progressStage: "In Progress",
    triageNotes: "Crew dispatched with bituminous patch mix. Priority 1 due to railway station commuter flow.",
  },
  {
    id: "ISS-020", lat: 21.1904, lng: 81.2849,
    category: "Water Clogging", severity: "critical",
    title: "Monsoon drain overflow at Indira Market",
    description: "Main stormwater drainage blocked behind Indira Market vegetable mandi. Water accumulated up to 1.5 feet, affecting 80+ merchant stalls and pedestrian movement.",
    ward: "Ward 15 — Indira Market, Durg", status: "Verified",
    reportedAt: getPastDate(2, 6), upvotes: 74,
    address: "Indira Market Main Plaza, Durg",
    photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: "₹50k – ₹5L", duplicateCount: 8, priorityScore: 88,
    city: "Durg",
    assignedDepartment: "Municipal Water Supply & Sewerage Drainage",
    assignedOfficer: "Er. Vivek Dewangan (Assistant Engineer)",
    progressStage: "Department Assigned",
    triageNotes: "Suction tanker requested. Desilting of 120m underground drain scheduled.",
  },
  {
    id: "ISS-021", lat: 21.2052, lng: 81.2780,
    category: "Road Damage", severity: "critical",
    title: "Surface disintegration on Mohan Nagar Flyover",
    description: "Bitumen wearing coat washed away on Mohan Nagar flyover approach from Raipur-Bhilai side. Rebar mesh exposed in two expansion joint patches.",
    ward: "Ward 12 — Mohan Nagar, Durg", status: "In Progress",
    reportedAt: getPastDate(0, 18), upvotes: 82,
    address: "Mohan Nagar Flyover Approach, NH-53 corridor, Durg",
    photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: "₹5L – ₹25L", duplicateCount: 11, priorityScore: 95,
    city: "Durg",
    assignedDepartment: "Roads & Highway Infrastructure (PWD)",
    assignedOfficer: "Er. Rameshwar Verma (Divisional Engineer)",
    progressStage: "In Progress",
    triageNotes: "Traffic diverted to service lane during night hours for micro-surfacing.",
  },
  {
    id: "ISS-022", lat: 21.1870, lng: 81.2865,
    category: "Crack", severity: "moderate",
    title: "Longitudinal road fissure near Ganj Mandi",
    description: "15-metre fissure opening along grain market truck corridor. Heavy trucks tilt dangerously while turning into the mandi depot.",
    ward: "Ward 08 — Ganj Para, Durg", status: "Reported",
    reportedAt: getPastDate(3, 8), upvotes: 39,
    address: "Ganj Mandi Road, Ganj Para, Durg",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: "₹50k – ₹5L", duplicateCount: 3, priorityScore: 74,
    city: "Durg",
    assignedDepartment: "Public Works Department (Civil Maintenance)",
    assignedOfficer: "Er. Neha Chandrakar",
    progressStage: "AI Triaged",
  },
  {
    id: "ISS-023", lat: 21.1762, lng: 81.2890,
    category: "Pothole", severity: "moderate",
    title: "Pothole cluster in Padmanabhpur residential zone",
    description: "Cluster of 4 potholes following municipal pipeline replacement. Road backfilled with loose gravel without proper asphalt topping.",
    ward: "Ward 05 — Padmanabhpur, Durg", status: "Verified",
    reportedAt: getPastDate(2, 12), upvotes: 41,
    address: "Padmanabhpur Main Road, Sector B, Durg",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: "₹10k – ₹50k", duplicateCount: 4, priorityScore: 68,
    city: "Durg",
    assignedDepartment: "Roads & Highway Infrastructure (PWD)",
    assignedOfficer: "Er. A. K. Sahu",
    progressStage: "Department Assigned",
  },
  {
    id: "ISS-024", lat: 21.1820, lng: 81.2610,
    category: "Road Damage", severity: "moderate",
    title: "Shoulder erosion on Pulgaon Shivnath River approach",
    description: "Rain runoff eroded 2 meters of road shoulder leading to old Shivnath river bridge. Guardrail foundation exposed.",
    ward: "Ward 03 — Pulgaon, Durg", status: "Reported",
    reportedAt: getPastDate(4, 2), upvotes: 27,
    address: "Pulgaon Chowk & Shivnath River Road, Durg",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: "₹50k – ₹5L", duplicateCount: 2, priorityScore: 65,
    city: "Durg",
    assignedDepartment: "Public Works Department (Civil Maintenance)",
    progressStage: "Reported",
  },
  {
    id: "ISS-025", lat: 21.1930, lng: 81.2835,
    category: "Other", severity: "resolved",
    title: "Culvert grating replaced at Patel Chowk",
    description: "Damaged iron grating over main intersection culvert replaced with heavy-duty precast concrete slab. Verified with field photography.",
    ward: "Ward 18 — Patel Chowk, Durg", status: "Resolved",
    reportedAt: getPastDate(5, 10), upvotes: 18,
    address: "Patel Chowk / Collectorate Road, Durg",
    photoUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "low", repairCostEstimate: "₹10k – ₹50k", duplicateCount: 5, priorityScore: 35,
    city: "Durg",
    assignedDepartment: "Municipal Water Supply & Sewerage Drainage",
    assignedOfficer: "Er. Vivek Dewangan",
    progressStage: "Resolved",
  },
  {
    id: "ISS-026", lat: 21.1680, lng: 81.2950,
    category: "Pothole", severity: "critical",
    title: "Blind curve crater on Borsi Main Road",
    description: "Massive crater on unlit curve near Borsi canal bridge. Immediate hazard for commuters traveling towards Bhilai Steel City.",
    ward: "Ward 31 — Borsi, Durg", status: "In Progress",
    reportedAt: getPastDate(1, 4), upvotes: 68,
    address: "Borsi Main Road, near Canal Bridge, Durg",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: "₹50k – ₹5L", duplicateCount: 7, priorityScore: 90,
    city: "Durg",
    assignedDepartment: "Roads & Highway Infrastructure (PWD - Durg Division)",
    assignedOfficer: "Er. Rameshwar Verma",
    progressStage: "In Progress",
  },
];

// Ensure every issue in MOCK_ISSUES has its calculated AI priority score (0-100)
MOCK_ISSUES.forEach((issue) => {
  if (issue.priorityScore === undefined) {
    const defaultTraffic =
      issue.severity === "critical" ? "high" : issue.severity === "moderate" ? "medium" : "low";
    const defaultDuplicates =
      issue.severity === "critical" ? 4 : issue.severity === "moderate" ? 2 : 0;
    issue.priorityScore = calcPriorityScore(
      issue.severity,
      issue.trafficImpact || defaultTraffic,
      issue.upvotes || 20,
      issue.duplicateCount !== undefined ? issue.duplicateCount : defaultDuplicates
    );
  }
});

// ─── Ward leaderboard for sidebar ────────────────────────────────────────────
export const WARD_LEADERBOARD = [
  { name: "Ward 12 — Andheri East", score: 94, delta: "+12%" },
  { name: "Ward 7 — Bandra West",   score: 87, delta: "+8%"  },
  { name: "Ward 23 — Powai",        score: 81, delta: "+21%" },
  { name: "Ward 31 — Versova",      score: 73, delta: "+5%"  },
  { name: "Ward 8 — Juhu",          score: 68, delta: "+3%"  },
  { name: "Ward 10 — Sion",         score: 61, delta: "-2%"  },
  { name: "Ward 17 — Jogeshwari",   score: 58, delta: "+9%"  },
];

// ─── Heatmap density points ───────────────────────────────────────────────────
export const HOTSPOT_DATA = [
  { lat: 19.1197, lng: 72.8468, intensity: 9 },
  { lat: 19.0544, lng: 72.8405, intensity: 8 },
  { lat: 19.0910, lng: 72.8650, intensity: 7 },
  { lat: 19.0640, lng: 72.8350, intensity: 8 },
  { lat: 19.1176, lng: 72.9060, intensity: 6 },
  { lat: 19.0760, lng: 72.8777, intensity: 5 },
  { lat: 19.0663, lng: 72.8526, intensity: 7 },
  { lat: 19.0399, lng: 72.8553, intensity: 5 },
  // Durg hotspots
  { lat: 21.1985, lng: 81.2801, intensity: 9 },
  { lat: 21.1904, lng: 81.2849, intensity: 8 },
  { lat: 21.2052, lng: 81.2780, intensity: 9 },
  { lat: 21.1680, lng: 81.2950, intensity: 7 },
];

export const CITIES = [
  { id: "Mumbai", name: "Mumbai", state: "Maharashtra", center: [19.09, 72.865] as [number, number], zoom: 13 },
  { id: "Durg", name: "Durg", state: "Chhattisgarh", center: [21.1904, 81.2849] as [number, number], zoom: 13.5 },
] as const;

export const DURG_WARDS = [
  "Ward 22 — Station Road, Durg",
  "Ward 15 — Indira Market, Durg",
  "Ward 12 — Mohan Nagar, Durg",
  "Ward 08 — Ganj Para, Durg",
  "Ward 05 — Padmanabhpur, Durg",
  "Ward 03 — Pulgaon, Durg",
  "Ward 18 — Patel Chowk, Durg",
  "Ward 31 — Borsi, Durg",
  "Ward 10 — Gaya Nagar, Durg",
  "Ward 14 — Civil Lines, Durg",
];

export const MUMBAI_WARDS = [
  "Ward 12 — Andheri East",
  "Ward 7 — Bandra West",
  "Ward 23 — Powai",
  "Ward 31 — Versova",
  "Ward 8 — Juhu",
  "Ward 10 — Sion",
  "Ward 17 — Jogeshwari",
  "Ward 18 — Kurla",
  "Ward 16 — Oshiwara",
];

