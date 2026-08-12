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
   Sub-component: Pulsing Map Pin
───────────────────────────────────────────────────────────────────────────── */
interface PinProps {
  cx: number; cy: number;
  color: string; glowColor: string;
  delay?: number; size?: number;
}
function PulsingPin({ cx, cy, color, glowColor, delay = 0, size = 10 }: PinProps) {
  return (
    <g>
      {[1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy}
          r={size}
          fill="none"
          stroke={color}
          strokeWidth={1.5 / i}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1 + i * 0.8, opacity: 0 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: delay + i * 0.55,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Glow disc */}
      <circle cx={cx} cy={cy} r={size * 1.5} fill={glowColor} opacity={0.18} />
      {/* Pin dot */}
      <circle cx={cx} cy={cy} r={size * 0.55} fill={color} />
      {/* Pin highlight */}
      <circle cx={cx - size * 0.18} cy={cy - size * 0.18} r={size * 0.18} fill="white" opacity={0.6} />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-component: Animated Map Illustration
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
      {/* Very subtle border glow — barely visible */}

      {/* Map card */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{ background: "#0B1220", border: "1px solid rgba(148,163,184,0.10)" }}
      >

        {/* Radar sweep — very subtle */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg at 55% 45%, transparent 340deg, rgba(79,209,165,0.04) 355deg, transparent 360deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <svg
          viewBox="0 0 560 420"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id={`${id}-glow`} cx="55%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#4FD1A5" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#070B14" stopOpacity="0" />
            </radialGradient>
            <filter id={`${id}-blur`}>
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>

          {/* Background fill */}
          <rect width="560" height="420" fill="url(#${id}-glow)" />

          {/* ── City blocks ── */}
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
            <rect key={i} x={x} y={y} width={w} height={h} rx={3}
              fill="#0F1726"
              opacity={0.85} />
          ))}

          {/* Water block */}
          <rect x={110} y={90} width={100} height={82} rx={4}
            fill="#0B1A2E" opacity={0.8} />

          {/* ── Road grid ── */}
          {/* Horizontals */}
          {[80, 180, 282, 362].map((y) => (
            <line key={y} x1={0} y1={y} x2={560} y2={y}
              stroke="#1e3a5f" strokeWidth={y === 80 || y === 180 ? 10 : 7} opacity={0.6} />
          ))}
          {/* Verticals */}
          {[100, 220, 360, 460].map((x) => (
            <line key={x} x1={x} y1={0} x2={x} y2={420}
              stroke="#1e3a5f" strokeWidth={x === 220 ? 10 : 7} opacity={0.6} />
          ))}

          {/* ── Animated road highlight ── */}
          <motion.line
            x1={0} y1={180} x2={560} y2={180}
            stroke="#4FD1A5" strokeWidth={1} opacity={0.15}
            strokeDasharray="6 12"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.line
            x1={220} y1={0} x2={220} y2={420}
            stroke="#4FD1A5" strokeWidth={1} opacity={0.12}
            strokeDasharray="6 12"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />

          {/* ── Connection lines between pins ── */}
          {[
            [165, 135, 307, 225], [307, 225, 420, 140],
            [307, 225, 165, 310], [420, 140, 495, 225],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#14B8A6" strokeWidth={1} opacity={0.2}
              strokeDasharray="4 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.3, ease: "easeInOut" }}
            />
          ))}

          {/* ── Location Pins ── */}
          {/* Critical — semantic red */}
          <PulsingPin cx={165} cy={135} color="#F05252" glowColor="#F05252" delay={0} size={6} />
          {/* Warning — semantic amber */}
          <PulsingPin cx={307} cy={225} color="#F2B84B" glowColor="#F2B84B" delay={0.6} size={7} />
          {/* Resolved — brand teal */}
          <PulsingPin cx={420} cy={140} color="#4FD1A5" glowColor="#4FD1A5" delay={1.1} size={5} />
          {/* Resolved */}
          <PulsingPin cx={165} cy={310} color="#4FD1A5" glowColor="#4FD1A5" delay={0.3} size={5} />
          {/* Critical */}
          <PulsingPin cx={495} cy={225} color="#F05252" glowColor="#F05252" delay={1.5} size={4} />
          {/* Resolved */}
          <PulsingPin cx={400} cy={330} color="#4FD1A5" glowColor="#4FD1A5" delay={1.8} size={4} />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 text-[10px] font-semibold tracking-wide">
          {[
            { color: "bg-red-400",   label: "Critical" },
            { color: "bg-amber",     label: "Reported" },
            { color: "bg-teal",      label: "Resolved" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-slate-400">
              <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
              {label}
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div className="absolute top-4 right-4">
          <Badge label="LIVE" variant="teal" pulse />
        </div>

        {/* Status popup — no emoji, clean */}
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 rounded-md px-3 py-1.5 text-xs font-medium text-slate-300 whitespace-nowrap"
          style={{ background: "rgba(15,23,38,0.9)", border: "1px solid rgba(148,163,184,0.10)", backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.45 }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger mr-1.5 align-middle" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
          3 new reports · Ward 12
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 1: HERO
───────────────────────────────────────────────────────────────────────────── */
const HERO_WORDS = ["Accountability", "Transparency", "Action"];

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const mapY  = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % HERO_WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex items-center px-4 sm:px-6 lg:px-8 pt-8 pb-20"
    >
      {/* Section gradient tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(20,184,166,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ── Left: Text ── */}
        <motion.div style={{ y: textY, opacity }} className="flex flex-col gap-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge label="Now Live in 38 Wards" variant="teal" pulse />
          </motion.div>

          <motion.h1
            className="text-hero text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Civic{" "}
            <span
              className="relative inline-block text-teal"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {HERO_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            ,<br />
            Powered by{" "}
            <span className="text-slate-300">You.</span>
          </motion.h1>

          <motion.p
            className="text-body text-slate-400 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Report potholes, water clogging, and unsafe structures with geotagged
            photos. Track government response in real time. Hold officials
            accountable — publicly, transparently, together.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <GradientButton href="/map" size="lg">
              <span className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                    fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="9" r="2.5" fill="currentColor"/>
                </svg>
                Report an Issue
              </span>
            </GradientButton>
            <GradientButton href="/map" variant="outline" size="lg">
              View Live Map →
            </GradientButton>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/[0.06]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { value: "9,800+", label: "Citizens" },
              { value: "1,240",  label: "Resolved" },
              { value: "4.2d",   label: "Avg Response" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-base font-semibold text-slate-100">{value}</span>
                <span className="text-caption text-slate-600">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Map ── */}
        <motion.div
          style={{ y: mapY }}
          className="relative h-[380px] lg:h-[460px] z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <MapIllustration />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="text-caption text-slate-600">Scroll to explore</span>
        <motion.div
          className="h-8 w-px bg-teal/60"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 2: HOW IT WORKS
───────────────────────────────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    step: "01",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
          stroke="#4FD1A5" strokeWidth="1.8" fill="rgba(79,209,165,0.15)"/>
        <circle cx="12" cy="9" r="2.5" fill="#4FD1A5"/>
        <path d="M9 22h6M12 18v4" stroke="#4FD1A5" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Report",
    description:
      "Snap a photo of any civic issue — pothole, waterlogging, or crumbling infrastructure. Pin it on the live map with one tap and submit in under 30 seconds.",
    badge: "Step 1",
  },
  {
    step: "02",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#4FD1A5" strokeWidth="1.8" fill="rgba(79,209,165,0.1)"/>
        <path d="M12 7v5l3 3" stroke="#4FD1A5" strokeWidth="2" strokeLinecap="round"/>
        <path d="M3 12H1M23 12h-2M12 1V3M12 21v2" stroke="#4FD1A5" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Track",
    description:
      "Your report enters the official workflow. Watch it get assigned, acknowledged, and actioned — with live status updates pushed directly to you.",
    badge: "Step 2",
  },
  {
    step: "03",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#4FD1A5" strokeWidth="1.8" fill="rgba(79,209,165,0.1)"/>
        <path d="M8 12l3 3 5-5" stroke="#4FD1A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Resolve",
    description:
      "Government resolves the issue and uploads proof. Their response time and quality score are publicly logged — building a permanent accountability record.",
    badge: "Step 3",
  },
];

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-24">
      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(245,158,11,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-caption text-teal mb-3">How It Works</p>
          <h2 className="text-h1 text-white mb-4">
            Three Steps to{" "}
            <span className="text-teal">Real Change</span>
          </h2>
          <p className="text-body text-slate-400 max-w-xl mx-auto">
            CivicPulse turns citizen frustration into structured accountability —
            fast, transparent, and permanently on record.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="relative grid md:grid-cols-3 gap-6">
          {/* Connector arrows (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-1/3 -translate-y-1/2 z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="origin-left"
            >
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none" aria-hidden>
                <path d="M0 10 H50 M44 4 L50 10 L44 16" stroke="rgba(20,184,166,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>
          </div>
          <div className="hidden md:block absolute top-1/2 right-1/3 -translate-y-1/2 z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="origin-left"
            >
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none" aria-hidden>
                <path d="M0 10 H50 M44 4 L50 10 L44 16" stroke="rgba(79,209,165,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>
          </div>

          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard
                className="h-full group"
                padding="lg"
                hover
                glow="none"
              >
                {/* Step number */}
                <div className="flex items-start justify-between mb-5">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                    {step.icon}
                  </div>
                  <span
                    className="text-5xl font-black opacity-[0.08] select-none"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {step.step}
                  </span>
                </div>

                <Badge
                  label={step.badge}
                  variant="teal"
                  className="mb-4"
                />

                <h3 className="text-h3 text-white mb-3 group-hover:text-teal-light transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-body-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Bottom bar accent */}
                <div
                  className="absolute bottom-0 inset-x-0 h-px rounded-b-2xl"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(79,209,165,0.5), transparent)",
                  }}
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 3: LIVE IMPACT STATS
───────────────────────────────────────────────────────────────────────────── */
const STATS = [
  {
    value: 1240,
    suffix: "",
    decimals: 0,
    label: "Reports Resolved",
    caption: "This calendar year",
  },
  {
    value: 4.2,
    suffix: "d",
    decimals: 1,
    label: "Avg Response Time",
    caption: "Down 38% vs last year",
  },
  {
    value: 38,
    suffix: "",
    decimals: 0,
    label: "Active Wards",
    caption: "Across 3 municipalities",
  },
  {
    value: 9800,
    suffix: "+",
    decimals: 0,
    label: "Citizens Engaged",
    caption: "And growing daily",
  },
];

function StatItem({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const { display, ref } = useCountUp(stat.value, 2.2, stat.decimals);

  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="flex items-end justify-center gap-1 mb-2">
        <span
          ref={ref}
          className="font-black leading-none text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
        >
          {display}
        </span>
        {stat.suffix && (
          <span className="text-xl font-bold mb-1 text-white">
            {stat.suffix}
          </span>
        )}
      </div>
      <div className="w-6 h-1 bg-teal rounded-full mb-3" />
      <p className="text-body-sm font-semibold text-white mb-1">{stat.label}</p>
      <p className="text-caption text-slate-500">{stat.caption}</p>
    </div>
  );
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 50%, rgba(79,209,165,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-caption text-teal mb-3">Real Numbers. Real Impact.</p>
          <h2 className="text-h1 text-white mb-4">
            Live <span className="text-teal">Impact Stats</span>
          </h2>
          <p className="text-body text-slate-400 max-w-xl mx-auto">
            Every resolved pothole, every cleared drain — tracked, verified, and
            scored. Here's what CivicPulse has achieved so far.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard padding="lg" glow="none" className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {STATS.map((stat, i) => (
                <StatItem key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 4: ACCOUNTABILITY IN ACTION (Leaderboard)
───────────────────────────────────────────────────────────────────────────── */
const WARD_DATA = [
  { name: "Ward 12 — Andheri East",   score: 94, issues: 312, resolved: 293, trend: "+12%" },
  { name: "Ward 7 — Bandra West",     score: 87, issues: 248, resolved: 215, trend: "+8%"  },
  { name: "Ward 23 — Powai",          score: 81, issues: 190, resolved: 154, trend: "+21%" },
  { name: "Ward 31 — Versova",        score: 73, issues: 176, resolved: 128, trend: "+5%"  },
  { name: "Ward 5 — Juhu",            score: 61, issues: 143, resolved: 87,  trend: "-3%"  },
];

function LeaderboardSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(245,158,11,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: heading + description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-caption text-amber mb-3">Accountability in Action</p>
            <h2 className="text-h1 text-white mb-6">
              Ward{" "}
              <span className="text-teal">Leaderboard</span>
            </h2>
            <p className="text-body text-slate-400 mb-8 leading-relaxed">
              Every ward is scored on resolution rate, response speed, and
              citizen satisfaction. Scores update daily. Accountability has
              never been this public — or this powerful.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  ),
                  label: "Resolution Rate", desc: "Ratio of resolved to total issues"
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  ),
                  label: "Response Speed",  desc: "Average time from report to action"
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ),
                  label: "Citizen Rating",  desc: "Post-resolution satisfaction score"
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 items-start">
                  <div className="mt-1 flex-shrink-0" aria-hidden>{item.icon}</div>
                  <div>
                    <p className="text-body-sm font-semibold text-slate-200">{item.label}</p>
                    <p className="text-caption text-slate-500 normal-case tracking-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Leaderboard card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard padding="lg" glow="teal">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-h3 text-white">Top Wards</h3>
                  <p className="text-caption text-slate-500 mt-0.5">By Accountability Score</p>
                </div>
                <Badge label="Live Ranking" variant="teal" pulse />
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-5">
                {WARD_DATA.map((ward, i) => (
                  <motion.div
                    key={ward.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`text-xs font-black w-5 text-center flex-shrink-0 ${
                            i === 0 ? "text-amber" : i === 1 ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </span>
                        <span className="text-body-sm text-slate-200 truncate font-medium">
                          {ward.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-xs font-semibold ${
                            ward.trend.startsWith("+") ? "text-teal" : "text-danger"
                          }`}
                        >
                          {ward.trend}
                        </span>
                        <span className="text-body-sm font-bold text-white">
                          {ward.score}
                        </span>
                      </div>
                    </div>

                    {/* Animated progress bar */}
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: "#4FD1A5",
                        }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${ward.score}%` } : {}}
                        transition={{
                          duration: 1.1,
                          delay: 0.4 + i * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>

                    {/* Sub-stats */}
                    <div className="flex gap-4 mt-1.5">
                      <span className="text-caption text-slate-600 normal-case tracking-normal">
                        {ward.resolved}/{ward.issues} resolved
                      </span>
                      <span className="text-caption text-teal-dark normal-case tracking-normal">
                        {Math.round((ward.resolved / ward.issues) * 100)}% rate
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <GradientButton href="/gov-dashboard" variant="outline" size="sm" className="w-full justify-center">
                  View Full Dashboard →
                </GradientButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 5: RECOGNITION WALL
───────────────────────────────────────────────────────────────────────────── */
const TOP_WARDS = [
  {
    ward:    "Ward 12 — Andheri East",
    title:   "Champion Ward",
    metric:  "94 / 100",
    caption: "Highest accountability score this quarter",
    detail:  "293 issues resolved · 4-day avg response",
    color:   "amber" as const,
  },
  {
    ward:    "Ward 7 — Bandra West",
    title:   "Fastest Responder",
    metric:  "1.8d avg",
    caption: "Lowest average response time this month",
    detail:  "215 issues resolved · 1.8-day avg response",
    color:   "teal" as const,
  },
  {
    ward:    "Ward 23 — Powai",
    title:   "Zero Backlog",
    metric:  "100%",
    caption: "All reported issues cleared within SLA",
    detail:  "154 issues resolved · zero pending",
    color:   "teal" as const,
  },
  {
    ward:    "Ward 31 — Versova",
    title:   "Rising Star",
    metric:  "+21%",
    caption: "Biggest improvement in score this quarter",
    detail:  "128 issues resolved · fastest growth",
    color:   "slate" as const,
  },
];

function ShineCard({ card, index, parentInView }: {
  card: typeof TOP_WARDS[number]; index: number; parentInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        className="relative h-full rounded-2xl overflow-hidden cursor-pointer"
        style={{ background: "#0F1726", border: `1px solid rgba(148,163,184,0.12)` }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Glass base */}
        <div className="glass absolute inset-0 rounded-2xl" />

        {/* Shine sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)",
          }}
          initial={{ x: "-100%" }}
          animate={hovered ? { x: "200%" } : { x: "-100%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />



        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
          <div className="flex items-start justify-between gap-3">
            <Badge label={card.title} variant={card.color} />
          </div>

          <div>
            <div
              className={`text-3xl font-black mb-1 ${card.color === "amber" ? "text-warning" : "text-teal"}`}
            >
              {card.metric}
            </div>
            <p className="text-body-sm text-slate-200 font-semibold">{card.ward}</p>
            <p className="text-caption text-slate-400 normal-case tracking-normal mt-1">
              {card.caption}
            </p>
          </div>

          <div className="mt-auto pt-3 border-t border-white/[0.06]">
            <p className="text-caption text-slate-500 normal-case tracking-normal">
              {card.detail}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RecognitionWallSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(20,184,166,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-caption text-teal mb-3">Recognition Wall</p>
          <h2 className="text-h1 text-white mb-4">
            Celebrating{" "}
            <span className="text-teal">Outstanding Wards</span>
          </h2>
          <p className="text-body text-slate-400 max-w-xl mx-auto">
            These wards went above and beyond. Their records are public — and
            their citizens are proud.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOP_WARDS.map((card, i) => (
            <ShineCard key={card.ward} card={card} index={i} parentInView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 6: FINAL CTA
───────────────────────────────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative px-4 sm:px-6 lg:px-8 py-28">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden text-center px-8 py-16"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background: "#0F1726",
            }}
          />
          <div className="glass absolute inset-0 rounded-3xl border border-slate-400/10" />

          {/* Top glow */}
          <div
            aria-hidden
            className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(79,209,165,0.15), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Inner top border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/50 to-transparent" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <Badge label="Join the Movement" variant="teal" pulse />

            <h2 className="text-h1 text-white max-w-2xl">
              Your City Deserves{" "}
              <span className="text-teal">Better.</span>{" "}
              Start Today.
            </h2>

            <p className="text-body text-slate-400 max-w-lg leading-relaxed">
              Every report matters. Every resolved issue proves that government
              can be held accountable. Add your voice — and your pin — to the
              map.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <GradientButton href="/map" size="lg">
                <span className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                      fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="9" r="2.5" fill="currentColor"/>
                  </svg>
                  Report Your First Issue
                </span>
              </GradientButton>
              <GradientButton href="/gov-dashboard" variant="outline" size="lg">
                Explore the Dashboard
              </GradientButton>
            </div>

            {/* Mini trust strip */}
            <p className="text-caption text-slate-600 mt-2">
              Free to use · No account required to view · 100% open data
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
    <div className="flex flex-col w-full overflow-x-hidden">
      <HeroSection />
      <BridgeStory />

      {/* Thin divider with gradient */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <HowItWorksSection />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <StatsSection />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <LeaderboardSection />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <RecognitionWallSection />

      <CTASection />
    </div>
  );
}
