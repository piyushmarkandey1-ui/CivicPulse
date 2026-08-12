"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SPARKLINE_RESOLUTION, SPARKLINE_RESPONSE, SPARKLINE_ESCALATIONS, SPARKLINE_TRUST } from "./mockData";
import { cn } from "@/lib/utils";

// Animated counter hook
function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endVal = end;
    if (start === endVal) return;
    const stepTime = Math.abs(Math.floor(duration * 1000 / endVal));
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
  sparklineData: any[];
  sparklineColor: string;
}

function KPICard({ title, value, unit, prefix, isDecimal, trend, trendUpIsGood, sparklineData, sparklineColor }: KPIProps) {
  // Hacky countup for demo: if decimal, just show final value instantly, else use countup
  const displayValue = isDecimal ? value : useCountUp(value);
  const trendIsPositive = trend.startsWith("+");
  const trendIsGood = trendIsPositive === trendUpIsGood;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 border border-white/[0.08]"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
        <span className={cn(
          "text-xs font-bold px-2 py-0.5 rounded-md",
          trendIsGood ? "bg-teal/10 text-teal-light" : "bg-red-500/10 text-red-400"
        )}>
          {trend}
        </span>
      </div>
      <div className="flex items-end gap-1 mb-4">
        {prefix && <span className="text-2xl font-bold text-white mb-0.5">{prefix}</span>}
        <span className="text-4xl font-black text-white">{displayValue}</span>
        {unit && <span className="text-lg font-bold text-slate-500 mb-1">{unit}</span>}
      </div>
      
      {/* Sparkline */}
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line 
              type="monotone" 
              dataKey="v" 
              stroke={sparklineColor} 
              strokeWidth={3} 
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default function KPIStatsRow({ kpi }: { kpi: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard 
        title="Resolution Rate" 
        value={kpi.resolutionRate} 
        unit="%" 
        trend="+4.2%" 
        trendUpIsGood={true}
        sparklineData={SPARKLINE_RESOLUTION}
        sparklineColor="#14B8A6"
      />
      <KPICard 
        title="Avg Response Time" 
        value={kpi.avgResponseTime} 
        isDecimal
        unit=" days" 
        trend="-0.8d" 
        trendUpIsGood={false}
        sparklineData={SPARKLINE_RESPONSE}
        sparklineColor="#F59E0B"
      />
      <KPICard 
        title="Pending Escalations" 
        value={kpi.pendingEscalations} 
        trend="-12%" 
        trendUpIsGood={false}
        sparklineData={SPARKLINE_ESCALATIONS}
        sparklineColor="#ef4444"
      />
      <KPICard 
        title="Public Trust Score" 
        value={kpi.trustScore}
        isDecimal
        prefix="" 
        unit="/10"
        trend="+0.4" 
        trendUpIsGood={true}
        sparklineData={SPARKLINE_TRUST}
        sparklineColor="#8B5CF6"
      />
    </div>
  );
}
