"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { USER_BADGES } from "./mockProfileData";
import ProfileHeader from "./ProfileHeader";
import GamificationSection from "./GamificationSection";
import MyReportsGrid from "./MyReportsGrid";
import IssueSidePanel from "@/components/ui/IssueSidePanel";
import { type Issue } from "@/lib/types";
import { Navbar } from "@/components/ui/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToUserIssues } from "@/lib/supabase/db";
import { Skeleton } from "@/components/ui/Skeleton";
import { MOCK_ISSUES } from "@/app/map/_components/mockData";
import Link from "next/link";

export default function ProfileClient() {
  const { user, profile, loading: authLoading } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(() => !!user);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserIssues(
      user.id,
      (fetchedIssues: Issue[]) => {
        setIssues(fetchedIssues);
        setLoadingIssues(false);
        setSelectedIssue((prev) => {
          if (!prev) return null;
          return fetchedIssues.find((i) => i.id === prev.id) || prev;
        });
      },
      (error) => {
        console.warn("Supabase error fetching user reports:", error);
        setLoadingIssues(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleUpvote = () => {
    console.log("Upvoted issue", selectedIssue?.id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F4ED] flex flex-col pt-24 px-6 space-y-6 max-w-5xl mx-auto w-full">
        <Skeleton className="h-36 w-full rounded-2xl bg-white border border-[#DED8CD]" />
        <Skeleton className="h-56 w-full rounded-2xl bg-white border border-[#DED8CD]" />
        <Skeleton className="h-72 w-full rounded-2xl bg-white border border-[#DED8CD]" />
      </div>
    );
  }

  const displayProfile = {
    name: profile?.name || user?.user_metadata?.name || "Active Citizen",
    avatarSeed: user?.id || "default",
    joinDate: profile?.join_date || "Recently",
    totalReports: issues.length,
    reputationScore: profile?.reputation_score || 0,
    level: "Active Contributor",
    nextBadge: "Ward Guardian",
    reportsNeededForNextBadge: Math.max(0, 10 - issues.length),
    reportsForNextBadgeTotal: 10,
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#242222] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-24 pb-16 space-y-10">
        {/* Header Section */}
        <ProfileHeader profile={displayProfile} />

        {/* Gamification & Badges */}
        <GamificationSection profile={displayProfile} badges={USER_BADGES} />

        {/* My Reports */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#242222]">My Filed Incident Reports</h2>
              <p className="text-xs text-[#625E59]">
                Track live department assignment, escalation timers, and repair proof.
              </p>
            </div>
            <Link
              href="/map?report=true"
              className="px-3.5 py-2 rounded-lg bg-[#8B2635] hover:bg-[#641B27] text-white text-xs font-bold transition-colors shadow-xs"
            >
              + File New Report
            </Link>
          </div>

          {loadingIssues ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-56 rounded-xl bg-white border border-[#DED8CD]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {issues.length === 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3.5 rounded-xl bg-[#FAF3EF] border border-[#EAD6CE] text-xs">
                  <div className="flex items-center gap-2 text-[#8B2635]">
                    <span className="font-bold">Municipal Corridor Demo:</span>
                    <span className="text-[#625E59]">
                      Displaying active citizen reports from Durg, CG corridor with real-time department routing.
                    </span>
                  </div>
                  <Link
                    href="/map?report=true"
                    className="font-bold text-[#8B2635] hover:underline whitespace-nowrap"
                  >
                    + File Your Own Report →
                  </Link>
                </div>
              )}
              <MyReportsGrid
                reports={issues.length > 0 ? issues : MOCK_ISSUES.slice(18, 24)}
                onSelectReport={(i) => setSelectedIssue(i)}
              />
            </div>
          )}
        </section>
      </main>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedIssue && (
          <IssueSidePanel
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
            onUpvote={handleUpvote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
