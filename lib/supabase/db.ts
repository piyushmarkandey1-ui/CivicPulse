/**
 * lib/supabase/db.ts
 *
 * All Supabase data-layer helpers for the "issues" table and storage.
 * Replaces all Firebase Firestore + Firebase Storage calls across the app.
 *
 * Table expected schema (run scripts/seed-supabase.ts to populate):
 *   issues (
 *     id                  text PRIMARY KEY,
 *     lat                 float8,
 *     lng                 float8,
 *     category            text,
 *     severity            text,
 *     title               text,
 *     description         text,
 *     ward                text,
 *     status              text,
 *     reported_at         timestamptz,
 *     upvotes             int4 DEFAULT 0,
 *     address             text,
 *     photo_url           text,
 *     reporter_uid        text,
 *     escalated_at        timestamptz,
 *     resolution_photo_url text,
 *     traffic_impact      text,
 *     repair_cost_estimate text,
 *     duplicate_count     int4 DEFAULT 0,
 *     priority_score      int4 DEFAULT 0,
 *     seeded_at           timestamptz
 *   )
 *
 * Storage bucket: "issue-photos" (public read)
 */

import { createClient } from "@/lib/supabase/client";
import { type Issue } from "@/lib/types";
import { type RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// ─── Row shape coming from Supabase (snake_case) ───────────────────────────────
interface IssueRow {
  id: string;
  lat: number;
  lng: number;
  category: string;
  severity: string;
  title: string;
  description: string;
  ward: string;
  status: string;
  reported_at: string;
  upvotes: number;
  address: string;
  photo_url?: string | null;
  reporter_uid?: string | null;
  escalated_at?: string | null;
  resolution_photo_url?: string | null;
  traffic_impact?: string | null;
  repair_cost_estimate?: string | null;
  duplicate_count?: number;
  priority_score?: number;
}

/** Convert snake_case DB row → camelCase Issue interface */
function rowToIssue(row: IssueRow): Issue {
  return {
    id:                  row.id,
    lat:                 row.lat,
    lng:                 row.lng,
    category:            row.category as Issue["category"],
    severity:            row.severity as Issue["severity"],
    title:               row.title,
    description:         row.description,
    ward:                row.ward,
    status:              row.status as Issue["status"],
    reportedAt:          row.reported_at,
    upvotes:             row.upvotes ?? 0,
    address:             row.address,
    photoUrl:            row.photo_url ?? undefined,
    reporterUid:         row.reporter_uid ?? undefined,
    escalatedAt:         row.escalated_at ?? undefined,
    resolutionPhotoUrl:  row.resolution_photo_url ?? undefined,
    trafficImpact:       (row.traffic_impact as Issue["trafficImpact"]) ?? undefined,
    repairCostEstimate:  row.repair_cost_estimate ?? undefined,
  };
}

/** Convert camelCase Issue → snake_case row for INSERT */
function issueToRow(issue: Omit<Issue, "upvotes" | "reportedAt"> & { photoFile?: string }) {
  return {
    id:                   issue.id,
    lat:                  issue.lat,
    lng:                  issue.lng,
    category:             issue.category,
    severity:             issue.severity,
    title:                issue.title,
    description:          issue.description,
    ward:                 issue.ward,
    status:               issue.status,
    reported_at:          new Date().toISOString(),
    upvotes:              1,
    address:              issue.address,
    photo_url:            issue.photoUrl ?? null,
    reporter_uid:         issue.reporterUid ?? null,
    traffic_impact:       issue.trafficImpact ?? null,
    repair_cost_estimate: issue.repairCostEstimate ?? null,
    duplicate_count:      0,
    priority_score:       0,
  };
}

// ─── Fetch all issues once ─────────────────────────────────────────────────────
export async function fetchIssues(): Promise<Issue[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .order("priority_score", { ascending: false });

  if (error) throw error;
  return (data as IssueRow[]).map(rowToIssue);
}

// ─── Fetch issues by reporter ──────────────────────────────────────────────────
export async function fetchIssuesByUser(uid: string): Promise<Issue[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .eq("reporter_uid", uid)
    .order("reported_at", { ascending: false });

  if (error) throw error;
  return (data as IssueRow[]).map(rowToIssue);
}

// ─── Insert a new issue ────────────────────────────────────────────────────────
export async function insertIssue(
  issue: Omit<Issue, "id" | "upvotes" | "reportedAt"> & { id: string; photoFile?: string }
): Promise<void> {
  const supabase = createClient();
  const row = issueToRow(issue as Parameters<typeof issueToRow>[0]);
  const { error } = await supabase.from("issues").insert(row);
  if (error) throw error;
}

// ─── Increment upvotes atomically ─────────────────────────────────────────────
export async function incrementUpvote(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("increment_upvotes", { issue_id: id });
  if (error) {
    // Fallback: read-increment-write (safe enough for demo)
    const { data } = await supabase
      .from("issues")
      .select("upvotes")
      .eq("id", id)
      .single();
    await supabase
      .from("issues")
      .update({ upvotes: ((data as { upvotes: number } | null)?.upvotes ?? 0) + 1 })
      .eq("id", id);
  }
}

// ─── Realtime subscription — all issues ───────────────────────────────────────
export function subscribeToIssues(
  onUpdate: (issues: Issue[]) => void,
  onError?: (err: Error) => void
): () => void {
  const supabase = createClient();

  // Initial fetch
  fetchIssues()
    .then(onUpdate)
    .catch((e) => onError?.(e as Error));

  // Realtime channel
  const channel = supabase
    .channel("issues-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "issues" },
      (_payload: RealtimePostgresChangesPayload<IssueRow>) => {
        // Re-fetch full list on any change (simple, correct)
        fetchIssues().then(onUpdate).catch((e) => onError?.(e as Error));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─── Realtime subscription — issues by reporter uid ───────────────────────────
export function subscribeToUserIssues(
  uid: string,
  onUpdate: (issues: Issue[]) => void,
  onError?: (err: Error) => void
): () => void {
  const supabase = createClient();

  fetchIssuesByUser(uid)
    .then(onUpdate)
    .catch((e) => onError?.(e as Error));

  const channel = supabase
    .channel(`user-issues-${uid}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "issues", filter: `reporter_uid=eq.${uid}` },
      () => {
        fetchIssuesByUser(uid).then(onUpdate).catch((e) => onError?.(e as Error));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─── Upload photo to Supabase Storage → return public URL ─────────────────────
export async function uploadIssuePhoto(
  issueId: string,
  dataUrl: string
): Promise<string> {
  const supabase = createClient();

  // Convert base64 data URL to Blob
  const base64 = dataUrl.split(",")[1];
  const mimeMatch = dataUrl.match(/data:([^;]+);/);
  const mime = mimeMatch?.[1] ?? "image/jpeg";
  const byteChars = atob(base64);
  const byteArr = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArr[i] = byteChars.charCodeAt(i);
  }
  const blob = new Blob([byteArr], { type: mime });

  const path = `issues/${issueId}.jpg`;
  const { error } = await supabase.storage
    .from("issue-photos")
    .upload(path, blob, { upsert: true, contentType: mime });

  if (error) throw error;

  const { data } = supabase.storage.from("issue-photos").getPublicUrl(path);
  return data.publicUrl;
}
