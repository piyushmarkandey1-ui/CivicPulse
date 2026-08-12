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

      // Profile is auto-created by database trigger
      router.push("/map");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-[#F7F4ED]">
      <div className="w-full max-w-md">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[#D6C2A3] bg-[#F0E5D8] text-[#8B2635]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
            </svg>
            Citizen Registration
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-2xl border border-[#DED8CD] p-8 bg-white shadow-[0_4px_20px_rgba(36,34,34,0.06)]"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#242222] mb-1">Join Citizen Watch</h1>
            <p className="text-[#625E59] text-sm">
              Create a citizen account to pin issues, track department resolution, and earn civic reputation.
            </p>
          </div>

          {/* Value props list */}
          <div className="mb-6 p-4 rounded-xl bg-[#F0E5D8]/50 border border-[#D6C2A3] space-y-2 text-xs text-[#625E59]">
            <div className="flex items-center gap-2">
              <span className="text-[#8B2635]">📍</span>
              <span>Pin municipal infrastructure issues with GPS accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8B2635]">⏱️</span>
              <span>Track department response times and SLA adherence</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8B2635]">⭐</span>
              <span>Validate repairs and build ward contributor credibility</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#FDEDED] border border-[#B83A3A]/25 text-[#B83A3A] text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Piyush Markandey"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 characters)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-[#8B2635] hover:bg-[#641B27] text-white font-bold text-sm transition-all duration-200 shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? "Creating citizen account..." : "Register as Active Citizen"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-[#DED8CD] flex flex-col gap-2.5 text-center text-xs text-[#625E59]">
            <p>
              Already registered?{" "}
              <Link href="/login" className="text-[#8B2635] font-bold hover:underline">
                Sign In →
              </Link>
            </p>
            <p className="text-[#88827A]">
              Municipal Official?{" "}
              <Link href="/gov-signup" className="text-[#242222] font-semibold hover:underline">
                Register as Government Official
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
