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

  const sortedIssues = [...issues].sort((a, b) => {
    if (a.severity === "critical" && b.severity !== "critical") return -1;
    if (b.severity === "critical" && a.severity !== "critical") return 1;
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  });

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress").length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 4) {
          scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ top: 1.2, behavior: "auto" });
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
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="absolute left-4 top-24 z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 bg-white border-[#DED8CD] text-[#242222] shadow-[0_4px_16px_rgba(36,34,34,0.08)]"
        aria-label={isOpen ? "Collapse Civic Bulletin" : "Open Civic Bulletin"}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B83A3A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B83A3A]"></span>
        </span>
        <span>{isOpen ? "Hide Bulletin" : "Live Civic Radar"}</span>
        <motion.svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
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
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute left-0 top-0 h-full w-84 sm:w-96 z-20 flex flex-col overflow-hidden bg-[#F7F4ED] border-r border-[#DED8CD] shadow-[0_8px_36px_rgba(36,34,34,0.12)]"
            aria-label="Civic Pulse Bulletin"
          >
            {/* Header with Live Ticker */}
            <div className="pt-20 pb-4 px-5 border-b border-[#DED8CD] bg-white">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B83A3A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B83A3A]"></span>
                  </span>
                  <h2 className="text-xs font-bold tracking-wider uppercase text-[#242222]">
                    Civic Pulse Live Radar
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F0E5D8] text-[#8B2635] border border-[#D6C2A3]">
                  REAL-TIME STREAM
                </span>
              </div>

              {/* Role-based Banner */}
              {role === "government" ? (
                <div className="mb-3 p-2.5 rounded-xl border border-[#D6C2A3] bg-[#F0E5D8] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#242222]">
                    <span>🛡️</span>
                    <span className="font-bold">
                      Official Ops: {profile?.department || "Municipal Command"}
                    </span>
                  </div>
                  <Link
                    href="/gov-dashboard"
                    className="text-[11px] font-bold text-[#8B2635] hover:underline"
                  >
                    Dashboard →
                  </Link>
                </div>
              ) : (
                <div className="mb-3 flex items-center gap-2">
                  <button
                    onClick={onOpenReportModal}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#8B2635] hover:bg-[#641B27] transition-all shadow-xs"
                  >
                    <span>📢</span>
                    <span>Report New Issue</span>
                  </button>
                  {role === "citizen" && (
                    <Link
                      href="/profile"
                      className="py-2 px-3 rounded-lg text-xs font-semibold text-[#625E59] hover:text-[#242222] bg-[#F7F4ED] border border-[#DED8CD] hover:border-[#8B2635] transition-all"
                    >
                      My Reports
                    </Link>
                  )}
                </div>
              )}

              {/* Metrics Summary Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#FDEDED] border border-[#B83A3A]/25">
                  <span className="block text-[10px] font-bold text-[#B83A3A] uppercase">Critical</span>
                  <span className="text-sm font-bold font-mono text-[#B83A3A]">{criticalCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FEF6E9] border border-[#C58B32]/25">
                  <span className="block text-[10px] font-bold text-[#C58B32] uppercase">Active</span>
                  <span className="text-sm font-bold font-mono text-[#C58B32]">{inProgressCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#EEF5EE] border border-[#5E8061]/25">
                  <span className="block text-[10px] font-bold text-[#5E8061] uppercase">Resolved</span>
                  <span className="text-sm font-bold font-mono text-[#5E8061]">{resolvedCount}</span>
                </div>
              </div>

              {/* Heatmap Toggle */}
              <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-[#F7F4ED] border border-[#DED8CD]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#625E59]">
                  <span>🌡️</span>
                  <span>Hotspot Heatmap Overlay</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleHeatmap}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors duration-200",
                    showHeatmap ? "bg-[#8B2635]" : "bg-[#C9C0B3]"
                  )}
                  aria-label="Toggle Heatmap"
                >
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-xs"
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
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-[10px] font-bold bg-[#242222] text-[#F7F4ED] shadow-md pointer-events-none"
                  >
                    ⏸️ SCROLL PAUSED (HOVERING)
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top fade gradient */}
              <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#F7F4ED] to-transparent z-10 pointer-events-none" />

              {/* Auto-scrolling List */}
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-none"
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
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "p-3.5 rounded-xl cursor-pointer transition-all duration-150 border text-left bg-white",
                        isSelected
                          ? "border-[#8B2635] bg-[#F0E5D8]/70 shadow-[0_4px_16px_rgba(139,38,53,0.15)] ring-1 ring-[#8B2635]"
                          : isCritical
                          ? "border-[#B83A3A]/30 bg-[#FDEDED]/40 hover:border-[#B83A3A]/60"
                          : "border-[#DED8CD] hover:border-[#C9C0B3] hover:bg-[#F0E5D8]/20"
                      )}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base" role="img" aria-label={issue.category}>
                            {CAT_EMOJIS[issue.category] || "⚠️"}
                          </span>
                          <span className="text-xs font-bold text-[#242222]">
                            {issue.category}
                          </span>
                        </div>
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FDEDED] text-[#B83A3A] border border-[#B83A3A]/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#B83A3A]" />
                            CRITICAL
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-semibold border",
                              issue.status === "Resolved"
                                ? "bg-[#EEF5EE] text-[#5E8061] border-[#5E8061]/25"
                                : issue.status === "In Progress"
                                ? "bg-[#FEF6E9] text-[#C58B32] border-[#C58B32]/25"
                                : "bg-[#F7F4ED] text-[#625E59] border-[#DED8CD]"
                            )}
                          >
                            {issue.status}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xs font-bold text-[#242222] line-clamp-1 mb-1">
                        {issue.title}
                      </h3>

                      {/* Description summary */}
                      <p className="text-[11px] text-[#625E59] line-clamp-2 leading-relaxed mb-2">
                        {issue.description}
                      </p>

                      {/* Footer Details */}
                      <div className="flex items-center justify-between text-[10px] text-[#88827A] pt-2 border-t border-[#DED8CD]">
                        <div className="flex items-center gap-1 truncate max-w-[170px]">
                          <span className="text-[#8B2635]">📍</span>
                          <span className="truncate font-medium">{issue.ward || issue.address}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                          <span>▲ {issue.upvotes || 0}</span>
                          <span>{reportTime}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom fade gradient */}
              <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#F7F4ED] to-transparent z-10 pointer-events-none" />
            </div>

            {/* Footer Notice */}
            <div className="p-3 border-t border-[#DED8CD] text-center bg-white">
              <p className="text-[10px] text-[#88827A]">
                💡 Click any incident to fly GIS map & view SLA telemetry
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
