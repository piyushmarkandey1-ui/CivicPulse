"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, Map, AlertOctagon, Award, LogOut } from "lucide-react";
import { type TabType } from "./GovDashboardClient";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside className="w-60 flex-shrink-0 hidden md:flex flex-col bg-white border-r border-[#DED8CD]">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-[#DED8CD]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md flex items-center justify-center bg-[#F0E5D8] border border-[#D6C2A3]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="2.5" fill="#8B2635" />
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                fill="rgba(139,38,53,0.15)"
                stroke="#8B2635"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-[#242222]">CivicPulse</span>
            <span className="text-xs ml-1.5 font-bold text-[#8B2635]">GOV</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(tab.label)}
              className={cn(
                "relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200",
                isActive
                  ? "text-[#8B2635] bg-[#F0E5D8] border border-[#D6C2A3] shadow-xs"
                  : "text-[#625E59] hover:text-[#242222] hover:bg-[#F7F4ED] border border-transparent"
              )}
            >
              <Icon className="h-4 w-4 z-10 flex-shrink-0" />
              <span className="z-10">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-3 border-t border-[#DED8CD] bg-[#F7F4ED]/50">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold text-white bg-[#8B2635] flex-shrink-0">
            {profile?.name?.slice(0, 2).toUpperCase() || "GOV"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#242222] truncate">
              {profile?.name || "Official"}
            </p>
            <p className="text-[10px] text-[#88827A] truncate">
              {profile?.department || "Municipal Command"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#88827A] hover:bg-[#FDEDED] hover:text-[#B83A3A] transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
