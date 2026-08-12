"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BridgeSVG } from "@/components/ui/BridgeSVG";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function BridgeStory() {
  const container = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    gsap.set(".center-piece", { y: 200, opacity: 0, rotation: 10 });
    gsap.set(".railing-center", { opacity: 0, scaleX: 0 });
    gsap.set(".deck-line", { scaleX: 0.3, transformOrigin: "left center" });
    gsap.set(".light-bulb", { opacity: 0, scale: 0 });
    gsap.set(".report-2, .report-3", { opacity: 0, scale: 0 });
    gsap.set(".hotspot-ring", { opacity: 0, scale: 0, transformOrigin: "center center" });
    gsap.set(".escalation-ui", { opacity: 0, y: 30 });
    gsap.set(".escalation-glow", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(textRefs.current.slice(1), { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=4000",
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to(textRefs.current[0], { opacity: 0, y: -30, duration: 1 }, 1)
      .to(textRefs.current[1], { opacity: 1, y: 0, duration: 1 }, 1)
      .to(".report-2, .report-3", { opacity: 1, scale: 1, stagger: 0.5, duration: 2, ease: "power2.out" }, 1)
      .to(textRefs.current[1], { opacity: 0, y: -30, duration: 1 }, 4)
      .to(textRefs.current[2], { opacity: 1, y: 0, duration: 1 }, 4)
      .to(".report-1, .report-2, .report-3", { x: (i) => (i === 0 ? 0 : i === 1 ? 100 : -80), duration: 2, ease: "power2.inOut" }, 4)
      .to(".hotspot-ring", { opacity: 0.5, scale: 1, duration: 1.5, ease: "power2.out" }, 5)
      .to(".center-piece.piece-1, .center-piece.piece-5", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 5)
      .to(textRefs.current[2], { opacity: 0, y: -30, duration: 1 }, 8)
      .to(textRefs.current[3], { opacity: 1, y: 0, duration: 1 }, 8)
      .to(".escalation-ui", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 8)
      .to(".escalation-glow", { scaleX: 1, duration: 2, ease: "linear" }, 9)
      .to(".center-piece.piece-2, .center-piece.piece-4", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 9)
      .to(textRefs.current[3], { opacity: 0, y: -30, duration: 1 }, 12)
      .to(".escalation-ui", { opacity: 0, duration: 0.5 }, 12)
      .to(textRefs.current[4], { opacity: 1, y: 0, duration: 1 }, 13)
      .to(".center-piece.piece-3", { y: 0, opacity: 1, rotation: 0, duration: 2.5, ease: "power2.out" }, 12.5)
      .to(".deck-line", { scaleX: 1, duration: 2, ease: "power2.inOut" }, 13)
      .to(".railing-center", { opacity: 1, scaleX: 1, duration: 1.5, ease: "power2.out" }, 14)
      .to(".report, .hotspot-ring", { opacity: 0, scale: 0, duration: 1 }, 14)
      .to(".light-bulb", { opacity: 1, scale: 1, stagger: 0.1, duration: 1, ease: "power2.out" }, 15)
      .to(".story-bg", { backgroundColor: "rgba(37, 99, 235, 0.04)", duration: 2 }, 15)
      .to({}, { duration: 3 });
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full h-screen overflow-hidden bg-gray-soft story-bg border-y border-gray-border">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at center, rgba(37,99,235,0.06) 0%, transparent 70%)" }}
      />

      <div className="absolute top-24 inset-x-0 z-20 flex flex-col items-center text-center pointer-events-none px-4">
        <h2 className="text-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">The CivicPulse Story</h2>
        <div className="relative w-full max-w-2xl h-32 flex justify-center">
          <div ref={(el) => { textRefs.current[0] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-gray-dark mb-2">SPOT</h3>
            <p className="text-xl text-gray-mid">Every problem starts somewhere.</p>
          </div>
          <div ref={(el) => { textRefs.current[1] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-gray-dark mb-2">REPORT</h3>
            <p className="text-xl text-gray-mid">Citizens make the problem visible.</p>
          </div>
          <div ref={(el) => { textRefs.current[2] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-gray-dark mb-2">PATTERN</h3>
            <p className="text-xl text-gray-mid">Individual reports reveal systemic problems.</p>
          </div>
          <div ref={(el) => { textRefs.current[3] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-blue mb-2">ACCOUNTABILITY</h3>
            <p className="text-xl text-gray-mid">Ignored issues escalate.</p>
          </div>
          <div ref={(el) => { textRefs.current[4] = el; }} className="absolute w-full">
            <h3 className="text-h2 text-green mb-2">VERIFIED RESOLUTION</h3>
            <p className="text-xl text-gray-dark">Together, we rebuild.</p>
          </div>
        </div>
      </div>

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20 escalation-ui pointer-events-none flex items-center gap-4">
        <div className="px-4 py-2 surface rounded-md text-xs font-semibold text-gray-dark">Ward Authority</div>
        <div className="w-16 h-px bg-gray-border relative">
          <div className="absolute inset-0 bg-blue escalation-glow" />
        </div>
        <div className="px-4 py-2 surface rounded-md text-xs font-semibold text-gray-dark">Department</div>
        <div className="w-16 h-px bg-gray-border relative">
          <div className="absolute inset-0 bg-blue escalation-glow" />
        </div>
        <div className="px-4 py-2 surface rounded-md border border-blue/30 text-xs font-semibold text-blue-dark">Senior Authority</div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pt-32">
        <BridgeSVG className="w-full max-w-[1400px] h-auto" />
      </div>
    </section>
  );
}
