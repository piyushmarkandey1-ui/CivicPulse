import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { BlobBackground } from "@/components/ui/BlobBackground";
import { PageTransition } from "@/components/ui/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";
import { SmoothScroller } from "@/components/ui/SmoothScroller";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CivicPulse — Geospatial Infrastructure Accountability",
    template: "%s | CivicPulse",
  },
  description:
    "Report potholes, water clogging, and unsafe civic infrastructure with geotagged photos. Track government response. Score accountability publicly in real time.",
  keywords: [
    "civic issues",
    "pothole reporting",
    "infrastructure",
    "geospatial",
    "government accountability",
  ],
  openGraph: {
    title: "CivicPulse — Geospatial Infrastructure Accountability",
    description:
      "Report civic issues on a live map. Track government response. Score accountability publicly.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${sora.variable} h-full`} suppressHydrationWarning>
      <body className="h-full flex flex-col min-h-screen font-sora antialiased selection:bg-[#8B2635]/20 selection:text-[#8B2635]">
        <SmoothScroller>
          <AuthProvider>
            <BlobBackground />
            <Navbar />
            <main className="relative z-10 flex flex-col flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </AuthProvider>
        </SmoothScroller>
      </body>
    </html>
  );
}
