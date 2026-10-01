'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, User, Wrench, RefreshCw, Zap } from 'lucide-react';
import { getComplaints } from '@/lib/storage';
import { TimelineItem } from '@/types';

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<(TimelineItem & { complaintId: string })[]>([]);

  useEffect(() => {
    const complaints = getComplaints();
    const allEvents: (TimelineItem & { complaintId: string })[] = [];

    complaints.forEach((c) => {
      c.timeline.forEach((tl) => {
        allEvents.push({
          ...tl,
          complaintId: c.id,
        });
      });
    });

    // Sort descending by timestamp
    allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setActivities(allEvents);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Activity Log & Audit Trail
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological stream of all system events, status changes, assignments, and citizen reports.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Live System Events Feed ({activities.length} Events)</span>
          </h3>
        </div>

        <div className="space-y-3">
          {activities.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600">{item.complaintId}</span>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-800 font-medium">{item.message}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Actor: <strong>{item.actor}</strong></span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-mono block">
                  {new Date(item.timestamp).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
