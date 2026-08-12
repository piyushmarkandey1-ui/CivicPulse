"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SPARKLINE_RESOLUTION, SPARKLINE_RESPONSE, SPARKLINE_ESCALATIONS, SPARKLINE_TRUST } from "./mockData";
import { cn } from "@/lib/utils";

function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endVal = end;
    if (start === endVal) return;
    const stepTime = Math.abs(Math.floor((duration * 1000) / endVal));
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
  title, value, unit, prefix, isDecimal, trend, trendUpIsGood, sparklineData, accentColor,
}: KPIProps) {
  const displayValue = isDecimal ? value : useCountUp(value);
  const trendIsPositive = trend.startsWith("+");
  const trendIsGood = trendIsPositive === trendUpIsGood;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-5"
      style={{
        background: "#0F1726",
        border: "1px solid rgba(148,163,184,0.10)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-md",
            trendIsGood
              ? "text-teal"
              : "text-danger"
          )}
          style={{
            background: trendIsGood
              ? "rgba(79,209,165,0.08)"
              : "rgba(240,82,82,0.08)",
          }}
        >
          {trend}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        {prefix && <span className="text-lg font-semibold text-slate-300">{prefix}</span>}
        <span className="text-3xl font-bold text-slate-100 tabular-nums">
          {displayValue}
        </span>
        {unit && <span className="text-sm font-medium text-slate-500 ml-0.5">{unit}</span>}
      </div>

      {/* Sparkline */}
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={accentColor}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default function KPIStatsRow({ kpi }: { kpi: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Resolution Rate"
        value={kpi.resolutionRate}
        unit="%"
        trend="+4.2%"
        trendUpIsGood
        sparklineData={SPARKLINE_RESOLUTION}
        accentColor="#4FD1A5"
      />
      <KPICard
        title="Avg Response Time"
        value={kpi.avgResponseTime}
        isDecimal
        unit=" days"
        trend="-0.8d"
        trendUpIsGood={false}
        sparklineData={SPARKLINE_RESPONSE}
        accentColor="#4FD1A5"
      />
      <KPICard
        title="Pending Escalations"
        value={kpi.pendingEscalations}
        trend="-12%"
        trendUpIsGood={false}
        sparklineData={SPARKLINE_ESCALATIONS}
        accentColor="#F05252"
      />
      <KPICard
        title="Public Trust Score"
        value={kpi.trustScore}
        isDecimal
        unit="/10"
        trend="+0.4"
        trendUpIsGood
        sparklineData={SPARKLINE_TRUST}
        accentColor="#4FD1A5"
      />
    </div>
  );
}
