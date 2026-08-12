"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BridgeSVG } from "@/components/ui/BridgeSVG";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const STAGES = [
  {
    label: "SPOT THE ISSUE",
    copy: "Every problem starts somewhere.",
  },
  {
    label: "REPORT",
    copy: "Citizens make the problem visible.",
  },
  {
    label: "PATTERN",
    copy: "Individual reports reveal systemic failures.",
  },
  {
    label: "ACCOUNTABILITY",
    copy: "Ignored issues escalate.",
    warning: true,
  },
  {
    label: "RESOLUTION",
    copy: "Together, we rebuild.",
    resolved: true,
  },
];

export function BridgeStory() {
  const container = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // Initial states — bridge is broken
      gsap.set(".center-piece", { y: 220, opacity: 0, rotation: 8 });
      gsap.set(".railing-center", { opacity: 0, scaleX: 0, transformOrigin: "left center" });
      gsap.set(".deck-line", { scaleX: 0.28, transformOrigin: "left center" });
      gsap.set(".light-bulb", { opacity: 0, scale: 0 });
      gsap.set(".report-2, .report-3", { opacity: 0, scale: 0 });
      gsap.set(".hotspot-ring", { opacity: 0, scale: 0, transformOrigin: "center center" });
      gsap.set(".escalation-ui", { opacity: 0, y: 24 });
      gsap.set(".escalation-glow", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(textRefs.current.slice(1), { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=4000",
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Stage 0 → 1: REPORT
      tl.to(textRefs.current[0], { opacity: 0, y: -20, duration: 0.8 }, 1)
        .to(textRefs.current[1], { opacity: 1, y: 0, duration: 0.8 }, 1)
        .to(".report-2, .report-3", { opacity: 1, scale: 1, stagger: 0.6, duration: 1.5, ease: "power2.out" }, 1.2)

      // Stage 1 → 2: PATTERN
        .to(textRefs.current[1], { opacity: 0, y: -20, duration: 0.8 }, 4)
        .to(textRefs.current[2], { opacity: 1, y: 0, duration: 0.8 }, 4)
        .to(".report-1, .report-2, .report-3", { x: (i) => i === 0 ? 0 : i === 1 ? 80 : -60, duration: 1.8, ease: "power2.inOut" }, 4.2)
        .to(".hotspot-ring", { opacity: 0.35, scale: 1, duration: 1.2, ease: "power2.out" }, 5)
        // Bridge: outer pieces settle first (heavy structural)
        .to(".center-piece.piece-1, .center-piece.piece-5", { y: 0, opacity: 1, rotation: 0, duration: 2.2, ease: "power3.out" }, 5.2)

      // Stage 2 → 3: ACCOUNTABILITY
        .to(textRefs.current[2], { opacity: 0, y: -20, duration: 0.8 }, 8)
        .to(textRefs.current[3], { opacity: 1, y: 0, duration: 0.8 }, 8)
        .to(".escalation-ui", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 8.3)
        .to(".escalation-glow", { scaleX: 1, duration: 2.5, ease: "power1.inOut" }, 9)
        // Next bridge pieces — slightly delayed (stagger the feel)
        .to(".center-piece.piece-2", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 9.4)
        .to(".center-piece.piece-4", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 9.8)

      // Stage 3 → 4: RESOLUTION
        .to(textRefs.current[3], { opacity: 0, y: -20, duration: 0.8 }, 12)
        .to(".escalation-ui", { opacity: 0, duration: 0.5 }, 12)
        .to(textRefs.current[4], { opacity: 1, y: 0, duration: 0.8 }, 12.8)
        // Keystone — drops with weight
        .to(".center-piece.piece-3", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 12.5)
        // Road deck connects
        .to(".deck-line", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 13.5)
        // Railings follow structure (lighter, faster)
        .to(".railing-center", { opacity: 1, scaleX: 1, duration: 1.2, ease: "power2.out" }, 14.2)
        // Reports dissolve
        .to(".report, .hotspot-ring", { opacity: 0, scale: 0, duration: 0.8 }, 14)
        // Lights: left to right, quick succession
        .to(".light-bulb", { opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: "power2.out" }, 15)
        // Ambient environment tint — very subtle
        .to(".bridge-story-bg", { backgroundColor: "rgba(79,209,165,0.025)", duration: 2 }, 15)

        // Hold
        .to({}, { duration: 3 });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="bridge-story-bg relative w-full h-screen overflow-hidden"
      style={{ background: "#070B14" }}
    >
      {/* Barely-visible top vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(79,209,165,0.04) 0%, transparent 65%)",
        }}
      />

      {/* Story Text */}
      <div className="absolute top-20 inset-x-0 z-20 flex flex-col items-center text-center pointer-events-none px-6">
        <p className="text-label text-teal mb-6 tracking-[0.18em]">The CivicPulse Story</p>

        <div className="relative w-full max-w-xl h-28 flex justify-center">
          {STAGES.map((stage, i) => (
            <div
              key={i}
              ref={(el) => { textRefs.current[i] = el; }}
              className="absolute inset-x-0"
            >
              <h3
                className="text-h2 mb-2 font-semibold"
                style={{
                  color: stage.warning ? "#F2B84B" : stage.resolved ? "#4FD1A5" : "#F1F5F9",
                }}
              >
                {stage.label}
              </h3>
              <p className="text-base text-slate-400 font-normal">{stage.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Chain UI */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 z-20 escalation-ui pointer-events-none flex items-center gap-3">
        {["Ward Authority", "Department", "Senior Authority"].map((node, i) => (
          <div key={node} className="flex items-center gap-3">
            <div
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300"
              style={{
                background: "rgba(15,23,38,0.8)",
                border: i === 2
                  ? "1px solid rgba(242,184,75,0.3)"
                  : "1px solid rgba(148,163,184,0.10)",
                color: i === 2 ? "#F2B84B" : "#94A3B8",
                backdropFilter: "blur(12px)",
              }}
            >
              {node}
            </div>
            {i < 2 && (
              <div className="relative w-10 h-px" style={{ background: "rgba(148,163,184,0.12)" }}>
                <div
                  className="absolute inset-0 escalation-glow"
                  style={{ background: "#F2B84B" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bridge */}
      <div className="absolute inset-0 flex items-center justify-center pt-28 px-4">
        <BridgeSVG className="w-full max-w-[1300px] h-auto" />
      </div>
    </section>
  );
}
