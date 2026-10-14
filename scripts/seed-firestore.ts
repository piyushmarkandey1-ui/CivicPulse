/**
 * scripts/seed-firestore.ts
 *
 * Seeds the Firestore "issues" collection with 18 demo issues.
 * Includes all fields from the Impact step: trafficImpact, repairCostEstimate,
 * duplicateCount, and priorityScore.
 *
 * Run with:
 *   npm run seed
 *
 * Prerequisites:
 *   Set in .env.local (loaded automatically by dotenv below):
 *     NEXT_PUBLIC_FIREBASE_API_KEY
 *     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *     NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *     NEXT_PUBLIC_FIREBASE_APP_ID
 */

import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local first so env vars are available before Firebase init
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// ─── Types (inlined to avoid path-alias resolution at runtime) ─────────────────
type Severity      = "critical" | "moderate" | "resolved";
type Category      = "Pothole" | "Water Clogging" | "Crack" | "Road Damage" | "Other";
type IssueStatus   = "Reported" | "Verified" | "In Progress" | "Resolved" | "Escalated";
type TrafficImpact = "low" | "medium" | "high";
type RepairScale   = "small_patch" | "road_section" | "full_road";

const REPAIR_COST_MAP: Record<RepairScale, string> = {
  small_patch:  "₹10k – ₹50k",
  road_section: "₹50k – ₹5L",
  full_road:    "₹5L – ₹25L",
};

interface SeedIssue {
  id:                  string;
  lat:                 number;
  lng:                 number;
  category:            Category;
  severity:            Severity;
  title:               string;
  description:         string;
  ward:                string;
  status:              IssueStatus;
  reportedAt:          string;
  upvotes:             number;
  address:             string;
  photoUrl?:           string;
  trafficImpact:       TrafficImpact;
  repairCostEstimate:  string;
  duplicateCount:      number;
  priorityScore:       number;
}

