"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BridgeSVG } from "@/components/ui/BridgeSVG";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function BridgeStory() {
  const container = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // 1. Initial State Setup
    gsap.set(".center-piece", { y: 200, opacity: 0, rotation: 10 });
    gsap.set(".railing-center", { opacity: 0, scaleX: 0 });
    gsap.set(".deck-line", { scaleX: 0.3, transformOrigin: "left center" });
    gsap.set(".light-bulb", { opacity: 0, scale: 0 });
    gsap.set(".report-2, .report-3", { opacity: 0, scale: 0 });
    gsap.set(".hotspot-ring", { opacity: 0, scale: 0, transformOrigin: "center center" });
    gsap.set(".escalation-ui", { opacity: 0, y: 30 });
    gsap.set(".escalation-glow", { scaleX: 0, transformOrigin: "left center" });
    
    // Hide all text except first
    gsap.set(textRefs.current.slice(1), { opacity: 0, y: 30 });

    // 2. Master Timeline controlled by scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=4000", // 4000px of scrolling
        scrub: 1.2, // Smooth scrubbing
        pin: true,
        anticipatePin: 1,
      },
    });

    // --- STAGE 1 (0-20%) -> STAGE 2: REPORT ---
    tl.to(textRefs.current[0], { opacity: 0, y: -30, duration: 1 }, 1)
      .to(textRefs.current[1], { opacity: 1, y: 0, duration: 1 }, 1)
      .to(".report-2, .report-3", { opacity: 1, scale: 1, stagger: 0.5, duration: 2, ease: "back.out(1.5)" }, 1)
      
    // --- STAGE 2 (20-40%) -> STAGE 3: PATTERN ---
      .to(textRefs.current[1], { opacity: 0, y: -30, duration: 1 }, 4)
      .to(textRefs.current[2], { opacity: 1, y: 0, duration: 1 }, 4)
      .to(".report-1, .report-2, .report-3", { x: (i) => i === 0 ? 0 : i === 1 ? 100 : -80, duration: 2, ease: "power2.inOut" }, 4)
      .to(".hotspot-ring", { opacity: 0.5, scale: 1, duration: 1.5, ease: "power2.out" }, 5)
      // Bridge starts assembling slowly
      .to(".center-piece.piece-1, .center-piece.piece-5", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 5)

    // --- STAGE 3 (40-60%) -> STAGE 4: ACCOUNTABILITY ---
      .to(textRefs.current[2], { opacity: 0, y: -30, duration: 1 }, 8)
      .to(textRefs.current[3], { opacity: 1, y: 0, duration: 1 }, 8)
      .to(".escalation-ui", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 8)
      .to(".escalation-glow", { scaleX: 1, duration: 2, ease: "linear" }, 9)
      // Bridge continues assembling
      .to(".center-piece.piece-2, .center-piece.piece-4", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 9)

    // --- STAGE 4 (60-90%) -> STAGE 5: VERIFIED RESOLUTION ---
      .to(textRefs.current[3], { opacity: 0, y: -30, duration: 1 }, 12)
      .to(".escalation-ui", { opacity: 0, duration: 0.5 }, 12)
      .to(textRefs.current[4], { opacity: 1, y: 0, duration: 1 }, 13)
      // Final bridge piece connects (heavy)
      .to(".center-piece.piece-3", { y: 0, opacity: 1, rotation: 0, duration: 2.5, ease: "bounce.out" }, 12.5)
      // Deck completes
      .to(".deck-line", { scaleX: 1, duration: 2, ease: "power2.inOut" }, 13)
      // Railing restores
      .to(".railing-center", { opacity: 1, scaleX: 1, duration: 1.5, ease: "power2.out" }, 14)
      // Remove reports
      .to(".report, .hotspot-ring", { opacity: 0, scale: 0, duration: 1 }, 14)
      // Lights turn on progressively
      .to(".light-bulb", { opacity: 1, scale: 1, stagger: 0.1, duration: 1, ease: "back.out(2)" }, 15)
      // Environment brightens
      .to(".story-bg", { backgroundColor: "rgba(20, 184, 166, 0.03)", duration: 2 }, 15)
      
      // Hold for a moment at 100%
      .to({}, { duration: 3 });

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full h-screen overflow-hidden bg-navy story-bg">
      {/* Background layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, #1E293B 0%, transparent 70%)" }} />

      {/* Title / Story Overlay */}
      <div className="absolute top-24 inset-x-0 z-20 flex flex-col items-center text-center pointer-events-none px-4">
        <h2 className="text-teal text-sm font-bold tracking-[0.2em] uppercase mb-4">The CivicPulse Story</h2>
        <div className="relative w-full max-w-2xl h-32 flex justify-center">
          
          <div ref={(el) => { textRefs.current[0] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-white mb-2">SPOT</h3>
            <p className="text-xl text-slate-400">Every problem starts somewhere.</p>
          </div>
          
          <div ref={(el) => { textRefs.current[1] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-white mb-2">REPORT</h3>
            <p className="text-xl text-slate-400">Citizens make the problem visible.</p>
          </div>
          
          <div ref={(el) => { textRefs.current[2] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-white mb-2">PATTERN</h3>
            <p className="text-xl text-slate-400">Individual reports reveal systemic problems.</p>
          </div>

          <div ref={(el) => { textRefs.current[3] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-amber-500 mb-2">ACCOUNTABILITY</h3>
            <p className="text-xl text-slate-400">Ignored issues escalate.</p>
          </div>

          <div ref={(el) => { textRefs.current[4] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-teal-light mb-2">VERIFIED RESOLUTION</h3>
            <p className="text-xl text-slate-300">Together, we rebuild.</p>
          </div>

        </div>
      </div>

      {/* Escalation UI Overlay */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20 escalation-ui pointer-events-none flex items-center gap-4">
        <div className="px-4 py-2 glass rounded-lg border border-white/10 text-xs font-semibold text-slate-300">Ward Authority</div>
        <div className="w-16 h-px bg-white/20 relative">
          <div className="absolute inset-0 bg-amber-500 escalation-glow shadow-[0_0_10px_#F59E0B]" />
        </div>
        <div className="px-4 py-2 glass rounded-lg border border-white/10 text-xs font-semibold text-slate-300">Department</div>
        <div className="w-16 h-px bg-white/20 relative">
          <div className="absolute inset-0 bg-amber-500 escalation-glow shadow-[0_0_10px_#F59E0B]" />
        </div>
        <div className="px-4 py-2 glass rounded-lg border border-amber-500/30 text-xs font-semibold text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">Senior Authority</div>
      </div>

      {/* The Bridge */}
      <div className="absolute inset-0 flex items-center justify-center pt-32">
        <BridgeSVG className="w-full max-w-[1400px] h-auto drop-shadow-2xl" />
      </div>

    </section>
  );
}
