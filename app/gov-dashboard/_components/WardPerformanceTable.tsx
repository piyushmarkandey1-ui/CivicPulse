"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type WardPerformance } from "./mockData";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SortField = keyof WardPerformance;
type SortOrder = "asc" | "desc";

export default function WardPerformanceTable({ data }: { data: WardPerformance[] }) {
  const [sortField, setSortField] = useState<SortField>("resolvedPercent");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc"); // Default to desc for new field
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: WardPerformance["status"]) => {
    switch (status) {
      case "Excellent": return <Badge label={status} variant="success" />;
      case "Good": return <Badge label={status} variant="copper" />;
      case "Needs Improvement": return <Badge label={status} variant="warning" />;
      case "Critical": return <Badge label={status} variant="critical" pulse />;
      default: return <Badge label={status} variant="neutral" />;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-600 ml-1 inline" />;
    return sortOrder === "asc" ? 
      <ChevronUp className="h-3 w-3 text-copper inline ml-1" /> : 
      <ChevronDown className="h-3 w-3 text-copper inline ml-1" />;
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/[0.08]" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/[0.08]">
              <th 
                className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort("name")}
              >
                Ward Name <SortIcon field="name" />
              </th>
              <th 
                className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort("totalReports")}
              >
                Total Reports <SortIcon field="totalReports" />
              </th>
              <th 
                className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort("resolvedPercent")}
              >
                Resolved % <SortIcon field="resolvedPercent" />
              </th>
              <th 
                className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort("avgResponseDays")}
              >
                Avg Response (Days) <SortIcon field="avgResponseDays" />
              </th>
              <th 
                className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort("status")}
              >
                Status <SortIcon field="status" />
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedData.map((ward, index) => (
                <motion.tr 
                  layout
                  key={ward.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-6 text-sm font-semibold text-white whitespace-nowrap">
                    {ward.name}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-300">
                    {ward.totalReports.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-sm w-48">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "font-bold w-9",
                        ward.resolvedPercent > 80 ? "text-copper-light" : ward.resolvedPercent > 60 ? "text-copper-light" : "text-red-400"
                      )}>
                        {ward.resolvedPercent}%
                      </span>
                      <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${ward.resolvedPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + (index * 0.05) }}
                          style={{
                            background: ward.resolvedPercent > 80 
                              ? "linear-gradient(90deg, #D98B52, #2DD4BF)" 
                              : ward.resolvedPercent > 60 
                                ? "linear-gradient(90deg, #D3A34A, #FCD34D)" 
                                : "linear-gradient(90deg, #D85C52, #f87171)"
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-300">
                    <span className={ward.avgResponseDays > 7 ? "text-red-400" : ""}>
                      {ward.avgResponseDays.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {getStatusBadge(ward.status)}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
