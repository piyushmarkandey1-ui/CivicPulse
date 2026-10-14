import { GradientButton } from "@/components/ui/GradientButton";
import { BlobBackground } from "@/components/ui/BlobBackground";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#242222] flex flex-col font-sora">
      <BlobBackground />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-white border border-[#DED8CD] flex items-center justify-center mb-6 shadow-sm">
          <span className="text-3xl" aria-hidden>🔍</span>
        </div>
        <h1 className="text-3xl font-bold text-[#242222] mb-3">404 — Page Not Found</h1>
        <p className="text-sm text-[#625E59] max-w-md mx-auto mb-8 leading-relaxed">
          We couldn&apos;t find the civic report or municipal resource you were looking for. It may have been relocated or archived.
        </p>
        <GradientButton href="/" size="lg">
          Return to Platform Home
        </GradientButton>
      </div>
    </div>
  );
}
