"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Cpu,
  Building2,
  Wrench,
  ShieldCheck,
  Clock,
  UserCheck,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ChevronRight,
} from "lucide-react";
import { type Issue, type IssueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const MUNICIPAL_DEPARTMENTS = [
  "Roads & Highway Infrastructure (PWD)",
  "Municipal Water Supply & Sewerage Drainage",
  "City Traffic Management Cell",
  "Public Works Department (Civil Maintenance)",
  "Solid Waste Management & Sanitation Wing",
  "Electrical & Streetlighting Directorate",
];

interface IssueProgressModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  isOfficer?: boolean;
  onUpdateIssue?: (updated: Partial<Issue>) => Promise<void> | void;
}

export default function IssueProgressModal({
  issue,
  isOpen,
  onClose,
  isOfficer = false,
  onUpdateIssue,
}: IssueProgressModalProps) {
  const [selectedDept, setSelectedDept] = useState(
    issue.assignedDepartment || MUNICIPAL_DEPARTMENTS[0]
  );
  const [officerName, setOfficerName] = useState(
    issue.assignedOfficer || (isOfficer ? "Er. A. K. Sahu (Executive Engineer)" : "")
  );
  const [directiveNotes, setDirectiveNotes] = useState(issue.triageNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  // Determine active stage (0 to 4)
  const getStageIndex = () => {
    if (issue.status === "Resolved") return 4;
    if (issue.status === "In Progress") return 3;
    if (issue.assignedDepartment || issue.status === "Verified") return 2;
    if (issue.priorityScore !== undefined) return 1;
    return 0;
  };

  const currentStage = getStageIndex();

  const STAGES = [
    {
      num: "01",
      title: "Citizen Report Logged",
      actor: "Citizen / Inspector",
      icon: MapPin,
      color: "#8B2635",
      bg: "#FAF3EF",
      border: "#EAD6CE",
      description: `Report filed with GPS telemetry at ${issue.address || "Field location"}.`,
      date: new Date(issue.reportedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      num: "02",
      title: "AI Priority Triage & Scoring",
      actor: "AI Engine",
      icon: Cpu,
      color: "#3F6B4C",
      bg: "#EFF5F1",
      border: "#CFDFD3",
      description: `Priority Score computed: ${issue.priorityScore ?? 75}/100. Duplicate clustering verified.`,
      date: "Automated analysis complete",
    },
    {
      num: "03",
      title: "Department Assignment",
      actor: issue.assignedOfficer || "Municipal Director",
      icon: Building2,
      color: "#B07525",
      bg: "#FBF5EA",
      border: "#EEDBBE",
      description: issue.assignedDepartment
        ? `Assigned to ${issue.assignedDepartment}`
        : "Awaiting administrative squad routing.",
      date: issue.assignedAt
        ? new Date(issue.assignedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })
        : "Pending Assignment",
    },
    {
      num: "04",
      title: "In Progress / Crew Mobilization",
      actor: "Field Crew Dispatch",
      icon: Wrench,
      color: "#C58B32",
      bg: "#FEF6E9",
      border: "#EBD8AE",
      description: "Repair materials allocated. Site inspection and patch execution underway.",
      date: issue.status === "In Progress" || issue.status === "Resolved" ? "Work in progress" : "Pending dispatch",
    },
    {
      num: "05",
      title: "Verified Field Resolution",
      actor: "Municipal Verification Cell",
      icon: ShieldCheck,
      color: "#5E8061",
      bg: "#EBF0EC",
      border: "#C2D9C6",
      description: "Physical inspection confirmed with tamper-proof photographic proof. Ticket archived in public ledger.",
      date: issue.status === "Resolved" ? "Resolution verified" : "Pending final proof",
    },
  ];

  const handleSaveAssignment = async () => {
    setIsSubmitting(true);
    setSuccessMsg("");
    try {
      const updates: Partial<Issue> = {
        assignedDepartment: selectedDept,
        assignedOfficer: officerName.trim() || "Municipal Officer",
        assignedAt: new Date().toISOString(),
        triageNotes: directiveNotes.trim(),
        status: issue.status === "Reported" ? "Verified" : issue.status,
      };

      if (onUpdateIssue) {
        await onUpdateIssue(updates);
      }
      setSuccessMsg("Department assignment updated and dispatched successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvanceStatus = async (newStatus: IssueStatus) => {
    setIsSubmitting(true);
    try {
      const updates: Partial<Issue> = {
        status: newStatus,
        assignedDepartment: selectedDept,
        assignedOfficer: officerName.trim() || "Municipal Officer",
      };
      if (newStatus === "Resolved") {
        updates.resolutionPhotoUrl = "/pothole-combined.jpg";
      }
      if (onUpdateIssue) {
        await onUpdateIssue(updates);
      }
      setSuccessMsg(`Status advanced to "${newStatus}"!`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl border border-[#DED8CD] shadow-[0_24px_64px_rgba(36,34,34,0.22)] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FDFBF7]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-bold text-[#8B2635] bg-[#F5EAE6] border border-[#E8D4CD] px-2 py-0.5 rounded-md">
                {issue.id}
              </span>
              <span className="text-xs text-[#88827A] font-semibold">
                {issue.city === "Durg" ? "Durg, Chhattisgarh" : "Mumbai, Maharashtra"} • {issue.ward}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#242222] tracking-tight">
              {issue.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#88827A] hover:text-[#242222] hover:bg-[#EFE9DE] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FBF9F5]">
          {/* Ongoing Stage Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#E6DFD4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold tracking-wider uppercase text-[#88827A] mb-0.5">
                Current Operational Stage
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5E8061] animate-pulse" />
                <span className="text-base font-bold text-[#242222]">
                  {STAGES[currentStage]?.title}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0E5D8] text-[#8B2635] font-semibold">
                  Stage {currentStage + 1} of 5
                </span>
              </div>
            </div>

            {issue.assignedDepartment && (
              <div className="text-left sm:text-right">
                <p className="text-[10px] font-bold tracking-wider uppercase text-[#88827A]">
                  Assigned Department
                </p>
                <p className="text-xs font-bold text-[#3F6B4C]">
                  {issue.assignedDepartment}
                </p>
              </div>
            )}
          </div>

          {/* 5-Step Lifecycle Pipeline */}
          <div className="p-5 rounded-2xl bg-white border border-[#E6DFD4] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#88827A] mb-4">
              Lifecycle Progress Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EAE4D9]">
              {STAGES.map((st, idx) => {
                const Icon = st.icon;
                const isPassed = idx < currentStage;
                const isCurrent = idx === currentStage;

                return (
                  <div key={st.num} className="relative flex items-start gap-4">
                    {/* Node marker */}
                    <div
                      className={cn(
                        "absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        isPassed
                          ? "bg-[#5E8061] border-[#5E8061] text-white"
                          : isCurrent
                          ? "bg-white border-[#8B2635] shadow-xs ring-4 ring-[#8B2635]/15"
                          : "bg-white border-[#D6CFC3] text-transparent"
                      )}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isCurrent ? "bg-[#8B2635]" : "bg-transparent"
                          )}
                        />
                      )}
                    </div>

                    {/* Step Card */}
                    <div
                      className={cn(
                        "flex-1 p-3.5 rounded-xl border transition-all",
                        isCurrent
                          ? "bg-[#FAF6F2] border-[#E2D2CA]"
                          : isPassed
                          ? "bg-white border-[#E8E2D8]"
                          : "bg-[#FAFAFA] border-[#EFECE6] opacity-60"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 shrink-0" style={{ color: st.color }} />
                          <h4 className="text-sm font-bold text-[#242222]">
                            {st.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#8B2635] text-white uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#88827A]">
                          {st.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#625E59] leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Officer Assignment Controls (Visible to Officers or when in Demo Mode) */}
          <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E6DFD4] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8B2635]" />
                <h3 className="text-sm font-bold text-[#242222]">
                  {isOfficer ? "Officer Department Routing & Directives" : "Department Routing Details"}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#88827A] px-2 py-0.5 rounded bg-white border border-[#E2DCCE]">
                Municipal Action
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#625E59] mb-1.5 uppercase tracking-wider">
                  Target Municipal Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#DED8CD] bg-white text-[#242222] focus:outline-hidden focus:border-[#8B2635] shadow-2xs"
                >
                  {MUNICIPAL_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#625E59] mb-1.5 uppercase tracking-wider">
                  Assigned Engineer / Inspector
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Er. A. K. Sahu (Executive Engineer)"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#DED8CD] bg-white text-[#242222] focus:outline-hidden focus:border-[#8B2635] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#625E59] mb-1.5 uppercase tracking-wider">
                Work Order / Directive Notes
              </label>
              <textarea
                value={directiveNotes}
                onChange={(e) => setDirectiveNotes(e.target.value)}
                rows={2}
                placeholder="Specific instructions for on-ground crew dispatch, materials or barricading..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#DED8CD] bg-white text-[#242222] focus:outline-hidden focus:border-[#8B2635] shadow-2xs"
              />
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-[#EBF5EE] border border-[#C5DEC8] text-[#2E6839] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveAssignment}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-[#8B2635] hover:bg-[#6D1B27] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Routing..." : "Confirm Department Assignment"}</span>
              </button>

              <div className="flex items-center gap-2">
                {issue.status !== "In Progress" && issue.status !== "Resolved" && (
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus("In Progress")}
                    disabled={isSubmitting}
                    className="px-3 py-2 rounded-xl bg-[#FEF6E9] hover:bg-[#FBE9CE] text-[#B07525] border border-[#E9D6B0] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Dispatch Crew (In Progress)
                  </button>
                )}

                {issue.status !== "Resolved" && (
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus("Resolved")}
                    disabled={isSubmitting}
                    className="px-3 py-2 rounded-xl bg-[#EBF5EE] hover:bg-[#D7EBDC] text-[#3F6B4C] border border-[#C2DEC8] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Verify Resolution ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E8E2D8] bg-white flex items-center justify-between text-xs text-[#88827A]">
          <span>CivicPulse Statutory SLA Telemetry • Public Infrastructure Ledger</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#DED8CD] hover:bg-[#F5F2EB] text-[#242222] font-semibold transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </motion.div>
    </div>
  );
}
