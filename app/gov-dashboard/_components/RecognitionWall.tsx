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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 20 }}
          className="group relative rounded-2xl overflow-hidden p-[1px]" // padding for border gradient
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal via-navy to-amber opacity-30 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          
          <div className="relative h-full bg-navy rounded-2xl p-6 flex flex-col items-center text-center z-10 glass border border-transparent">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />

            {/* Medal Icon */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-copper/20 blur-xl rounded-full" />
              {index === 0 ? (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-[0_0_20px_rgba(252,211,77,0.5)]">
                  <Award className="h-8 w-8 text-yellow-950" />
                </div>
              ) : index === 1 ? (
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center">
                  <Award className="h-7 w-7 text-slate-900" />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                  <Award className="h-7 w-7 text-copper-100" />
                </div>
              )}
              {/* Rank badge */}
              <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-navy border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                #{ward.rank}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{ward.name}</h3>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber text-copper" />
              ))}
              <span className="text-xs font-bold text-copper ml-1">{ward.score}/100</span>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 flex-1 bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.05]">
              {ward.highlight}
            </p>

            <GradientButton 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              icon={<Share2 className="h-3 w-3" />}
            >
              Share Achievement
            </GradientButton>
          </div>
        </motion.div>
      ))}

      {/* Global styles for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
