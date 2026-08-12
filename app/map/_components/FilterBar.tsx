"use client";

import { motion } from "framer-motion";
import { type Filters } from "./MapDashboard";
import { type Category, type Severity, type IssueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_CHIPS: { label: string; value: Category | "all" }[] = [
  { label: "All Categories", value: "all" },
  { label: "🕳️ Pothole", value: "Pothole" },
  { label: "💧 Waterlogging", value: "Water Clogging" },
  { label: "🏗️ Crack", value: "Crack" },
  { label: "🛣️ Road Damage", value: "Road Damage" },
  { label: "⚠️ Other", value: "Other" },
];

const SEVERITY_CHIPS: { label: string; value: Severity | "all"; color: string }[] = [
  { label: "All Severity", value: "all", color: "maroon" },
  { label: "Critical", value: "critical", color: "red" },
  { label: "Reported", value: "moderate", color: "amber" },
  { label: "Resolved", value: "resolved", color: "green" },
];

const STATUS_CHIPS: { label: string; value: IssueStatus | "all" }[] = [
  { label: "All Status", value: "all" },
  { label: "Reported", value: "Reported" },
  { label: "Verified", value: "Verified" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
];

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  issueCount: number;
  onOpenReportModal?: () => void;
}

function Chip({
  active,
  label,
  color = "maroon",
  onClick,
}: {
  active: boolean;
  label: string;
  color?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "relative px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none border",
        active
          ? "text-white border-transparent shadow-xs font-bold"
          : "text-[#625E59] border-[#DED8CD] hover:border-[#8B2635] hover:text-[#8B2635] bg-[#F7F4ED]"
      )}
      style={
        active
          ? {
              backgroundColor:
                color === "red"
                  ? "#B83A3A"
                  : color === "amber"
                  ? "#C58B32"
                  : color === "green"
                  ? "#5E8061"
                  : "#8B2635",
            }
          : undefined
      }
    >
      {label}
    </motion.button>
  );
}

export default function FilterBar({
  filters,
  onChange,
  issueCount,
  onOpenReportModal,
}: FilterBarProps) {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[94vw] w-fit">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex items-center gap-3"
      >
        {/* White institutional container */}
        <div
          className="rounded-2xl px-4 py-2.5 flex flex-col gap-2 border border-[#DED8CD] bg-white shadow-[0_6px_24px_rgba(36,34,34,0.08)]"
        >
          {/* Row 1: Category + count badge */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {CATEGORY_CHIPS.map((chip) => (
              <Chip
                key={chip.value}
                label={chip.label}
                active={filters.category === chip.value}
                onClick={() => onChange({ ...filters, category: chip.value })}
              />
            ))}
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0E5D8] text-[#8B2635] border border-[#D6C2A3] flex-shrink-0 font-mono">
              {issueCount} active
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#DED8CD]" />

          {/* Row 2: Severity + Status */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {SEVERITY_CHIPS.map((chip) => (
                <Chip
                  key={chip.value}
                  label={chip.label}
                  color={chip.color}
                  active={filters.severity === chip.value}
                  onClick={() => onChange({ ...filters, severity: chip.value })}
                />
              ))}
            </div>
            <div className="h-4 w-px bg-[#DED8CD] flex-shrink-0" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {STATUS_CHIPS.map((chip) => (
                <Chip
                  key={chip.value}
                  label={chip.label}
                  active={filters.status === chip.value}
                  onClick={() => onChange({ ...filters, status: chip.value })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Primary Report Issue Button in toolbar */}
        {onOpenReportModal && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-[#8B2635] hover:bg-[#641B27] text-white transition-all duration-200 shadow-[0_4px_16px_rgba(139,38,53,0.25)] flex-shrink-0"
          >
            <span className="text-base leading-none">📢</span>
            <span className="whitespace-nowrap">Report an Issue</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
