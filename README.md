# CivicPulse — Geospatial Infrastructure Accountability Platform

**CivicPulse** is a modern, real-time geospatial civic intelligence platform bridging citizens and municipal authorities. It provides transparent issue reporting, statutory SLA tracking, and visual resolution verification across city wards.

---

## 🌟 Key Portals & Features

### 👤 Citizen Portal
- **Geospatial Reporting**: Pin issues (potholes, waterlogging, streetlights, garbage) directly on an interactive GIS map.
- **Photo Upload & Geotagging**: Attach photos and precise location data to issue reports.
- **Track Status**: Real-time progress updates from submission to verified resolution.

### 🛡️ Government Command & SLA Triage Center (`/gov-dashboard`)
- **Municipal Command Center**: Dedicated officer portal with sidebar navigation and zero clutter.
- **Live KPIs & Telemetry**: Track Resolution Rate (%), Avg Turnaround (days), Active Backlog, and Citizen Trust Score in real time.
- **SLA Escalation Alerts**: Automated warnings for complaints exceeding statutory turnaround limits.
- **Ward Performance Roster**: Comparative metrics across all 40 municipal wards.
- **Verified Field Resolutions**: Interactive before/after repair photo sliders demonstrating completed repairs.
- **Ward Hall of Excellence**: Leaderboard celebrating top-performing municipal wards.

---

## 🔑 Access & Authentication

- **Citizen Sign In / Up**: Open registration via `/login` and `/signup`.
- **Official Officer Onboarding**: Restricted access via `/gov-signup` and `/gov-login`.
  - **Department Invite Code**: Requires official invite code (`civic2025gov` for demo, configurable via `NEXT_PUBLIC_GOV_INVITE_CODE`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Mapping**: Leaflet / React-Leaflet GIS Radar
- **Backend / Database**: Supabase & Firebase Firestore (Realtime sync)
- **Charts**: Recharts

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
git clone https://github.com/piyushmarkandey1-ui/CivicPulse.git
cd CivicPulse
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Key Terminology (Cheat Sheet for Presentation)

- **SLA (Service Level Agreement)**: Statutory deadline promised by municipal authorities to resolve reported issues.
- **Triage**: Categorizing and prioritizing complaints based on severity and SLA overdue status.
- **GIS Radar**: Interactive geospatial map overlay showing geotagged issue pins.
- **Verified Field Resolution**: Photographic proof (Before/After) uploaded by field engineering crews upon completing repairs.

