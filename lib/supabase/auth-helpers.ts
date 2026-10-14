/**
 * lib/supabase/auth-helpers.ts
 *
 * Robust, dual-mode authentication helpers for CivicPulse.
 * Provides seamless fallback to local state / demo session whenever Supabase
 * is offline, unconfigured, or returns network errors ("Failed to fetch").
 */

import { type User } from "@supabase/supabase-js";

export type AuthRole = "citizen" | "government" | null;

export interface UserProfile {
  name: string;
  role: AuthRole;
  department?: string;
  ward?: string;
  reputation_score: number;
  total_reports: number;
  join_date: string;
}

export interface DemoSession {
  user: User;
  profile: UserProfile;
}

const STORAGE_KEY = "civicpulse_demo_session";

/**
 * Returns true only if a valid, non-placeholder Supabase project URL is configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (
    url.includes("your-project.supabase.co") ||
    url.includes("placeholder") ||
    url.includes("example.com")
  ) {
    return false;
  }
  return true;
}

/**
 * Reads local demo session from localStorage (browser-only).
 */
export function getStoredDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

/**
 * Saves demo session to localStorage and sets routing cookies for middleware.
 */
export function setStoredDemoSession(user: User, profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const session: DemoSession = { user, profile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    // Set cookie so Next.js middleware respects the role
    const role = profile.role || "citizen";
    document.cookie = `civicpulse_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `civicpulse_uid=${user.id}; path=/; max-age=604800; SameSite=Lax`;

    // Notify all listening components
    window.dispatchEvent(new CustomEvent("civicpulse_auth_change", { detail: session }));
  } catch (err) {
    console.warn("Could not save demo session to localStorage:", err);
  }
}

/**
 * Clears demo session and authentication cookies.
 */
export function clearStoredDemoSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = "civicpulse_role=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "civicpulse_uid=; path=/; max-age=0; SameSite=Lax";
    window.dispatchEvent(new CustomEvent("civicpulse_auth_change", { detail: null }));
  } catch (err) {
    console.warn("Could not clear demo session:", err);
  }
}

/**
 * Builds a standardized User object conforming to Supabase User interface.
 */
export function createMockUser(params: {
  id?: string;
  email: string;
  name: string;
  role: "citizen" | "government";
  department?: string;
  ward?: string;
}): { user: User; profile: UserProfile } {
  const id = params.id || `demo-user-${Math.random().toString(36).substring(2, 10)}`;
  const now = new Date().toISOString();

  const user: User = {
    id,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {
      name: params.name,
      role: params.role,
      department: params.department,
      ward: params.ward,
    },
    aud: "authenticated",
    confirmation_sent_at: now,
    recovery_sent_at: now,
    email_change_sent_at: now,
    new_email: "",
    invited_at: now,
    action_link: "",
    email: params.email,
    phone: "",
    created_at: now,
    confirmed_at: now,
    email_confirmed_at: now,
    phone_confirmed_at: now,
    last_sign_in_at: now,
    role: "authenticated",
    updated_at: now,
    identities: [],
    factors: [],
  };

  const profile: UserProfile = {
    name: params.name,
    role: params.role,
    department: params.department,
    ward: params.ward,
    reputation_score: params.role === "citizen" ? 100 : 500,
    total_reports: params.role === "citizen" ? 3 : 24,
    join_date: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  return { user, profile };
}

/**
 * Instantly logs in as demo citizen without credentials
 */
export function loginAsDemoCitizen(): { user: User; profile: UserProfile } {
  const mock = createMockUser({
    id: "demo-citizen-id",
    name: "Rani Suryavanshi (Citizen)",
    email: "citizen@civicpulse.org",
    role: "citizen",
    ward: "Ward 15 — Indira Market, Durg",
  });
  setStoredDemoSession(mock.user, mock.profile);
  return mock;
}

/**
 * Instantly logs in as demo government officer without credentials
 */
export function loginAsDemoOfficer(): { user: User; profile: UserProfile } {
  const mock = createMockUser({
    id: "demo-officer-id",
    name: "Er. A. K. Sahu (Executive Engineer)",
    email: "officer@civicpulse.org",
    role: "government",
    department: "Roads & Highway Infrastructure (PWD)",
    ward: "Durg & Mumbai Central Municipal Division",
  });
  setStoredDemoSession(mock.user, mock.profile);
  return mock;
}
