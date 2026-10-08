'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Users,
  Timer,
  BarChart3,
  MapPin,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { getComplaints, getMaintenanceTeams } from '@/lib/storage';
import { Complaint } from '@/types';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

export default function AdminOverviewDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setComplaints(getComplaints());
    const handleStorage = () => setComplaints(getComplaints());
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === 'REPORTED' || c.status === 'VERIFIED'
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === 'WORK IN PROGRESS' || c.status === 'ASSIGNED'
  ).length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const criticalHigh = complaints.filter(
    (c) => c.priority === 'Critical' || c.priority === 'High'
  ).length;

  const teamsCount = getMaintenanceTeams().length;

  // Recharts Data Transformation
  // 1. Complaints by Issue Type
  const issueTypeCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    issueTypeCounts[c.issueType] = (issueTypeCounts[c.issueType] || 0) + 1;
  });
  const issueChartData = Object.keys(issueTypeCounts).map((key) => ({
    name: key.length > 18 ? key.substring(0, 16) + '...' : key,
    count: issueTypeCounts[key],
  }));

  // 2. Status Distribution Pie Chart Data
  const statusPieData = [
    { name: 'Reported', value: complaints.filter((c) => c.status === 'REPORTED').length, color: '#64748b' },
    { name: 'Verified', value: complaints.filter((c) => c.status === 'VERIFIED').length, color: '#6366f1' },
    { name: 'Assigned', value: complaints.filter((c) => c.status === 'ASSIGNED').length, color: '#0ea5e9' },
    { name: 'In Progress', value: complaints.filter((c) => c.status === 'WORK IN PROGRESS').length, color: '#f59e0b' },
    { name: 'Resolved', value: complaints.filter((c) => c.status === 'RESOLVED').length, color: '#10b981' },
  ].filter((d) => d.value > 0);

  // 3. Complaints by Area Bar Chart
  const areaCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    areaCounts[c.area] = (areaCounts[c.area] || 0) + 1;
  });
  const areaChartData = Object.keys(areaCounts).map((key) => ({
    area: key,
    count: areaCounts[key],
  }));

  // 4. Simulated Trend Line Chart Data
  const trendLineData = [
    { day: '24 Sep', reports: 2, resolved: 1 },
    { day: '25 Sep', reports: 4, resolved: 3 },
    { day: '26 Sep', reports: 3, resolved: 2 },
    { day: '27 Sep', reports: 5, resolved: 4 },
    { day: '28 Sep', reports: 6, resolved: 5 },
    { day: '29 Sep', reports: 4, resolved: 3 },
    { day: '30 Sep', reports: 7, resolved: 4 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Urban Energy Control Dashboard</h1>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Live System
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time analytics and field team dispatch monitoring system.
          </p>
        </div>
        <Link
          href="/admin/complaints"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
        >
          <span>Manage Complaints ({total})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Top Stat Cards (7 Cards Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <StatCard
          title="Total Reports"
          value={total}
          icon={<FileText className="w-4 h-4 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Pending Desk"
          value={pending}
          icon={<Clock className="w-4 h-4 text-indigo-600" />}
          color="indigo"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={<Wrench className="w-4 h-4 text-amber-600" />}
          color="amber"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          color="emerald"
        />
        <StatCard
          title="High/Critical"
          value={criticalHigh}
          icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
          color="red"
        />
        <StatCard
          title="Avg Turnaround"
          value="4.2 h"
          icon={<Timer className="w-4 h-4 text-blue-600" />}
          color="slate"
        />
        <StatCard
          title="Field Teams"
          value={teamsCount}
          icon={<Users className="w-4 h-4 text-indigo-600" />}
          color="indigo"
        />
      </div>

      {/* Analytics Charts Grid (Recharts) */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Complaints Trend Line Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>1. Complaints Logged vs Resolved Over Time</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Last 7 Days</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendLineData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    name="Reports Logged"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Issues Resolved"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Complaints by Issue Type Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>2. Complaints Distribution by Issue Type</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issueChartData} layout="vertical">
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Complaint Status Donut / Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>3. Live Complaint Status Distribution</span>
            </h3>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Complaints by Area Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>4. Issues Count by Municipal Ward / Area</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaChartData}>
                  <XAxis dataKey="area" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Complaints" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent High Priority Complaints Desk */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Critical & High Priority Action Desk</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Requires immediate administrator verification and field team dispatch.
            </p>
          </div>
          <Link
            href="/admin/complaints"
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Manage All ({total}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Hazard / Issue</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {complaints
                .filter((c) => c.priority === 'Critical' || c.priority === 'High')
                .slice(0, 5)
                .map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.issueType}</td>
                    <td className="py-3 px-4 text-slate-600">{item.area}</td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.assignedTeam || (
                        <span className="text-amber-600 text-[11px] font-bold">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/complaints?id=${item.id}`}
                        className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                      >
                        Action &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
