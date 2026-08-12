"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { TREND_DATA, DEPT_RESOLUTION_DATA } from "./mockData";

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-6 bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.05)]"
      >
        <div className="mb-6">
          <h3 className="text-base font-bold text-[#242222]">Reporting vs Resolution Volume</h3>
          <p className="text-xs text-[#625E59]">6-month municipal rolling trend</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DED8CD" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#88827A"
                tick={{ fill: "#88827A", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#88827A"
                tick={{ fill: "#88827A", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#DED8CD",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(36,34,34,0.1)",
                  color: "#242222",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "14px", fontSize: "11px" }} />
              <Line
                type="monotone"
                name="Submitted Reports"
                dataKey="submitted"
                stroke="#C9C0B3"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#C9C0B3", strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                name="Resolved Incidents"
                dataKey="resolved"
                stroke="#8B2635"
                strokeWidth={3}
                dot={{ r: 4, fill: "#8B2635", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#641B27", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-6 bg-white border border-[#DED8CD] shadow-[0_4px_20px_rgba(36,34,34,0.05)]"
      >
        <div className="mb-6">
          <h3 className="text-base font-bold text-[#242222]">Department SLA Resolution Rate</h3>
          <p className="text-xs text-[#625E59]">Current month efficiency percentage (%)</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DEPT_RESOLUTION_DATA}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#DED8CD" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#88827A"
                tick={{ fill: "#88827A", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="dept"
                type="category"
                stroke="#88827A"
                tick={{ fill: "#242222", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip
                cursor={{ fill: "rgba(240,229,216,0.3)" }}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#DED8CD",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(36,34,34,0.1)",
                  color: "#242222",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="rate" name="Resolution %" fill="#8B2635" radius={[0, 4, 4, 0]} barSize={20}>
                {DEPT_RESOLUTION_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.rate > 80
                        ? "#8B2635"
                        : entry.rate > 60
                        ? "#C58B32"
                        : "#B83A3A"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
