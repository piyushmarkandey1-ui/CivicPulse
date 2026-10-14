"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { type User, type AuthChangeEvent, type Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

import {
  isSupabaseConfigured,
  getStoredDemoSession,
  clearStoredDemoSession,
  type AuthRole,
  type UserProfile,
} from "@/lib/supabase/auth-helpers";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AuthRole>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getSupabase = () => {
    if (!isSupabaseConfigured()) return null;
    return createClient();
  };

  const fetchProfile = async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
        setRole(data.role as AuthRole);
      }
    } catch {
      // Keep existing role if fetch failed
    }
  };

  useEffect(() => {
    // 1. Check local demo session first (instant, non-blocking)
    const localSession = getStoredDemoSession();
    if (localSession) {
      setUser(localSession.user);
      setProfile(localSession.profile);
      setRole(localSession.profile.role);
      setLoading(false);
    }

    // 2. Listen for custom auth change events (dispatched by signup/login forms)
    const handleCustomAuth = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setUser(detail.user);
        setProfile(detail.profile);
        setRole(detail.profile.role);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    };
    window.addEventListener("civicpulse_auth_change", handleCustomAuth);

    // 3. If Supabase is configured, check live session
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
        if (data?.session?.user) {
          setUser(data.session.user);
          fetchProfile(data.session.user.id).finally(() => setLoading(false));
        } else if (!localSession) {
          setLoading(false);
        }
      }).catch(() => {
        if (!localSession) setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (!getStoredDemoSession()) {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      });

      return () => {
        window.removeEventListener("civicpulse_auth_change", handleCustomAuth);
        subscription.unsubscribe();
      };
    }

    setLoading(false);
    return () => {
      window.removeEventListener("civicpulse_auth_change", handleCustomAuth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    clearStoredDemoSession();
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore network errors on signout
      }
    }
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
