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
    copy: "Every municipal infrastructure failure starts with a localized crack or leak.",
  },
  {
    label: "CITIZEN REPORT",
    copy: "Citizens photograph and pin the issue, making neglected problems publicly visible.",
  },
  {
    label: "PATTERN IDENTIFICATION",
    copy: "Spatial clustering connects isolated reports to identify ward-wide systemic hazards.",
  },
  {
    label: "SLA ACCOUNTABILITY",
    copy: "Automated escalation routes overdue complaints directly to executive leadership.",
    warning: true,
  },
  {
    label: "VERIFIED RESOLUTION",
    copy: "Repairs are validated with photographic proof and citizen verification.",
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
      gsap.set(".escalation-ui", { opacity: 0, y: 20 });
      gsap.set(".escalation-glow", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(textRefs.current.slice(1), { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=3200",
          scrub: 1.2,
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
        // Bridge outer pieces settle
        .to(".center-piece.piece-1, .center-piece.piece-5", { y: 0, opacity: 1, rotation: 0, duration: 2.2, ease: "power3.out" }, 5.2)

      // Stage 2 → 3: ACCOUNTABILITY
        .to(textRefs.current[2], { opacity: 0, y: -20, duration: 0.8 }, 8)
        .to(textRefs.current[3], { opacity: 1, y: 0, duration: 0.8 }, 8)
        .to(".escalation-ui", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 8.3)
        .to(".escalation-glow", { scaleX: 1, duration: 2.5, ease: "power1.inOut" }, 9)
        .to(".center-piece.piece-2", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 9.4)
        .to(".center-piece.piece-4", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 9.8)

      // Stage 3 → 4: RESOLUTION
        .to(textRefs.current[3], { opacity: 0, y: -20, duration: 0.8 }, 12)
        .to(".escalation-ui", { opacity: 0, duration: 0.5 }, 12)
        .to(textRefs.current[4], { opacity: 1, y: 0, duration: 0.8 }, 12.8)
        // Keystone
        .to(".center-piece.piece-3", { y: 0, opacity: 1, rotation: 0, duration: 2, ease: "power2.out" }, 12.5)
        .to(".deck-line", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 13.5)
        .to(".railing-center", { opacity: 1, scaleX: 1, duration: 1.2, ease: "power2.out" }, 14.2)
        .to(".report, .hotspot-ring", { opacity: 0, scale: 0, duration: 0.8 }, 14)
        .to(".light-bulb", { opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: "power2.out" }, 15)

        // Hold
        .to({}, { duration: 3 });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="bridge-story-bg relative w-full h-screen overflow-hidden bg-transparent"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      {/* Story Text Header */}
      <div className="absolute top-14 inset-x-0 z-20 flex flex-col items-center text-center pointer-events-none px-6">
        <p className="text-xs font-bold uppercase text-[#8B2635] tracking-[0.18em] mb-3">
          Public Infrastructure Lifecycle
        </p>

        <div className="relative w-full max-w-xl h-24 flex justify-center">
          {STAGES.map((stage, i) => (
            <div
              key={i}
              ref={(el) => { textRefs.current[i] = el; }}
              className="absolute inset-x-0"
            >
              <h3
                className="text-xl md:text-2xl font-bold mb-1 tracking-tight"
                style={{
                  color: stage.warning ? "#B83A3A" : stage.resolved ? "#5E8061" : "#242222",
                }}
              >
                {stage.label}
              </h3>
              <p className="text-sm text-[#625E59] font-normal leading-relaxed max-w-lg mx-auto">
                {stage.copy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Chain UI (Floating Glass Cards) */}
      <div className="absolute top-[34%] left-1/2 -translate-x-1/2 z-20 escalation-ui pointer-events-none flex items-center gap-3">
        {["Ward Office", "Department Directorate", "Municipal Commissioner"].map((node, i) => (
          <div key={node} className="flex items-center gap-3">
            <div
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-[0_4px_16px_rgba(36,34,34,0.06)] bg-white/90 backdrop-blur-md"
              style={{
                border: i === 2 ? "1.5px solid #8B2635" : "1px solid rgba(222,216,205,0.8)",
                color: i === 2 ? "#8B2635" : "#625E59",
              }}
            >
              {node}
            </div>
            {i < 2 && (
              <div className="relative w-8 h-0.5" style={{ background: "rgba(222,216,205,0.7)" }}>
                <div
                  className="absolute inset-0 escalation-glow"
                  style={{ background: "#8B2635" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bridge Visual (Perfect Center in Viewport) */}
      <div className="absolute inset-0 flex items-center justify-center pt-8 pb-4 px-4 pointer-events-none">
        <BridgeSVG className="w-full max-w-[1150px] h-auto" />
      </div>
    </section>
  );
}
