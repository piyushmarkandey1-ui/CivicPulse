"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { WARD_LEADERBOARD } from "./mockData";
import { cn } from "@/lib/utils";

interface CollapsibleSidebarProps {
  isOpen:           boolean;
  onToggle:         () => void;
  showHeatmap:      boolean;
  onToggleHeatmap:  () => void;
}

export default function CollapsibleSidebar({
  isOpen,
  onToggle,
  showHeatmap,
  onToggleHeatmap,
}: CollapsibleSidebarProps) {
  const ref = useRef(null);

  return (
    <>
      {/* Toggle button — always visible */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-4 top-[calc(50%-28px)] z-30 h-10 w-10 flex items-center justify-center rounded-xl glass border border-white/10 text-text-muted hover:text-copper hover:border-copper/30 transition-colors shadow-lg"
        aria-label={isOpen ? "Collapse sidebar" : "Open sidebar"}
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
      >
        <motion.svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </motion.svg>
      </motion.button>

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute left-0 top-0 h-full w-72 z-20 flex flex-col overflow-hidden"
            style={{
              background: "rgba(11,17,32,0.88)",
              backdropFilter: "blur(20px)",
              borderRight: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "8px 0 40px rgba(0,0,0,0.5)",
            }}
            aria-label="Map sidebar"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/[0.06]">
              <h2 className="text-h3 text-white">Map Controls</h2>
              <p className="text-caption text-slate-500 mt-0.5 normal-case tracking-normal">
                Layers and ward ranking
              </p>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto p-5 gap-6">

              {/* ── Heatmap toggle ── */}
              <section>
                <p className="text-caption text-slate-500 mb-3">Map Layers</p>

                <motion.button
                  onClick={onToggleHeatmap}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300",
                    showHeatmap
                      ? "bg-copper/15 border-copper/40"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden>🌡️</span>
                    <div className="text-left">
                      <p className={cn(
                        "text-body-sm font-semibold",
                        showHeatmap ? "text-copper-light" : "text-text-secondary"
                      )}>
                        Hotspot Heatmap
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Show issue density overlay
                      </p>
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <div className={cn(
                    "relative h-5 w-9 rounded-full transition-colors duration-300 flex-shrink-0",
                    showHeatmap ? "bg-copper" : "bg-slate-700"
                  )}>
                    <motion.div
                      className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md"
                      animate={{ x: showHeatmap ? 16 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>

                {/* Layer legend */}
                <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 space-y-2">
                  {[
                    { color: "#ef4444", label: "Critical hotspot" },
                    { color: "#F59E0B", label: "Moderate density" },
                    { color: "#22C55E", label: "Low / Resolved" },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
                      <span className="text-caption text-slate-500 normal-case tracking-normal">{label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* ── Ward Leaderboard ── */}
              <section ref={ref} className="flex flex-col gap-3">
                <p className="text-caption text-slate-500">Ward Leaderboard</p>

                {WARD_LEADERBOARD.map((ward, i) => (
                  <LeaderboardRow key={ward.name} ward={ward} index={i} />
                ))}
              </section>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* ── Quick stats ── */}
              <section>
                <p className="text-caption text-slate-500 mb-3">Live Summary</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Total Issues",   value: "18" },
                    { label: "Resolved",       value: "4"  },
                    { label: "Critical Open",  value: "6"  },
                    { label: "Avg Response",   value: "4.2d" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5 text-center">
                      <p className="text-caption text-slate-500 normal-case tracking-normal leading-tight mb-1">{label}</p>
                      <p className="text-sm font-bold text-copper">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function LeaderboardRow({
  ward,
  index,
}: {
  ward: (typeof WARD_LEADERBOARD)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-black w-4 flex-shrink-0 text-slate-500">
            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index+1}`}
          </span>
          <p className="text-[11px] font-medium text-text-secondary truncate">{ward.name}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={cn(
            "text-[10px] font-semibold",
            ward.delta.startsWith("+") ? "text-green-400" : "text-danger"
          )}>{ward.delta}</span>
          <span className="text-xs font-bold text-white">{ward.score}</span>
        </div>
      </div>
      <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: index === 0
              ? "linear-gradient(90deg,#D98B52,#F59E0B)"
              : "linear-gradient(90deg,#334155,#D98B52)",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${ward.score}%` } : {}}
          transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
