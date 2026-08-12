"use client";

import { motion } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";
import { TREND_DATA, DEPT_RESOLUTION_DATA } from "./mockData";

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Trend Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/[0.08]"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Issue Reporting vs Resolution</h3>
          <p className="text-sm text-slate-400">6-month rolling trend</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B1120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              <Line type="monotone" name="Submitted" dataKey="submitted" stroke="#334155" strokeWidth={3} dot={{ r: 4, fill: '#334155', strokeWidth: 0 }} />
              <Line type="monotone" name="Resolved" dataKey="resolved" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4, fill: '#14B8A6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#14B8A6', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/[0.08]"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Resolution Rate by Department</h3>
          <p className="text-sm text-slate-400">Current month performance (%)</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEPT_RESOLUTION_DATA} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ backgroundColor: '#0B1120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#14B8A6' }}
              />
              <Bar dataKey="rate" name="Resolution %" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={24}>
                {
                  DEPT_RESOLUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 80 ? '#14B8A6' : entry.rate > 60 ? '#F59E0B' : '#ef4444'} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
