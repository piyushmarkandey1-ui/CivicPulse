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
import { Footer } from "@/components/ui/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { GradientButton } from "@/components/ui/GradientButton";

export default function ProfileClient() {
  const { user, profile, loading: authLoading } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingIssues(false);
      return;
    }

    const q = query(collection(db, "issues"), where("reporterUid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedIssues: Issue[] = [];
      snapshot.forEach((doc) => {
        fetchedIssues.push({ id: doc.id, ...doc.data() } as Issue);
      });
      // Sort by reportedAt desc
      fetchedIssues.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
      
      setIssues(fetchedIssues);
      setLoadingIssues(false);
      
      setSelectedIssue((prev) => {
        if (!prev) return null;
        return fetchedIssues.find(i => i.id === prev.id) || prev;
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpvote = () => {
    console.log("Upvoted issue", selectedIssue?.id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col pt-20 px-6 space-y-6 max-w-5xl mx-auto w-full">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  // Create a merged profile object
  const displayProfile = {
    name: profile?.name || user?.displayName || "Citizen",
    avatarSeed: user?.uid || "default",
    joinDate: profile?.joinDate || "Recently",
    totalReports: issues.length,
    reputationScore: profile?.reputationScore || 0,
    level: "Active Reporter",
    nextBadge: "Ward Guardian",
    reportsNeededForNextBadge: Math.max(0, 15 - issues.length),
    reportsForNextBadgeTotal: 15,
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col selection:bg-teal/30">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-16 space-y-12">
        {/* Header Section */}
        <ProfileHeader profile={displayProfile} />

        {/* Gamification & Badges */}
        <GamificationSection profile={displayProfile} badges={USER_BADGES} />

        {/* My Reports */}
        <section>
          <div className="mb-6">
            <h2 className="text-h2 text-white">My Reports</h2>
            <p className="text-body-sm text-slate-400 mt-1">Track the status of the civic issues you've reported.</p>
          </div>
          {loadingIssues ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
            </div>
          ) : issues.length === 0 ? (
            <EmptyState 
              title="No Reports Yet" 
              description="You haven't reported any civic issues. Spot a pothole or a broken street light? Let the city know!" 
              icon="🗺️"
              action={
                <GradientButton href="/map" size="sm">
                  Go to Live Map
                </GradientButton>
              }
            />
          ) : (
            <MyReportsGrid reports={issues} onSelectReport={setSelectedIssue} />
          )}
        </section>
      </main>

      <Footer />

      {/* Slide-in Detail Panel for selected report */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
              onClick={() => setSelectedIssue(null)}
            />
            {/* Panel container */}
            <div className="absolute right-0 top-0 h-full pointer-events-auto">
              <IssueSidePanel
                issue={selectedIssue}
                onClose={() => setSelectedIssue(null)}
                onUpvote={handleUpvote}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
