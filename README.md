# CivicPulse

CivicPulse is a premium, real-time geospatial civic intelligence platform. It bridges the gap between citizens and government by providing a transparent, accountable, and map-driven issue reporting system.

## Features

- **Live Geospatial Dashboard**: Interactive real-time map of civic infrastructure issues across wards. Filter by severity, category, and status.
- **Cinematic Landing Page**: Features a scroll-driven, GSAP-animated bridge reconstruction story illustrating the reporting and resolution workflow.
- **Government Dashboard**: High-level KPIs, escalation tracking, and ward leaderboards for public accountability.
- **Citizen Engagement**: Citizens can easily snap a photo, pin an issue on the map, and track its resolution in real time.
- **Premium UI/UX**: Built with a restrained, professional design system focusing on dark navy backgrounds, single teal accents, and glassmorphism elements.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion (for UI micro-interactions)
- **Animation**: GSAP & ScrollTrigger (for cinematic scroll stories)
- **Mapping**: Leaflet / React-Leaflet
- **Charts**: Recharts
- **Backend / DB**: Firebase (Authentication, Firestore, Storage)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase Account (for authentication and database)
- A Mapbox access token (optional, if using Mapbox tile layers instead of CartoDB)

### 1. Environment Setup

Create a `.env.local` file in the root of the project with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Installation

Install the project dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Ensure the Framework Preset is set to **Next.js**.
4. In the **Environment Variables** section, add all your `NEXT_PUBLIC_FIREBASE_*` variables exactly as they are in your local `.env.local` file.
5. Deploy!

## UI/UX Guidelines

- **Colors**: The background is deep navy (`#070B14`) and surfaces are `#0F1726`. The primary accent is teal (`#4FD1A5`). Semantic colors (amber, red) are strictly reserved for warnings and critical alerts.
- **Components**: The design emphasizes subtle glassmorphism (`GlassCard`) and clean, solid primary buttons (`GradientButton` without the gradient).

## Known Issues & Current Status

*A build/lint check is currently being run to verify the current health of the codebase. Any discovered issues will be documented here or addressed directly.*
