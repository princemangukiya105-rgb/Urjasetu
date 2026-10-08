'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  PlusCircle,
  Eye,
  Activity,
  Layers,
  Wrench,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { SafetyBanner } from '@/components/SafetyBanner';
import { getComplaints } from '@/lib/storage';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';

export default function LandingPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

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

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Glow Effects Background */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 fill-blue-400" />
              <span>Urban Energy Infrastructure Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smarter Cities Start With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">Better Coordination.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Report public electrical issues, track their progress in real-time, and help create a more responsive, efficient, and transparent urban environment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm hover:bg-slate-700/80 transition-all"
              >
                <Search className="w-4 h-4 text-blue-400" />
                <span>Track Complaint</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual: Workflow Illustration */}
          <div className="mt-16 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-700/60 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                CORE COORDINATION FLOW
              </span>
              <span>Transparent 5-Stage Life Cycle</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
              {/* Step 1 */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-center space-y-2 group hover:border-blue-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-blue-400 flex items-center justify-center mx-auto font-bold border border-blue-700/50">
                  01
                </div>
                <h4 className="font-bold text-sm text-white">Citizen Report</h4>
                <p className="text-[11px] text-slate-400">Citizen logs streetlight hazard with location & photo.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-center space-y-2 group hover:border-indigo-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-900/60 text-indigo-400 flex items-center justify-center mx-auto font-bold border border-indigo-700/50">
                  02
                </div>
                <h4 className="font-bold text-sm text-white">Admin Review</h4>
                <p className="text-[11px] text-slate-400">Admin desk verifies issue details & sets priority.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-center space-y-2 group hover:border-sky-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sky-900/60 text-sky-400 flex items-center justify-center mx-auto font-bold border border-sky-700/50">
                  03
                </div>
                <h4 className="font-bold text-sm text-white">Assigned</h4>
                <p className="text-[11px] text-slate-400">Assigned to electrical maintenance team.</p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-center space-y-2 group hover:border-amber-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-900/60 text-amber-400 flex items-center justify-center mx-auto font-bold border border-amber-700/50">
                  04
                </div>
                <h4 className="font-bold text-sm text-white">Work In Progress</h4>
                <p className="text-[11px] text-slate-400">Field crew performs repairs & updates status.</p>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-center space-y-2 group hover:border-emerald-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center mx-auto font-bold border border-emerald-700/50">
                  05
                </div>
                <h4 className="font-bold text-sm text-white">Resolved</h4>
                <p className="text-[11px] text-slate-400">Issue fixed and transparently verified on timeline.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-slate-100 last:border-0 pr-4">
            <span className="block text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalReports}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Issues Reported
            </span>
            <span className="text-[10px] text-blue-600 font-medium">Live System Data</span>
          </div>

          <div className="border-r border-slate-100 last:border-0 pr-4">
            <span className="block text-3xl font-extrabold text-emerald-600 tracking-tight">
              {resolvedCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Issues Resolved
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">100% Tracked</span>
          </div>

          <div className="border-r border-slate-100 last:border-0 pr-4">
            <span className="block text-3xl font-extrabold text-blue-600 tracking-tight">
              4.2 hrs
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Avg Resolution Time
            </span>
            <span className="text-[10px] text-slate-400">High Hazard Priority</span>
          </div>

          <div>
            <span className="block text-3xl font-extrabold text-amber-500 tracking-tight">
              {inProgressCount + pendingCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Active Complaints
            </span>
            <span className="text-[10px] text-amber-600 font-medium">In Field Coordination</span>
          </div>
        </div>
      </section>

      {/* Safety Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SafetyBanner />
      </section>

      {/* Central Story / Process Flow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Urban Resource Lifecycle
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3">
            How UrjaSetu Solves Infrastructure Coordination
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            "To observe urban resource usage and demonstrate a very basic system for better coordination."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">1. Observe & Report</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens notice unlit streetlights, exposed wires, or damaged utility poles and submit precise location, pin code, and photo evidence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">2. Verify & Coordinate</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Urban Energy Administration desk reviews complaints, categorizes hazard severity, and assigns designated electrical maintenance crews.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">3. Resolve & Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintenance crews complete repairs, upload status notes, and close out complaints with transparent vertical timeline updates visible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Live Public Complaints Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Recent Public Infrastructure Reports</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time snapshot of active electrical issues across municipal wards.
              </p>
            </div>
            <Link
              href="/transparency"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>View Full Transparency Portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Issue Type</th>
                  <th className="py-3 px-4">Area & Ward</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {complaints.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {item.issueType}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.area} <span className="text-slate-400 font-mono">({item.ward})</span>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/track/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Track &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
