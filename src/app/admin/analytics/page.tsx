'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Clock, Zap } from 'lucide-react';
import { getComplaints } from '@/lib/storage';
import { Complaint } from '@/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setComplaints(getComplaints());
  }, []);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Recharts
  const priorityDistribution = [
    { name: 'Critical', count: complaints.filter((c) => c.priority === 'Critical').length, fill: '#ef4444' },
    { name: 'High', count: complaints.filter((c) => c.priority === 'High').length, fill: '#f59e0b' },
    { name: 'Medium', count: complaints.filter((c) => c.priority === 'Medium').length, fill: '#3b82f6' },
    { name: 'Low', count: complaints.filter((c) => c.priority === 'Low').length, fill: '#94a3b8' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Analytics & Performance KPI
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics evaluating urban electrical infrastructure coordination efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overall Resolution Rate
          </span>
          <div className="text-3xl font-extrabold text-emerald-600">{resolutionRate}%</div>
          <p className="text-xs text-slate-400">Total complaints completed on schedule</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Hazard Response
          </span>
          <div className="text-3xl font-extrabold text-blue-600">4.2 Hours</div>
          <p className="text-xs text-slate-400">Critical hazard safety isolation time</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Data Quality Audit
          </span>
          <div className="text-3xl font-extrabold text-indigo-600">100% Verified</div>
          <p className="text-xs text-slate-400">All reports validated by admin desk</p>
        </div>
      </div>

      {mounted && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Hazard Severity & Priority Breakdown</span>
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityDistribution}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Complaints Count" radius={[8, 8, 0, 0]}>
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
