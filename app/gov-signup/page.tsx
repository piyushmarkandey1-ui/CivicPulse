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
      setError("Invalid department invite code. Please check with your ward administrator.");
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
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6 py-12 bg-[#F7F4ED]">
      <div className="w-full max-w-md">
        {/* Badge */}
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
            Official Onboarding Protocol
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-2xl border border-[#D6C2A3] p-8 bg-white shadow-[0_6px_24px_rgba(36,34,34,0.07)]"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#242222] mb-1">Official Registration</h1>
            <p className="text-[#625E59] text-xs">
              Register as a municipal department lead or ward operations officer.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#FDEDED] border border-[#B83A3A]/25 text-[#B83A3A] text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="gov-name" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                Full Name & Rank
              </label>
              <input
                id="gov-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Er. Ramesh Deshmukh (AE)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="gov-email" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                Official Email
              </label>
              <input
                id="gov-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="r.deshmukh@bmc.gov.in"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
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
                  className="w-full px-3 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-xs focus:outline-none focus:border-[#8B2635] transition-all"
                >
                  <option value="">Select Dept</option>
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
                  className="w-full px-3 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-xs focus:outline-none focus:border-[#8B2635] transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C9C0B3] bg-white text-[#242222] text-sm focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="gov-invite" className="block text-xs font-bold text-[#242222] uppercase tracking-wider mb-1">
                Department Access Code
              </label>
              <input
                id="gov-invite"
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="e.g. civic2025gov"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6C2A3] bg-[#F0E5D8]/50 text-[#242222] font-mono text-sm focus:outline-none focus:border-[#8B2635] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-[#242222] hover:bg-[#181616] text-[#F7F4ED] font-bold text-sm transition-all duration-200 shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? "Registering Official Profile..." : "Complete Official Registration"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-[#DED8CD] flex flex-col gap-2 text-center text-xs text-[#625E59]">
            <p>
              Already registered?{" "}
              <Link href="/gov-login" className="text-[#8B2635] font-bold hover:underline">
                Officer Sign In →
              </Link>
            </p>
            <p className="text-[#88827A]">
              Citizen contributor?{" "}
              <Link href="/signup" className="text-[#242222] font-semibold hover:underline">
                Citizen Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
