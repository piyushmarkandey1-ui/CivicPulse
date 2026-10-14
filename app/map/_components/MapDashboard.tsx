"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { type Issue, type Category, type Severity, type IssueStatus } from "@/lib/types";
import {
  subscribeToIssues,
  incrementUpvote,
  uploadIssuePhoto,
  insertIssue,
} from "@/lib/supabase/db";
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
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [newsFeedOpen, setNewsFeedOpen] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("report") === "true";
    }
    return false;
  });

  // Listen for global open-report-modal events (from Navbar or URL params)
  useEffect(() => {
    const handleOpenModal = () => setReportModalOpen(true);
    window.addEventListener("open-report-modal", handleOpenModal);
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
    // Optimistic local update
    setIssues((prev) =>
      prev.map((it) => (it.id === id ? { ...it, upvotes: (it.upvotes || 0) + 1 } : it))
    );
    try {
      await incrementUpvote(id);
    } catch (error) {
      console.warn("Upvote saved locally (demo mode):", error);
    }
  }, []);

  // Subscribe to real-time Supabase issue updates & merge with demo points
  useEffect(() => {
    const unsubscribe = subscribeToIssues(
      (dbIssues) => {
        // Merge: Supabase rows take precedence over mock data with same id
        const merged = [
          ...dbIssues,
          ...MOCK_ISSUES.filter((m) => !dbIssues.some((d) => d.id === m.id)),
        ];
        setIssues(merged);
        setSelectedIssue((prev) => {
          if (!prev) return null;
          return merged.find((i) => i.id === prev.id) || prev;
        });
      },
      (err) => console.warn("Supabase listener fallback to mock data:", err)
    );
    return unsubscribe;
  }, []);

  const handleNewIssueSubmit = useCallback(
    async (issue: Partial<Issue> & { photoFile?: string }) => {
      try {
        const issueId = `ISS-${Date.now()}`;
        let photoUrl = "";

        if (issue.photoFile && issue.photoFile.startsWith("data:")) {
          try {
            photoUrl = await uploadIssuePhoto(issueId, issue.photoFile);
          } catch (storageErr) {
            console.warn("Storage upload fallback:", storageErr);
            photoUrl = issue.photoFile; // keep base64 locally
          }
        } else if (issue.photoFile) {
          photoUrl = issue.photoFile;
        }

        const newIssue: Issue = {
          category: issue.category || "Other",
          severity: issue.severity || "moderate",
          address: issue.address || "Andheri East, Mumbai",
          lat: issue.lat ?? 19.09,
          lng: issue.lng ?? 72.865,
          ...issue,
          id: issueId,
          upvotes: 1,
          status: "Reported",
          title: issue.title || `${issue.category || "Infrastructure"} Issue Reported`,
          description: issue.description || "Reported by citizen via CivicPulse mobile web.",
          ward: issue.ward || "Ward 12 — Andheri East",
          reportedAt: new Date().toISOString(),
          photoUrl,
          reporterUid: user?.id || "anonymous",
        };

        // Instant local feedback
        setIssues((prev) => [newIssue, ...prev]);
        setSelectedIssue(newIssue);

        try {
          await insertIssue({ ...newIssue, photoFile: undefined });
        } catch (dbErr) {
          console.warn("Saved to local demo store (Supabase unavailable):", dbErr);
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
