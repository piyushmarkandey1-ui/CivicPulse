"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Issue, type IssueStatus } from "@/lib/types";
import { computePriorityScore, cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AlertTriangle, Zap, Users, TrendingUp, IndianRupee, MapPin, Clock, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";

// ─── Priority tier helpers ────────────────────────────────────────────────────
type PriorityTier = "CRITICAL" | "HIGH" | "NORMAL";

function getTier(score: number, status: Issue["status"]): PriorityTier {
  if (status === "Resolved") return "NORMAL";
  if (score >= 70) return "CRITICAL";
  if (score >= 40) return "HIGH";
  return "NORMAL";
}

const TIER_CONFIG = {
  CRITICAL: {
    label: "🔴 CRITICAL",
    bar: "#B83A3A",
    bg: "bg-[#FDEDED]",
    border: "border-[#B83A3A]/30",
    text: "text-[#B83A3A]",
    badge: "bg-[#B83A3A] text-white",
  },
  HIGH: {
    label: "🟡 HIGH",
    bar: "#C58B32",
    bg: "bg-[#FEF6E9]",
    border: "border-[#C58B32]/30",
    text: "text-[#C58B32]",
    badge: "bg-[#C58B32] text-white",
  },
  NORMAL: {
    label: "🟢 NORMAL",
    bar: "#5E8061",
    bg: "bg-[#F7F4ED]",
    border: "border-[#DED8CD]",
    text: "text-[#625E59]",
    badge: "bg-[#5E8061] text-white",
  },
};

const TRAFFIC_ICON: Record<string, string> = { High: "🔴", Medium: "🟡", Low: "🟢" };
const COST_ICON: Record<string, string> = { "< ₹50k": "💚", "₹50k–2L": "🟡", "> ₹2L": "🔴" };

const STATUS_COLOR: Record<IssueStatus, string> = {
  Reported:     "bg-[#F0E5D8] text-[#8B2635]",
  Verified:     "bg-[#EBF0EC] text-[#4A7A55]",
  "In Progress": "bg-[#FEF6E9] text-[#C58B32]",
  Resolved:     "bg-[#EBF0EC] text-[#5E8061]",
  Escalated:    "bg-[#FDEDED] text-[#B83A3A]",
};

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, tier }: { score: number; tier: PriorityTier }) {
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1.5 rounded-full bg-[#F0EAE0] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: TIER_CONFIG[tier].bar }}
        />
      </div>
      <span className={cn("text-xs font-bold tabular-nums w-7 text-right", TIER_CONFIG[tier].text)}>
        {score}
      </span>
    </div>
  );
}

// ─── Status steps (ordered pipeline) ─────────────────────────────────────────
const STATUS_STEPS: IssueStatus[] = ["Reported", "Verified", "In Progress", "Resolved"];

const STATUS_META: Record<IssueStatus, { color: string; bg: string; icon: string }> = {
  Reported:      { color: "#8B2635", bg: "#F0E5D8", icon: "📋" },
  Verified:      { color: "#4A7A55", bg: "#EBF0EC", icon: "✅" },
  "In Progress": { color: "#C58B32", bg: "#FEF6E9", icon: "🔧" },
  Resolved:      { color: "#5E8061", bg: "#EBF0EC", icon: "🎉" },
  Escalated:     { color: "#B83A3A", bg: "#FDEDED", icon: "🚨" },
};

