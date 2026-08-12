"use client";

import { motion } from "framer-motion";
import { type Filters } from "./MapDashboard";
import { type Category, type Severity, type IssueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_CHIPS: { label: string; value: Category | "all" }[] = [
  { label: "All Types", value: "all" },
  { label: "🕳️ Pothole", value: "Pothole" },
  { label: "💧 Waterlogging", value: "Water Clogging" },
  { label: "🏗️ Crack", value: "Crack" },
  { label: "🛣️ Road Damage", value: "Road Damage" },
  { label: "⚠️ Other", value: "Other" },
];

const SEVERITY_CHIPS: { label: string; value: Severity | "all"; color: string }[] = [
  { label: "All", value: "all", color: "copper" },
  { label: "🔴 Critical", value: "critical", color: "red" },
  { label: "🟡 Moderate", value: "moderate", color: "amber" },
  { label: "✅ Resolved", value: "resolved", color: "green" },
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
  color = "copper",
  onClick,
}: {
  active: boolean;
  label: string;
  color?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "relative px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none",
        "border focus:outline-none focus:ring-1 focus:ring-copper",
        active
          ? "text-[#0D0D0C] border-transparent font-bold"
          : "text-text-muted border-white/10 hover:border-white/20 hover:text-text-primary bg-white/[0.03]"
      )}
      style={
        active
          ? {
              background:
                color === "red"
                  ? "linear-gradient(135deg,#ef4444,#dc2626)"
                  : color === "amber"
                  ? "linear-gradient(135deg,#F59E0B,#D97706)"
                  : color === "green"
                  ? "linear-gradient(135deg,#22C55E,#16A34A)"
                  : "linear-gradient(135deg,#D98B52,#C27840)",
              boxShadow:
                color === "red"
                  ? "0 0 12px rgba(239,68,68,0.4)"
                  : color === "amber"
                  ? "0 0 12px rgba(245,158,11,0.4)"
                  : color === "green"
                  ? "0 0 12px rgba(34,197,94,0.4)"
                  : "0 0 12px rgba(217,139,82,0.4)",
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
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex items-center gap-3"
      >
        {/* Glass container */}
        <div
          className="rounded-2xl px-4 py-2.5 flex flex-col gap-2 border border-white/[0.08]"
          style={{
            background: "rgba(18,17,16,0.92)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
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
            <span
              className="ml-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-[#0D0D0C] flex-shrink-0"
              style={{ background: "#D98B52" }}
            >
              {issueCount} active
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06]" />

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
            <div className="h-4 w-px bg-white/10 flex-shrink-0" />
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

        {/* Prominent Report Issue Button in toolbar */}
        {onOpenReportModal && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs text-[#0D0D0C] transition-all duration-200 border border-copper/40 shadow-xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#D98B52,#E6A370)",
              boxShadow: "0 4px 24px rgba(217,139,82,0.35)",
            }}
          >
            <span className="text-base leading-none">📢</span>
            <span className="whitespace-nowrap">Report an Issue</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
