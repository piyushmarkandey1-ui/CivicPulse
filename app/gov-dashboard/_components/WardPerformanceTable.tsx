"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type WardPerformance } from "./mockData";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

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
      setSortOrder("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: WardPerformance["status"]) => {
    switch (status) {
      case "Excellent":
        return <Badge label={status} variant="success" />;
      case "Good":
        return <Badge label={status} variant="maroon" />;
      case "Needs Improvement":
        return <Badge label={status} variant="warning" />;
      case "Critical":
        return <Badge label={status} variant="critical" pulse />;
      default:
        return <Badge label={status} variant="neutral" />;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-[#88827A] ml-1 inline" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3 w-3 text-[#8B2635] inline ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[#8B2635] inline ml-1" />
    );
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F4ED] border-b border-[#DED8CD]">
              <th
                className="py-3.5 px-6 text-xs font-bold text-[#625E59] uppercase tracking-wider cursor-pointer hover:text-[#242222] transition-colors"
                onClick={() => handleSort("name")}
              >
                Ward Name <SortIcon field="name" />
              </th>
              <th
                className="py-3.5 px-6 text-xs font-bold text-[#625E59] uppercase tracking-wider cursor-pointer hover:text-[#242222] transition-colors"
                onClick={() => handleSort("totalReports")}
              >
                Total Reports <SortIcon field="totalReports" />
              </th>
              <th
                className="py-3.5 px-6 text-xs font-bold text-[#625E59] uppercase tracking-wider cursor-pointer hover:text-[#242222] transition-colors"
                onClick={() => handleSort("resolvedPercent")}
              >
                Resolution Rate (%) <SortIcon field="resolvedPercent" />
              </th>
              <th
                className="py-3.5 px-6 text-xs font-bold text-[#625E59] uppercase tracking-wider cursor-pointer hover:text-[#242222] transition-colors"
                onClick={() => handleSort("avgResponseDays")}
              >
                Avg Turnaround (Days) <SortIcon field="avgResponseDays" />
              </th>
              <th
                className="py-3.5 px-6 text-xs font-bold text-[#625E59] uppercase tracking-wider cursor-pointer hover:text-[#242222] transition-colors"
                onClick={() => handleSort("status")}
              >
                Performance Rating <SortIcon field="status" />
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedData.map((ward, index) => (
                <motion.tr
                  layout
                  key={ward.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-[#DED8CD]/60 hover:bg-[#F0E5D8]/30 transition-colors"
                >
                  <td className="py-3.5 px-6 text-xs font-bold text-[#242222] whitespace-nowrap">
                    {ward.name}
                  </td>
                  <td className="py-3.5 px-6 text-xs font-mono font-semibold text-[#625E59]">
                    {ward.totalReports}
                  </td>
                  <td className="py-3.5 px-6 text-xs whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#F0E5D8] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#8B2635]"
                          style={{ width: `${ward.resolvedPercent}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[#242222]">
                        {ward.resolvedPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-xs font-mono font-semibold text-[#625E59]">
                    {ward.avgResponseDays}d
                  </td>
                  <td className="py-3.5 px-6 text-xs whitespace-nowrap">
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
