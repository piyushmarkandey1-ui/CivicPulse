"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const DEPARTMENTS = [
  "Roads & Infrastructure",
  "Water & Sanitation",
  "Municipal Services",
  "Urban Planning",
  "Public Works",
  "Health & Environment",
  "Traffic Management",
  "Solid Waste Management",
];

const WARDS = Array.from({ length: 40 }, (_, i) => `Ward ${i + 1}`);

export default function GovSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [ward, setWard] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const expectedCode = process.env.NEXT_PUBLIC_GOV_INVITE_CODE || "civic2025gov";
    if (inviteCode.trim() !== expectedCode) {
      setError("Invalid department invite code. Use demo code 'civic2025gov'.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "government",
            department,
            ward: ward || null,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Registration failed. Please try again.");

      router.push("/gov-dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to register government account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6 py-12 bg-transparent">
      <div className="w-full max-w-md">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-[#D6C2A3] bg-white/85 backdrop-blur-sm text-[#242222] shadow-xs">
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
            Official Onboarding Protocol
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#DED8CD]/80 shadow-[0_16px_48px_rgba(36,34,34,0.07),0_1px_3px_rgba(36,34,34,0.03)]"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#242222] tracking-tight">
              Officer Registration
            </h1>
            <p className="text-xs text-[#625E59] mt-1.5">
              Authorized access for municipal department engineers and ward triage officers.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3.5 rounded-xl text-xs font-semibold bg-[#FDEDED] border border-[#B83A3A]/30 text-[#B83A3A] mb-5 flex items-start gap-2"
            >
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="gov-name" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                Official Full Name
              </label>
              <input
                id="gov-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Er. Rajesh Verma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="gov-email" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                Government Email Address
              </label>
              <input
                id="gov-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@municipal.gov.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="gov-dept" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  id="gov-dept"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#C9C0B3] bg-white text-[#242222] text-xs focus:outline-none focus:border-[#8B2635] transition-all"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="gov-ward" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                  Assigned Ward
                </label>
                <select
                  id="gov-ward"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#C9C0B3] bg-white text-[#242222] text-xs focus:outline-none focus:border-[#8B2635] transition-all"
                >
                  <option value="">All Wards (Central)</option>
                  {WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="gov-pass" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                Security Password
              </label>
              <input
                id="gov-pass"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 characters)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gov-invite" className="block text-xs font-bold text-[#242222] uppercase tracking-wider">
                  Department Invite Code
                </label>
                <button
                  type="button"
                  onClick={() => setInviteCode("civic2025gov")}
                  className="text-[11px] text-[#8B2635] hover:underline font-bold cursor-pointer"
                >
                  Demo: <span className="font-mono bg-[#F0E5D8] px-1.5 py-0.5 rounded border border-[#D6C2A3]">civic2025gov</span>
                </button>
              </div>
              <input
                id="gov-invite"
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter civic2025gov"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6C2A3] bg-[#F0E5D8]/40 text-[#242222] font-mono text-sm focus:outline-none focus:border-[#8B2635] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#242222] hover:bg-[#181616] text-[#F7F4ED] font-bold text-sm transition-all duration-200 shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? "Authenticating Authority..." : "Register Officer Account →"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#DED8CD]/60 text-center text-xs text-[#625E59]">
            Already verified?{" "}
            <Link
              href="/gov-login"
              className="text-[#8B2635] font-bold hover:underline"
            >
              Official Sign In
            </Link>
            <div className="mt-2.5">
              <Link
                href="/signup"
                className="text-[#88827A] hover:text-[#242222] text-[11px] font-medium"
              >
                Not a municipal officer? Register as Citizen →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
