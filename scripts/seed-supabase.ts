/**
 * scripts/seed-supabase.ts
 *
 * Seeds the Supabase "issues" table with the 18 demo issues.
 * Includes all fields: traffic_impact, repair_cost_estimate,
 * duplicate_count, and priority_score.
 *
 * Run with:
 *   npm run seed:supabase
 *
 * Prerequisites in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { createClient } from "@supabase/supabase-js";
import { MOCK_ISSUES } from "../app/map/_components/mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE key in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`🌱 Seeding ${MOCK_ISSUES.length} issues into Supabase table "issues"...`);

  const rows = MOCK_ISSUES.map((issue) => ({
    id: issue.id,
    lat: issue.lat,
    lng: issue.lng,
    category: issue.category,
    severity: issue.severity,
    title: issue.title,
    description: issue.description,
    ward: issue.ward,
    status: issue.status,
    reported_at: issue.reportedAt,
    upvotes: issue.upvotes ?? 0,
    address: issue.address,
    photo_url: issue.photoUrl ?? null,
    reporter_uid: issue.reporterUid ?? null,
    escalated_at: issue.escalatedAt ?? null,
    resolution_photo_url: issue.resolutionPhotoUrl ?? null,
    traffic_impact: issue.trafficImpact ?? "medium",
    repair_cost_estimate: issue.repairCostEstimate ?? "₹50k – ₹5L",
    duplicate_count: issue.duplicateCount ?? 1,
    priority_score: issue.priorityScore ?? 70,
    seeded_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("issues")
    .upsert(rows, { onConflict: "id" })
    .select();

  if (error) {
    console.error("❌ Error seeding issues into Supabase:", error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${data?.length ?? rows.length} issues into Supabase!`);
}

seed().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
