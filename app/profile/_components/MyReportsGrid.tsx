"use client";

import { motion } from "framer-motion";
import { type Issue } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STEPS = ["Reported", "Verified", "In Progress", "Resolved"];

function MiniTimeline({ current }: { current: string }) {
  const currentIdx = STATUS_STEPS.indexOf(current);
  return (
    <div className="relative flex items-center justify-between w-full mt-3">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#DED8CD]" />
      <div
        className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-[#8B2635] transition-all duration-300"
        style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
      />
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        return (
          <div
            key={step}
            className={cn(
              "relative h-2.5 w-2.5 rounded-full z-10 transition-colors duration-300",
              done ? "bg-[#8B2635] ring-2 ring-white" : "bg-[#DED8CD]"
            )}
            title={step}
          />
        );
      })}
    </div>
  );
}

const SEV_VARIANT: Record<string, "critical" | "warning" | "success"> = {
  critical: "critical",
  moderate: "warning",
  resolved: "success",
};

interface MyReportsGridProps {
  reports: Issue[];
  onSelectReport: (issue: Issue) => void;
}

export default function MyReportsGrid({ reports, onSelectReport }: MyReportsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {reports.map((report, index) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectReport(report)}
          className="group rounded-2xl overflow-hidden bg-white border border-[#DED8CD] hover:border-[#8B2635] shadow-[0_4px_20px_rgba(36,34,34,0.05)] transition-all duration-200 cursor-pointer"
        >
          {/* Thumbnail */}
          <div className="relative h-36 w-full bg-[#F0E5D8] overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${report.photoSeed}/400/200`}
              alt={report.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2.5 left-2.5">
              <Badge
                label={report.status}
                variant={report.status === "Resolved" ? "success" : "sand"}
              />
            </div>
            <div className="absolute top-2.5 right-2.5">
              <Badge
                label={report.severity.toUpperCase()}
                variant={SEV_VARIANT[report.severity]}
                pulse={report.severity === "critical"}
              />
            </div>
          </div>

          {/* Details */}
          <div className="p-4">
            <p className="text-[11px] text-[#625E59] mb-1 flex items-center gap-1 font-medium">
              <MapPin className="h-3 w-3 text-[#8B2635]" /> {report.ward}
            </p>
            <h3 className="text-xs font-bold text-[#242222] mb-1 line-clamp-1">{report.title}</h3>

            <MiniTimeline current={report.status} />

            <div className="mt-3 pt-2.5 border-t border-[#DED8CD] flex justify-between text-[10px] text-[#88827A] font-medium">
              <span>{new Date(report.reportedAt).toLocaleDateString()}</span>
              <span className="font-bold text-[#242222]">{report.category}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
