"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate invite code
    const expectedCode = process.env.NEXT_PUBLIC_GOV_INVITE_CODE || "civic2025gov";
    if (inviteCode.trim() !== expectedCode) {
      setError("Invalid invite code. Please contact your department administrator.");
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
      if (!data.user) throw new Error("Signup failed. Please try again.");

      // Profile is auto-created by database trigger — no manual insert needed

      router.push("/gov-dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(13,13,12,0.7)",
    borderColor: "rgba(211,163,74,0.15)",
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm text-white placeholder-text-subtle border focus:outline-none transition-colors";

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-6 py-12">
      <div className="w-full max-w-md">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-warning/30 bg-warning/[0.07] text-warning">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Government Access Request
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border p-8"
          style={{
            background: "rgba(20,17,13,0.92)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(211,163,74,0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(211,163,74,0.1)", border: "1px solid rgba(211,163,74,0.2)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D3A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Register as Official</h1>
              <p className="text-xs text-text-muted mt-0.5">Invite code required</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Official Registration</h2>
            <p className="text-text-muted text-sm">
              Create your government operations account. You'll need your department invite code to proceed.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="gov-name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Full Name
              </label>
              <input
                id="gov-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="gov-dept" className="block text-sm font-medium text-text-secondary mb-1.5">
                Department
              </label>
              <select
                id="gov-dept"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={cn(inputClass, "cursor-pointer")}
                style={inputStyle}
              >
                <option value="" disabled style={{ background: "#191715" }}>Select department…</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} style={{ background: "#191715" }}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="gov-ward" className="block text-sm font-medium text-text-secondary mb-1.5">
                Assigned Ward <span className="text-text-subtle font-normal">(optional)</span>
              </label>
              <select
                id="gov-ward"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className={cn(inputClass, "cursor-pointer")}
                style={inputStyle}
              >
                <option value="" style={{ background: "#191715" }}>All Wards (City-wide)</option>
                {WARDS.map((w) => (
                  <option key={w} value={w} style={{ background: "#191715" }}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="gov-reg-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Official Email
              </label>
              <input
                id="gov-reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="official@municipality.gov.in"
              />
            </div>

            <div>
              <label htmlFor="gov-reg-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="gov-reg-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="Minimum 8 characters"
              />
            </div>

            {/* Invite code with reveal toggle */}
            <div>
              <label htmlFor="invite-code" className="block text-sm font-medium text-text-secondary mb-1.5">
                Department Invite Code
              </label>
              <div className="relative">
                <input
                  id="invite-code"
                  type={showCode ? "text" : "password"}
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className={cn(inputClass, "pr-12")}
                  style={inputStyle}
                  placeholder="Enter your invite code"
                />
                <button
                  type="button"
                  onClick={() => setShowCode((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted transition-colors"
                  aria-label={showCode ? "Hide code" : "Show code"}
                >
                  {showCode ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-text-subtle">
                Contact your department head or IT administrator to obtain this code.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold disabled:opacity-60 transition-all duration-200"
              style={{ background: "#D3A34A", color: "#0D0D0C" }}
            >
              {loading ? "Registering…" : "Register as Government Official →"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-text-muted">
            Already registered?{" "}
            <Link href="/gov-login" className="font-semibold underline underline-offset-2" style={{ color: "#D3A34A" }}>
              Sign in to the portal
            </Link>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-text-subtle mt-4"
        >
          Not a government official?{" "}
          <Link href="/signup" className="underline underline-offset-2 hover:text-text-muted">
            Create a citizen account →
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
