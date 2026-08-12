import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During static builds without env vars, return a no-op stub
    // so pages don't crash on import. The stub will never be called
    // at runtime because real env vars will be present.
    return {
      auth: {
        signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
        signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
        signOut: async () => {},
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: async () => ({ data: { user: null } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ error: null }),
      }),
    } as any;
  }

  return createBrowserClient(url, key);
}
