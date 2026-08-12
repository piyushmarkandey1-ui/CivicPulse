"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Badge } from "@/components/ui/Badge";
import { BridgeStory } from "./BridgeStory";

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;
const SECTION_PY = "py-[7.2rem]";
const HERO_WORDS = ["Accountability", "Transparency", "Action"];

function useCountUp(to: number, duration = 1.6, decimals = 0, suffix = "") {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px", amount: 0.3 });
  const format = (v: number) =>
    (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()) + suffix;
  const [display, setDisplay] = useState(format(to));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!inView || hasAnimated) return;
    setHasAnimated(true);
    const from = Math.floor(to * 0.72);
    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT_QUAD,
      onUpdate(v) {
        setDisplay(format(v));
      },
    });
    return controls.stop;
  }, [inView, to, duration, decimals, suffix, hasAnimated]);

  return { display, ref };
}

function PulsingPin({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      {[1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={6}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          initial={{ scale: 0.6, opacity: 0.5 }}
          animate={{ scale: 1 + i * 0.6, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
        />
      ))}
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
}

function MapIllustration() {
  return (
    <motion.div
      className="relative w-full h-full min-h-[380px]"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT_QUAD }}
    >
      <div
        className="relative w-full h-full rounded-lg overflow-hidden border border-gray-border"
        style={{ background: "linear-gradient(160deg, #fafafa 0%, #f5f5f5 100%)" }}
      >
        <svg
          viewBox="0 0 560 420"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* City blocks */}
          {[
            [14, 14, 76, 54], [110, 14, 100, 54], [220, 14, 60, 54],
            [290, 14, 60, 54], [370, 14, 80, 54], [460, 14, 86, 54],
            [14, 90, 76, 82], [220, 90, 130, 82],
            [370, 90, 80, 82], [460, 90, 86, 82],
            [14, 192, 76, 78], [110, 192, 100, 78], [220, 192, 60, 78],
            [290, 192, 60, 78], [460, 192, 86, 78],
            [14, 290, 76, 62], [110, 290, 100, 62], [220, 290, 60, 62],
            [290, 290, 60, 62], [370, 290, 80, 62], [460, 290, 86, 62],
            [14, 372, 76, 34], [110, 372, 100, 34], [220, 372, 130, 34],
            [370, 372, 80, 34], [460, 372, 86, 34],
          ].map(([x, y, w, h], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={3}
              fill={i % 5 === 2 ? "#e8f5f0" : "#ebebeb"}
            />
          ))}

          {/* Roads */}
          {[80, 180, 282, 362].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={560}
              y2={y}
              stroke="#d4d4d4"
              strokeWidth={y === 80 || y === 180 ? 8 : 6}
            />
          ))}
          {[100, 220, 360, 460].map((x) => (
            <line
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2={420}
              stroke="#d4d4d4"
              strokeWidth={x === 220 ? 8 : 6}
            />
          ))}

          {[
            { cx: 165, cy: 135, color: "#dc2626" },
            { cx: 307, cy: 225, color: "#2563eb" },
            { cx: 420, cy: 140, color: "#10b981" },
            { cx: 165, cy: 310, color: "#10b981" },
            { cx: 495, cy: 225, color: "#dc2626" },
          ].map(({ cx, cy, color }) => (
            <PulsingPin key={`${cx}-${cy}`} cx={cx} cy={cy} color={color} />
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 text-[10px] font-medium tracking-wide">
          {[
            { color: "#dc2626", label: "Critical" },
            { color: "#2563eb", label: "Reported" },
            { color: "#10b981", label: "Resolved" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-gray-mid">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
            </div>
          ))}
        </div>

        <div className="absolute top-4 right-4">
          <Badge label="Live Data" variant="blue" dot={false} />
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % HERO_WORDS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 pt-8 pb-[6rem]">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 lg:gap-[4.8rem] items-center">
        <motion.div style={{ y: textY }} className="flex flex-col gap-7 z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_QUAD }}
          >
            <Badge label="Now Live in 38 Wards" variant="blue" dot={false} />
          </motion.div>

          <motion.h1
            className="text-hero text-gray-dark"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: EASE_OUT_QUAD }}
          >
            Civic{" "}
            <span className="text-blue inline-block min-w-[1ch]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE_OUT_QUAD }}
                  className="inline-block"
                >
                  {HERO_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            ,{" "}
            <br />
            Powered by{" "}
            <span className="text-gray-mid">You.</span>
          </motion.h1>

          <motion.p
            className="text-body text-gray-mid max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT_QUAD }}
          >
            Report potholes, water clogging, and unsafe structures with geotagged
            photos. Track government response in real time. Hold officials
            accountable — publicly, transparently, together.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT_QUAD }}
          >
            <GradientButton href="/map" size="lg">
              <span className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                    fill="currentColor"
                    fillOpacity="0.3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                </svg>
                Report an Issue
              </span>
            </GradientButton>
            <GradientButton href="/map" variant="outline" size="lg">
              View Live Map
            </GradientButton>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-8 pt-5 border-t border-gray-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: EASE_OUT_QUAD }}
          >
            {[
              { value: "9,800+", label: "Citizens" },
              { value: "1,240", label: "Resolved" },
              { value: "4.2d", label: "Avg Response" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span
                  className="text-lg font-bold text-gray-dark tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {value}
                </span>
                <span className="text-caption text-gray-mid normal-case tracking-normal">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: mapY }} className="relative h-[380px] lg:h-[460px] z-10">
          <MapIllustration />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 2: HOW IT WORKS
───────────────────────────────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    step: "01",
    title: "Report",
    description:
      "Snap a photo of any civic issue — pothole, waterlogging, or crumbling infrastructure. Pin it on the live map with one tap and submit in under 30 seconds.",
    badge: "Step 1",
  },
  {
    step: "02",
    title: "Track",
    description:
      "Your report enters the official workflow. Watch it get assigned, acknowledged, and actioned — with live status updates pushed directly to you.",
    badge: "Step 2",
  },
  {
    step: "03",
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
    <section ref={ref} className={`relative px-4 sm:px-6 lg:px-8 ${SECTION_PY}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-[4.8rem]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE_OUT_QUAD }}
        >
          <p className="text-caption text-blue mb-3">How It Works</p>
          <h2 className="text-h1 text-gray-dark mb-4">
            Three Steps to Real Change
          </h2>
          <p className="text-body text-gray-mid max-w-xl mx-auto">
            CivicPulse turns citizen frustration into structured accountability —
            fast, transparent, and permanently on record.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-7">
          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: EASE_OUT_QUAD }}
            >
              <GlassCard className="h-full" padding="lg" animate={false}>
              <div className="flex items-start justify-between mb-5">
                <Badge label={step.badge} variant="slate" dot={false} />
                <span
                  className="text-3xl font-bold text-gray-border select-none tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {step.step}
                </span>
              </div>
              <h3 className="text-h3 text-gray-dark mb-3">{step.title}</h3>
              <p className="text-body-sm text-gray-mid leading-relaxed">
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
   Section 3: LIVE IMPACT STATS — static mock data, subtle fade on scroll
───────────────────────────────────────────────────────────────────────────── */
const STATS = [
  { value: 1240, suffix: "", decimals: 0, label: "Reports Resolved", caption: "This calendar year", variant: "blue" as const },
  { value: 4.2, suffix: "d", decimals: 1, label: "Avg Response Time", caption: "Down 38% vs last year", variant: "slate" as const },
  { value: 38, suffix: "", decimals: 0, label: "Active Wards", caption: "Across 3 municipalities", variant: "blue" as const },
  { value: 9800, suffix: "+", decimals: 0, label: "Citizens Engaged", caption: "Verified registrations", variant: "slate" as const },
];

function StatCard({
  stat,
  index,
  parentInView,
}: {
  stat: (typeof STATS)[number];
  index: number;
  parentInView: boolean;
}) {
  const { display, ref } = useCountUp(stat.value, 1.6, stat.decimals, stat.suffix);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE_OUT_QUAD }}
    >
      <GlassCard padding="lg" className="h-full text-center" animate={false}>
        <div
          ref={ref}
          className="text-stat mb-2 tabular-nums"
          style={{
            fontVariantNumeric: "tabular-nums",
            color: stat.variant === "blue" ? "#2563eb" : "#2c2c2c",
          }}
        >
          {display}
        </div>
        <p className="text-body-sm font-semibold text-gray-dark mb-1">{stat.label}</p>
        <p className="text-caption text-gray-mid normal-case tracking-normal">
          {stat.caption}
        </p>
      </GlassCard>
    </motion.div>
  );
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className={`relative px-4 sm:px-6 lg:px-8 ${SECTION_PY}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-[4.2rem]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE_OUT_QUAD }}
        >
          <p className="text-caption text-blue mb-3">Real Numbers. Real Impact.</p>
          <h2 className="text-h1 text-gray-dark mb-4">Live Impact Stats</h2>
          <p className="text-body text-gray-mid max-w-xl mx-auto">
            Every resolved pothole, every cleared drain — tracked, verified, and
            scored. Published figures as of the current reporting period.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} parentInView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 4: WARD LEADERBOARD — official scoreboard
