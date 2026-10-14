"use client";

import { useState, useRef } from "react";
import {
  type Category,
  type Severity,
  type Issue,
  type TrafficImpact,
  type RepairScale,
  type City,
  REPAIR_COST_MAP,
} from "@/lib/types";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { DURG_WARDS, MUMBAI_WARDS } from "./mockData";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = ["Photo", "Location", "Category", "Description", "Impact", "Review"];

const CATEGORIES: Category[] = ["Pothole", "Water Clogging", "Crack", "Road Damage", "Other"];
const CAT_ICON: Record<Category, string> = {
  "Pothole": "🕳️",
  "Water Clogging": "💧",
  "Crack": "🏗️",
  "Road Damage": "🛣️",
  "Other": "⚠️",
};
const SEVERITIES: { value: Severity; label: string; color: string }[] = [
  { value: "critical", label: "Critical Hazard", color: "#B83A3A" },
  { value: "moderate", label: "Reported / Moderate", color: "#C58B32" },
];

// ─── Impact step constants ─────────────────────────────────────────────────────
const TRAFFIC_OPTIONS: {
  value: TrafficImpact;
  label: string;
  emoji: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    value: "low",
    label: "Low",
    emoji: "🟢",
    desc: "Minimal disruption, passable",
    color: "#5E8061",
    bg: "#EAF0EA",
    border: "#B8D0BC",
  },
  {
    value: "medium",
    label: "Medium",
    emoji: "🟡",
    desc: "Slows traffic, caution needed",
    color: "#C58B32",
    bg: "#F5ECD8",
    border: "#D9B96A",
  },
  {
    value: "high",
    label: "High",
    emoji: "🔴",
    desc: "Blocks lane or major hazard",
    color: "#B83A3A",
    bg: "#F5E5E5",
    border: "#D9A0A0",
  },
];

const REPAIR_OPTIONS: {
  value: RepairScale;
  label: string;
  icon: string;
  cost: string;
  desc: string;
}[] = [
  {
    value: "small_patch",
    label: "Small Patch",
    icon: "🔧",
    cost: REPAIR_COST_MAP.small_patch,
    desc: "Isolated crack or pothole ≤ 1 m²",
  },
  {
    value: "road_section",
    label: "Road Section",
    icon: "🚧",
    cost: REPAIR_COST_MAP.road_section,
    desc: "Damaged stretch, 1 – 20 m",
  },
  {
    value: "full_road",
    label: "Full Road",
    icon: "🏗️",
    cost: REPAIR_COST_MAP.full_road,
    desc: "Entire carriageway needs resurfacing",
  },
];

interface DraftIssue {
  photoFile: string | null;
  lat: number;
  lng: number;
  category: Category | null;
  severity: Severity | null;
  description: string;
  address: string;
  trafficImpact: TrafficImpact | null;
  repairScale: RepairScale | null;
  city: City;
  ward: string;
}

const DEFAULT_DRAFT: DraftIssue = {
  photoFile: null,
  lat: 21.1904,
  lng: 81.2849,
  category: null,
  severity: null,
  description: "",
  address: "Indira Market Main Road, Durg",
  trafficImpact: null,
  repairScale: null,
  city: "Durg",
  ward: "Ward 15 — Indira Market, Durg",
};

