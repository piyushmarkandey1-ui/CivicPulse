"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/GradientButton";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"citizen" | "government">("citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        role,
        reputationScore: 0,
        totalReports: 0,
        joinDate: new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
        createdAt: new Date().toISOString(),
      });

      if (role === "government") {
        router.push("/gov-dashboard");
      } else {
        router.push("/map");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 mt-10 mb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 border border-white/[0.08]"
      >
        <div className="text-center mb-8">
          <h1 className="text-h2 text-white mb-2">Create Account</h1>
          <p className="text-slate-400 text-body-sm">Join CivicPulse to start making an impact</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => setRole("citizen")}
              className={cn(
                "py-2 rounded-xl text-sm font-semibold transition-colors border",
                role === "citizen" 
                  ? "bg-teal/20 border-teal text-teal-light" 
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200"
              )}
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setRole("government")}
              className={cn(
                "py-2 rounded-xl text-sm font-semibold transition-colors border",
                role === "government" 
                  ? "bg-amber-600/20 border-amber text-amber-100" 
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200"
              )}
            >
              Gov Official
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy-muted border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal/50 transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-muted border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-muted border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <GradientButton 
            type="submit" 
            disabled={loading} 
            className="w-full mt-6"
            size="lg"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-teal hover:text-teal-light font-bold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
