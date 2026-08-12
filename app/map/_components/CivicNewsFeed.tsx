"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Issue } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface CivicNewsFeedProps {
  issues: Issue[];
  selectedIssue: Issue | null;
  onSelectIssue: (issue: Issue | null) => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenReportModal: () => void;
}

const CAT_EMOJIS: Record<string, string> = {
  Pothole: "🕳️",
  "Water Clogging": "💧",
  Crack: "🏗️",
  "Road Damage": "🛣️",
  Other: "⚠️",
};

export default function CivicNewsFeed({
  issues,
  selectedIssue,
  onSelectIssue,
  showHeatmap,
  onToggleHeatmap,
  isOpen,
  onToggle,
  onOpenReportModal,
}: CivicNewsFeedProps) {
  const { role, profile } = useAuth();
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Critical issues first, then active ones
  const sortedIssues = [...issues].sort((a, b) => {
    if (a.severity === "critical" && b.severity !== "critical") return -1;
    if (b.severity === "critical" && a.severity !== "critical") return 1;
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  });

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress").length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  // Auto-scroll animation loop
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 4) {
          // Wrap around to top smoothly
          scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ top: 1.5, behavior: "auto" });
        }
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  return (
    <>
      {/* ── Toggle button on left ── */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="absolute left-4 top-24 z-30 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
        style={{
          background: "rgba(18,17,16,0.92)",
          borderColor: "rgba(217,139,82,0.3)",
          color: "#F5F1EA",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(217,139,82,0.15)",
        }}
        aria-label={isOpen ? "Collapse Civic Bulletin" : "Open Civic Bulletin"}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="font-bold tracking-wide">
          {isOpen ? "Hide Bulletin" : "Live Civic News"}
        </span>
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path d="M9 18l6-6-6-6" />
        </motion.svg>
      </motion.button>

      {/* ── Sidebar Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="absolute left-0 top-0 h-full w-84 sm:w-96 z-20 flex flex-col overflow-hidden"
            style={{
              background: "rgba(14,13,12,0.94)",
              backdropFilter: "blur(28px)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "12px 0 48px rgba(0,0,0,0.7)",
            }}
            aria-label="Civic Pulse Bulletin"
          >
            {/* Header with Live Ticker */}
            <div className="pt-20 pb-4 px-5 border-b border-white/[0.08]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                    Civic Pulse Live Radar
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-copper/15 text-copper border border-copper/30">
                  AUTO-STREAM
                </span>
              </div>

              {/* Role-based Banner */}
              {role === "government" ? (
                <div className="mb-3 p-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-200">
                    <span>🛡️</span>
                    <span className="font-semibold">
                      Official Ops: {profile?.department || "Municipal Command"}
                    </span>
                  </div>
                  <Link
                    href="/gov-dashboard"
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                  >
                    Dashboard →
                  </Link>
                </div>
              ) : (
                <div className="mb-3 flex items-center gap-2">
                  <button
                    onClick={onOpenReportModal}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-[#0D0D0C] bg-copper hover:bg-copper-light transition-all shadow-md active:scale-98"
                  >
                    <span>📢</span>
                    <span>Report New Issue</span>
                  </button>
                  {role === "citizen" && (
                    <Link
                      href="/profile"
                      className="py-2 px-3 rounded-xl text-xs font-semibold text-text-secondary hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-copper/30 transition-all"
                    >
                      My Reports
                    </Link>
                  )}
                </div>
              )}

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="block text-[10px] font-medium text-red-400 uppercase">Critical</span>
                  <span className="text-sm font-bold text-red-200">{criticalCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="block text-[10px] font-medium text-amber-400 uppercase">Active</span>
                  <span className="text-sm font-bold text-amber-200">{inProgressCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="block text-[10px] font-medium text-green-400 uppercase">Resolved</span>
                  <span className="text-sm font-bold text-green-200">{resolvedCount}</span>
                </div>
              </div>

              {/* Heatmap Quick Toggle */}
              <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>🌡️</span>
                  <span>Hotspot Heatmap Overlay</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleHeatmap}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors duration-200",
                    showHeatmap ? "bg-copper" : "bg-white/20"
                  )}
                  aria-label="Toggle Heatmap"
                >
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                    animate={{ x: showHeatmap ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* Scrolling Feed Container */}
            <div
              className="relative flex-1 overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Paused indicator */}
              <AnimatePresence>
                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0D0D0C]/90 text-copper border border-copper/30 shadow-lg pointer-events-none"
                  >
                    ⏸️ SCROLL PAUSED (HOVERING)
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top fade gradient */}
              <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-[#0E0D0C] to-transparent z-10 pointer-events-none" />

              {/* Auto-scrolling List */}
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto px-4 py-4 space-y-3 scrollbar-none"
              >
                {sortedIssues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id;
                  const isCritical = issue.severity === "critical";
                  const reportTime = new Date(issue.reportedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <motion.div
                      key={issue.id}
                      onClick={() => onSelectIssue(isSelected ? null : issue)}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      className={cn(
                        "p-3.5 rounded-xl cursor-pointer transition-all duration-200 border text-left",
                        isSelected
                          ? "bg-copper/[0.14] border-copper shadow-[0_0_20px_rgba(217,139,82,0.25)]"
                          : isCritical
                          ? "bg-red-950/20 border-red-500/25 hover:border-red-500/50 hover:bg-red-950/30"
                          : "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.05]"
                      )}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base" role="img" aria-label={issue.category}>
                            {CAT_EMOJIS[issue.category] || "⚠️"}
                          </span>
                          <span className="text-[11px] font-bold tracking-wide text-text-primary">
                            {issue.category}
                          </span>
                        </div>
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                            CRITICAL
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-medium border",
                              issue.status === "Resolved"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : issue.status === "In Progress"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-white/[0.04] text-text-muted border-white/[0.08]"
                            )}
                          >
                            {issue.status}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xs font-semibold text-white line-clamp-1 mb-1">
                        {issue.title}
                      </h3>

                      {/* Description summary */}
                      <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed mb-2">
                        {issue.description}
                      </p>

                      {/* Footer Details */}
                      <div className="flex items-center justify-between text-[10px] text-text-subtle pt-2 border-t border-white/[0.05]">
                        <div className="flex items-center gap-1 truncate max-w-[170px]">
                          <span className="text-copper">📍</span>
                          <span className="truncate">{issue.ward || issue.address}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-text-muted">▲ {issue.upvotes || 0}</span>
                          <span>{reportTime}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom fade gradient */}
              <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#0E0D0C] to-transparent z-10 pointer-events-none" />
            </div>

            {/* Footer Notice */}
            <div className="p-3 border-t border-white/[0.06] text-center">
              <p className="text-[10px] text-text-subtle">
                💡 Click any incident to fly map & view full telemetry
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