// ─── Assign / Triage Modal Panel ──────────────────────────────────────────────
function AssignPanel({ issue, onClose }: { issue: Issue; onClose: () => void }) {
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(issue.status);
  const [note, setNote] = useState(issue.officerNote ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const isDirty =
    selectedStatus !== issue.status || note.trim() !== (issue.officerNote ?? "").trim();

  const handleSave = useCallback(async () => {
    if (saveState === "saving") return;
    setSaveState("saving");
    try {
      await updateDoc(doc(db, "issues", issue.id), {
        status:      selectedStatus,
        officerNote: note.trim() || null,
        lastUpdated: new Date().toISOString(),
      });
      setSaveState("saved");
      // Auto-close after success
      setTimeout(() => {
        setSaveState("idle");
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Assign update failed:", err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  }, [issue.id, selectedStatus, note, saveState, onClose]);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-5 pt-4 border-t border-[#DED8CD] bg-[#F7F4ED]/70 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-[#88827A] uppercase tracking-wider">
            Officer Triage — <span className="font-mono text-[#242222]">{issue.id}</span>
          </p>
          {issue.lastUpdated && (
            <p className="text-[10px] text-[#88827A]">
              Last updated {new Date(issue.lastUpdated).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </p>
          )}
        </div>

        {/* Status stepper */}
        <div>
          <p className="text-[11px] font-bold text-[#242222] mb-2">Change Status</p>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_STEPS.map((s) => {
              const meta = STATUS_META[s];
              const isActive = selectedStatus === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStatus(s)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all",
                    isActive
                      ? "text-white shadow-sm"
                      : "bg-white border-[#DED8CD] text-[#625E59] hover:border-[#8B2635] hover:text-[#242222]"
                  )}
                  style={isActive ? { backgroundColor: meta.color, borderColor: meta.color } : undefined}
                >
                  <span>{meta.icon}</span>
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Officer note */}
        <div>
          <label className="text-[11px] font-bold text-[#242222] block mb-1.5">
            Officer Note <span className="text-[#88827A] font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Field crew dispatched. Estimated fix by EOD Thursday."
            className="w-full px-3 py-2 rounded-lg text-xs text-[#242222] placeholder-[#88827A] border border-[#C9C0B3] bg-white resize-none focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/10 leading-relaxed"
          />
          <p className="text-[10px] text-[#88827A] text-right mt-0.5">{note.length}/300</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!isDirty || saveState === "saving" || saveState === "saved"}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs",
              saveState === "saved"
                ? "bg-[#5E8061] text-white border border-[#5E8061]"
                : saveState === "error"
                ? "bg-[#B83A3A] text-white border border-[#B83A3A]"
                : isDirty
                ? "bg-[#8B2635] hover:bg-[#641B27] text-white border border-transparent"
                : "bg-white text-[#88827A] border border-[#DED8CD] cursor-not-allowed"
            )}
          >
            {saveState === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
            {saveState === "saved"  && <CheckCircle2 className="h-3 w-3" />}
            {saveState === "error"  && <AlertTriangle className="h-3 w-3" />}
            {saveState === "saving" ? "Saving…"
              : saveState === "saved"  ? "Saved!"
              : saveState === "error"  ? "Retry"
              : "Confirm Update"}
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-bold border border-[#DED8CD] bg-white text-[#625E59] hover:text-[#242222] hover:border-[#C9C0B3] transition-colors"
          >
            Cancel
          </button>

          {/* Escalate shortcut */}
          <button
            onClick={() => {
              setSelectedStatus("Escalated" as IssueStatus);
              setNote((n) => n ? n + " [Escalated to directorate]" : "Escalated to directorate");
            }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-[#DED8CD] bg-white text-[#C58B32] hover:border-[#C58B32] transition-colors"
          >
            <AlertTriangle className="h-3 w-3" />
            Escalate
          </button>
        </div>

        {/* Existing officer note preview */}
        {issue.officerNote && issue.officerNote !== note && (
          <p className="text-[10px] text-[#88827A] bg-white border border-[#DED8CD] rounded-lg px-3 py-2 leading-relaxed">
            <span className="font-bold">Previous note:</span> {issue.officerNote}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface PriorityQueueTableProps {
  issues: Issue[];
}

export default function PriorityQueueTable({ issues }: PriorityQueueTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "CRITICAL" | "HIGH" | "NORMAL">("all");

  const ranked = useMemo(() => {
    return issues
      .filter((i) => i.status !== "Resolved")
      .map((issue) => ({
        ...issue,
        _score: issue.priorityScore ?? computePriorityScore(issue),
      }))
      .sort((a, b) => b._score - a._score);
  }, [issues]);

  const filtered = useMemo(() => {
    if (filter === "all") return ranked;
    return ranked.filter((i) => getTier(i._score, i.status) === filter);
  }, [ranked, filter]);

  const criticalCount = ranked.filter((i) => getTier(i._score, i.status) === "CRITICAL").length;
  const highCount = ranked.filter((i) => getTier(i._score, i.status) === "HIGH").length;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { tier: "CRITICAL" as const, count: criticalCount, icon: "🔴", label: "Critical" },
          { tier: "HIGH" as const, count: highCount, icon: "🟡", label: "High Priority" },
          { tier: "NORMAL" as const, count: ranked.length - criticalCount - highCount, icon: "🟢", label: "Normal" },
        ].map(({ tier, count, icon, label }) => (
          <button
            key={tier}
            onClick={() => setFilter(filter === tier ? "all" : tier)}
            className={cn(
              "rounded-xl p-3.5 border text-left transition-all",
              filter === tier
                ? cn(TIER_CONFIG[tier].bg, TIER_CONFIG[tier].border, "shadow-sm")
                : "bg-white border-[#DED8CD] hover:border-[#C9C0B3]"
            )}
          >
            <p className="text-xl mb-1">{icon}</p>
            <p className={cn("text-2xl font-bold", filter === tier ? TIER_CONFIG[tier].text : "text-[#242222]")}>
              {count}
            </p>
            <p className="text-[11px] font-semibold text-[#88827A]">{label}</p>
          </button>
        ))}
      </div>

      {/* Ranked table */}
      <div className="rounded-2xl border border-[#DED8CD] bg-white shadow-[0_4px_20px_rgba(36,34,34,0.05)] overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[32px_1fr_90px_80px_70px_80px_72px_76px] gap-2 px-4 py-2.5 bg-[#F7F4ED] border-b border-[#DED8CD] text-[10px] font-bold uppercase tracking-wider text-[#88827A]">
          <span>#</span>
          <span>Issue / Location</span>
          <span className="flex items-center gap-1"><Zap className="h-3 w-3" />Score</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />Reports</span>
          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />Traffic</span>
          <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />Cost</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-[#88827A] text-sm">
            No issues match this filter.
          </div>
        ) : (
          <div className="divide-y divide-[#F0EAE0]">
            {filtered.map((issue, idx) => {
              const tier = getTier(issue._score, issue.status);
              const cfg = TIER_CONFIG[tier];
              const isExpanded = expandedId === issue.id;
              const daysOpen = Math.floor(
                (Date.now() - new Date(issue.reportedAt).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={issue.id} className="transition-colors hover:bg-[#F7F4ED]/40">
                  <div className="grid grid-cols-[32px_1fr_90px_80px_70px_80px_72px_76px] gap-2 px-4 py-3 items-center">
                    {/* Rank */}
                    <span className="text-xs font-bold text-[#88827A] tabular-nums">{idx + 1}</span>

                    {/* Title + meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={cn("inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0", cfg.badge)}>
                          {tier}
                        </span>
                        <span className="text-xs font-bold text-[#242222] truncate">{issue.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#88827A]">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {issue.ward.split("—")[1]?.trim() || issue.ward}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {daysOpen}d open
                        </span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <ScoreBar score={issue._score} tier={tier} />

                    {/* Duplicate count */}
                    <div className="flex items-center gap-1 text-xs text-[#625E59]">
                      <span className="text-sm">🔁</span>
                      <span className="font-bold text-[#242222]">{issue.duplicateCount ?? 1}</span>
                      <span className="text-[10px]">rpts</span>
                    </div>

                    {/* Traffic impact */}
                    <div className="text-xs text-[#625E59]">
                      <span>{TRAFFIC_ICON[issue.trafficImpact ?? "Low"]}</span>
                      <span className="ml-1 font-medium">{issue.trafficImpact ?? "—"}</span>
                    </div>

                    {/* Cost estimate */}
                    <div className="text-[10px] text-[#625E59]">
                      <span>{COST_ICON[issue.repairCostEstimate ?? "< ₹50k"]}</span>
                      <span className="ml-1 font-medium">{issue.repairCostEstimate ?? "—"}</span>
                    </div>

                    {/* Status */}
                    <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-center", STATUS_COLOR[issue.status])}>
                      {issue.status}
                    </span>

                    {/* Assign */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all",
                        isExpanded
                          ? "bg-[#8B2635] text-white border-[#8B2635]"
                          : "bg-white text-[#242222] border-[#DED8CD] hover:border-[#8B2635] hover:text-[#8B2635]"
                      )}
                    >
                      Assign
                      <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <AssignPanel issue={issue} onClose={() => setExpandedId(null)} />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-[11px] text-[#88827A] text-right">
        Ranked by AI Priority Score · {filtered.length} active issues shown · Resolved excluded
      </p>
    </div>
  );
}
