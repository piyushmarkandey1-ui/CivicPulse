"use client";

import { motion } from "framer-motion";
import { type USER_PROFILE, type BadgeEarned } from "./mockProfileData";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GamificationSection({
  profile,
  badges,
}: {
  profile: typeof USER_PROFILE;
  badges: BadgeEarned[];
}) {
  const progressPercent =
    (profile.reportsNeededForNextBadge / profile.reportsForNextBadgeTotal) * 100;

  return (
    <section className="space-y-4">
      <h2 className="text-base font-bold text-[#242222]">Achievements & Milestones</h2>

      {/* Progress to next badge */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl p-5 bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.05)]"
      >
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs text-[#625E59] font-medium">
              <span className="text-[#8B2635] font-bold">
                {profile.reportsNeededForNextBadge} more reports
              </span>{" "}
              to unlock rank advancement
            </p>
            <p className="text-sm font-bold text-[#242222] mt-0.5">{profile.nextBadge}</p>
          </div>
          <div className="text-3xl" aria-hidden>
            🛡️
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 bg-[#F0E5D8] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#8B2635]"
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "relative rounded-xl p-4 flex flex-col items-center text-center transition-all duration-200 border bg-white",
              badge.isLocked
                ? "border-[#DED8CD] opacity-50 grayscale"
                : "border-[#DED8CD] hover:border-[#8B2635] shadow-[0_4px_16px_rgba(36,34,34,0.04)]"
            )}
          >
            {badge.isLocked && (
              <div className="absolute top-2 right-2 p-1 rounded-full text-[#88827A]">
                <Lock className="h-3 w-3" />
              </div>
            )}

            <div className="text-3xl mb-2">{badge.icon}</div>

            <h4
              className={cn(
                "text-xs font-bold mb-1",
                badge.isLocked ? "text-[#88827A]" : "text-[#242222]"
              )}
            >
              {badge.name}
            </h4>

            {!badge.isLocked && badge.unlockedAt && (
              <p className="text-[10px] text-[#8B2635] font-semibold uppercase tracking-wider">
                {new Date(badge.unlockedAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
