"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { type USER_PROFILE } from "./mockProfileData";

export default function ProfileHeader({ profile }: { profile: typeof USER_PROFILE }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-white/[0.08]"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="absolute inset-0 bg-teal/20 blur-xl rounded-full" />
        <div className="relative h-28 w-28 rounded-full border-4 border-white/[0.08] overflow-hidden bg-navy-muted">
          <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.avatarSeed}&backgroundColor=14B8A6`} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 right-0 h-8 w-8 rounded-full bg-navy border-2 border-teal flex items-center justify-center text-sm shadow-lg">
          ⭐
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
          <h1 className="text-h2 text-white">{profile.name}</h1>
          <Badge label={profile.level} variant="teal" />
        </div>
        <p className="text-body-sm text-slate-400 mb-6">CivicPulse member since {profile.joinDate}</p>

        {/* Stats */}
        <div className="flex justify-center md:justify-start gap-8">
          <div>
            <p className="text-caption text-slate-500 mb-1">Total Reports</p>
            <p className="text-3xl font-black text-white">{profile.totalReports}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-caption text-slate-500 mb-1">Reputation Score</p>
            <p className="text-3xl font-black text-amber-light">{profile.reputationScore}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
