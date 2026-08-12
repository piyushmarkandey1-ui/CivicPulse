"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "citizen",
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Signup failed. Please try again.");

      // Profile is auto-created by database trigger — no manual insert needed
      router.push("/map");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: "📍", text: "Pin issues directly on the live city map" },
    { icon: "🔔", text: "Track government response in real time" },
    { icon: "⭐", text: "Build reputation as a civic contributor" },
  ];

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6 py-12">
      <div className="w-full max-w-md">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-copper/20 bg-copper/[0.07] text-copper">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
            </svg>
            Join the Community
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/[0.08] p-8"
          style={{ background: "rgba(25,23,21,0.8)", backdropFilter: "blur(20px)" }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-text-muted text-sm">
              Join thousands of citizens making their cities better — one report at a time.
            </p>
          </div>

          {/* Perks */}
          <div className="mb-6 space-y-2">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-2.5 text-sm text-text-muted">
                <span className="text-base">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-white/[0.06] mb-6" />

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-subtle border border-white/[0.08] focus:outline-none focus:border-copper/40 transition-colors"
                style={{ background: "rgba(13,13,12,0.6)" }}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-subtle border border-white/[0.08] focus:outline-none focus:border-copper/40 transition-colors"
                style={{ background: "rgba(13,13,12,0.6)" }}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-[#0D0D0C] bg-copper hover:bg-copper-light disabled:opacity-60 transition-all duration-200"
            >
              {loading ? "Creating Account…" : "Create Citizen Account →"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-copper hover:text-copper-light font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-text-subtle mt-4"
        >
          Government official?{" "}
          <Link href="/gov-signup" className="underline underline-offset-2 hover:text-text-muted">
            Request government access →
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
