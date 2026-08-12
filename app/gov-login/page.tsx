"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function GovLoginPage() {
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

      // Verify they are actually a government official
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "government") {
        await supabase.auth.signOut();
        throw new Error("This portal is for government officials only. Please use the Citizen Portal.");
      }

      router.push("/gov-dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <div className="w-full max-w-md">
        {/* Institutional badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-warning/30 bg-warning/[0.07] text-warning">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Authorized Personnel Only
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-2xl border p-8"
          style={{
            background: "rgba(20,17,13,0.92)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(211,163,74,0.15)",
          }}
        >
          {/* Shield header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(211,163,74,0.1)", border: "1px solid rgba(211,163,74,0.2)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D3A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Government Portal</h1>
              <p className="text-xs text-text-muted mt-0.5">CivicPulse Operations Access</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Official Sign In</h2>
            <p className="text-text-muted text-sm">
              Access restricted to verified government employees. Unauthorized access attempts are logged.
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
              <label htmlFor="gov-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Official Email Address
              </label>
              <input
                id="gov-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-subtle border focus:outline-none transition-colors"
                style={{
                  background: "rgba(13,13,12,0.7)",
                  borderColor: "rgba(211,163,74,0.15)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(211,163,74,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(211,163,74,0.15)")}
                placeholder="official@municipality.gov.in"
              />
            </div>

            <div>
              <label htmlFor="gov-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="gov-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-subtle border focus:outline-none transition-colors"
                style={{
                  background: "rgba(13,13,12,0.7)",
                  borderColor: "rgba(211,163,74,0.15)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(211,163,74,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(211,163,74,0.15)")}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold disabled:opacity-60 transition-all duration-200"
              style={{ background: "#D3A34A", color: "#0D0D0C" }}
            >
              {loading ? "Authenticating…" : "Access Dashboard →"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-text-muted">
              New official?{" "}
              <Link href="/gov-signup" className="font-semibold underline underline-offset-2" style={{ color: "#D3A34A" }}>
                Request Access
              </Link>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-text-subtle" style={{ background: "rgba(20,17,13,0.92)" }}>
                  not an official?
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-text-muted">
              <Link href="/login" className="text-text-secondary hover:text-white font-medium underline underline-offset-2">
                ← Go to Citizen Portal
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Security notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-text-subtle mt-5"
        >
          🔒 This session is secured and monitored. All actions are logged for audit compliance.
        </motion.p>
      </div>
    </div>
  );
}
