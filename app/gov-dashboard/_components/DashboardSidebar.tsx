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
    <aside
      className="w-60 flex-shrink-0 hidden md:flex flex-col"
      style={{
        background: "#121110",
        borderRight: "1px solid rgba(148,163,184,0.08)",
      }}
    >
      {/* Brand */}
      <div
        className="h-16 flex items-center px-5"
        style={{ borderBottom: "1px solid rgba(148,163,184,0.07)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center"
            style={{ background: "rgba(217,139,82,0.10)", border: "1px solid rgba(217,139,82,0.18)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="2.5" fill="#D98B52" />
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" fill="rgba(217,139,82,0.15)" stroke="#D98B52" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-100">CivicPulse</span>
            <span className="text-xs ml-1.5 font-medium" style={{ color: "#D98B52" }}>GOV</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 space-y-0.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(tab.label)}
              className={cn(
                "relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "font-medium"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.025] font-normal"
              )}
              style={isActive ? { color: "#D98B52" } : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveTab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(217,139,82,0.07)", border: "1px solid rgba(217,139,82,0.12)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 z-10 flex-shrink-0" />
              <span className="z-10">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(148,163,184,0.07)" }}>
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div
            className="h-8 w-8 rounded-md flex items-center justify-center text-xs font-semibold text-slate-300 flex-shrink-0"
            style={{ background: "#121C2D", border: "1px solid rgba(148,163,184,0.10)" }}
          >
            OC
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Operations Chief</p>
            <p className="text-xs text-slate-600">HQ Access</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-white/[0.025] hover:text-red-400 transition-colors">
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
