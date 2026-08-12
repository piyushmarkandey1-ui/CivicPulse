"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Fetch role to redirect correctly
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "government") {
        router.push("/gov-dashboard");
      } else {
        router.push("/map");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <div className="w-full max-w-md">
        {/* Top community badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-copper/20 bg-copper/[0.07] text-copper">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
            </svg>
            Citizen Portal
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-2xl border border-white/[0.08] p-8"
          style={{ background: "rgba(25,23,21,0.8)", backdropFilter: "blur(20px)" }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-text-muted text-sm">
              Sign in to report issues, track progress, and hold your city accountable.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-subtle border border-white/[0.08] focus:outline-none focus:border-copper/40 transition-colors"
                style={{ background: "rgba(13,13,12,0.6)" }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-subtle border border-white/[0.08] focus:outline-none focus:border-copper/40 transition-colors"
                style={{ background: "rgba(13,13,12,0.6)" }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-[#0D0D0C] bg-copper hover:bg-copper-light disabled:opacity-60 transition-all duration-200"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-text-muted">
              New to CivicPulse?{" "}
              <Link href="/signup" className="text-copper hover:text-copper-light font-semibold">
                Create a citizen account
              </Link>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-text-subtle" style={{ background: "rgba(25,23,21,0.8)" }}>
                  Government official?
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-text-muted">
              <Link href="/gov-login" className="text-text-secondary hover:text-white font-medium underline underline-offset-2">
                Access the Government Portal →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
