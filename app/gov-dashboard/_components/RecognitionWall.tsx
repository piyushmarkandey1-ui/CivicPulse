"use client";

import { motion } from "framer-motion";
import { Award, Share2, Star } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";

const TOP_WARDS = [
  { rank: 1, name: "Ward 12 — Andheri East", score: 94, highlight: "Fastest response time (2.1d)" },
  { rank: 2, name: "Ward 3 — Colaba", score: 96, highlight: "Highest resolution rate (96%)" },
  { rank: 3, name: "Ward 7 — Bandra West", score: 88, highlight: "Most community upvotes" },
];

export default function RecognitionWall() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {TOP_WARDS.map((ward, index) => (
        <motion.div
          key={ward.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className="rounded-2xl bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.06)] p-6 flex flex-col items-center text-center"
        >
          {/* Medal Icon */}
          <div className="relative mb-4">
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center ${
                index === 0
                  ? "bg-[#8B2635] text-white shadow-[0_4px_16px_rgba(139,38,53,0.3)]"
                  : index === 1
                  ? "bg-[#D6C2A3] text-[#242222]"
                  : "bg-[#F0E5D8] text-[#8B2635] border border-[#D6C2A3]"
              }`}
            >
              <Award className="h-7 w-7" />
            </div>

            {/* Rank badge */}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#242222] border border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
              #{ward.rank}
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#242222] mb-1">{ward.name}</h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-[#C58B32] text-[#C58B32]" />
            ))}
            <span className="text-xs font-mono font-bold text-[#8B2635] ml-1">
              {ward.score}/100
            </span>
          </div>

          <p className="text-xs text-[#625E59] mb-5 flex-1 bg-[#F7F4ED] px-3 py-2 rounded-lg border border-[#DED8CD] leading-relaxed">
            {ward.highlight}
          </p>

          <GradientButton
            variant="outline"
            size="sm"
            className="w-full text-xs"
            icon={<Share2 className="h-3 w-3" />}
          >
            Share Public Recognition
          </GradientButton>
        </motion.div>
      ))}
    </div>
  );
}
