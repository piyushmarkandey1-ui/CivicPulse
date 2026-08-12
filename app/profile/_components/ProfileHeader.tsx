"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { type USER_PROFILE } from "./mockProfileData";

export default function ProfileHeader({ profile }: { profile: typeof USER_PROFILE }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.06)]"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="relative h-24 w-24 rounded-full border-2 border-[#DED8CD] overflow-hidden bg-[#F0E5D8]">
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.avatarSeed}&backgroundColor=F0E5D8`}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#8B2635] text-white border-2 border-white flex items-center justify-center text-xs shadow-xs">
          ⭐
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-2.5 mb-1.5">
          <h1 className="text-xl md:text-2xl font-bold text-[#242222]">{profile.name}</h1>
          <Badge label={profile.level} variant="maroon" />
        </div>
        <p className="text-xs text-[#625E59] mb-5">CivicPulse verified citizen contributor</p>

        {/* Stats */}
        <div className="flex justify-center md:justify-start gap-8">
          <div>
            <p className="text-[11px] font-bold text-[#88827A] uppercase tracking-wider mb-0.5">
              Total Reports
            </p>
            <p className="text-2xl font-bold font-mono text-[#8B2635]">
              {profile.totalReports}
            </p>
          </div>
          <div className="w-px bg-[#DED8CD]" />
          <div>
            <p className="text-[11px] font-bold text-[#88827A] uppercase tracking-wider mb-0.5">
              Reputation Score
            </p>
            <p className="text-2xl font-bold font-mono text-[#242222]">
              {profile.reputationScore}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
