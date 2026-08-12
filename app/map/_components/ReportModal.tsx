"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Category, type Severity, type Issue } from "./mockData";
import { GradientButton } from "@/components/ui/GradientButton";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = ["Photo", "Location", "Category", "Description", "Review"];

const CATEGORIES: Category[] = ["Pothole", "Water Clogging", "Crack", "Road Damage", "Other"];
const CAT_ICON: Record<Category, string> = {
  "Pothole":       "🕳️",
  "Water Clogging":"💧",
  "Crack":         "🏗️",
  "Road Damage":   "🛣️",
  "Other":         "⚠️",
};
const SEVERITIES: { value: Severity; label: string; color: string }[] = [
  { value: "critical", label: "🔴 Critical",  color: "#ef4444" },
  { value: "moderate", label: "🟡 Moderate",  color: "#F59E0B" },
];

// ─── Draft state ──────────────────────────────────────────────────────────────
interface DraftIssue {
  photoFile:   string | null;
  lat:         number;
  lng:         number;
  category:    Category | null;
  severity:    Severity | null;
  description: string;
  address:     string;
}

const DEFAULT_DRAFT: DraftIssue = {
  photoFile:   null,
  lat:         19.09,
  lng:         72.865,
  category:    null,
  severity:    null,
  description: "",
  address:     "Andheri East, Mumbai",
};

