"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import KPIStatsRow from "./KPIStatsRow";
import ChartsSection from "./ChartsSection";
import WardPerformanceTable from "./WardPerformanceTable";
import EscalationAlerts from "./EscalationAlerts";
import RecognitionWall from "./RecognitionWall";
import PriorityQueueTable from "./PriorityQueueTable";
import { WARD_DATA, ESCALATIONS, KPI_DATA as MOCK_KPI, type WardPerformance, type Escalation } from "./mockData";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { type Issue } from "@/lib/types";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

export type TabType = "Overview" | "Departments" | "Wards" | "Escalations" | "Priority Queue" | "Recognition";

export default function GovDashboardClient() {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, loading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || role !== "government")) {
      router.replace("/gov-login");
    }
  }, [authLoading, user, role, router]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "issues"),
      (snapshot) => {
        const fetched: Issue[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          let reportedAtStr = new Date().toISOString();
          if (data.reportedAt) {
            if (typeof data.reportedAt.toDate === "function") {
              reportedAtStr = data.reportedAt.toDate().toISOString();
            } else if (typeof data.reportedAt === "string") {
              reportedAtStr = data.reportedAt;
            }
          }
          fetched.push({ id: docSnap.id, ...data, reportedAt: reportedAtStr } as Issue);
        });
        setIssues(fetched);
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore snapshot error, continuing with fallback:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Live KPIs
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;
  const pendingCount = issues.filter((i) => i.status !== "Resolved").length;
  const resolutionRate =
    issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0;

  const KPI_DATA = {
    resolutionRate: issues.length > 0 ? resolutionRate : MOCK_KPI.resolutionRate,
    avgResponseTime: MOCK_KPI.avgResponseTime,
    pendingEscalations: issues.length > 0 ? pendingCount : MOCK_KPI.pendingEscalations,
    trustScore: MOCK_KPI.trustScore,
  };

  // ─── 1. Ward Performance dynamically derived from issues ─────────────────
  const wardData: WardPerformance[] = useMemo(() => {
    if (issues.length === 0) return WARD_DATA;

    const map = new Map<string, Issue[]>();
    issues.forEach((issue) => {
      const wardName = issue.ward?.trim() || "Unassigned Ward";
      if (!map.has(wardName)) {
        map.set(wardName, []);
      }
      map.get(wardName)!.push(issue);
    });

    const list: WardPerformance[] = [];
    let idx = 1;
    map.forEach((wIssues, wardName) => {
      const total = wIssues.length;
      const resolved = wIssues.filter((i) => i.status === "Resolved");
      const resolvedPercent = Math.round((resolved.length / total) * 100);

      let avgResponseDays = 3.5;
      if (resolved.length > 0) {
        const totalDays = resolved.reduce((acc, curr) => {
          const start = new Date(curr.reportedAt).getTime();
          const end = curr.lastUpdated ? new Date(curr.lastUpdated).getTime() : Date.now();
          const days = Math.max(0.5, (end - start) / (1000 * 60 * 60 * 24));
          return acc + days;
        }, 0);
        avgResponseDays = Number((totalDays / resolved.length).toFixed(1));
      }

      const status: WardPerformance["status"] =
        resolvedPercent >= 90
          ? "Excellent"
          : resolvedPercent >= 75
          ? "Good"
          : resolvedPercent >= 60
          ? "Needs Improvement"
          : "Critical";

      list.push({
        id: `W-${idx++}`,
        name: wardName,
        totalReports: total,
        resolvedPercent,
        avgResponseDays,
        status,
      });
    });

    return list.sort((a, b) => b.totalReports - a.totalReports);
  }, [issues]);

  // ─── 2. Active Escalations (Unresolved > 5 days) ─────────────────────────
  const escalations: Escalation[] = useMemo(() => {
    if (issues.length === 0) return ESCALATIONS;

    const overdue = issues.filter((i) => {
      if (i.status === "Resolved" || !i.reportedAt) return false;
      const reportedMs = new Date(i.reportedAt).getTime();
      if (isNaN(reportedMs)) return false;
      const days = (Date.now() - reportedMs) / (1000 * 60 * 60 * 24);
      return days > 5;
    });

    // If live data has items, show them; if live data is loaded but none are overdue, show empty list
    return overdue.map((i) => {
      const reportedMs = new Date(i.reportedAt).getTime();
      const daysOverdue = Math.max(1, Math.floor((Date.now() - reportedMs) / (1000 * 60 * 60 * 24)));
      return {
        id: i.id,
        title: i.title || `${i.category} Hazard`,
        ward: i.ward || "Unassigned Ward",
        daysOverdue,
        category: i.category,
        description: i.description || "Reported infrastructure complaint exceeding statutory SLA response window.",
      };
    });
  }, [issues]);

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#242222] flex">
      {/* Sidebar Navigation */}
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen px-6 py-6 md:px-10 bg-[#F7F4ED]">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-[#DED8CD] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8B2635] bg-[#F0E5D8] border border-[#D6C2A3] px-2.5 py-1 rounded-full mb-3">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Municipal Command Center
            </span>
            <h1 className="text-xl font-bold text-[#242222] leading-tight">
              Operations &amp; SLA Triage Dashboard
            </h1>
            <p className="text-xs text-[#88827A] mt-1 max-w-sm">
              Live ward telemetry, statutory response tracking, and photographic resolution index.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/map"
              className="text-xs font-bold px-3 py-2 rounded-lg bg-white border border-[#DED8CD] hover:border-[#8B2635] text-[#242222] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>🗺️</span>
              <span>GIS Radar</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#DED8CD] shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5E8061] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5E8061]"></span>
              </span>
              <span className="text-xs font-semibold text-[#625E59]">Live</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-xl bg-white border border-[#DED8CD]" />
                ))}
              </div>
              <Skeleton className="h-96 w-full rounded-2xl bg-white border border-[#DED8CD]" />
            </div>
          ) : (
            <>
              {(activeTab === "Overview" || activeTab === "Departments") && (
                <>
                  <KPIStatsRow kpi={KPI_DATA} />
                  <ChartsSection />
                </>
              )}

              {(activeTab === "Overview" || activeTab === "Wards") && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-[#242222]">
                      Ward Performance & Accountability Roster
                    </h2>
                    <p className="text-xs text-[#625E59]">
                      Comparative turnaround and closure rate metrics across all 40 municipal wards.
                    </p>
                  </div>
                  <WardPerformanceTable data={wardData} />
                </div>
              )}

              {(activeTab === "Overview" || activeTab === "Escalations") && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-[#242222]">
                      Active SLA Escalations
                    </h2>
                    <p className="text-xs text-[#625E59]">
                      Complaints exceeding statutory resolution turnaround limits requiring immediate directorate intervention.
                    </p>
                  </div>
                  <EscalationAlerts escalations={escalations} />
                </div>
              )}

              {activeTab === "Priority Queue" && (
                <div>
                  <div className="mb-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-base font-bold text-[#242222]">AI Priority Queue</h2>
                        <p className="text-xs text-[#625E59] mt-1 max-w-lg">
                          Issues ranked by automated priority score: Severity (40pts) + Citizen Reports (20pts) + Traffic Impact (20pts) + Days Overdue (20pts). Officers should action top items first.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8B2635] bg-[#F0E5D8] border border-[#D6C2A3] px-2.5 py-1 rounded-full flex-shrink-0">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B2635] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B2635]"></span>
                        </span>
                        Smart Automation
                      </span>
                    </div>
                  </div>
                  <PriorityQueueTable issues={issues.length > 0 ? issues : []} />
                </div>
              )}

              {activeTab === "Recognition" && (
                <div>
                  <div className="mb-6 text-center max-w-xl mx-auto">
                    <h2 className="text-xl font-bold text-[#242222]">
                      Municipal Ward Hall of Excellence
                    </h2>
                    <p className="text-xs text-[#625E59] mt-1">
                      Quarterly recognition awarded to ward administrations leading Mumbai in public service responsiveness.
                    </p>
                  </div>
                  <RecognitionWall />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
