"use client";

import { useRef, useEffect, useState, useId } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Badge } from "@/components/ui/Badge";
import { BridgeStory } from "./BridgeStory";

/* ─────────────────────────────────────────────────────────────────────────────
   Utility: Count-Up Hook
───────────────────────────────────────────────────────────────────────────── */
function useCountUp(to: number, duration = 2.2, decimals = 0) {
  const motionVal = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setDisplay(
          decimals > 0
            ? v.toFixed(decimals)
            : Math.round(v).toLocaleString()
        );
      },
    });
    return controls.stop;
  }, [inView, to, duration, decimals, motionVal]);

  return { display, ref };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-component: Animated Pulsing Map Pin with Concentric Ripples
───────────────────────────────────────────────────────────────────────────── */
interface PinProps {
  cx: number;
  cy: number;
  color: string;
  glowColor: string;
  delay?: number;
  size?: number;
}
function PulsingPin({ cx, cy, color, glowColor, delay = 0, size = 8 }: PinProps) {
  return (
    <g>
      {[1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={size}
          fill="none"
          stroke={color}
          strokeWidth={1.5 / i}
          initial={{ scale: 0.5, opacity: 0.85 }}
          animate={{ scale: 1 + i * 0.85, opacity: 0 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: delay + i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
      <circle cx={cx} cy={cy} r={size * 1.6} fill={glowColor} opacity={0.22} />
      <circle cx={cx} cy={cy} r={size * 0.65} fill={color} />
      <circle cx={cx - size * 0.2} cy={cy - size * 0.2} r={size * 0.22} fill="white" opacity={0.8} />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-component: Restored Animated GIS Radar Map Illustration
───────────────────────────────────────────────────────────────────────────── */
function MapIllustration() {
  const id = useId();

  return (
    <motion.div
      className="relative w-full h-full min-h-[380px]"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Floating Map container */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md border border-[#DED8CD]/70 shadow-[0_16px_48px_rgba(36,34,34,0.08),0_1px_3px_rgba(36,34,34,0.03)]">
        {/* Animated Radar Sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `conic-gradient(from 0deg at 55% 45%, transparent 330deg, rgba(139,38,53,0.08) 355deg, transparent 360deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />

        <svg
          viewBox="0 0 560 420"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id={`${id}-glow`} cx="55%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#F0E5D8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F7F4ED" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Canvas fill */}
          <rect width="560" height="420" fill={`url(#${id}-glow)`} />

          {/* City blocks */}
          {[
            [14, 14, 76, 54], [110, 14, 100, 54], [220, 14, 60, 54],
            [290, 14, 60, 54], [370, 14, 80, 54], [460, 14, 86, 54],
            [14, 90, 76, 82],                      [220, 90, 130, 82],
            [370, 90, 80, 82], [460, 90, 86, 82],
            [14, 192, 76, 78], [110, 192, 100, 78],[220, 192, 60, 78],
            [290, 192, 60, 78],                    [460, 192, 86, 78],
            [14, 290, 76, 62], [110, 290, 100, 62],[220, 290, 60, 62],
            [290, 290, 60, 62],[370, 290, 80, 62], [460, 290, 86, 62],
            [14, 372, 76, 34], [110, 372, 100, 34],[220, 372, 130, 34],
            [370, 372, 80, 34],[460, 372, 86, 34],
          ].map(([x, y, w, h], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={4}
              fill={i % 3 === 0 ? "#EDE3D4" : "#FFFFFF"}
              stroke="#DED8CD"
              strokeWidth={0.75}
            />
          ))}

          {/* Water body */}
          <rect x={110} y={90} width={100} height={82} rx={6} fill="#E0D7CC" stroke="#D0C6B8" />

          {/* Road grid */}
          {[80, 180, 282, 362].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={560}
              y2={y}
              stroke={y === 80 || y === 180 ? "#C4BAAC" : "#DDD4C6"}
              strokeWidth={y === 80 || y === 180 ? 8 : 5}
            />
          ))}
          {[100, 220, 360, 460].map((x) => (
            <line
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2={420}
              stroke={x === 220 ? "#C4BAAC" : "#DDD4C6"}
              strokeWidth={x === 220 ? 8 : 5}
            />
          ))}

          {/* Animated Road Traffic Flow Lines */}
          <motion.line
            x1={0}
            y1={180}
            x2={560}
            y2={180}
            stroke="#8B2635"
            strokeWidth={1.5}
            opacity={0.35}
            strokeDasharray="6 12"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.line
            x1={220}
            y1={0}
            x2={220}
            y2={420}
            stroke="#8B2635"
            strokeWidth={1.5}
            opacity={0.3}
            strokeDasharray="6 12"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Animated Connection Lines Between Incident Pins */}
          {[
            [165, 135, 307, 225],
            [307, 225, 420, 140],
            [307, 225, 165, 310],
            [420, 140, 495, 225],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#8B2635"
              strokeWidth={1.2}
              opacity={0.35}
              strokeDasharray="4 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                delay: 0.4 + i * 0.35,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Animated Location Pins */}
          <PulsingPin cx={165} cy={135} color="#B83A3A" glowColor="#B83A3A" delay={0} size={7} />
          <PulsingPin cx={307} cy={225} color="#C58B32" glowColor="#C58B32" delay={0.6} size={8} />
          <PulsingPin cx={420} cy={140} color="#5E8061" glowColor="#5E8061" delay={1.1} size={6} />
          <PulsingPin cx={165} cy={310} color="#5E8061" glowColor="#5E8061" delay={0.3} size={6} />
          <PulsingPin cx={495} cy={225} color="#B83A3A" glowColor="#B83A3A" delay={1.5} size={5} />
          <PulsingPin cx={400} cy={330} color="#5E8061" glowColor="#5E8061" delay={1.8} size={5} />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 text-[10px] font-semibold bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#DED8CD]/80 shadow-xs z-20">
          {[
            { color: "bg-[#B83A3A]", label: "Critical Hazard" },
            { color: "bg-[#C58B32]", label: "Reported / Active" },
            { color: "bg-[#5E8061]", label: "Resolved" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[#625E59]">
              <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Live GIS Badge */}
        <div className="absolute top-4 right-4 z-20">
          <Badge label="GIS RADAR ACTIVE" variant="sand" pulse />
        </div>

        {/* Floating status pill */}
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-xs font-bold text-[#242222] bg-white/95 backdrop-blur-md border border-[#DED8CD]/80 shadow-xs whitespace-nowrap z-20"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.45 }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B83A3A] mr-1.5 align-middle animate-pulse" />
          Ward 12 · 3 new verified reports
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 1: HERO SECTION with Dynamic Rotating Word
───────────────────────────────────────────────────────────────────────────── */
const HERO_WORDS = ["Transparency", "Accountability", "Resolution", "Action"];

function HeroSection() {
  const { scrollY } = useScroll();
  const mapY = useTransform(scrollY, [0, 600], [0, 60]);

  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left: Headline + Actions */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Floating Pill Badge */}
          <div className="inline-flex">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/80 backdrop-blur-md border border-[#D6C2A3] text-[#8B2635] shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B2635] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B2635]"></span>
              </span>
              <span>Now Live in 38 Municipal Wards</span>
            </span>
          </div>

          {/* Heading with Dynamic Word Animation */}
          <h1 className="text-hero text-[#242222] tracking-tight">
            Civic{" "}
            <span className="inline-block relative overflow-visible text-[#8B2635]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={HERO_WORDS[wordIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="inline-block"
                >
                  {HERO_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            .
            <br />
            Powered by You.
          </h1>

          {/* Subtitle */}
          <p className="text-body text-[#625E59] max-w-lg leading-relaxed">
            Report municipal infrastructure failures with precise geolocation and
            verified photographic evidence. Track government SLA response times
            in real time and hold ward administrations accountable.
          </p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap gap-3.5 items-center pt-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GradientButton href="/map?report=true" size="lg" variant="primary">
              <span className="flex items-center gap-2">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                    fill="currentColor"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                </svg>
                Report an Issue
              </span>
            </GradientButton>

            <GradientButton href="/map" variant="outline" size="lg">
              View Live Map →
            </GradientButton>
          </motion.div>

          {/* Floating Trust Strip */}
          <motion.div
            className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 border-t border-[#DED8CD]/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { value: "2,458", label: "Issues Reported" },
              { value: "1,842", label: "Issues Resolved" },
              { value: "38", label: "Active Wards" },
              { value: "92%", label: "Avg. Response Rate" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-lg font-bold text-[#8B2635] font-mono">{value}</span>
                <span className="text-xs text-[#625E59]">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Map Illustration with Radar & Traffic Animation */}
        <motion.div
          style={{ y: mapY }}
          className="relative h-[380px] lg:h-[450px] z-10"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <MapIllustration />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span className="text-[11px] font-semibold text-[#88827A]">Scroll to explore framework</span>
        <motion.div
          className="h-5 w-0.5 bg-[#8B2635]/60 rounded-full"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 2: HOW IT WORKS (Floating Step Cards)
───────────────────────────────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    step: "01",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8B2635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    title: "1. Capture & Geo-Pin",
    description:
      "Photograph the hazard (pothole, waterlogging, or structural crack). The system captures exact GPS coordinates and tags the administrative ward automatically.",
  },
  {
    step: "02",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8B2635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "2. Department SLA Tracking",
    description:
      "Your report enters the official municipal queue with a transparent SLA countdown. Watch your complaint progress from Verified to In Progress with real-time logs.",
  },
  {
    step: "03",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8B2635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "3. Verified Public Resolution",
    description:
      "Field engineers upload photographic proof of the repair. Ward scores and turnaround metrics update publicly on the permanent civic leaderboard.",
  },
];

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-20 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-caption text-[#8B2635] mb-1.5 font-bold">Standard Operating Procedure</p>
          <h2 className="text-h1 text-[#242222] mb-2.5">
            Structured Accountability in Three Steps
          </h2>
          <p className="text-body text-[#625E59] max-w-xl mx-auto">
            Transforming public grievances into verifiable, auditable municipal workflows.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <GlassCard className="h-full" padding="lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-[#F0E5D8] border border-[#D6C2A3]/70">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-bold font-mono text-[#D6C2A3]">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-h3 text-[#242222] mb-2">{step.title}</h3>
                <p className="text-body-sm text-[#625E59] leading-relaxed">
                  {step.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 3: LIVE IMPACT STATS (Floating Metric Island)
───────────────────────────────────────────────────────────────────────────── */
const STATS = [
  {
    value: 2458,
    suffix: "",
    decimals: 0,
    label: "Issues Reported",
    caption: "Across municipal zones",
  },
  {
    value: 1842,
    suffix: "",
    decimals: 0,
    label: "Issues Resolved",
    caption: "With photographic validation",
  },
  {
    value: 38,
    suffix: "",
    decimals: 0,
    label: "Active Wards",
    caption: "Monitored 24/7 on live GIS",
  },
  {
    value: 92,
    suffix: "%",
    decimals: 0,
    label: "Avg. Response Rate",
    caption: "Within statutory SLA limit",
  },
];

function StatItem({ stat }: { stat: typeof STATS[number] }) {
  const { display, ref } = useCountUp(stat.value, 2.2, stat.decimals);

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-[#DED8CD]/60 shadow-[0_8px_30px_rgba(36,34,34,0.05),0_1px_3px_rgba(36,34,34,0.03)] hover:shadow-[0_16px_40px_rgba(36,34,34,0.08)] hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-baseline justify-center gap-0.5 mb-1.5">
        <span
          ref={ref}
          className="text-4xl font-bold font-mono text-[#8B2635]"
        >
          {display}
        </span>
        {stat.suffix && (
          <span className="text-2xl font-bold text-[#8B2635] font-mono">
            {stat.suffix}
          </span>
        )}
      </div>
      <div className="w-6 h-0.5 bg-[#D6C2A3] rounded-full mb-2" />
      <p className="text-sm font-bold text-[#242222] mb-0.5">{stat.label}</p>
      <p className="text-xs text-[#88827A]">{stat.caption}</p>
    </div>
  );
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-20 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-caption text-[#8B2635] mb-1.5 font-bold">Public Data Audit</p>
          <h2 className="text-h1 text-[#242222] mb-2.5">Live City Performance Metrics</h2>
          <p className="text-body text-[#625E59] max-w-xl mx-auto">
            Real-time municipal health benchmarks maintained under open civic data governance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 4: ACCOUNTABILITY IN ACTION (Floating Leaderboard)
───────────────────────────────────────────────────────────────────────────── */
const WARD_DATA = [
  { name: "Ward 12 — Andheri East", score: 94, issues: 312, resolved: 293, trend: "+12%" },
  { name: "Ward 7 — Bandra West", score: 87, issues: 248, resolved: 215, trend: "+8%" },
  { name: "Ward 23 — Powai", score: 81, issues: 190, resolved: 154, trend: "+21%" },
  { name: "Ward 31 — Versova", score: 73, issues: 176, resolved: 128, trend: "+5%" },
  { name: "Ward 5 — Juhu", score: 61, issues: 143, resolved: 87, trend: "-3%" },
];

function LeaderboardSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-20 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-caption text-[#8B2635] mb-1.5 font-bold">Public Index</p>
            <h2 className="text-h1 text-[#242222] mb-3.5">
              Municipal Ward <span className="text-[#8B2635]">Leaderboard</span>
            </h2>
            <p className="text-body text-[#625E59] mb-7 leading-relaxed">
              Every municipal ward is benchmarked against resolution turnaround,
              closure quality, and citizen satisfaction ratings. Rankings refresh
              continuously to maintain public institutional accountability.
            </p>

            <div className="space-y-3.5">
              {[
                {
                  label: "Resolution Percentage",
                  desc: "Ratio of closed complaints to total reported issues",
                },
                {
                  label: "Response Velocity",
                  desc: "Mean elapsed duration between report filing and crew dispatch",
                },
                {
                  label: "Citizen Verification Score",
                  desc: "Mandatory post-repair resident validation rating",
                },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-[#DED8CD]/60 shadow-[0_4px_16px_rgba(36,34,34,0.04)]">
                  <p className="text-sm font-bold text-[#242222]">{item.label}</p>
                  <p className="text-xs text-[#625E59] mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Floating Table Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#DED8CD]/70 shadow-[0_16px_48px_rgba(36,34,34,0.07),0_1px_3px_rgba(36,34,34,0.03)]">
              <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-[#DED8CD]/60">
                <div>
                  <h3 className="text-base font-bold text-[#242222]">Top Municipal Wards</h3>
                  <p className="text-xs text-[#88827A]">Performance Audit Index</p>
                </div>
                <Badge label="Official Ranking" variant="sand" />
              </div>

              <div className="space-y-4">
                {WARD_DATA.map((ward, i) => (
                  <div key={ward.name}>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold ${
                            i === 0 ? "text-[#8B2635]" : "text-[#88827A]"
                          }`}
                        >
                          #{i + 1}
                        </span>
                        <span className="text-[#242222]">{ward.name}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[11px] font-bold ${
                            ward.trend.startsWith("+") ? "text-[#5E8061]" : "text-[#B83A3A]"
                          }`}
                        >
                          {ward.trend}
                        </span>
                        <span className="font-mono font-bold text-[#8B2635] text-sm">
                          {ward.score}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-[#F0E5D8] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#8B2635]"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${ward.score}%` } : {}}
                        transition={{ duration: 0.9, delay: 0.15 + i * 0.08 }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#88827A] mt-1">
                      <span>{ward.resolved}/{ward.issues} resolved</span>
                      <span className="font-medium text-[#625E59]">
                        {Math.round((ward.resolved / ward.issues) * 100)}% rate
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#DED8CD]/60">
                <Link
                  href="/gov-dashboard"
                  className="block w-full py-2.5 text-center text-xs font-bold text-[#8B2635] hover:text-[#641B27] bg-[#F0E5D8]/70 hover:bg-[#F0E5D8] rounded-xl transition-colors border border-[#D6C2A3]/60"
                >
                  View Comprehensive Ward Telemetry →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 5: RECOGNITION WALL (Floating Cards)
───────────────────────────────────────────────────────────────────────────── */
const TOP_WARDS = [
  {
    ward: "Ward 12 — Andheri East",
    title: "Highest Resolution Index",
    metric: "94 / 100",
    caption: "Leading municipal score across Mumbai",
    detail: "293 verified fixes · 3.8-day average response",
    variant: "maroon" as const,
  },
  {
    ward: "Ward 7 — Bandra West",
    title: "Fastest SLA Dispatch",
    metric: "1.8d avg",
    caption: "Lowest average turnaround duration",
    detail: "215 verified fixes · rapid response team active",
    variant: "success" as const,
  },
  {
    ward: "Ward 23 — Powai",
    title: "Zero Backlog Maintenance",
    metric: "100%",
    caption: "All critical hazard reports cleared on schedule",
    detail: "154 verified fixes · zero pending escalations",
    variant: "success" as const,
  },
  {
    ward: "Ward 31 — Versova",
    title: "Most Improved Administration",
    metric: "+21%",
    caption: "Highest quarterly performance advancement",
    detail: "128 verified fixes · desilting milestone met",
    variant: "sand" as const,
  },
];

function RecognitionWallSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-20 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-caption text-[#8B2635] mb-1.5 font-bold">Public Commendation</p>
          <h2 className="text-h1 text-[#242222] mb-2.5">Municipal Excellence Honors</h2>
          <p className="text-body text-[#625E59] max-w-xl mx-auto">
            Recognizing top-performing wards delivering reliable public service.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_WARDS.map((card, i) => (
            <motion.div
              key={card.ward}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 + i * 0.08 }}
              className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#DED8CD]/60 shadow-[0_10px_30px_rgba(36,34,34,0.06),0_1px_3px_rgba(36,34,34,0.03)] hover:shadow-[0_20px_45px_rgba(36,34,34,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <Badge label={card.title} variant={card.variant} />
                <div className="text-3xl font-bold font-mono text-[#8B2635] mt-3.5 mb-1">
                  {card.metric}
                </div>
                <h3 className="text-sm font-bold text-[#242222] mb-1">{card.ward}</h3>
                <p className="text-xs text-[#625E59] leading-relaxed">{card.caption}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#DED8CD]/60 text-[11px] text-[#88827A]">
                {card.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 6: FINAL CTA (Grand Floating Banner)
───────────────────────────────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-20 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative rounded-3xl text-center px-8 py-16 bg-white/90 backdrop-blur-md border border-[#D6C2A3]/70 shadow-[0_20px_60px_rgba(36,34,34,0.08),0_1px_3px_rgba(36,34,34,0.03)]"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center gap-4">
            <Badge label="Public Infrastructure Network" variant="maroon" />

            <h2 className="text-h1 text-[#242222] max-w-xl">
              Better Governance Starts With{" "}
              <span className="text-[#8B2635]">Public Visibility</span>
            </h2>

            <p className="text-body text-[#625E59] max-w-lg leading-relaxed">
              Every citizen report strengthens data-driven municipal allocation.
              Join thousands of residents actively monitoring and improving city infrastructure.
            </p>

            <div className="flex flex-wrap justify-center gap-3.5 mt-2">
              <GradientButton href="/map?report=true" size="lg" variant="primary">
                Report a Municipal Issue
              </GradientButton>
              <GradientButton href="/map" variant="outline" size="lg">
                Explore Live Map Radar →
              </GradientButton>
            </div>

            <p className="text-xs text-[#88827A] mt-1">
              Free public service · Open civic data standards · Secure & verifiable
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Root: Landing Page
───────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-transparent">
      <HeroSection />
      <BridgeStory />
      <HowItWorksSection />
      <StatsSection />
      <LeaderboardSection />
      <RecognitionWallSection />
      <CTASection />
    </div>
  );
}
