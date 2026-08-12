"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Escalation } from "./mockData";
import { ChevronDown, Clock, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EscalationAlerts({ escalations }: { escalations: Escalation[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="rounded-2xl p-3 bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.05)]">
      {escalations.length === 0 ? (
        <div className="p-8 text-center text-[#88827A]">
          <p>No active SLA escalations currently logged.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {escalations.map((esc) => {
            const isExpanded = expandedId === esc.id;
            return (
              <div
                key={esc.id}
                className={cn(
                  "rounded-xl border transition-all duration-200 overflow-hidden",
                  isExpanded
                    ? "bg-[#FDEDED]/60 border-[#B83A3A]/40"
                    : "bg-[#F7F4ED]/50 border-[#DED8CD] hover:border-[#C9C0B3]"
                )}
              >
                <button
                  onClick={() => toggleExpand(esc.id)}
                  className="w-full flex items-center justify-between p-4 focus:outline-none text-left"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Pulsing indicator */}
                    <div className="relative flex h-2.5 w-2.5 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B83A3A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B83A3A]"></span>
                    </div>

                    <div>
                      <h4
                        className={cn(
                          "text-xs font-bold",
                          isExpanded ? "text-[#B83A3A]" : "text-[#242222]"
                        )}
                      >
                        {esc.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-[#625E59]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#8B2635]" /> {esc.ward}
                        </span>
                        <span className="flex items-center gap-1 text-[#B83A3A] font-bold">
                          <Clock className="h-3 w-3" /> {esc.daysOverdue} days overdue
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[#88827A] transition-transform duration-200",
                      isExpanded && "rotate-180 text-[#B83A3A]"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-[#B83A3A]/20">
                        <div className="bg-white rounded-lg p-3 mb-3 border border-[#DED8CD]">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Tag className="h-3 w-3 text-[#88827A]" />
                            <span className="text-xs font-bold text-[#242222]">
                              {esc.category}
                            </span>
                            <span className="text-[10px] font-mono text-[#88827A] ml-auto">
                              ID: {esc.id}
                            </span>
                          </div>
                          <p className="text-xs text-[#625E59] leading-relaxed">
                            {esc.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3.5 py-2 bg-[#B83A3A] hover:bg-[#9B2E2E] text-white text-xs font-bold rounded-lg transition-colors flex-1 shadow-xs">
                            Direct Field Dispatch
                          </button>
                          <button className="px-3.5 py-2 bg-white hover:bg-[#F0E5D8] text-[#242222] text-xs font-bold rounded-lg transition-colors border border-[#DED8CD]">
                            Notify Ward Supervisor
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
