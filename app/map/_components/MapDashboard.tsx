"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { type Issue, type Category, type Severity, type IssueStatus } from "@/lib/types";
import { db, storage } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";
import FilterBar from "./FilterBar";
import IssueSidePanel from "@/components/ui/IssueSidePanel";
import CollapsibleSidebar from "./CollapsibleSidebar";
import ReportModal from "./ReportModal";

// Leaflet map loaded client-only (window/document APIs)
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export type Filters = {
  category: Category | "all";
  severity: Severity | "all";
  status:   IssueStatus | "all";
};

const DEFAULT_FILTERS: Filters = { category: "all", severity: "all", status: "all" };

export default function MapDashboard() {
  const { user } = useAuth();
  const [issues, setIssues]                   = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue]     = useState<Issue | null>(null);
  const [filters, setFilters]                 = useState<Filters>(DEFAULT_FILTERS);
  const [showHeatmap, setShowHeatmap]         = useState(false);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Derived: filter issues based on chips
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filters.category !== "all" && issue.category !== filters.category) return false;
      if (filters.severity !== "all" && issue.severity !== filters.severity) return false;
      if (filters.status   !== "all" && issue.status   !== filters.status)   return false;
      return true;
    });
  }, [issues, filters]);

  const handleSelectIssue  = useCallback((issue: Issue | null) => setSelectedIssue(issue), []);
  const handleUpvote = useCallback(async (id: string) => {
    try {
      const issueRef = doc(db, "issues", id);
      await updateDoc(issueRef, { upvotes: increment(1) });
    } catch (error) {
      console.error("Error upvoting issue:", error);
    }
  }, []);

  // Listen for real-time issue updates
  useEffect(() => {
    const q = collection(db, "issues");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedIssues: Issue[] = [];
      snapshot.forEach((doc) => {
        updatedIssues.push({ id: doc.id, ...doc.data() } as Issue);
      });
      setIssues(updatedIssues);
      
      // Update selected issue if it changed
      setSelectedIssue((prev) => {
        if (!prev) return null;
        const updated = updatedIssues.find(i => i.id === prev.id);
        return updated || prev;
      });
    });

    return () => unsubscribe();
  }, []);

  const handleNewIssueSubmit = useCallback(async (issue: any) => {
    try {
      const issueId = `ISS-${Date.now()}`;
      let photoUrl = "";

      if (issue.photoFile) {
        // Upload base64 string to Firebase Storage
        const storageRef = ref(storage, `issues/${issueId}.jpg`);
        await uploadString(storageRef, issue.photoFile, "data_url");
        photoUrl = await getDownloadURL(storageRef);
      }

      const newIssue: Issue = {
        ...issue,
        id:          issueId,
        upvotes:     0,
        status:      "Reported",
        title:       issue.category + " Issue",
        reportedAt:  new Date().toISOString(),
        photoSeed:   Math.floor(Math.random() * 100), // Fallback if no photo
        photoUrl,
        reporterUid: user?.id || "anonymous",
      };

      await setDoc(doc(db, "issues", issueId), newIssue);
      setReportModalOpen(false);
    } catch (error) {
      console.error("Error submitting issue:", error);
    }
  }, [user]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Leaflet Map (base layer) ── */}
      <LeafletMap
        issues={filteredIssues}
        selectedIssue={selectedIssue}
        onSelectIssue={handleSelectIssue}
        showHeatmap={showHeatmap}
      />

      {/* ── Filter bar (top center floating) ── */}
      <FilterBar filters={filters} onChange={setFilters} issueCount={filteredIssues.length} />

      {/* ── Left collapsible sidebar ── */}
      <CollapsibleSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap((v) => !v)}
      />

      {/* ── Right issue detail panel ── */}
      <AnimatePresence>
        {selectedIssue && (
          <IssueSidePanel
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
            onUpvote={() => handleUpvote(selectedIssue.id)}
          />
        )}
      </AnimatePresence>

      {/* ── Floating report button ── */}
      <button
        id="report-issue-btn"
        aria-label="Report a new civic issue"
        onClick={() => setReportModalOpen(true)}
        className="absolute bottom-6 right-6 z-30 flex items-center justify-center h-14 w-14 rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-copper focus:ring-offset-2 focus:ring-offset-[#0D0D0C]"
        style={{
          background: "#D98B52",
          boxShadow:  "0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(217,139,82,0.2)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="#0D0D0C" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* ── New issue report modal ── */}
      <AnimatePresence>
        {reportModalOpen && (
          <ReportModal
            onClose={() => setReportModalOpen(false)}
            onSubmit={handleNewIssueSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
