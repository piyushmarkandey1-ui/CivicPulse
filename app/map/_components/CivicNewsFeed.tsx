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
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sortedIssues = [...issues].sort((a, b) => {
    if (a.severity === "critical" && b.severity !== "critical") return -1;
    if (b.severity === "critical" && a.severity !== "critical") return 1;
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  });

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress" || i.status === "Verified").length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  // Function to pause ticker during manual interaction and auto-resume after 6s
  const handleUserManualScroll = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  // Smooth background auto-scroll when not manually interacting
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 2) {
          scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ top: 1, behavior: "auto" });
        }
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  return (
    <>
      {/* ── Toggle button (ONLY VISIBLE WHEN SIDEBAR IS CLOSED) ── */}
      {!isOpen && (
        <motion.button
          onClick={onToggle}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="absolute left-4 top-20 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition-all duration-200 bg-white/95 backdrop-blur-md border-[#DED8CD] text-[#242222] shadow-[0_8px_24px_rgba(36,34,34,0.12)] cursor-pointer"
          aria-label="Open Civic Bulletin"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B83A3A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B83A3A]"></span>
          </span>
          <span>Live Civic Radar</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      )}

      {/* ── Sidebar Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -380, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="absolute left-0 top-0 h-full w-84 sm:w-96 z-20 flex flex-col overflow-hidden bg-[#F7F4ED] border-r border-[#DED8CD] shadow-[0_8px_36px_rgba(36,34,34,0.12)]"
            aria-label="Civic Pulse Bulletin"
          >
            {/* Header */}
            <div className="pt-20 pb-3.5 px-5 border-b border-[#DED8CD] bg-white flex-shrink-0">
              {/* Top Title Row with integrated collapse button */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B83A3A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B83A3A]"></span>
                  </span>
                  <h2 className="text-xs font-bold tracking-wider uppercase text-[#242222]">
                    Civic Pulse Live Radar
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F0E5D8] text-[#8B2635] border border-[#D6C2A3]">
                    LIVE
                  </span>
                  {/* Clean Collapse button inside header */}
                  <button
                    onClick={onToggle}
                    className="p-1 rounded-lg hover:bg-[#F0E5D8] text-[#625E59] hover:text-[#242222] transition-colors cursor-pointer"
                    title="Hide bulletin sidebar"
                    aria-label="Hide bulletin sidebar"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Banner */}
              {role === "government" ? (
                <div className="mb-3 p-2.5 rounded-xl border border-[#D6C2A3] bg-[#F0E5D8] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#242222]">
                    <span>🛡️</span>
                    <span className="font-bold truncate max-w-[170px]">
                      {profile?.department || "Municipal Command"}
                    </span>
                  </div>
                  <Link
                    href="/gov-dashboard"
                    className="text-[11px] font-bold text-[#8B2635] hover:underline whitespace-nowrap"
                  >
                    Dashboard →
                  </Link>
                </div>
              ) : (
                <div className="mb-3 flex items-center gap-2">
                  <button
                    onClick={onOpenReportModal}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#8B2635] hover:bg-[#641B27] transition-all shadow-xs cursor-pointer"
                  >
                    <span>📢</span>
                    <span>Report New Issue</span>
                  </button>
                  {role === "citizen" && (
                    <Link
                      href="/profile"
                      className="py-2 px-3 rounded-xl text-xs font-semibold text-[#625E59] hover:text-[#242222] bg-[#F7F4ED] border border-[#DED8CD] hover:border-[#8B2635] transition-all"
                    >
                      My Reports
                    </Link>
                  )}
                </div>
              )}

              {/* Metrics Summary Row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-[#FDEDED] border border-[#B83A3A]/20">
                  <span className="block text-[10px] font-bold text-[#B83A3A] uppercase">Critical</span>
                  <span className="text-sm font-bold font-mono text-[#B83A3A]">{criticalCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FEF6E9] border border-[#C58B32]/20">
                  <span className="block text-[10px] font-bold text-[#C58B32] uppercase">Active</span>
                  <span className="text-sm font-bold font-mono text-[#C58B32]">{inProgressCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#EEF5EE] border border-[#5E8061]/20">
                  <span className="block text-[10px] font-bold text-[#5E8061] uppercase">Resolved</span>
                  <span className="text-sm font-bold font-mono text-[#5E8061]">{resolvedCount}</span>
                </div>
              </div>

              {/* Heatmap Toggle */}
              <div className="mt-2.5 flex items-center justify-between p-2 rounded-xl bg-[#F7F4ED] border border-[#DED8CD]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#625E59]">
                  <span>🌡️</span>
                  <span>Hotspot Heatmap Overlay</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleHeatmap}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors duration-200 cursor-pointer",
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

            {/* Smooth Scroll Feed Container with Manual Scroll & Drag Support */}
            <div
              className="relative flex-1 overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onWheel={handleUserManualScroll}
              onTouchStart={handleUserManualScroll}
              onPointerDown={handleUserManualScroll}
            >
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto p-4 space-y-3 overscroll-contain"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#DED8CD transparent",
                }}
              >
                {sortedIssues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id;
                  const isCritical = issue.severity === "critical";

                  return (
                    <motion.div
                      key={issue.id}
                      onClick={() => onSelectIssue(issue)}
                      whileHover={{ scale: 1.015, y: -2 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "rounded-2xl p-4 transition-all duration-200 cursor-pointer border",
                        isSelected
                          ? "bg-white border-[#8B2635] shadow-[0_8px_24px_rgba(139,38,53,0.12)] ring-1 ring-[#8B2635]"
                          : isCritical
                          ? "bg-white border-[#B83A3A]/30 hover:border-[#8B2635] shadow-xs"
                          : "bg-white border-[#DED8CD] hover:border-[#8B2635] shadow-xs"
                      )}
                    >
                      {/* Top Row: Category & Status */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">
                            {CAT_EMOJIS[issue.category] || "📍"}
                          </span>
                          <span className="text-xs font-bold text-[#242222]">
                            {issue.category}
                          </span>
                        </div>
                        <Badge
                          label={issue.status}
                          variant={
                            issue.status === "Resolved"
                              ? "success"
                              : isCritical
                              ? "critical"
                              : "sand"
                          }
                        />
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-[#242222] mb-1 line-clamp-1">
                        {issue.title}
                      </h4>

                      {/* Description */}
                      <p className="text-[11px] text-[#625E59] line-clamp-2 leading-relaxed mb-2">
                        {issue.description}
                      </p>

                      {/* Meta Footer */}
                      <div className="flex items-center justify-between text-[10px] text-[#88827A] pt-2 border-t border-[#DED8CD]/60">
                        <span className="flex items-center gap-1 text-[#625E59] font-medium truncate max-w-[180px]">
                          <span className="text-[#8B2635]">📍</span>
                          <span>{issue.ward}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#8B2635]">
                            ▲ {issue.upvotes || 0}
                          </span>
                          <span>
                            {new Date(issue.reportedAt).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="p-3 border-t border-[#DED8CD] bg-white text-center flex-shrink-0">
              <p className="text-[11px] text-[#625E59] flex items-center justify-center gap-1.5">
                <span>💡</span>
                <span>Click any incident to fly GIS map & view SLA telemetry</span>
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