// ─── Progress stepper ─────────────────────────────────────────────────────────
function ProgressStepper({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center flex-1">
          <div
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200 flex-shrink-0",
              i < current
                ? "bg-[#8B2635] border-[#8B2635] text-white"
                : i === current
                ? "border-[#8B2635] bg-[#F0E5D8] text-[#8B2635]"
                : "border-[#DED8CD] text-[#88827A] bg-white"
            )}
          >
            {i < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div className="flex-1 h-0.5 mx-1.5 rounded-full overflow-hidden bg-[#DED8CD]">
              <div
                className="h-full bg-[#8B2635] rounded-full transition-all duration-300"
                style={{ width: i < current ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Photo Upload ─────────────────────────────────────────────────────
function StepPhoto({
  draft,
  onUpdate,
}: {
  draft: DraftIssue;
  onUpdate: (d: Partial<DraftIssue>) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [detected, setDetected] = useState(false);
  const [exifStatus, setExifStatus] = useState("Processing EXIF...");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate({ photoFile: reader.result as string });
    };
    reader.readAsDataURL(file);
    
    // Extract actual EXIF data
    try {
      const exifr = (await import("exifr")).default;
      const gps = await exifr.gps(file);
      if (gps && gps.latitude && gps.longitude) {
        onUpdate({ lat: gps.latitude, lng: gps.longitude });
        setExifStatus(`EXIF Captured: ${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}`);
      } else {
        setExifStatus("No EXIF found. Using default location.");
      }
    } catch {
      setExifStatus("EXIF read failed. Using default location.");
    }
    
    setTimeout(() => setDetected(true), 600);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-[#242222] mb-0.5">Upload Verification Photo</h3>
        <p className="text-xs text-[#625E59]">Attach clear photographic evidence of the infrastructure issue.</p>
      </div>

      {draft.photoFile ? (
        <div className="relative rounded-xl overflow-hidden border border-[#DED8CD]">
          <img src={draft.photoFile} alt="Issue preview" className="w-full h-48 object-cover rounded-xl" />
          {detected && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#242222] bg-white border border-[#DED8CD] shadow-sm">
              <span className="text-[#8B2635]">📍</span> {exifStatus}
            </div>
          )}
          <button
            onClick={() => {
              onUpdate({ photoFile: null });
              setDetected(false);
            }}
            className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90 text-[#242222] border border-[#DED8CD] hover:bg-white text-xs font-bold"
          >
            ✕ Remove
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 bg-[#F7F4ED]",
            dragging ? "border-[#8B2635] bg-[#F0E5D8]" : "border-[#C9C0B3] hover:border-[#8B2635]"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
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
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <span className="text-3xl" aria-hidden>📷</span>
          <div className="text-center">
            <p className="text-xs font-bold text-[#242222]">Click or drag photo to attach</p>
            <p className="text-[11px] text-[#88827A] mt-0.5">JPEG, PNG, HEIC up to 10 MB</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────
function StepLocation({
  draft,
  onUpdate,
}: {
  draft: DraftIssue;
  onUpdate: (d: Partial<DraftIssue>) => void;
}) {
  const wards = draft.city === "Durg" ? DURG_WARDS : MUMBAI_WARDS;

  const handleCityChange = (city: City) => {
    if (city === "Durg") {
      onUpdate({
        city: "Durg",
        lat: 21.1904,
        lng: 81.2849,
        ward: "Ward 15 — Indira Market, Durg",
        address: "Indira Market Main Road, Durg",
      });
    } else {
      onUpdate({
        city: "Mumbai",
        lat: 19.09,
        lng: 72.865,
        ward: "Ward 12 — Andheri East",
        address: "S.V. Road near Andheri Station, Mumbai",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-[#242222] mb-0.5">Incident Location &amp; Municipal Ward</h3>
        <p className="text-xs text-[#625E59]">Select municipal jurisdiction and confirm street address.</p>
      </div>

      {/* City Switcher */}
      <div>
        <label className="text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5 block">
          Municipal Corporation / City
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleCityChange("Durg")}
            className={cn(
              "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer",
              draft.city === "Durg"
                ? "bg-[#8B2635] text-white border-[#8B2635] shadow-xs"
                : "bg-white text-[#625E59] border-[#DED8CD] hover:border-[#8B2635]/40"
            )}
          >
            <span className="font-bold">Durg, CG</span>
            <span className={cn("text-[10px]", draft.city === "Durg" ? "text-white/80" : "text-[#88827A]")}>
              Durg Municipal Corp.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCityChange("Mumbai")}
            className={cn(
              "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer",
              draft.city === "Mumbai"
                ? "bg-[#8B2635] text-white border-[#8B2635] shadow-xs"
                : "bg-white text-[#625E59] border-[#DED8CD] hover:border-[#8B2635]/40"
            )}
          >
            <span className="font-bold">Mumbai, MH</span>
            <span className={cn("text-[10px]", draft.city === "Mumbai" ? "text-white/80" : "text-[#88827A]")}>
              BMC Municipal Corp.
            </span>
          </button>
        </div>
      </div>

      {/* Ward Dropdown */}
      <div>
        <label className="text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5 block">
          Administrative Ward
        </label>
        <select
          value={draft.ward}
          onChange={(e) => onUpdate({ ward: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-[#C9C0B3] bg-white text-[#242222] focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 cursor-pointer"
        >
          {wards.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <div className="relative h-20 rounded-xl overflow-hidden border border-[#DED8CD] flex items-center justify-center bg-[#F4EFE6]">
        <div className="text-center">
          <p className="text-xs font-bold text-[#242222]">GPS Geo-Coordinates for {draft.city}</p>
          <p className="text-[11px] font-mono font-bold text-[#8B2635] mt-0.5">
            {draft.lat.toFixed(4)}° N, {draft.lng.toFixed(4)}° E
          </p>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#242222] uppercase tracking-wider mb-1.5 block">
          Street Address / Landmark
        </label>
        <input
          type="text"
          value={draft.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          placeholder={
            draft.city === "Durg"
              ? "e.g. Near Station Road / Indira Market"
              : "e.g. S.V. Road near Andheri Station"
          }
          className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-[#C9C0B3] bg-white text-[#242222] focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15"
        />
      </div>
    </div>
  );
}

// ─── Step 3: Category & Severity ──────────────────────────────────────────────
function StepCategory({
  draft,
  onUpdate,
}: {
  draft: DraftIssue;
  onUpdate: (d: Partial<DraftIssue>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-[#242222] mb-0.5">Category & Severity Assessment</h3>
        <p className="text-xs text-[#625E59]">Select classification for municipal department routing.</p>
      </div>

      <div>
        <p className="text-xs font-bold text-[#242222] uppercase tracking-wider mb-2">Issue Category</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onUpdate({ category: cat })}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-bold transition-all text-left",
                draft.category === cat
                  ? "border-[#8B2635] bg-[#F0E5D8] text-[#8B2635] shadow-xs"
                  : "border-[#DED8CD] bg-white text-[#625E59] hover:border-[#8B2635] hover:text-[#242222]"
              )}
            >
              <span className="text-base">{CAT_ICON[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-[#242222] uppercase tracking-wider mb-2">Severity Level</p>
        <div className="flex gap-2.5">
          {SEVERITIES.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => onUpdate({ severity: value })}
              className={cn(
                "flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all",
                draft.severity === value
                  ? "text-white shadow-xs"
                  : "border-[#DED8CD] bg-white text-[#625E59] hover:border-[#8B2635]"
              )}
              style={
                draft.severity === value
                  ? { backgroundColor: color, borderColor: color }
                  : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Description ──────────────────────────────────────────────────────
function StepDescription({
  draft,
  onUpdate,
}: {
  draft: DraftIssue;
  onUpdate: (d: Partial<DraftIssue>) => void;
}) {
  const MAX = 400;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-base font-bold text-[#242222] mb-0.5">Detailed Description</h3>
        <p className="text-xs text-[#625E59]">Provide context to assist municipal engineers.</p>
      </div>
      <div className="relative">
        <textarea
          rows={5}
          maxLength={MAX}
          value={draft.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="e.g. Large pothole near the station crossing. Approximately 12 inches deep, dangerous for two-wheelers during night..."
          className="w-full px-3.5 py-2.5 rounded-lg text-xs text-[#242222] placeholder-[#88827A] resize-none focus:outline-none focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/15 border border-[#C9C0B3] bg-white leading-relaxed"
        />
        <p className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#88827A]">
          {draft.description.length}/{MAX}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Accident Hazard",
          "Near Bus Stop",
          "Overdue 2 Weeks",
          "Pedestrian Risk",
        ].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() =>
              onUpdate({
                description: draft.description
                  ? `${draft.description} ${prompt}.`
                  : `${prompt}.`,
              })
            }
            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-[#625E59] bg-[#F7F4ED] border border-[#DED8CD] hover:border-[#8B2635] hover:text-[#8B2635] transition-colors"
          >
            + {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 5: Impact ───────────────────────────────────────────────────────────
function StepImpact({
  draft,
  onUpdate,
}: {
  draft: DraftIssue;
  onUpdate: (d: Partial<DraftIssue>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-[#242222] mb-0.5">Impact Assessment</h3>
        <p className="text-xs text-[#625E59]">
          Help the AI Priority Engine rank this repair accurately.
        </p>
      </div>

      {/* Traffic Impact */}
      <div>
        <p className="text-xs font-bold text-[#242222] uppercase tracking-wider mb-2.5">
          Traffic Impact
        </p>
        <div className="flex flex-col gap-2">
          {TRAFFIC_OPTIONS.map((opt) => {
            const selected = draft.trafficImpact === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ trafficImpact: opt.value })}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3.5 w-full px-4 py-3 rounded-xl border-2 text-left transition-all duration-150",
                  selected ? "shadow-sm" : "border-[#DED8CD] bg-white hover:border-[#C9C0B3]"
                )}
                style={selected ? { background: opt.bg, borderColor: opt.border } : undefined}
              >
                <div
                  className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                  style={selected ? { borderColor: opt.color, background: opt.color } : { borderColor: "#C9C0B3" }}
                >
                  {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xl leading-none">{opt.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color: selected ? opt.color : "#242222" }}>
                    {opt.label}
                  </p>
                  <p className="text-[11px] text-[#88827A] mt-0.5">{opt.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Repair Scale */}
      <div>
        <p className="text-xs font-bold text-[#242222] uppercase tracking-wider mb-2.5">
          Approximate Repair Scale
        </p>
        <div className="flex flex-col gap-2">
          {REPAIR_OPTIONS.map((opt) => {
            const selected = draft.repairScale === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ repairScale: opt.value })}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3.5 w-full px-4 py-3 rounded-xl border-2 text-left transition-all duration-150",
                  selected
                    ? "border-[#8B2635] bg-[#F0E5D8] shadow-sm"
                    : "border-[#DED8CD] bg-white hover:border-[#C9C0B3]"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                    selected ? "border-[#8B2635] bg-[#8B2635]" : "border-[#C9C0B3]"
                  )}
                >
                  {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xl leading-none">{opt.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={cn("text-xs font-bold", selected ? "text-[#8B2635]" : "text-[#242222]")}>
                      {opt.label}
                    </p>
                    <span className="text-[11px] font-mono font-bold text-[#8B2635] flex-shrink-0">
                      {opt.cost}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#88827A] mt-0.5">{opt.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 6: Review ───────────────────────────────────────────────────────────
function StepReview({ draft }: { draft: DraftIssue }) {
  const trafficOpt = TRAFFIC_OPTIONS.find((o) => o.value === draft.trafficImpact);
  const repairOpt  = REPAIR_OPTIONS.find((o) => o.value === draft.repairScale);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-base font-bold text-[#242222] mb-0.5">Review Verification Submission</h3>
        <p className="text-xs text-[#625E59]">Confirm details before entering the public municipal log.</p>
      </div>

      <div className="rounded-xl overflow-hidden border border-[#DED8CD] bg-[#F7F4ED] p-4 space-y-2.5 text-xs">
        <div className="flex justify-between border-b border-[#DED8CD] pb-2">
          <span className="text-[#88827A] font-medium">Category:</span>
          <span className="font-bold text-[#242222]">{draft.category || "—"}</span>
        </div>
        <div className="flex justify-between border-b border-[#DED8CD] pb-2">
          <span className="text-[#88827A] font-medium">Severity:</span>
          <span className="font-bold text-[#8B2635] uppercase">{draft.severity || "—"}</span>
        </div>
        <div className="flex justify-between border-b border-[#DED8CD] pb-2">
          <span className="text-[#88827A] font-medium">Location:</span>
          <span className="font-medium text-[#242222] text-right">{draft.address}</span>
        </div>
        <div className="flex justify-between border-b border-[#DED8CD] pb-2 items-center">
          <span className="text-[#88827A] font-medium">Traffic Impact:</span>
          {trafficOpt ? (
            <span className="flex items-center gap-1.5 font-bold" style={{ color: trafficOpt.color }}>
              {trafficOpt.emoji} {trafficOpt.label}
            </span>
          ) : (
            <span className="font-bold text-[#242222]">—</span>
          )}
        </div>
        <div className="flex justify-between border-b border-[#DED8CD] pb-2 items-center">
          <span className="text-[#88827A] font-medium">Repair Scale:</span>
          {repairOpt ? (
            <span className="font-bold text-[#242222]">
              {repairOpt.icon} {repairOpt.label}{" "}
              <span className="font-mono text-[#8B2635]">({repairOpt.cost})</span>
            </span>
          ) : (
            <span className="font-bold text-[#242222]">—</span>
          )}
        </div>
        <div className="pt-1">
          <span className="text-[#88827A] font-medium block mb-1">Description:</span>
          <p className="text-[#625E59] leading-relaxed italic">{draft.description || "—"}</p>
        </div>
      </div>
    </div>
  );
}

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (issue: Omit<Issue, "id" | "upvotes" | "reportedAt"> & { photoFile?: string }) => void;
}

export default function ReportModal({ onClose, onSubmit }: ReportModalProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftIssue>(DEFAULT_DRAFT);
  const [submitted, setSubmitted] = useState(false);

  const updateDraft = (partial: Partial<DraftIssue>) =>
    setDraft((d) => ({ ...d, ...partial }));

  const canAdvance = () => {
    if (step === 0) return true;
    if (step === 1) return !!draft.address;
    if (step === 2) return !!draft.category && !!draft.severity;
    if (step === 3) return draft.description.length >= 6;
    if (step === 4) return !!draft.trafficImpact && !!draft.repairScale;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        lat: draft.lat,
        lng: draft.lng,
        category: (draft.category || "Other") as Category,
        severity: (draft.severity || "moderate") as Severity,
        title: `${draft.category || "Issue"} at ${draft.address}`,
        description: draft.description,
        ward: draft.ward || (draft.city === "Durg" ? "Ward 15 — Indira Market, Durg" : "Ward 12 — Andheri East"),
        city: draft.city,
        status: "Reported",
        address: draft.address,
        photoUrl: draft.photoFile || undefined,
        photoFile: draft.photoFile || undefined,
        // Impact fields — written to database
        trafficImpact: draft.trafficImpact ?? undefined,
        repairCostEstimate: draft.repairScale
          ? REPAIR_COST_MAP[draft.repairScale]
          : undefined,
      });
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#242222]/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 14 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 14 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl overflow-hidden bg-white border border-[#DED8CD] shadow-[0_16px_48px_rgba(36,34,34,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#DED8CD] bg-[#F7F4ED]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-[#242222]">Report Municipal Incident</h2>
              <p className="text-[11px] text-[#88827A]">
                Step {step + 1} of {STEPS.length}: {STEPS[step]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white text-[#88827A] hover:text-[#242222] border border-transparent hover:border-[#DED8CD] transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <ProgressStepper current={step} total={STEPS.length} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <span className="text-5xl">✅</span>
              <h3 className="text-lg font-bold text-[#242222]">Report Successfully Logged</h3>
              <p className="text-xs text-[#625E59] max-w-xs leading-relaxed">
                Your report in {draft.city} has been entered into the municipal GIS ledger and assigned to the {draft.ward} engineering desk.
              </p>
              <Badge label="Report Logged" variant="sand" />
            </div>
          ) : (
            <>
              {step === 0 && <StepPhoto draft={draft} onUpdate={updateDraft} />}
              {step === 1 && <StepLocation draft={draft} onUpdate={updateDraft} />}
              {step === 2 && <StepCategory draft={draft} onUpdate={updateDraft} />}
              {step === 3 && <StepDescription draft={draft} onUpdate={updateDraft} />}
              {step === 4 && <StepImpact draft={draft} onUpdate={updateDraft} />}
              {step === 5 && <StepReview draft={draft} />}
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-[#DED8CD] flex gap-3 bg-[#F7F4ED]">
            <button
              type="button"
              onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
              className="flex-1 py-2.5 rounded-lg border border-[#C9C0B3] text-xs font-bold text-[#625E59] hover:bg-white hover:text-[#242222] transition-colors"
            >
              {step === 0 ? "Cancel" : "← Previous"}
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => canAdvance() && setStep(step + 1)}
                disabled={!canAdvance()}
                className="flex-1 py-2.5 rounded-lg bg-[#8B2635] hover:bg-[#641B27] text-white text-xs font-bold transition-colors disabled:opacity-40 shadow-xs"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-lg bg-[#8B2635] hover:bg-[#641B27] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Submit Incident Report
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
