"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Escalation } from "./mockData";
import { AlertCircle, ChevronDown, Clock, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EscalationAlerts({ escalations }: { escalations: Escalation[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="glass rounded-2xl p-2 border border-white/[0.08]" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      {escalations.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          <p>No active escalations. Good job!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {escalations.map((esc) => {
            const isExpanded = expandedId === esc.id;
            return (
              <div 
                key={esc.id} 
                className={cn(
                  "rounded-xl border transition-all duration-300 overflow-hidden",
                  isExpanded 
                    ? "bg-red-500/10 border-red-500/30" 
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                )}
              >
                <button
                  onClick={() => toggleExpand(esc.id)}
                  className="w-full flex items-center justify-between p-4 focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    {/* Pulsing indicator */}
                    <div className="relative flex h-3 w-3 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                    
                    <div className="text-left">
                      <h4 className={cn("font-bold", isExpanded ? "text-red-400" : "text-slate-200")}>
                        {esc.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {esc.ward}</span>
                        <span className="flex items-center gap-1 text-red-400/80"><Clock className="h-3 w-3" /> {esc.daysOverdue} days overdue</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronDown className={cn("h-5 w-5 text-slate-500 transition-transform duration-300", isExpanded && "rotate-180 text-red-400")} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-red-500/20">
                        <div className="bg-black/20 rounded-lg p-4 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-3 w-3 text-slate-400" />
                            <span className="text-xs font-semibold text-slate-300">{esc.category}</span>
                            <span className="text-xs text-slate-500 ml-auto">ID: {esc.id}</span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {esc.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex-1">
                            Intervene Now
                          </button>
                          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-lg transition-colors border border-white/10">
                            Notify Ward Officer
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
