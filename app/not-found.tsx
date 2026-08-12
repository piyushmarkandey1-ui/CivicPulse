import Link from "next/link";
import { GradientButton } from "@/components/ui/GradientButton";
import { BlobBackground } from "@/components/ui/BlobBackground";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy text-slate-200 flex flex-col font-sora selection:bg-teal/30">
      <BlobBackground />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="w-24 h-24 rounded-full bg-white/[0.04] flex items-center justify-center mb-8 border border-white/[0.08] shadow-lg shadow-teal/5">
          <span className="text-4xl" aria-hidden>🔍</span>
        </div>
        <h1 className="text-h1 text-white mb-4">404 - Page Not Found</h1>
        <p className="text-body text-slate-400 max-w-md mx-auto mb-10">
          We couldn't find the page you were looking for. It might have been moved or the link might be broken.
        </p>
        <GradientButton href="/" size="lg">
          Return Home
        </GradientButton>
      </div>
    </div>
  );
}
