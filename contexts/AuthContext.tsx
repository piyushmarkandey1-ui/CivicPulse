"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { type User, type AuthChangeEvent, type Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthRole = "citizen" | "government" | null;

interface UserProfile {
  name: string;
  role: AuthRole;
  department?: string;
  ward?: string;
  reputation_score: number;
  total_reports: number;
  join_date: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: AuthRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AuthRole>(null);
  const [loading, setLoading] = useState<boolean>(() => isSupabaseConfigured());

  const getSupabase = () => {
    if (!isSupabaseConfigured()) return null;
    return createClient();
  };

  const fetchProfile = async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) { setRole("citizen"); return; }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data && !error) {
      setProfile(data as UserProfile);
      setRole(data.role as AuthRole);
    } else {
      setRole("citizen");
    }
  };

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (data?.session?.user) {
        setUser(data.session.user);
        fetchProfile(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
