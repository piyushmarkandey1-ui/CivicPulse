"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Issue, type IssueStatus } from "@/lib/types";
import { computePriorityScore, cn } from "@/lib/utils";
import {
  AlertTriangle,
  Zap,
  Users,
  TrendingUp,
  IndianRupee,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle2,
  X,
  Send,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";

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

const STATUS_COLOR: Record<Issue["status"], string> = {
  Reported: "bg-[#F0E5D8] text-[#8B2635]",
  Verified: "bg-[#EBF0EC] text-[#4A7A55]",
  "In Progress": "bg-[#FEF6E9] text-[#C58B32]",
  Resolved: "bg-[#EBF0EC] text-[#5E8061]",
  Escalated: "bg-[#FDEDEC] text-[#B83A3A]",
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

// ─── Officer Action Modal ─────────────────────────────────────────────────────
interface OfficerModalProps {
  issue: Issue;
  onClose: () => void;
}

function OfficerActionModal({ issue, onClose }: OfficerModalProps) {
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [note, setNote] = useState(issue.officerNote || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const issueRef = doc(db, "issues", issue.id);
      await updateDoc(issueRef, {
        status,
        officerNote: note.trim(),
        lastUpdated: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.warn("Status update fallback (local/demo):", err);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } finally {
      setSaving(false);
    }
  };

  const STATUS_OPTIONS: { val: IssueStatus; label: string; desc: string }[] = [
    { val: "Reported", label: "Reported", desc: "Citizen complaint registered" },
    { val: "Verified", label: "Verified", desc: "Inspected & acknowledged by field officer" },
    { val: "In Progress", label: "In Progress", desc: "Repair crew dispatched to site" },
    { val: "Resolved", label: "Resolved", desc: "Damage repaired and SLA closed" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full border border-[#DED8CD] shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-[#DED8CD] flex items-center justify-between bg-[#F7F4ED]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B2635] bg-[#F0E5D8] border border-[#D6C2A3] px-2 py-0.5 rounded-full">
                {issue.id}
              </span>
              <span className="text-xs font-semibold text-[#88827A]">{issue.ward}</span>
            </div>
            <h3 className="text-sm font-bold text-[#242222]">
              {issue.title || `${issue.category} Operations Triage`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#88827A] hover:text-[#242222] hover:bg-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#242222] uppercase tracking-wider mb-2">
              Update Resolution Pipeline
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setStatus(opt.val)}
                  className={cn(
                    "text-left p-2.5 rounded-xl border text-xs transition-all",
                    status === opt.val
                      ? "border-[#8B2635] bg-[#F0E5D8]/60 ring-2 ring-[#8B2635]/20 font-bold text-[#8B2635]"
                      : "border-[#DED8CD] bg-white hover:border-[#88827A] text-[#625E59]"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold">{opt.label}</span>
                    {status === opt.val && <CheckCircle2 className="h-3.5 w-3.5 text-[#8B2635]" />}
                  </div>
                  <span className="text-[10px] text-[#88827A] leading-tight block">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#242222] uppercase tracking-wider mb-1.5">
              Officer Directive / Field Note
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Assigned Road Works Squad #4. Cold-mix asphalt patch scheduled today."
              className="w-full text-xs p-3 rounded-xl border border-[#DED8CD] focus:border-[#8B2635] focus:outline-hidden bg-[#F7F4ED]/50 placeholder:text-[#88827A]"
            />
          </div>

          <div className="pt-2 border-t border-[#DED8CD] flex items-center justify-between">
            <Link
              href="/map"
              className="text-xs font-semibold text-[#8B2635] hover:underline flex items-center gap-1"
            >
              <span>View GIS</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-3.5 py-2 text-xs font-bold text-[#625E59] hover:text-[#242222] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#8B2635] hover:bg-[#641B27] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                {saving ? (
                  "Saving..."
                ) : success ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Updated!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Commit Status</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Assign action panel ──────────────────────────────────────────────────────
function AssignPanel({
  issue,
  onOpenAction,
  onClose,
}: {
  issue: Issue;
  onOpenAction: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-4 pt-3 border-t border-[#DED8CD] bg-[#F7F4ED]/60">
        <p className="text-[11px] font-bold text-[#88827A] uppercase tracking-wider mb-2">
          Quick Actions — {issue.id}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenAction}
            className="px-3.5 py-1.5 bg-[#8B2635] hover:bg-[#641B27] text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="h-3 w-3" />
            Update Status &amp; Dispatch
          </button>
          <button
            onClick={onOpenAction}
            className="px-3.5 py-1.5 bg-white hover:bg-[#F0E5D8] text-[#242222] text-xs font-bold rounded-lg border border-[#DED8CD] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="h-3 w-3 text-[#C58B32]" />
            Escalate to Directorate
          </button>
          <Link
            href="/map"
            className="px-3.5 py-1.5 bg-white hover:bg-[#F0E5D8] text-[#242222] text-xs font-bold rounded-lg border border-[#DED8CD] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="h-3 w-3 text-[#8B2635]" />
            View on GIS Map
          </Link>
        </div>
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
  const [actionIssue, setActionIssue] = useState<Issue | null>(null);
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
                      <AssignPanel
                        issue={issue}
                        onOpenAction={() => setActionIssue(issue)}
                        onClose={() => setExpandedId(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Officer Directive & Status Update Modal */}
      <AnimatePresence>
        {actionIssue && (
          <OfficerActionModal
            issue={actionIssue}
            onClose={() => setActionIssue(null)}
          />
        )}
      </AnimatePresence>

      <p className="text-[11px] text-[#88827A] text-right">
        Ranked by AI Priority Score · {filtered.length} active issues shown · Resolved excluded
      </p>
    </div>
  );
}
