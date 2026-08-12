"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, Map, AlertOctagon, Award, LogOut } from "lucide-react";
import { type TabType } from "./GovDashboardClient";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: { label: TabType; icon: React.ElementType }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Departments", icon: Users },
  { label: "Wards", icon: Map },
  { label: "Escalations", icon: AlertOctagon },
  { label: "Recognition", icon: Award },
];

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-white/10" style={{ background: "rgba(11,17,32,0.6)", backdropFilter: "blur(20px)" }}>
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal to-teal/40 flex items-center justify-center">
            <span className="text-navy font-black text-lg">CP</span>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">CivicPulse <span className="text-teal text-sm">GOV</span></span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(tab.label)}
              className={cn(
                "relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive ? "text-teal-light" : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-xl border border-teal/20"
                  style={{ background: "linear-gradient(90deg, rgba(20,184,166,0.15) 0%, rgba(20,184,166,0.03) 100%)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <Icon className="h-5 w-5 z-10" />
              <span className="z-10">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile/Logout */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
            OC
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Operations Chief</p>
            <p className="text-xs text-slate-500">HQ Level Access</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.03] hover:text-red-400 transition-colors">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
