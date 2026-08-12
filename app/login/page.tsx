"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/GradientButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Fetch role to redirect appropriately
      const docRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === "government") {
          router.push("/gov-dashboard");
        } else {
          router.push("/map");
        }
      } else {
        router.push("/map");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 mt-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 border border-white/[0.08]"
      >
        <div className="text-center mb-8">
          <h1 className="text-h2 text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-body-sm">Sign in to continue to CivicPulse</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? "Signing In..." : "Sign In"}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link href="/signup" className="text-teal hover:text-teal-light font-bold">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
