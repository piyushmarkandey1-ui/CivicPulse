import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, createMockUser } from "./auth-helpers";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured() || !url || !key) {
    // When Supabase is not configured or in demo mode, return an active client stub
    return {
      auth: {
        signInWithPassword: async ({ email }: { email: string; password?: string }) => {
          const { user } = createMockUser({
            email: email || "citizen@civicpulse.org",
            name: email?.split("@")[0] || "Active Citizen",
            role: "citizen",
          });
          return { data: { user, session: { user } }, error: null };
        },
        signUp: async ({ email, options }: { email: string; password?: string; options?: { data?: Record<string, any> } }) => {
          const name = options?.data?.name || email?.split("@")[0] || "Active Citizen";
          const role = (options?.data?.role as "citizen" | "government") || "citizen";
          const { user } = createMockUser({
            email: email || "citizen@civicpulse.org",
            name,
            role,
            department: options?.data?.department,
            ward: options?.data?.ward,
          });
          return { data: { user, session: { user } }, error: null };
        },
        signOut: async () => {},
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: async () => ({ data: { user: null } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null }),
          }),
          order: () => ({ data: [], error: null }),
        }),
        insert: async () => ({ error: null }),
        upsert: async () => ({ error: null }),
        update: async () => ({ eq: async () => ({ error: null }) }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: "demo-photo.jpg" }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "/pothole-combined.jpg" } }),
        }),
      },
      channel: () => ({
        on: function () { return this; },
        subscribe: function () { return this; },
      }),
      removeChannel: () => {},
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}