// ─── Priority score formula ────────────────────────────────────────────────────
// Mimics what the AI Priority Engine would compute.
// Score 0-100: severity (40%) + traffic (30%) + upvotes (20%) + duplicates (10%)
function calcPriorityScore(
  severity: Severity,
  traffic: TrafficImpact,
  upvotes: number,
  duplicates: number
): number {
  const sevScore  = severity === "critical" ? 40 : severity === "moderate" ? 24 : 8;
  const trafScore = traffic  === "high"     ? 30 : traffic  === "medium"   ? 18 : 6;
  const upvScore  = Math.min(20, Math.round((upvotes / 110) * 20));
  const dupScore  = Math.min(10, duplicates * 2);
  return Math.min(100, sevScore + trafScore + upvScore + dupScore);
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const now = Date.now();
const getPastDate = (daysAgo: number, hoursAgo: number) =>
  new Date(now - daysAgo * 86_400_000 - hoursAgo * 3_600_000).toISOString();

// ─── Seed data — all 18 issues with new fields ────────────────────────────────
const SEED_ISSUES: SeedIssue[] = [
  {
    id: "ISS-001", lat: 19.1197, lng: 72.8468,
    category: "Pothole", severity: "critical",
    title: "Large pothole causing accidents",
    description: "A dangerous 2-foot deep pothole has formed near the Andheri station junction. Multiple two-wheelers have skidded. The asphalt has completely caved in following last week's rains. Immediate patching required.",
    ward: "Ward 12 — Andheri East", status: "In Progress",
    reportedAt: getPastDate(1, 21), upvotes: 47,
    address: "S.V. Road, near Andheri Station, Andheri East",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: REPAIR_COST_MAP.road_section,
    duplicateCount: 4, priorityScore: 0,
  },
  {
    id: "ISS-002", lat: 19.0544, lng: 72.8405,
    category: "Water Clogging", severity: "critical",
    title: "Severe waterlogging blocking traffic",
    description: "Knee-deep water accumulation at Turner Road junction for over 3 days. Storm drain appears blocked. Businesses, schools and residential societies severely affected. BMC crew not seen.",
    ward: "Ward 7 — Bandra West", status: "Verified",
    reportedAt: getPastDate(3, 4), upvotes: 89,
    address: "Turner Road Junction, Bandra West",
    photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: REPAIR_COST_MAP.full_road,
    duplicateCount: 7, priorityScore: 0,
  },
  {
    id: "ISS-003", lat: 19.1176, lng: 72.9060,
    category: "Crack", severity: "critical",
    title: "Structural crack in footbridge",
    description: "Visible crack running 4 metres along the footbridge over Powai Lake approach. Bridge sways under load. Multiple residents have reported it but no action taken for 6 weeks.",
    ward: "Ward 23 — Powai", status: "Reported",
    reportedAt: getPastDate(2, 14), upvotes: 63,
    address: "Hiranandani Gardens Footbridge, Powai",
    photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: REPAIR_COST_MAP.road_section,
    duplicateCount: 3, priorityScore: 0,
  },
  {
    id: "ISS-004", lat: 19.1075, lng: 72.8263,
    category: "Water Clogging", severity: "moderate",
    title: "Waterlogging near school gate",
    description: "Children have to wade through ankle-deep water every morning. Blocked drain near school entrance. The problem occurs every monsoon but no permanent fix has been done.",
    ward: "Ward 8 — Juhu", status: "In Progress",
    reportedAt: getPastDate(2, 3), upvotes: 38,
    address: "JVPD Scheme School, Juhu",
    photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: REPAIR_COST_MAP.small_patch,
    duplicateCount: 2, priorityScore: 0,
  },
  {
    id: "ISS-005", lat: 19.1320, lng: 72.8181,
    category: "Road Damage", severity: "moderate",
    title: "Road collapsed after pipeline work",
    description: "BMC pipeline repair work left without proper road restoration. Large depression in road surface, about 6 inches deep over 15 sq metres. Creates hazardous driving conditions at night.",
    ward: "Ward 31 — Versova", status: "Verified",
    reportedAt: getPastDate(3, 11), upvotes: 29,
    address: "Versova Road near Andheri-Versova Link Road",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: REPAIR_COST_MAP.road_section,
    duplicateCount: 1, priorityScore: 0,
  },
  {
    id: "ISS-006", lat: 19.1140, lng: 72.8557,
    category: "Pothole", severity: "resolved",
    title: "Pothole cluster patched — good work!",
    description: "Cluster of 5 potholes on D.N. Nagar main road. Reported 12 days ago, BMC team arrived within 4 days and completed proper hot-mix patching. Road now smooth.",
    ward: "Ward 12 — Andheri East", status: "Resolved",
    reportedAt: getPastDate(0, 5), upvotes: 21,
    address: "D.N. Nagar Main Road, Andheri West",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "low", repairCostEstimate: REPAIR_COST_MAP.small_patch,
    duplicateCount: 0, priorityScore: 0,
  },
  {
    id: "ISS-007", lat: 19.0760, lng: 72.8777,
    category: "Crack", severity: "moderate",
    title: "Crumbling retaining wall on arterial road",
    description: "The retaining wall along the main road shows deep horizontal cracks and is bulging outward. Risk of partial collapse in heavy rain. Spans ~30 metres along the embankment.",
    ward: "Ward 15 — Dharavi", status: "Reported",
    reportedAt: getPastDate(0, 16), upvotes: 55,
    address: "Dharavi Main Road, near 90 Feet Road",
    photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: REPAIR_COST_MAP.full_road,
    duplicateCount: 3, priorityScore: 0,
  },
  {
    id: "ISS-008", lat: 19.0663, lng: 72.8526,
    category: "Road Damage", severity: "critical",
    title: "Road surface completely destroyed",
    description: "Entire stretch of road (approx 200m) has broken up. No asphalt remaining, only loose gravel and potholes of varying sizes. Speed limit signs meaningless at this point.",
    ward: "Ward 10 — Sion", status: "Verified",
    reportedAt: getPastDate(1, 14), upvotes: 102,
    address: "Dharavi-Sion Link Road, Sion",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: REPAIR_COST_MAP.full_road,
    duplicateCount: 8, priorityScore: 0,
  },
  {
    id: "ISS-009", lat: 19.1663, lng: 72.8526,
    category: "Water Clogging", severity: "resolved",
    title: "Drain cleared, waterlogging fixed",
    description: "Chronic waterlogging at Goregaon market reported. BMC desilted the drain within 7 days. No waterlogging during last heavy rain on August 8th. Excellent response.",
    ward: "Ward 19 — Goregaon", status: "Resolved",
    reportedAt: getPastDate(0, 15), upvotes: 18,
    address: "Goregaon West Market, Goregaon",
    photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "low", repairCostEstimate: REPAIR_COST_MAP.small_patch,
    duplicateCount: 0, priorityScore: 0,
  },
  {
    id: "ISS-010", lat: 19.1874, lng: 72.8481,
    category: "Pothole", severity: "moderate",
    title: "Multiple potholes near market",
    description: "Stretch of road near Malad market has developed 8-10 medium-sized potholes over the past 2 weeks. Heavy truck traffic appears to be worsening them daily.",
    ward: "Ward 21 — Malad West", status: "Reported",
    reportedAt: getPastDate(1, 17), upvotes: 24,
    address: "Malad Market, S.V. Road, Malad West",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: REPAIR_COST_MAP.road_section,
    duplicateCount: 2, priorityScore: 0,
  },
  {
    id: "ISS-011", lat: 19.2288, lng: 72.8566,
    category: "Other", severity: "moderate",
    title: "Damaged streetlights create dark stretch",
    description: "6 consecutive streetlights non-functional on Borivali main road. Stretch is completely dark after 8pm. Residents fear mugging. Multiple complaints made at ward office — no response.",
    ward: "Ward 25 — Borivali West", status: "Reported",
    reportedAt: getPastDate(1, 20), upvotes: 41,
    address: "Borivali West Main Road, near IC Colony",
    photoUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "low", repairCostEstimate: REPAIR_COST_MAP.small_patch,
    duplicateCount: 1, priorityScore: 0,
  },
  {
    id: "ISS-012", lat: 19.0910, lng: 72.8650,
    category: "Pothole", severity: "critical",
    title: "Accident-prone pothole at crossroads",
    description: "Massive pothole at busy SEEPZ crossroads. Two accidents in past week, one resulting in hospitalization. Depth approximately 14 inches. Completely unmarked, no warning signs.",
    ward: "Ward 14 — Andheri East", status: "In Progress",
    reportedAt: getPastDate(0, 20), upvotes: 73,
    address: "SEEPZ Crossroads, Andheri East",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: REPAIR_COST_MAP.road_section,
    duplicateCount: 6, priorityScore: 0,
  },
  {
    id: "ISS-013", lat: 19.0399, lng: 72.8553,
    category: "Water Clogging", severity: "moderate",
    title: "Underpass floods in moderate rain",
    description: "The Mahim underpass floods to 2-3 feet depth even in moderate rainfall. Commuters stranded for hours. Pumping infrastructure seems non-functional.",
    ward: "Ward 6 — Mahim", status: "Verified",
    reportedAt: getPastDate(3, 8), upvotes: 66,
    address: "Mahim Underpass, Western Express Highway",
    photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: REPAIR_COST_MAP.full_road,
    duplicateCount: 5, priorityScore: 0,
  },
  {
    id: "ISS-014", lat: 19.1057, lng: 72.8369,
    category: "Crack", severity: "resolved",
    title: "Bridge parapet repaired successfully",
    description: "Cracked parapet wall on the pedestrian bridge at Versova Link Road. Reported 3 weeks ago. BMC engineers inspected and repaired within agreed timeline.",
    ward: "Ward 8 — Juhu", status: "Resolved",
    reportedAt: getPastDate(3, 8), upvotes: 12,
    address: "Versova Link Road Bridge, Juhu",
    photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "low", repairCostEstimate: REPAIR_COST_MAP.small_patch,
    duplicateCount: 0, priorityScore: 0,
  },
  {
    id: "ISS-015", lat: 19.1445, lng: 72.8287,
    category: "Road Damage", severity: "moderate",
    title: "Service road completely broken up",
    description: "Service road parallel to Western Express Highway has disintegrated. Residents use it daily to access housing societies. BMC seems unaware as this is a disputed road asset.",
    ward: "Ward 16 — Oshiwara", status: "Reported",
    reportedAt: getPastDate(1, 10), upvotes: 33,
    address: "WEH Service Road, Oshiwara, Andheri West",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: REPAIR_COST_MAP.road_section,
    duplicateCount: 2, priorityScore: 0,
  },
  {
    id: "ISS-016", lat: 19.0839, lng: 72.8984,
    category: "Pothole", severity: "moderate",
    title: "School bus route pothole",
    description: "Two large potholes on the route used by school buses. Parents concerned about safety. School principal has written to BMC. No action for 2 weeks.",
    ward: "Ward 18 — Kurla", status: "Verified",
    reportedAt: getPastDate(3, 6), upvotes: 48,
    address: "Kurla West Station Road, Kurla",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "medium", repairCostEstimate: REPAIR_COST_MAP.small_patch,
    duplicateCount: 3, priorityScore: 0,
  },
  {
    id: "ISS-017", lat: 19.0640, lng: 72.8350,
    category: "Water Clogging", severity: "critical",
    title: "Society basement flooded for 5 days",
    description: "Basement parking of Kalanagar society flooded due to broken drain. 45 cars submerged or damaged. BMC drain inspection team visited but no fix attempted. Citizens threatening legal action.",
    ward: "Ward 7 — Bandra East", status: "In Progress",
    reportedAt: getPastDate(0, 6), upvotes: 91,
    address: "Kalanagar, Bandra East",
    photoUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "high", repairCostEstimate: REPAIR_COST_MAP.full_road,
    duplicateCount: 9, priorityScore: 0,
  },
  {
    id: "ISS-018", lat: 19.1550, lng: 72.8710,
    category: "Other", severity: "resolved",
    title: "Manhole cover replaced — issue closed",
    description: "Missing manhole cover on Jogeshwari main road was a major safety hazard. Reported 10 days ago with photographic evidence. BMC replaced it within 5 days. Excellent turnaround.",
    ward: "Ward 17 — Jogeshwari", status: "Resolved",
    reportedAt: getPastDate(2, 16), upvotes: 9,
    address: "Jogeshwari West Main Road",
    photoUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=800",
    trafficImpact: "low", repairCostEstimate: REPAIR_COST_MAP.small_patch,
    duplicateCount: 0, priorityScore: 0,
  },
];

// Compute priorityScore for every issue now that we have all fields
SEED_ISSUES.forEach((issue) => {
  issue.priorityScore = calcPriorityScore(
    issue.severity,
    issue.trafficImpact,
    issue.upvotes,
    issue.duplicateCount
  );
});

// ─── Firebase Admin init ──────────────────────────────────────────────────────
function initAdmin(): App {
  if (getApps().length > 0) return getApps()[0];

  // Try service account JSON first (best for CI / production seeding)
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (serviceAccountPath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(path.resolve(serviceAccountPath));
    return initializeApp({ credential: cert(serviceAccount) });
  }

  // Fall back: initialise from individual env vars (matches .env.local)
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error(
      "\n❌  No Firebase credentials found.\n" +
      "    Set NEXT_PUBLIC_FIREBASE_PROJECT_ID (+ other NEXT_PUBLIC_FIREBASE_* vars) in .env.local,\n" +
      "    OR set FIREBASE_SERVICE_ACCOUNT_PATH to a service account JSON file path.\n"
    );
    process.exit(1);
  }

  // When using the client-SDK env vars the Admin SDK still needs a credential.
  // For local demo we use applicationDefault() — requires GOOGLE_APPLICATION_CREDENTIALS
  // or `firebase login` with ADC set up.
  try {
    return initializeApp({
      projectId,
      credential: cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
        // Support both raw key string or base64-encoded key
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "")
          .replace(/\\n/g, "\n"),
      }),
    });
  } catch {
    console.error(
      "\n❌  Could not initialise Firebase Admin with env vars.\n" +
      "    Make sure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are set.\n" +
      "    Alternatively, point FIREBASE_SERVICE_ACCOUNT_PATH to a service account JSON.\n"
    );
    process.exit(1);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  CivicPulse Firestore Seeder");
  console.log("━".repeat(48));

  initAdmin();
  const db = getFirestore();

  // Sort by priority descending so ranked order is clear in Firestore console
  const sorted = [...SEED_ISSUES].sort((a, b) => b.priorityScore - a.priorityScore);

  let written = 0;
  let skipped = 0;

  for (const issue of sorted) {
    const docRef = db.collection("issues").doc(issue.id);
    const snap   = await docRef.get();

    if (snap.exists) {
      console.log(`  ⏭  ${issue.id}  already exists — skipping`);
      skipped++;
      continue;
    }

    // Convert ISO string to Firestore Timestamp for proper querying
    const { reportedAt, ...rest } = issue;
    await docRef.set({
      ...rest,
      reportedAt: Timestamp.fromDate(new Date(reportedAt)),
      seededAt:   Timestamp.now(),
    });

    console.log(
      `  ✅  ${issue.id}  [score: ${issue.priorityScore.toString().padStart(3)}]  ${issue.title.slice(0, 50)}`
    );
    written++;
  }

  console.log("━".repeat(48));
  console.log(`\n✅  Done — ${written} written, ${skipped} skipped.\n`);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