// ─── Progress stepper ─────────────────────────────────────────────────────────
function ProgressStepper({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center flex-1">
          <motion.div
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 flex-shrink-0",
              i < current
                ? "bg-teal border-teal text-navy"
                : i === current
                ? "border-teal bg-teal/20 text-teal"
                : "border-white/20 text-slate-600 bg-transparent"
            )}
            animate={i === current ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={i === current ? { duration: 1.8, repeat: Infinity } : {}}
          >
            {i < current ? "✓" : i + 1}
          </motion.div>
          {i < total - 1 && (
            <div className="flex-1 h-0.5 mx-1 rounded-full overflow-hidden bg-white/[0.07]">
              <motion.div
                className="h-full bg-teal rounded-full"
                animate={{ width: i < current ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Photo Upload ─────────────────────────────────────────────────────
function StepPhoto({ draft, onUpdate }: { draft: DraftIssue; onUpdate: (d: Partial<DraftIssue>) => void }) {
  const [dragging, setDragging] = useState(false);
  const [detected, setDetected] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    onUpdate({ photoFile: url });
    setTimeout(() => setDetected(true), 800); // simulate EXIF extraction
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-h3 text-white mb-1">Upload Photo</h3>
        <p className="text-body-sm text-slate-400">Take or upload a clear photo of the issue.</p>
      </div>

      {draft.photoFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden"
        >
          <img src={draft.photoFile} alt="Issue preview" className="w-full h-48 object-cover rounded-xl" />
          {detected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-navy"
              style={{ background: "linear-gradient(135deg,#22C55E,#4ADE80)" }}
            >
              <span>📍</span> Location detected · Mumbai, MH
            </motion.div>
          )}
          <button
            onClick={() => { onUpdate({ photoFile: null }); setDetected(false); }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-white text-xs"
          >✕</button>
        </motion.div>
      ) : (
        <motion.div
          className={cn(
            "relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200",
            dragging ? "border-teal bg-teal/10" : "border-white/20 hover:border-teal/50 hover:bg-white/[0.03]"
          )}
          whileHover={{ scale: 1.01 }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <span className="text-4xl" aria-hidden>📷</span>
          <div className="text-center">
            <p className="text-body-sm text-slate-300 font-medium">Drop photo here or click to browse</p>
            <p className="text-caption text-slate-500 normal-case tracking-normal mt-1">
              JPEG, PNG, HEIC up to 10 MB
            </p>
          </div>
          {dragging && (
            <div className="absolute inset-0 rounded-xl border-2 border-teal bg-teal/10 flex items-center justify-center">
              <p className="text-teal font-semibold">Drop to upload</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────
function StepLocation({ draft, onUpdate }: { draft: DraftIssue; onUpdate: (d: Partial<DraftIssue>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-h3 text-white mb-1">Confirm Location</h3>
        <p className="text-body-sm text-slate-400">Location auto-detected from photo. Adjust if needed.</p>
      </div>

      {/* Mock mini-map visual */}
      <div className="relative h-44 rounded-xl overflow-hidden border border-white/10"
        style={{ background: "linear-gradient(135deg,#0d1829,#0a1520)" }}>
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(20,184,166,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,0.05) 1px,transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
        {/* Roads */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-700/60" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-700/60" />
        {/* Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-8 h-8 rounded-full border-4 border-teal flex items-center justify-center text-sm"
              style={{ background: "rgba(20,184,166,0.2)", boxShadow: "0 0 20px rgba(20,184,166,0.4)" }}>
              📍
            </div>
          </motion.div>
          {/* Shadow */}
          <div className="w-4 h-1 mx-auto rounded-full bg-black/40 mt-1 blur-sm" />
        </div>
        <div className="absolute top-3 right-3">
          <Badge label="Location Detected" variant="green" />
        </div>
      </div>

      {/* Address input */}
      <div>
        <label className="text-caption text-slate-500 normal-case tracking-normal mb-1.5 block">Street Address</label>
        <input
          type="text"
          value={draft.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>

      {/* Coordinates display */}
      <div className="flex gap-3">
        {[
          { label: "Latitude",  value: draft.lat.toFixed(4) },
          { label: "Longitude", value: draft.lng.toFixed(4) },
        ].map(({ label, value }) => (
          <div key={label} className="flex-1 px-3 py-2 rounded-lg text-xs"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-slate-500 mb-0.5">{label}</p>
            <p className="font-mono font-bold text-teal">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Category & Severity ──────────────────────────────────────────────
function StepCategory({ draft, onUpdate }: { draft: DraftIssue; onUpdate: (d: Partial<DraftIssue>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-h3 text-white mb-1">Category & Severity</h3>
        <p className="text-body-sm text-slate-400">What type of issue is this?</p>
      </div>

      {/* Category grid */}
      <div>
        <p className="text-caption text-slate-500 normal-case tracking-normal mb-2">Issue Type</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.96 }}
              onClick={() => onUpdate({ category: cat })}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
                draft.category === cat
                  ? "border-teal bg-teal/15 text-teal-light"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
              )}
            >
              <span className="text-lg" aria-hidden>{CAT_ICON[cat]}</span>
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Severity picker */}
      <div>
        <p className="text-caption text-slate-500 normal-case tracking-normal mb-2">Severity</p>
        <div className="flex gap-3">
          {SEVERITIES.map(({ value, label, color }) => (
            <motion.button
              key={value}
              whileTap={{ scale: 0.96 }}
              onClick={() => onUpdate({ severity: value })}
              className={cn(
                "flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
                draft.severity === value
                  ? "text-navy"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20"
              )}
              style={draft.severity === value ? {
                background: `linear-gradient(135deg,${color},${color}cc)`,
                borderColor: color,
                boxShadow:   `0 0 16px ${color}60`,
              } : undefined}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Description ──────────────────────────────────────────────────────
function StepDescription({ draft, onUpdate }: { draft: DraftIssue; onUpdate: (d: Partial<DraftIssue>) => void }) {
  const MAX = 400;
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-h3 text-white mb-1">Add Description</h3>
        <p className="text-body-sm text-slate-400">Describe the issue clearly so officials can act quickly.</p>
      </div>
      <div className="relative">
        <textarea
          rows={7}
          maxLength={MAX}
          value={draft.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="e.g. Large pothole near the bus stop — about 2 feet wide and 8 inches deep. Multiple vehicles have been damaged. No warning signs in place..."
          className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-teal leading-relaxed"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
        <p className={cn(
          "absolute bottom-3 right-3 text-[10px] font-mono",
          draft.description.length > MAX * 0.9 ? "text-amber" : "text-slate-600"
        )}>
          {draft.description.length}/{MAX}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-caption text-slate-500 normal-case tracking-normal">Quick prompts:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Near bus stop", "Causing accidents", "Has been there weeks",
            "No warning signs", "Especially bad at night",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => onUpdate({ description: draft.description ? `${draft.description} ${prompt}.` : `${prompt}.` })}
              className="px-2.5 py-1 rounded-lg text-xs text-slate-400 border border-white/10 hover:border-teal/30 hover:text-teal transition-colors"
            >
              + {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Review ───────────────────────────────────────────────────────────
function StepReview({ draft }: { draft: DraftIssue }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-h3 text-white mb-1">Review & Submit</h3>
        <p className="text-body-sm text-slate-400">Check your report before submitting.</p>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/10">
        {/* Photo thumbnail */}
        {draft.photoFile && (
          <img src={draft.photoFile} alt="Preview" className="w-full h-32 object-cover" />
        )}
        {!draft.photoFile && (
          <div className="h-20 flex items-center justify-center bg-white/[0.03] text-slate-600 text-sm">
            No photo attached
          </div>
        )}

        <div className="p-4 space-y-3">
          {[
            { label: "Category",    value: draft.category ? `${CAT_ICON[draft.category]} ${draft.category}` : "—" },
            { label: "Severity",    value: draft.severity ? draft.severity.charAt(0).toUpperCase() + draft.severity.slice(1) : "—" },
            { label: "Address",     value: draft.address || "—" },
            { label: "Coordinates", value: `${draft.lat.toFixed(4)}, ${draft.lng.toFixed(4)}` },
            { label: "Description", value: draft.description || "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-caption text-slate-500 normal-case tracking-normal w-24 flex-shrink-0">{label}</span>
              <span className="text-body-sm text-slate-200 flex-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-caption text-slate-500 normal-case tracking-normal text-center">
        Your report will be publicly visible and forwarded to the ward office.
      </p>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
interface ReportModalProps {
  onClose:  () => void;
  onSubmit: (issue: Omit<Issue, "id" | "upvotes" | "reportedAt">) => void;
}

export default function ReportModal({ onClose, onSubmit }: ReportModalProps) {
  const [step,  setStep]  = useState(0);
  const [draft, setDraft] = useState<DraftIssue>(DEFAULT_DRAFT);
  const [submitted, setSubmitted] = useState(false);

  const updateDraft = (partial: Partial<DraftIssue>) => setDraft((d) => ({ ...d, ...partial }));

  const canAdvance = () => {
    if (step === 0) return true; // photo optional
    if (step === 1) return !!draft.address;
    if (step === 2) return !!draft.category && !!draft.severity;
    if (step === 3) return draft.description.length >= 10;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        lat:         draft.lat,
        lng:         draft.lng,
        category:    (draft.category || "Other") as Category,
        severity:    (draft.severity || "moderate") as Severity,
        title:       `${draft.category || "Issue"} at ${draft.address}`,
        description: draft.description,
        ward:        "Ward 12 — Andheri East",
        status:      "Reported",
        address:     draft.address,
        photoSeed:   Math.floor(Math.random() * 100),
      });
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center px-4"
      style={{ background: "rgba(11,17,32,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "rgba(11,17,32,0.95)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(20,184,166,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top teal accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent flex-shrink-0" />

        {/* Header with stepper */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-h3 text-white">Report an Issue</h2>
              <p className="text-caption text-slate-500 normal-case tracking-normal mt-0.5">
                Step {step + 1} of {STEPS.length} — {STEPS[step]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <ProgressStepper current={step} total={STEPS.length} />
        </div>

        {/* Scrollable step content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 gap-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="text-6xl"
                >
                  ✅
                </motion.div>
                <h3 className="text-h2 text-white">Report Submitted!</h3>
                <p className="text-body-sm text-slate-400 max-w-xs">
                  Your issue has been logged and assigned to the ward office.
                  You'll receive updates as the status changes.
                </p>
                <Badge label="Report ID: ISS-019" variant="teal" />
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && <StepPhoto       draft={draft} onUpdate={updateDraft} />}
                {step === 1 && <StepLocation    draft={draft} onUpdate={updateDraft} />}
                {step === 2 && <StepCategory    draft={draft} onUpdate={updateDraft} />}
                {step === 3 && <StepDescription draft={draft} onUpdate={updateDraft} />}
                {step === 4 && <StepReview      draft={draft} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3 flex-shrink-0">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : onClose()}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            >
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            {step < STEPS.length - 1 ? (
              <GradientButton
                onClick={() => canAdvance() && setStep(step + 1)}
                size="sm"
                className={cn("flex-1", !canAdvance() && "opacity-40 cursor-not-allowed")}
                disabled={!canAdvance()}
              >
                Next →
              </GradientButton>
            ) : (
              <GradientButton onClick={handleSubmit} size="sm" className="flex-1">
                🚀 Submit Report
              </GradientButton>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
