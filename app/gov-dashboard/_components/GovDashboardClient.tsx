"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import KPIStatsRow from "./KPIStatsRow";
import ChartsSection from "./ChartsSection";
import WardPerformanceTable from "./WardPerformanceTable";
import EscalationAlerts from "./EscalationAlerts";
import BeforeAfterSlider from "./BeforeAfterSlider";
import RecognitionWall from "./RecognitionWall";
import { WARD_DATA, ESCALATIONS, KPI_DATA as MOCK_KPI, BEFORE_AFTER_EXAMPLES } from "./mockData";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { type Issue } from "@/lib/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export type TabType = "Overview" | "Departments" | "Wards" | "Escalations" | "Recognition";

export default function GovDashboardClient() {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "issues"), (snapshot) => {
      const fetched: Issue[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Issue);
      });
      setIssues(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Compute live KPIs
  const resolvedCount = issues.filter(i => i.status === "Resolved").length;
  const pendingCount = issues.filter(i => i.status !== "Resolved").length;
  const resolutionRate = issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0;

  const KPI_DATA = {
    resolutionRate: issues.length > 0 ? resolutionRate : MOCK_KPI.resolutionRate,
    avgResponseTime: MOCK_KPI.avgResponseTime, // complex to compute without resolution timestamps
    pendingEscalations: issues.length > 0 ? pendingCount : MOCK_KPI.pendingEscalations,
    trustScore: MOCK_KPI.trustScore,
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex overflow-hidden selection:bg-copper/30">
      {/* Sidebar Navigation */}
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-6 py-8 md:px-10 scrollbar-none">
        
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-h2 text-white">Government Dashboard</h1>
            <p className="text-body-sm text-slate-400 mt-1">Live tracking and accountability for civic operations.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-copper opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-copper"></span>
              </span>
              <span className="text-xs font-semibold text-text-secondary">Live Data Sync</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content based on Tab */}
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
          
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
              </div>
              <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
          ) : (
            <>
              {(activeTab === "Overview" || activeTab === "Departments") && (
                <>
                  <KPIStatsRow kpi={KPI_DATA} />
                  <ChartsSection />
                </>
              )}
            </>
          )}

          {(activeTab === "Overview" || activeTab === "Wards") && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-h3 text-white">Ward Performance</h2>
              </div>
              <WardPerformanceTable data={WARD_DATA} />
            </section>
          )}

          {(activeTab === "Overview" || activeTab === "Escalations") && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section>
                <h2 className="text-h3 text-white mb-5">Escalation Alerts</h2>
                <EscalationAlerts escalations={ESCALATIONS} />
              </section>
              
              <section>
                <h2 className="text-h3 text-white mb-5">Resolved Spotlights</h2>
                <div className="space-y-6">
                  {BEFORE_AFTER_EXAMPLES.map((example) => (
                    <BeforeAfterSlider key={example.id} data={example} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {(activeTab === "Overview" || activeTab === "Recognition") && (
            <section>
              <div className="mb-5 text-center">
                <h2 className="text-h2 text-white">Recognition Wall</h2>
                <p className="text-body-sm text-slate-400 mt-1">Celebrating top performing wards and rapid resolutions this month.</p>
              </div>
              <RecognitionWall />
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
