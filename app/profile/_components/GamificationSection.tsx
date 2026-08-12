"use client";

import { motion } from "framer-motion";
import { type USER_PROFILE, type BadgeEarned } from "./mockProfileData";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GamificationSection({ 
  profile, 
  badges 
}: { 
  profile: typeof USER_PROFILE;
  badges: BadgeEarned[];
}) {
  const progressPercent = (profile.reportsNeededForNextBadge / profile.reportsForNextBadgeTotal) * 100;

  return (
    <section className="space-y-6">
      <h2 className="text-h3 text-white">Achievements & Progress</h2>

      {/* Progress to next badge */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-2xl p-5 border border-teal/20"
        style={{ background: "rgba(20,184,166,0.03)" }}
      >
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-body-sm text-slate-300 font-medium">
              <span className="text-teal font-bold">{profile.reportsNeededForNextBadge} more reports</span> to unlock
            </p>
            <p className="text-h4 text-white mt-0.5">{profile.nextBadge}</p>
          </div>
          <div className="text-4xl" aria-hidden>🛡️</div>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden border border-white/10">
          <motion.div 
            className="h-full rounded-full relative"
            style={{ background: "linear-gradient(90deg, #14B8A6, #2DD4BF)" }}
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            {/* Shimmer effect inside progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>
      </motion.div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300",
              badge.isLocked 
                ? "bg-white/[0.02] border border-white/5 opacity-60 grayscale" 
                : "glass border border-white/[0.08] hover:border-teal/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] group"
            )}
          >
            {badge.isLocked && (
              <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
                <Lock className="h-3 w-3 text-slate-400" />
              </div>
            )}
            
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {badge.icon}
            </div>
            
            <h4 className={cn("text-sm font-bold mb-1", badge.isLocked ? "text-slate-400" : "text-slate-200")}>
              {badge.name}
            </h4>
            
            {!badge.isLocked && badge.unlockedAt && (
              <p className="text-[10px] text-teal/70 font-semibold uppercase tracking-wider">
                {new Date(badge.unlockedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
