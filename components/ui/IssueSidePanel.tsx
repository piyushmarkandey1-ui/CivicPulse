"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { type Issue, type IssueStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { GradientButton } from "@/components/ui/GradientButton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

// ─── Escalation countdown ─────────────────────────────────────────────────────
const SLA_HOURS: Record<Issue["severity"], number> = { critical: 72, moderate: 120, resolved: 240 };

function useEscalation(reportedAt: string, severity: Issue["severity"]) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const deadline  = new Date(new Date(reportedAt).getTime() + SLA_HOURS[severity] * 3_600_000);
  const diffMs    = deadline.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  const hours     = Math.abs(Math.floor(Math.abs(diffMs) / 3_600_000));
  const mins      = Math.abs(Math.floor((Math.abs(diffMs) % 3_600_000) / 60_000));
  return { isOverdue, label: `${hours}h ${mins}m ${isOverdue ? "overdue" : "remaining"}` };
}

// ─── Status timeline ──────────────────────────────────────────────────────────
const STATUS_STEPS: IssueStatus[] = ["Reported", "Verified", "In Progress", "Resolved"];

function StatusTimeline({ current }: { current: IssueStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(current);
  return (
    <div className="w-full">
      <p className="text-caption text-slate-500 mb-3">Status Timeline</p>
      <div className="relative flex items-center justify-between">
        {/* Connector line behind */}
        <div className="absolute inset-x-0 top-3 h-px bg-white/[0.06]" />
        <motion.div
          className="absolute top-3 left-0 h-px bg-gradient-to-r from-teal to-teal/40"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {STATUS_STEPS.map((step, i) => {
          const done   = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step} className="relative flex flex-col items-center gap-1.5 z-10">
              <motion.div
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                  done
                    ? "border-copper bg-copper text-navy"
                    : "border-white/20 bg-background text-slate-500"
                )}
                animate={active ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {done ? "✓" : i + 1}
              </motion.div>
              <span className={cn(
                "text-[9px] font-semibold text-center leading-tight max-w-[50px]",
                done ? "text-copper-light" : "text-slate-600"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Category badge map ────────────────────────────────────────────────────────
const CAT_VARIANT: Record<Issue["category"], "copper" | "warning" | "critical" | "success" | "neutral"> = {
  "Pothole":       "warning",
  "Water Clogging":"copper",
  "Crack":         "critical",
  "Road Damage":   "warning",
  "Other":         "neutral",
};

const SEV_VARIANT: Record<Issue["severity"], "critical" | "warning" | "success"> = {
  critical: "critical",
  moderate: "warning",
  resolved: "success",
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface IssueSidePanelProps {
  issue:    Issue;
  onClose:  () => void;
  onUpvote: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function IssueSidePanel({ issue, onClose, onUpvote }: IssueSidePanelProps) {
  const { role } = useAuth();
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Ref for gov photo upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const escl = useEscalation(issue.reportedAt, issue.severity);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setHasUpvoted(true);
      if (onUpvote) onUpvote(issue.id);
    }
  };

  const handleStatusUpdate = async (newStatus: IssueStatus, e?: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      const issueRef = doc(db, "issues", issue.id);
      const updates: any = { status: newStatus };

      // Handle photo if present (for Resolved)
      if (e?.target?.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        const photoPromise = new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const storageRef = ref(storage, `resolutions/${issue.id}.jpg`);
              await uploadString(storageRef, reader.result as string, "data_url");
              const url = await getDownloadURL(storageRef);
              resolve(url);
            } catch (err) { reject(err); }
          };
          reader.readAsDataURL(file);
        });

        updates.resolutionPhotoUrl = await photoPromise;
      }
      
      await updateDoc(issueRef, updates);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const reportDate = new Date(issue.reportedAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <motion.aside
      key={issue.id}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="absolute right-0 top-0 h-full w-[380px] max-w-full z-30 flex flex-col"
      style={{
        background: "rgba(11,17,32,0.88)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
      }}
      aria-label="Issue details panel"
    >
      {/* ── Close button ── */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-colors"
        aria-label="Close panel"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* ── Scrollable content ── */}
      <div className="flex flex-col flex-1 overflow-y-auto">

        {/* Photo */}
        <div className="relative h-48 w-full flex-shrink-0 bg-background-muted overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${issue.photoSeed}/760/400`}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          {/* Severity overlay badge */}
          <div className="absolute top-3 left-3">
            <Badge
              label={issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
              variant={SEV_VARIANT[issue.severity]}
              pulse={issue.severity === "critical"}
            />
          </div>
          {/* ID chip */}
          <div className="absolute top-3 right-10 px-2 py-1 rounded-md text-xs font-mono font-bold text-white"
            style={{ background: "rgba(11,17,32,0.75)", backdropFilter: "blur(6px)" }}>
            {issue.id}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-5">

          {/* Title + ward */}
          <div>
            <h2 className="text-h3 text-white mb-1 pr-8">{issue.title}</h2>
            <p className="text-caption text-slate-500 normal-case tracking-normal">{issue.address}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge label={issue.category}     variant={CAT_VARIANT[issue.category]} />
            <Badge label={issue.ward}         variant="neutral" />
            <Badge label={`Reported ${reportDate}`} variant="neutral" />
          </div>

          {/* Description */}
          <p className="text-body-sm text-text-muted leading-relaxed">{issue.description}</p>

          {/* Status timeline */}
          <StatusTimeline current={issue.status} />

          {/* Escalation timer */}
          {issue.severity !== "resolved" && issue.status !== "Resolved" && (
            <div className={cn(
              "flex items-center gap-3 rounded-xl p-3 border",
              escl.isOverdue
                ? "bg-red-500/10 border-red-500/25"
                : "bg-warning/10 border-amber/25"
            )}>
              <div className={cn(
                "text-xl",
                escl.isOverdue ? "animate-pulse" : ""
              )} aria-hidden>
                {escl.isOverdue ? "⚠️" : "⏱️"}
              </div>
              <div>
                <p className="text-caption text-slate-500 normal-case tracking-normal">SLA Deadline</p>
                <p className={cn(
                  "text-body-sm font-bold",
                  escl.isOverdue ? "text-danger" : "text-warning-light"
                )}>
                  {escl.label}
                </p>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Upvotes",  value: issue.upvotes },
              { label: "Status",   value: issue.status },
              { label: "SLA",      value: `${SLA_HOURS[issue.severity]}h` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white/[0.04] border border-white/[0.05] p-3 text-center">
                <p className="text-caption text-slate-500 normal-case tracking-normal mb-1">{label}</p>
                <p className="text-body-sm font-bold text-white truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Action buttons based on Role */}
          {role === "government" ? (
            <div className="flex flex-col gap-3 pt-2 border-t border-white/[0.06]">
              <p className="text-caption text-text-muted normal-case">Government Actions</p>
              <div className="flex gap-2">
                <button
                  disabled={isUpdating || issue.status === "In Progress" || issue.status === "Resolved"}
                  onClick={() => handleStatusUpdate("In Progress")}
                  className="flex-1 py-2 rounded-lg bg-warning-600/20 text-amber-500 text-sm font-semibold hover:bg-warning-600/30 transition-colors disabled:opacity-50"
                >
                  Mark In Progress
                </button>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => handleStatusUpdate("Resolved", e)}
                />
                <button
                  disabled={isUpdating || issue.status === "Resolved"}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 rounded-lg bg-copper/20 text-copper-light text-sm font-semibold hover:bg-copper/30 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Resolve + Photo"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
                  hasUpvoted
                    ? "bg-copper/20 border-copper/40 text-copper-light cursor-default"
                    : "bg-white/[0.04] border-white/10 text-text-secondary hover:bg-copper/10 hover:border-copper/30 hover:text-copper"
                )}
              >
                <span aria-hidden>👍</span>
                {hasUpvoted ? "Confirmed!" : `Confirm (${issue.upvotes})`}
              </motion.button>
              <GradientButton variant="outline" size="sm" className="flex-shrink-0">
                Escalate
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
