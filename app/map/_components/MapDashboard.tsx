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
import CivicNewsFeed from "./CivicNewsFeed";
import ReportModal from "./ReportModal";
import { MOCK_ISSUES } from "./mockData";

// Leaflet map loaded client-only (window/document APIs)
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export type Filters = {
  category: Category | "all";
  severity: Severity | "all";
  status: IssueStatus | "all";
};

const DEFAULT_FILTERS: Filters = { category: "all", severity: "all", status: "all" };

export default function MapDashboard() {
  const { user, role } = useAuth();
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [newsFeedOpen, setNewsFeedOpen] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Listen for global open-report-modal events (from Navbar or URL params)
  useEffect(() => {
    const handleOpenModal = () => setReportModalOpen(true);
    window.addEventListener("open-report-modal", handleOpenModal);

    // Check if ?report=true is in URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("report") === "true") {
        setReportModalOpen(true);
      }
    }

    return () => window.removeEventListener("open-report-modal", handleOpenModal);
  }, []);

  // Derived: filter issues based on chips
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filters.category !== "all" && issue.category !== filters.category) return false;
      if (filters.severity !== "all" && issue.severity !== filters.severity) return false;
      if (filters.status !== "all" && issue.status !== filters.status) return false;
      return true;
    });
  }, [issues, filters]);

  const handleSelectIssue = useCallback((issue: Issue | null) => setSelectedIssue(issue), []);

  const handleUpvote = useCallback(async (id: string) => {
    try {
      // Optimistic local update
      setIssues((prev) =>
        prev.map((it) => (it.id === id ? { ...it, upvotes: (it.upvotes || 0) + 1 } : it))
      );
      const issueRef = doc(db, "issues", id);
      await updateDoc(issueRef, { upvotes: increment(1) });
    } catch (error) {
      console.warn("Upvote saved locally (demo mode):", error);
    }
  }, []);

  // Listen for real-time Firestore issue updates & merge with demo points
  useEffect(() => {
    try {
      const q = collection(db, "issues");
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const dbIssues: Issue[] = [];
          snapshot.forEach((docSnap) => {
            dbIssues.push({ id: docSnap.id, ...docSnap.data() } as Issue);
          });

          // Merge db issues with mock issues so demo map is always rich
          const merged = [
            ...dbIssues,
            ...MOCK_ISSUES.filter((m) => !dbIssues.some((d) => d.id === m.id)),
          ];
          setIssues(merged);

          // Update selected issue if it changed
          setSelectedIssue((prev) => {
            if (!prev) return null;
            const updated = merged.find((i) => i.id === prev.id);
            return updated || prev;
          });
        },
        (err) => {
          console.warn("Firestore listener fallback to mock data:", err);
          setIssues(MOCK_ISSUES);
        }
      );

      return () => unsubscribe();
    } catch {
      setIssues(MOCK_ISSUES);
    }
  }, []);

  const handleNewIssueSubmit = useCallback(
    async (issue: any) => {
      try {
        const issueId = `ISS-${Date.now()}`;
        let photoUrl = "";

        if (issue.photoFile && issue.photoFile.startsWith("data:")) {
          try {
            const storageRef = ref(storage, `issues/${issueId}.jpg`);
            await uploadString(storageRef, issue.photoFile, "data_url");
            photoUrl = await getDownloadURL(storageRef);
          } catch (storageErr) {
            console.warn("Storage upload fallback:", storageErr);
            photoUrl = issue.photoFile;
          }
        } else if (issue.photoFile) {
          photoUrl = issue.photoFile;
        }

        const newIssue: Issue = {
          ...issue,
          id: issueId,
          upvotes: 1,
          status: "Reported",
          title: issue.title || `${issue.category} Issue Reported`,
          description: issue.description || "Reported by citizen via CivicPulse mobile web.",
          ward: issue.ward || "Ward 12 — Andheri East",
          reportedAt: new Date().toISOString(),
          photoSeed: Math.floor(Math.random() * 100),
          photoUrl,
          reporterUid: user?.id || "anonymous",
        };

        // Prepend to local state immediately for instant feedback
        setIssues((prev) => [newIssue, ...prev]);
        setSelectedIssue(newIssue);

        try {
          await setDoc(doc(db, "issues", issueId), newIssue);
        } catch (dbErr) {
          console.warn("Saved to local demo store:", dbErr);
        }

        setReportModalOpen(false);
      } catch (error) {
        console.error("Error submitting issue:", error);
      }
    },
    [user]
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Leaflet Map (base layer) ── */}
      <LeafletMap
        issues={filteredIssues}
        selectedIssue={selectedIssue}
        onSelectIssue={handleSelectIssue}
        showHeatmap={showHeatmap}
      />

      {/* ── Filter bar (top center floating) with Report Issue button ── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        issueCount={filteredIssues.length}
        onOpenReportModal={() => setReportModalOpen(true)}
      />

      {/* ── Left Live Civic Pulse News & Critical Issues Bulletin ── */}
      <CivicNewsFeed
        issues={filteredIssues}
        selectedIssue={selectedIssue}
        onSelectIssue={handleSelectIssue}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap((v) => !v)}
        isOpen={newsFeedOpen}
        onToggle={() => setNewsFeedOpen((v) => !v)}
        onOpenReportModal={() => setReportModalOpen(true)}
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
