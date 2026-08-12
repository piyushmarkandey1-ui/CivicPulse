"use client";

import { motion } from "framer-motion";
import { type Filters } from "./MapDashboard";
import { type Category, type Severity, type IssueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  issueCount: number;
  onOpenReportModal?: () => void;
}

const CATEGORIES: { label: string; value: Category; icon: string }[] = [
  { label: "Potholes", value: "Pothole", icon: "🕳️" },
  { label: "Waterlogging", value: "Water Clogging", icon: "💧" },
  { label: "Structural", value: "Crack", icon: "🏗️" },
  { label: "Road Damage", value: "Road Damage", icon: "🛣️" },
];

export default function FilterBar({
  filters,
  onChange,
  issueCount,
  onOpenReportModal,
}: FilterBarProps) {
  const isAll =
    filters.category === "all" &&
    filters.severity === "all" &&
    filters.status === "all";

  const handleReset = () => {
    onChange({ category: "all", severity: "all", status: "all" });
  };

  const handleCategoryClick = (cat: Category) => {
    onChange({
      ...filters,
      category: filters.category === cat ? "all" : cat,
    });
  };

  const handleCriticalToggle = () => {
    onChange({
      ...filters,
      severity: filters.severity === "critical" ? "all" : "critical",
    });
  };

  const handleResolvedToggle = () => {
    onChange({
      ...filters,
      status: filters.status === "Resolved" ? "all" : "Resolved",
    });
  };

  return (
    <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[96vw] w-fit">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DED8CD] shadow-[0_8px_30px_rgba(36,34,34,0.1)] overflow-x-auto scrollbar-none"
      >
        {/* All / Reset Pill */}
        <button
          type="button"
          onClick={handleReset}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none border",
            isAll
              ? "bg-[#8B2635] text-white border-[#8B2635] shadow-xs font-bold"
              : "bg-transparent text-[#625E59] border-transparent hover:bg-[#F0E5D8] hover:text-[#8B2635]"
          )}
        >
          All ({issueCount})
        </button>

        <div className="h-4 w-px bg-[#DED8CD] flex-shrink-0" />

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1">
          {CATEGORIES.map(({ label, value, icon }) => {
            const active = filters.category === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleCategoryClick(value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none border",
                  active
                    ? "bg-[#8B2635] text-white border-[#8B2635] shadow-xs font-bold"
                    : "bg-transparent text-[#625E59] border-transparent hover:bg-[#F0E5D8] hover:text-[#8B2635]"
                )}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-[#DED8CD] flex-shrink-0" />

        {/* Status / Severity Quick Toggles */}
        <div className="flex items-center gap-1">
          {/* Critical Hazard toggle */}
          <button
            type="button"
            onClick={handleCriticalToggle}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none border",
              filters.severity === "critical"
                ? "bg-[#B83A3A] text-white border-[#B83A3A] shadow-xs font-bold"
                : "bg-transparent text-[#B83A3A] border-transparent hover:bg-[#FDEDED]"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-[#B83A3A] inline-block" />
            <span>Critical</span>
          </button>

          {/* Resolved toggle */}
          <button
            type="button"
            onClick={handleResolvedToggle}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none border",
              filters.status === "Resolved"
                ? "bg-[#5E8061] text-white border-[#5E8061] shadow-xs font-bold"
                : "bg-transparent text-[#5E8061] border-transparent hover:bg-[#EEF5EE]"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-[#5E8061] inline-block" />
            <span>Resolved</span>
          </button>
        </div>

        {/* Report New Issue Button */}
        {onOpenReportModal && (
          <>
            <div className="h-4 w-px bg-[#DED8CD] flex-shrink-0" />
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#8B2635] hover:bg-[#641B27] text-white transition-all shadow-xs cursor-pointer whitespace-nowrap ml-0.5"
            >
              <span>📢</span>
              <span>Report Issue</span>
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
