"use client";

import { motion } from "framer-motion";
import { type Issue } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Timeline Helper ────────────────────────────────────────────────────────
const STATUS_STEPS = ["Reported", "Verified", "In Progress", "Resolved"];

function MiniTimeline({ current }: { current: string }) {
  const currentIdx = STATUS_STEPS.indexOf(current);
  return (
    <div className="relative flex items-center justify-between w-full mt-4">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/[0.06]" />
      <div 
        className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-teal transition-all duration-500"
        style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
      />
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        return (
          <div 
            key={step} 
            className={cn(
              "relative h-2.5 w-2.5 rounded-full z-10 transition-colors duration-500",
              done ? "bg-teal shadow-[0_0_8px_rgba(20,184,166,0.5)]" : "bg-slate-700"
            )}
            title={step}
          />
        );
      })}
    </div>
  );
}

// ─── Badge Map ──────────────────────────────────────────────────────────────
const SEV_VARIANT: Record<string, "critical" | "warning" | "success"> = {
  critical: "critical",
  moderate: "warning",
  resolved: "success",
};

// ─── Component ──────────────────────────────────────────────────────────────
interface MyReportsGridProps {
  reports: Issue[];
  onSelectReport: (issue: Issue) => void;
}

export default function MyReportsGrid({ reports, onSelectReport }: MyReportsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report, index) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectReport(report)}
          className="group glass rounded-2xl overflow-hidden border border-white/[0.08] hover:border-teal/30 transition-all duration-300 cursor-pointer"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
        >
          {/* Thumbnail */}
          <div className="relative h-36 w-full bg-navy-muted overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/${report.photoSeed}/400/200`} 
              alt={report.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute top-3 left-3">
              <Badge label={report.status} variant={report.status === "Resolved" ? "success" : "copper"} />
            </div>
            <div className="absolute top-3 right-3">
              <Badge label={report.severity.toUpperCase()} variant={SEV_VARIANT[report.severity]} pulse={report.severity === "critical"} />
            </div>
          </div>

          {/* Details */}
          <div className="p-4">
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1 font-medium">
              <MapPin className="h-3 w-3" /> {report.ward}
            </p>
            <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{report.title}</h3>
            
            <MiniTimeline current={report.status} />
            
            <div className="mt-3 flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              <span>{new Date(report.reportedAt).toLocaleDateString()}</span>
              <span>{report.category}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
