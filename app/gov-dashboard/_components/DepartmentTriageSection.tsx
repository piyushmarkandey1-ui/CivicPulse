"use client";

import { useState, useMemo } from "react";
import { type Issue, type City, type IssueStatus } from "@/lib/types";
import { MUNICIPAL_DEPARTMENTS } from "@/components/ui/IssueProgressModal";
import IssueProgressModal from "@/components/ui/IssueProgressModal";
import { cn } from "@/lib/utils";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  ArrowUpDown,
  Send,
  MapPin,
  Sparkles,
  Layers,
} from "lucide-react";

interface DepartmentTriageSectionProps {
  issues: Issue[];
  onUpdateIssue: (id: string, updates: Partial<Issue>) => Promise<void> | void;
}

export default function DepartmentTriageSection({
  issues,
  onUpdateIssue,
}: DepartmentTriageSectionProps) {
  const [selectedCity, setSelectedCity] = useState<City | "all">("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  // Filtered issues
  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      // City
      if (selectedCity !== "all") {
        const issueCity =
          issue.city ||
          (issue.address?.includes("Durg") ||
          issue.ward?.includes("Durg") ||
          (issue.lat > 20 && issue.lat < 22)
            ? "Durg"
            : "Mumbai");
        if (issueCity !== selectedCity) return false;
      }

      // Department
      if (selectedDept !== "all") {
        if (selectedDept === "unassigned") {
          if (issue.assignedDepartment) return false;
        } else if (issue.assignedDepartment !== selectedDept) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && issue.status !== statusFilter) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = issue.id.toLowerCase().includes(q);
        const matchesTitle = issue.title.toLowerCase().includes(q);
        const matchesWard = issue.ward.toLowerCase().includes(q);
        const matchesDept = (issue.assignedDepartment || "").toLowerCase().includes(q);
        const matchesOfficer = (issue.assignedOfficer || "").toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesWard && !matchesDept && !matchesOfficer) {
          return false;
        }
      }

      return true;
    });
  }, [issues, selectedCity, selectedDept, statusFilter, searchQuery]);

  // Statistics
  const durgCount = issues.filter(
    (i) =>
      i.city === "Durg" ||
      i.address?.includes("Durg") ||
      i.ward?.includes("Durg") ||
      (i.lat > 20 && i.lat < 22)
  ).length;

  const mumbaiCount = issues.filter(
    (i) =>
      i.city === "Mumbai" ||
      (!i.address?.includes("Durg") &&
        !i.ward?.includes("Durg") &&
        !(i.lat > 20 && i.lat < 22))
  ).length;

  const unassignedCount = issues.filter((i) => !i.assignedDepartment && i.status !== "Resolved").length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress").length;

  const handleModalUpdate = async (updates: Partial<Issue>) => {
    if (!activeIssue) return;
    await onUpdateIssue(activeIssue.id, updates);
    setActiveIssue((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <div className="space-y-6">
      {/* Header and Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF3EF] text-[#8B2635] border border-[#EAD6CE]">
              <Building2 className="w-3 h-3" />
              Administrative Routing
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#242222] tracking-tight">
            Municipal Department Routing &amp; SLA Dispatch
          </h2>
          <p className="text-xs text-[#625E59] max-w-2xl mt-0.5">
            Route incoming citizen reports to operational directorates across Durg, CG and Mumbai, allocate executive engineers, issue SLA directives, and track resolution timelines.
          </p>
        </div>
      </div>

      {/* Metric Capsule Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#DED8CD] shadow-2xs">
          <p className="text-[10px] font-bold text-[#88827A] uppercase tracking-wider">
            Total Triage Queue
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-[#242222]">{issues.length}</span>
            <span className="text-[11px] text-[#625E59]">Across corridors</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#DED8CD] shadow-2xs">
          <p className="text-[10px] font-bold text-[#8B2635] uppercase tracking-wider">
            Durg, CG Telemetry
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-[#8B2635]">{durgCount}</span>
            <span className="text-[11px] text-[#625E59]">Municipal points</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#DED8CD] shadow-2xs">
          <p className="text-[10px] font-bold text-[#3F6B4C] uppercase tracking-wider">
            Mumbai Telemetry
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-[#3F6B4C]">{mumbaiCount}</span>
            <span className="text-[11px] text-[#625E59]">BMC points</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#DED8CD] shadow-2xs">
          <p className="text-[10px] font-bold text-[#B07525] uppercase tracking-wider">
            Pending Routing
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-[#B07525]">{unassignedCount}</span>
            <span className="text-[11px] text-[#625E59]">Awaiting department</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DED8CD] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* City Toggle */}
          <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-xl border border-[#E2DACE] w-fit">
            <button
              type="button"
              onClick={() => setSelectedCity("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                selectedCity === "all"
                  ? "bg-white text-[#242222] shadow-2xs"
                  : "text-[#625E59] hover:text-[#242222]"
              )}
            >
              All Cities ({issues.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity("Durg")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                selectedCity === "Durg"
                  ? "bg-[#8B2635] text-white shadow-2xs"
                  : "text-[#625E59] hover:text-[#8B2635]"
              )}
            >
              <span>Durg, CG</span>
              <span className="text-[10px] opacity-80 font-mono">({durgCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity("Mumbai")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                selectedCity === "Mumbai"
                  ? "bg-[#8B2635] text-white shadow-2xs"
                  : "text-[#625E59] hover:text-[#8B2635]"
              )}
            >
              <span>Mumbai</span>
              <span className="text-[10px] opacity-80 font-mono">({mumbaiCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#88827A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Issue ID, Ward, Department, or Officer..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DED8CD] bg-[#FDFBF7] text-[#242222] focus:outline-none focus:border-[#8B2635] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Filter dropdowns row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0EBE1] text-xs">
          <span className="text-[#88827A] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </span>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#DED8CD] bg-[#FDFBF7] text-[#242222] font-medium text-xs focus:outline-none focus:border-[#8B2635] cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="unassigned">Awaiting Routing (Unassigned)</option>
            {MUNICIPAL_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#DED8CD] bg-[#FDFBF7] text-[#242222] font-medium text-xs focus:outline-none focus:border-[#8B2635] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Verified">Verified</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {(selectedDept !== "all" || statusFilter !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedDept("all");
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#8B2635] hover:bg-[#FAF3EF] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}

          <span className="ml-auto text-[11px] font-mono text-[#88827A]">
            Showing {filtered.length} of {issues.length} tickets
          </span>
        </div>
      </div>

      {/* Main Operational Table */}
      <div className="bg-white rounded-2xl border border-[#DED8CD] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D8] bg-[#FDFBF7] text-[10px] font-bold text-[#88827A] uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket Ref &amp; City</th>
                <th className="py-3.5 px-4">Issue Summary &amp; Ward</th>
                <th className="py-3.5 px-4">AI Triage Score</th>
                <th className="py-3.5 px-4">Target Department</th>
                <th className="py-3.5 px-4">Officer Assigned</th>
                <th className="py-3.5 px-4">Lifecycle Stage</th>
                <th className="py-3.5 px-4 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEAE1] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#88827A]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Layers className="w-8 h-8 mx-auto text-[#C9C0B3]" />
                      <p className="font-semibold text-sm text-[#242222]">No matching incidents</p>
                      <p className="text-xs">Adjust your city, department or keyword filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((issue) => {
                  const isDurg =
                    issue.city === "Durg" ||
                    issue.address?.includes("Durg") ||
                    issue.ward?.includes("Durg") ||
                    (issue.lat > 20 && issue.lat < 22);

                  const stageNum =
                    issue.status === "Resolved"
                      ? "05"
                      : issue.status === "In Progress"
                      ? "04"
                      : issue.assignedDepartment
                      ? "03"
                      : issue.priorityScore !== undefined
                      ? "02"
                      : "01";

                  return (
                    <tr
                      key={issue.id}
                      className="hover:bg-[#FAF8F3] transition-colors group"
                    >
                      {/* Ticket Ref & City */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono font-bold text-[#8B2635] text-[11px]">
                            {issue.id}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold w-fit border",
                              isDurg
                                ? "bg-[#FAF3EF] text-[#8B2635] border-[#EAD6CE]"
                                : "bg-[#EFF3F6] text-[#2D546B] border-[#D0DFE7]"
                            )}
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            {isDurg ? "Durg, CG" : "Mumbai"}
                          </span>
                        </div>
                      </td>

                      {/* Issue Summary & Ward */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-[#242222] truncate leading-snug">
                          {issue.title}
                        </p>
                        <p className="text-[11px] text-[#625E59] truncate mt-0.5">
                          {issue.ward} • {issue.address}
                        </p>
                      </td>

                      {/* AI Triage Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-mono font-bold px-2 py-0.5 rounded-md text-[11px] border",
                              (issue.priorityScore ?? 75) >= 80
                                ? "bg-[#FAF3EF] text-[#8B2635] border-[#EAD6CE]"
                                : "bg-[#FDF6EA] text-[#B07525] border-[#EEDBBE]"
                            )}
                          >
                            {issue.priorityScore ?? 75}/100
                          </span>
                          <span className="text-[10px] text-[#88827A] uppercase font-bold">
                            {issue.severity}
                          </span>
                        </div>
                      </td>

                      {/* Target Department */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {issue.assignedDepartment ? (
                          <div className="flex items-start gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#8B2635] mt-0.5 flex-shrink-0" />
                            <span className="font-medium text-[#242222] leading-tight line-clamp-2">
                              {issue.assignedDepartment}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF5E6] text-[#C58B32] border border-[#F3DFC1]">
                            <AlertTriangle className="w-3 h-3" />
                            Awaiting Allocation
                          </span>
                        )}
                      </td>

                      {/* Officer Assigned */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {issue.assignedOfficer ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#242222]">
                            <UserCheck className="w-3 h-3 text-[#3F6B4C]" />
                            <span className="font-medium">{issue.assignedOfficer}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#88827A] italic">Unassigned</span>
                        )}
                      </td>

                      {/* Lifecycle Stage */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                            issue.status === "Resolved"
                              ? "bg-[#EBF0EC] text-[#3F6B4C] border-[#C2D9C6]"
                              : issue.status === "In Progress"
                              ? "bg-[#FEF6E9] text-[#B07525] border-[#EBD8AE]"
                              : issue.assignedDepartment
                              ? "bg-[#FAF3EF] text-[#8B2635] border-[#EAD6CE]"
                              : "bg-white text-[#625E59] border-[#DED8CD]"
                          )}
                        >
                          <span className="font-mono">S{stageNum}:</span>
                          <span>
                            {issue.status === "Resolved"
                              ? "Resolved"
                              : issue.status === "In Progress"
                              ? "In Progress"
                              : issue.assignedDepartment
                              ? "Assigned"
                              : "Triaged"}
                          </span>
                        </span>
                      </td>

                      {/* Dispatch Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setActiveIssue(issue)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B2635] hover:bg-[#641B27] text-white text-xs font-bold transition-all shadow-xs cursor-pointer group-hover:scale-[1.02]"
                        >
                          <span>Assign / Dispatch</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Stage Officer Dispatch & Lifecycle Modal */}
      {activeIssue && (
        <IssueProgressModal
          issue={activeIssue}
          isOpen={!!activeIssue}
          onClose={() => setActiveIssue(null)}
          isOfficer={true}
          onUpdateIssue={handleModalUpdate}
        />
      )}
    </div>
  );
}
