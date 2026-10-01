'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  UserCheck,
  Copy,
  Check,
  Image as ImageIcon,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { getComplaintById } from '@/lib/storage';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { TimelineView } from '@/components/TimelineView';
import { SafetyBanner } from '@/components/SafetyBanner';

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = () => {
    if (id) {
      const data = getComplaintById(id);
      setComplaint(data || null);
    }
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, [id]);

  const handleCopyId = () => {
    if (complaint) {
      navigator.clipboard.writeText(complaint.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 max-w-md mx-auto">
          <h2 className="font-bold text-base">Complaint Not Found</h2>
          <p className="text-xs mt-1">
            No complaint record exists matching ID: <span className="font-mono font-bold">{id}</span>
          </p>
        </div>
        <Link
          href="/track"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(complaint.reportedDate).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Nav & Copy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/track"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaint Tracking</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'ID Copied!' : `Copy ID: ${complaint.id}`}</span>
          </button>
        </div>
      </div>

      {/* Safety Caution */}
      <SafetyBanner compact />

      {/* Main Complaint Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {complaint.id}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              {complaint.issueType}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported on {formattedDate}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Status
            </span>
            <StatusBadge status={complaint.status} size="lg" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Column 1: Location */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> Location Details
            </span>
            <p className="font-bold text-slate-900 text-sm">{complaint.location}</p>
            <p className="text-slate-500">
              {complaint.area} • {complaint.ward} (Pin: {complaint.pincode})
            </p>
          </div>

          {/* Column 2: Assigned Team */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-slate-400" /> Maintenance Crew
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {complaint.assignedTeam || 'Pending Team Assignment'}
            </p>
            <p className="text-slate-500">
              {complaint.assignedTeam
                ? 'Field crew assigned by Urban Energy Control'
                : 'Under admin review'}
            </p>
          </div>

          {/* Column 3: Priority & Privacy */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-400" /> Privacy Protected
            </span>
            <p className="font-semibold text-slate-700">
              Reported by: {complaint.reportedBy.name}
            </p>
            <p className="text-slate-400 text-[11px]">
              Personal contact details redacted on public tracking view.
            </p>
          </div>
        </div>

        {/* Description & Photo */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div>
            <strong className="text-slate-900 text-xs font-bold block mb-1">
              Issue Observation Details:
            </strong>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed text-xs sm:text-sm">
              "{complaint.description}"
            </p>
          </div>

          {complaint.image && (
            <div className="pt-2">
              <strong className="text-slate-900 text-xs font-bold flex items-center gap-1.5 mb-2">
                <ImageIcon className="w-4 h-4 text-blue-600" /> Attached Photo Evidence:
              </strong>
              <img
                src={complaint.image}
                alt="Complaint photo"
                className="max-h-64 rounded-xl border border-slate-300 object-cover shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Vertical Transparent Timeline */}
      <TimelineView timeline={complaint.timeline} currentStatus={complaint.status} />
    </div>
  );
}
