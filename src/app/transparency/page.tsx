'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Shield, Search, Filter, CheckCircle2, Clock, Wrench, FileText, ArrowUpRight } from 'lucide-react';
import { getComplaints } from '@/lib/storage';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatCard } from '@/components/StatCard';

export default function TransparencyPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');

  useEffect(() => {
    setComplaints(getComplaints());
    const handleStorage = () => setComplaints(getComplaints());
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, []);

  const totalReports = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const inProgressCount = complaints.filter((c) => c.status === 'WORK IN PROGRESS').length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'REPORTED' || c.status === 'VERIFIED' || c.status === 'ASSIGNED'
  ).length;

  // Extract unique areas for filter
  const areas = Array.from(new Set(complaints.map((c) => c.area)));

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (areaFilter !== 'ALL' && c.area !== areaFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchArea = c.area.toLowerCase().includes(q);
      const matchIssue = c.issueType.toLowerCase().includes(q);
      if (!matchId && !matchArea && !matchIssue) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Eye className="w-3.5 h-3.5" />
          <span>Public Governance & Civic Open Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Public Energy Infrastructure Transparency Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Open monitoring of all public electrical issues, resolution efficiency, and municipal accountability across all wards.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports Logged"
          value={totalReports}
          subtitle="Public energy issues"
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          color="blue"
          badgeText="100% Public"
        />
        <StatCard
          title="Resolved Issues"
          value={resolvedCount}
          subtitle="Fixed & verified"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          color="emerald"
          badgeText={`${Math.round((resolvedCount / (totalReports || 1)) * 100)}% Rate`}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Field crew repairing"
          icon={<Wrench className="w-5 h-5 text-amber-600" />}
          color="amber"
        />
        <StatCard
          title="Pending Verification"
          value={pendingCount}
          subtitle="Queued in admin desk"
          icon={<Clock className="w-5 h-5 text-indigo-600" />}
          color="indigo"
        />
      </div>

      {/* Transparency Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Public Audit Log (Privacy Preserved)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Personal citizen details are automatically masked to ensure privacy.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID or Area..."
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="WORK IN PROGRESS">Work In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Areas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Issue Description</th>
                <th className="py-3 px-4">Area & Ward</th>
                <th className="py-3 px-4">Reported Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Public Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No public complaints match the current search filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {item.issueType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.area} <span className="text-slate-400 font-mono">({item.ward})</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {new Date(item.reportedDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/track/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <span>Audit Timeline</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
