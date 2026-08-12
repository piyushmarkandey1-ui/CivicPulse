"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  const deadline = new Date(new Date(reportedAt).getTime() + SLA_HOURS[severity] * 3_600_000);
  const diffMs = deadline.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  const hours = Math.abs(Math.floor(Math.abs(diffMs) / 3_600_000));
  const mins = Math.abs(Math.floor((Math.abs(diffMs) % 3_600_000) / 60_000));
  return { isOverdue, label: `${hours}h ${mins}m ${isOverdue ? "overdue" : "remaining"}` };
}

// ─── Status timeline ──────────────────────────────────────────────────────────
const STATUS_STEPS: IssueStatus[] = ["Reported", "Verified", "In Progress", "Resolved"];

function StatusTimeline({ current }: { current: IssueStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(current);
  return (
    <div className="w-full">
      <p className="text-[11px] font-bold text-[#88827A] uppercase tracking-wider mb-3">
        Resolution Pipeline
      </p>
      <div className="relative flex items-center justify-between">
        {/* Connector line */}
        <div className="absolute inset-x-0 top-3 h-0.5 bg-[#DED8CD]" />
        <motion.div
          className="absolute top-3 left-0 h-0.5 bg-[#8B2635]"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {STATUS_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step} className="relative flex flex-col items-center gap-1.5 z-10">
              <div
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                  done
                    ? "border-[#8B2635] bg-[#8B2635] text-white"
                    : "border-[#C9C0B3] bg-white text-[#88827A]"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold text-center leading-tight max-w-[55px]",
                  done ? "text-[#8B2635]" : "text-[#88827A]"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CAT_VARIANT: Record<Issue["category"], "maroon" | "warning" | "critical" | "success" | "neutral"> = {
  Pothole: "warning",
  "Water Clogging": "maroon",
  Crack: "critical",
  "Road Damage": "warning",
  Other: "neutral",
};

const SEV_VARIANT: Record<Issue["severity"], "critical" | "warning" | "success"> = {
  critical: "critical",
  moderate: "warning",
  resolved: "success",
};

interface IssueSidePanelProps {
  issue: Issue;
  onClose: () => void;
  onUpvote: (id: string) => void;
}

export default function IssueSidePanel({ issue, onClose, onUpvote }: IssueSidePanelProps) {
  const { role } = useAuth();
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
            } catch (err) {
              reject(err);
            }
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
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.aside
      key={issue.id}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute right-0 top-0 h-full w-[380px] max-w-full z-30 flex flex-col bg-white border-l border-[#DED8CD] shadow-[0_8px_40px_rgba(36,34,34,0.15)]"
      aria-label="Issue details panel"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/90 hover:bg-[#F0E5D8] text-[#625E59] hover:text-[#242222] border border-[#DED8CD] transition-colors shadow-xs"
        aria-label="Close panel"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Scrollable content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Photo */}
        <div className="relative h-48 w-full flex-shrink-0 bg-[#F0E5D8] overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${issue.photoSeed}/760/400`}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge
              label={issue.severity.toUpperCase()}
              variant={SEV_VARIANT[issue.severity]}
              pulse={issue.severity === "critical"}
            />
          </div>
          <div className="absolute top-3 right-12 px-2.5 py-1 rounded-md text-xs font-mono font-bold text-[#242222] bg-white/90 border border-[#DED8CD] shadow-xs">
            {issue.id}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-5">
          {/* Title + address */}
          <div>
            <h2 className="text-lg font-bold text-[#242222] mb-1 pr-6 leading-tight">
              {issue.title}
            </h2>
            <p className="text-xs text-[#625E59] flex items-center gap-1">
              <span className="text-[#8B2635]">📍</span>
              <span>{issue.address}</span>
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge label={issue.category} variant={CAT_VARIANT[issue.category]} />
            <Badge label={issue.ward} variant="neutral" />
            <Badge label={`Reported ${reportDate}`} variant="neutral" />
          </div>

          {/* Description */}
          <p className="text-xs text-[#625E59] leading-relaxed bg-[#F7F4ED] p-3 rounded-xl border border-[#DED8CD]">
            {issue.description}
          </p>

          {/* Status timeline */}
          <StatusTimeline current={issue.status} />

          {/* SLA Countdown Timer */}
          {issue.severity !== "resolved" && issue.status !== "Resolved" && (
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl p-3 border",
                escl.isOverdue
                  ? "bg-[#FDEDED] border-[#B83A3A]/30 text-[#B83A3A]"
                  : "bg-[#FEF6E9] border-[#C58B32]/30 text-[#C58B32]"
              )}
            >
              <div className="text-xl" aria-hidden>
                {escl.isOverdue ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider">
                  Official SLA Countdown
                </p>
                <p className="text-xs font-bold font-mono">
                  {escl.label}
                </p>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-lg bg-[#F7F4ED] border border-[#DED8CD] p-2.5">
              <p className="text-[10px] text-[#88827A] font-medium uppercase">Upvotes</p>
              <p className="text-sm font-bold font-mono text-[#8B2635]">{issue.upvotes}</p>
            </div>
            <div className="rounded-lg bg-[#F7F4ED] border border-[#DED8CD] p-2.5">
              <p className="text-[10px] text-[#88827A] font-medium uppercase">Status</p>
              <p className="text-xs font-bold text-[#242222] truncate">{issue.status}</p>
            </div>
            <div className="rounded-lg bg-[#F7F4ED] border border-[#DED8CD] p-2.5">
              <p className="text-[10px] text-[#88827A] font-medium uppercase">SLA</p>
              <p className="text-sm font-bold font-mono text-[#242222]">
                {SLA_HOURS[issue.severity]}h
              </p>
            </div>
          </div>

          {/* Actions depending on role */}
          {role === "government" ? (
            <div className="flex flex-col gap-2.5 pt-2 border-t border-[#DED8CD]">
              <p className="text-[10px] font-bold text-[#88827A] uppercase tracking-wider">
                Official Operations Triage
              </p>
              <div className="flex gap-2">
                <button
                  disabled={isUpdating || issue.status === "In Progress" || issue.status === "Resolved"}
                  onClick={() => handleStatusUpdate("In Progress")}
                  className="flex-1 py-2.5 rounded-lg bg-[#C58B32] hover:bg-[#A87222] text-white text-xs font-bold transition-colors disabled:opacity-50"
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
                  className="flex-1 py-2.5 rounded-lg bg-[#5E8061] hover:bg-[#4C684F] text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Resolve + Photo"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2.5 pt-1">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold transition-all duration-200",
                  hasUpvoted
                    ? "bg-[#F0E5D8] border-[#D6C2A3] text-[#8B2635] cursor-default"
                    : "bg-[#8B2635] text-white border-transparent hover:bg-[#641B27]"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                {hasUpvoted ? "Confirmed (+1)" : `Confirm Issue (${issue.upvotes})`}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
