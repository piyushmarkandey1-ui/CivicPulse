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

      // Verify role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "government") {
        await supabase.auth.signOut();
        throw new Error(
          "This portal is for authorized municipal officials only. Please use the Citizen Portal."
        );
      }

      router.push("/gov-dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-[#F7F4ED]">
      <div className="w-full max-w-md">
        {/* Institutional badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border border-[#D6C2A3] bg-[#F0E5D8] text-[#242222]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Authorized Personnel Only
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-2xl border border-[#D6C2A3] p-8 bg-white shadow-[0_6px_24px_rgba(36,34,34,0.07)]"
        >
          {/* Shield header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#DED8CD]">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F0E5D8] border border-[#D6C2A3]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B2635"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-[#242222]">Government Portal</h1>
              <p className="text-xs text-[#88827A]">CivicPulse Municipal Command & Triage</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#242222] mb-1">Official Sign In</h2>
            <p className="text-[#625E59] text-xs leading-relaxed">
              Restricted to verified department officers and ward administrators.
            </p>
          </div>

          {/* Security notice */}
          <div className="mb-5 p-3 rounded-lg bg-[#F0E5D8]/70 border border-[#D6C2A3] text-xs text-[#625E59]">
            <span className="font-bold text-[#242222]">Audit Notice:</span> All official
            actions, status updates, and resolution proofs are permanently logged in the municipal audit index.
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#FDEDED] border border-[#B83A3A]/25 text-[#B83A3A] text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="gov-email"
                className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5"
              >
                Official Email Address
              </label>
              <input
                id="gov-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@bmc.gov.in"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="gov-password"
                className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <input
                id="gov-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-[#242222] hover:bg-[#181616] text-[#F7F4ED] font-bold text-sm transition-all duration-200 shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating Official..." : "Enter Government Command Center"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-[#DED8CD] flex flex-col gap-2 text-center text-xs text-[#625E59]">
            <p>
              Need to register as an official?{" "}
              <Link href="/gov-signup" className="text-[#8B2635] font-bold hover:underline">
                Officer Registration →
              </Link>
            </p>
            <p className="text-[#88827A]">
              Citizen user?{" "}
              <Link href="/login" className="text-[#242222] font-semibold hover:underline">
                Citizen Portal
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
