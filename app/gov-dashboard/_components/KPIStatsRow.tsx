"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import {
  SPARKLINE_RESOLUTION,
  SPARKLINE_RESPONSE,
  SPARKLINE_ESCALATIONS,
  SPARKLINE_TRUST,
} from "./mockData";
import { cn } from "@/lib/utils";

function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endVal = end;
    if (start === endVal) return;
    const stepTime = Math.abs(Math.floor((duration * 1000) / (endVal || 1)));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= endVal) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

interface KPIProps {
  title: string;
  value: number;
  unit?: string;
  prefix?: string;
  isDecimal?: boolean;
  trend: string;
  trendUpIsGood: boolean;
  sparklineData: { v: number }[];
  accentColor: string;
}

function KPICard({
  title,
  value,
  unit,
  prefix,
  isDecimal,
  trend,
  trendUpIsGood,
  sparklineData,
  accentColor,
}: KPIProps) {
  // Always call the hook (Rules of Hooks) — use raw value for decimals, animated count for integers
  const animatedCount = useCountUp(isDecimal ? 0 : value);
  const displayValue = isDecimal ? value : animatedCount;
  const trendIsPositive = trend.startsWith("+");
  const trendIsGood = trendIsPositive === trendUpIsGood;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-5 bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.05)]"
    >
      <div className="flex justify-between items-center mb-3">
        <p className="text-[11px] font-bold text-[#88827A] uppercase tracking-wider">{title}</p>
        <span
          className={cn(
            "text-[11px] font-bold px-2 py-0.5 rounded-md border",
            trendIsGood
              ? "text-[#5E8061] bg-[#EEF5EE] border-[#5E8061]/20"
              : "text-[#B83A3A] bg-[#FDEDED] border-[#B83A3A]/20"
          )}
        >
          {trend}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        {prefix && <span className="text-lg font-bold text-[#8B2635]">{prefix}</span>}
        <span className="text-3xl font-bold font-mono text-[#8B2635] tabular-nums">
          {displayValue}
        </span>
        {unit && <span className="text-xs font-semibold text-[#88827A] ml-0.5">{unit}</span>}
      </div>

      {/* Sparkline */}
      <div className="h-9 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={accentColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default function KPIStatsRow({ kpi }: { kpi: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Resolution Rate"
        value={kpi.resolutionRate}
        unit="%"
        trend="+6.2%"
        trendUpIsGood={true}
        sparklineData={SPARKLINE_RESOLUTION}
        accentColor="#8B2635"
      />
      <KPICard
        title="Avg Turnaround"
        value={kpi.avgResponseTime}
        unit="days"
        isDecimal={true}
        trend="-1.2d"
        trendUpIsGood={false}
        sparklineData={SPARKLINE_RESPONSE}
        accentColor="#5E8061"
      />
      <KPICard
        title="Active Backlog"
        value={kpi.pendingEscalations}
        trend="-4"
        trendUpIsGood={false}
        sparklineData={SPARKLINE_ESCALATIONS}
        accentColor="#C58B32"
      />
      <KPICard
        title="Citizen Trust Score"
        value={kpi.trustScore}
        unit="/5.0"
        isDecimal={true}
        trend="+0.3"
        trendUpIsGood={true}
        sparklineData={SPARKLINE_TRUST}
        accentColor="#8B2635"
      />
    </div>
  );
}
