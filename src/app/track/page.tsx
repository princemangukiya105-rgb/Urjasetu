'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Zap, Clock, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { getComplaints } from '@/lib/storage';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';

export default function TrackSearchPage() {
  const router = useRouter();
  const [searchId, setSearchId] = useState('');
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const list = getComplaints();
    setRecentComplaints(list);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const query = searchId.trim();
    const found = recentComplaints.find(
      (c) => c.id.toLowerCase() === query.toLowerCase()
    );

    if (found) {
      router.push(`/track/${found.id}`);
    } else {
      setErrorMsg(`No complaint found matching ID: "${query}". Please check the ID or pick from demo list below.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Public Audit & Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Complaint Progress
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Enter your unique reference ID to inspect real-time verification, assignment, and work progress updates on the transparent timeline.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Enter Reference / Complaint ID
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. URJ-2026-00124 or URJ-2026-00101"
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 font-bold text-sm text-white rounded-xl hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/30"
            >
              <span>Track Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Demo Complaints Quick Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Select Demo Complaints to Inspect</span>
          </h3>
          <span className="text-xs text-slate-400">Click any row to track</span>
        </div>

        <div className="space-y-2">
          {recentComplaints.map((item) => (
            <Link
              key={item.id}
              href={`/track/${item.id}`}
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-600 group-hover:underline">
                    {item.id}
                  </span>
                  <PriorityBadge priority={item.priority} size="sm" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">{item.issueType}</h4>
                <p className="text-[11px] text-slate-500">{item.location}</p>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <StatusBadge status={item.status} size="sm" />
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Track &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