───────────────────────────────────────────────────────────────────────────── */
type SortKey = "rank" | "score" | "resolved" | "rate" | "trend";
type SortDir = "asc" | "desc";

interface WardRow {
  name: string;
  score: number;
  issues: number;
  resolved: number;
  trend: number;
}

const WARD_DATA: WardRow[] = [
  { name: "Ward 12 — Andheri East", score: 94, issues: 312, resolved: 293, trend: 12 },
  { name: "Ward 7 — Bandra West", score: 87, issues: 248, resolved: 215, trend: 8 },
  { name: "Ward 23 — Powai", score: 81, issues: 190, resolved: 154, trend: 21 },
  { name: "Ward 31 — Versova", score: 73, issues: 176, resolved: 128, trend: 5 },
  { name: "Ward 5 — Juhu", score: 61, issues: 143, resolved: 87, trend: -3 },
];

const LAST_UPDATED = "Aug 12, 2026 · 2:30 PM IST";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`inline-block ml-1 ${active ? "text-blue" : "text-gray-border"}`}
    >
      {dir === "desc" ? (
        <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 10V2M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function LeaderboardSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedWards = useMemo(() => {
    const rows = WARD_DATA.map((w, i) => ({
      ...w,
      rank: i + 1,
      rate: Math.round((w.resolved / w.issues) * 100),
    }));

    return [...rows].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "rank":
          cmp = a.rank - b.rank;
          break;
        case "score":
          cmp = a.score - b.score;
          break;
        case "resolved":
          cmp = a.resolved - b.resolved;
          break;
        case "rate":
          cmp = a.rate - b.rate;
          break;
        case "trend":
          cmp = a.trend - b.trend;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: "rank", label: "Rank", align: "text-center w-12" },
    { key: "score", label: "Score", align: "text-right w-16" },
    { key: "resolved", label: "Resolved", align: "text-right w-20" },
    { key: "rate", label: "Rate", align: "text-right w-16" },
    { key: "trend", label: "Trend", align: "text-right w-16" },
  ];

  return (
    <section ref={ref} className={`relative px-4 sm:px-6 lg:px-8 ${SECTION_PY}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: EASE_OUT_QUAD }}
          >
            <p className="text-caption text-blue mb-3">Accountability in Action</p>
            <h2 className="text-h1 text-gray-dark mb-6">Ward Leaderboard</h2>
            <p className="text-body text-gray-mid mb-8 leading-relaxed">
              Every ward is scored on resolution rate, response speed, and
              citizen satisfaction. Scores update daily. Rankings are published
              for public review.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { label: "Resolution Rate", desc: "Ratio of resolved to total issues" },
                { label: "Response Speed", desc: "Average time from report to action" },
                { label: "Citizen Rating", desc: "Post-resolution satisfaction score" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 items-start border-l-2 border-blue pl-4">
                  <div>
                    <p className="text-body-sm font-semibold text-gray-dark">{item.label}</p>
                    <p className="text-body-sm text-gray-mid">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05, ease: EASE_OUT_QUAD }}
          >
            <div className="scoreboard">
              {/* Scoreboard header */}
              <div className="px-5 py-4 border-b border-gray-border flex items-center justify-between">
                <div>
                  <h3 className="text-h3 text-gray-dark">Ward Performance Index</h3>
                  <p className="text-body-sm text-gray-mid mt-0.5">
                    Last updated: {LAST_UPDATED}
                  </p>
                </div>
                <Badge label="Official" variant="blue" dot={false} />
              </div>

              {/* Column headers */}
              <div className="scoreboard-header px-5 py-2.5 grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center text-caption text-gray-mid normal-case tracking-normal">
                <button
                  type="button"
                  onClick={() => handleSort("rank")}
                  className="text-left font-medium hover:text-gray-dark transition-opacity duration-200"
                >
                  Ward
                  {sortKey === "rank" && <SortIcon active dir={sortDir} />}
                </button>
                {columns.slice(1).map((col) => (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={`font-medium hover:text-gray-dark transition-opacity duration-200 ${col.align}`}
                  >
                    {col.label}
                    {sortKey === col.key && <SortIcon active dir={sortDir} />}
                  </button>
                ))}
              </div>

              {/* Rows */}
              {sortedWards.map((ward, i) => (
                <motion.div
                  key={ward.name}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: EASE_OUT_QUAD }}
                  className="scoreboard-row px-5 py-3.5"
                >
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center mb-2">
                    <div className="min-w-0">
                      <span className="text-body-sm font-medium text-gray-dark truncate block">
                        {ward.name}
                      </span>
                    </div>
                    <span
                      className="text-right text-body-sm font-bold text-gray-dark tabular-nums w-16"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {ward.score}
                    </span>
                    <span
                      className="text-right text-body-sm text-gray-mid tabular-nums w-20"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {ward.resolved}
                    </span>
                    <span
                      className="text-right text-body-sm font-medium tabular-nums w-16"
                      style={{ fontVariantNumeric: "tabular-nums", color: "#10b981" }}
                    >
                      {ward.rate}%
                    </span>
                    <span
                      className={`text-right text-body-sm font-medium tabular-nums w-16 ${
                        ward.trend >= 0 ? "text-green" : "text-red-500"
                      }`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {ward.trend >= 0 ? "+" : ""}
                      {ward.trend}%
                    </span>
                  </div>
                  <div className="h-1 bg-gray-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-blue"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${ward.score}%` } : {}}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease: EASE_OUT_QUAD }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Footer CTA */}
              <div className="px-5 py-4 border-t border-gray-border bg-gray-soft">
                <GradientButton href="/gov-dashboard" variant="outline" size="sm" className="w-full justify-center">
                  View Full Dashboard
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 5: RECOGNITION WALL — institutional, no shine effects
───────────────────────────────────────────────────────────────────────────── */
const TOP_WARDS = [
  {
    ward: "Ward 12 — Andheri East",
    title: "Highest Score",
    metric: "94 / 100",
    caption: "Highest accountability score this quarter",
    detail: "293 issues resolved · 4-day avg response",
  },
  {
    ward: "Ward 7 — Bandra West",
    title: "Fastest Response",
    metric: "1.8d avg",
    caption: "Lowest average response time this month",
    detail: "215 issues resolved · 1.8-day avg response",
  },
  {
    ward: "Ward 23 — Powai",
    title: "Zero Backlog",
    metric: "100%",
    caption: "All reported issues cleared within SLA",
    detail: "154 issues resolved · zero pending",
  },
  {
    ward: "Ward 31 — Versova",
    title: "Most Improved",
    metric: "+21%",
    caption: "Biggest improvement in score this quarter",
    detail: "128 issues resolved · fastest growth",
  },
];

function RecognitionWallSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className={`relative px-4 sm:px-6 lg:px-8 ${SECTION_PY}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-[4.2rem]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE_OUT_QUAD }}
        >
          <p className="text-caption text-blue mb-3">Recognition Wall</p>
          <h2 className="text-h1 text-gray-dark mb-4">Outstanding Ward Performance</h2>
          <p className="text-body text-gray-mid max-w-xl mx-auto">
            Published records of wards meeting or exceeding accountability
            benchmarks for the current reporting period.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_WARDS.map((card, i) => (
            <motion.div
              key={card.ward}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05, ease: EASE_OUT_QUAD }}
            >
              <GlassCard padding="lg" hover className="h-full" animate={false}>
                <Badge label={card.title} variant="slate" dot={false} className="mb-4" />
                <div
                  className="text-stat mb-2 text-blue tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {card.metric}
                </div>
                <p className="text-body-sm text-gray-dark font-semibold">{card.ward}</p>
                <p className="text-body-sm text-gray-mid mt-1">{card.caption}</p>
                <div className="mt-4 pt-3 border-t border-gray-border">
                  <p className="text-body-sm text-gray-mid">{card.detail}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section 6: FINAL CTA — no entrance animations
───────────────────────────────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className={`relative px-4 sm:px-6 lg:px-8 py-[8.4rem]`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative rounded-lg overflow-hidden text-center px-8 py-14 border border-gray-border bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: EASE_OUT_QUAD }}
        >
          <div className="relative z-10 flex flex-col items-center gap-6">
            <Badge label="Public Service" variant="blue" dot={false} />

            <h2 className="text-h1 text-gray-dark max-w-2xl">
              Your City Deserves Better. Start Today.
            </h2>

            <p className="text-body text-gray-mid max-w-lg leading-relaxed">
              Every report matters. Every resolved issue proves that government
              can be held accountable. Add your voice — and your pin — to the
              map.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <GradientButton href="/map" size="lg">
                <span className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                      fill="currentColor"
                      fillOpacity="0.3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                  </svg>
                  Report Your First Issue
                </span>
              </GradientButton>
              <GradientButton href="/gov-dashboard" variant="outline" size="lg">
                Explore the Dashboard
              </GradientButton>
            </div>

            <p className="text-caption text-gray-mid mt-2 normal-case tracking-normal">
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

      <div className="divider" />
      <HowItWorksSection />

      <div className="divider" />
      <StatsSection />

      <div className="divider" />
      <LeaderboardSection />

      <div className="divider" />
      <RecognitionWallSection />

      <CTASection />
    </div>
  );
}
