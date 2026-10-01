'use client';

import React, { useState } from 'react';
import { Complaint } from '../types';
import { MapPin, Navigation, Info, AlertOctagon, Filter, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import Link from 'next/link';

interface InteractiveMapProps {
  complaints: Complaint[];
  onSelectComplaint?: (c: Complaint) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  complaints,
  onSelectComplaint,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints.length > 0 ? complaints[0] : null
  );
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredComplaints = complaints.filter((c) => {
    if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const getMarkerColor = (priority: string, status: string) => {
    if (status === 'RESOLVED') return 'bg-emerald-500 text-white ring-emerald-200';
    if (priority === 'Critical') return 'bg-red-600 text-white ring-red-200 animate-bounce';
    if (priority === 'High') return 'bg-amber-500 text-white ring-amber-200';
    return 'bg-blue-600 text-white ring-blue-200';
  };

  // Convert lat/lng to stylized percentage coordinates on the grid map
  // Bounds roughly covering lat 19.27 - 19.31 and lng 72.83 - 72.88
  const getMapPosition = (lat: number, lng: number) => {
    const minLat = 19.27;
    const maxLat = 19.31;
    const minLng = 72.83;
    const maxLng = 72.88;

    const x = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 80 + 10, 8), 92);
    const y = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 80 + 10, 8), 92);

    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col lg:flex-row">
      {/* Main Stylized Map Container */}
      <div className="flex-1 relative bg-slate-900 min-h-[480px] md:min-h-[550px] p-4 flex flex-col justify-between overflow-hidden">
        {/* Vector Stylized Map Background (Grid, Roads, Zones) */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Simulated Road Lines SVG overlay */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-700/60 stroke-[1.5] fill-none pointer-events-none">
          <path d="M 50 0 Q 200 150 400 200 T 800 500" className="stroke-blue-500/30 stroke-[3]" />
          <path d="M 0 300 Q 300 280 600 350 T 1000 400" className="stroke-slate-600 stroke-[2]" />
          <path d="M 150 0 L 250 600" className="stroke-slate-600 stroke-[1.5]" />
          <path d="M 550 0 L 450 600" className="stroke-slate-600 stroke-[1.5]" />
          {/* Ward Outlines */}
          <circle cx="25%" cy="30%" r="80" className="stroke-blue-500/20 fill-blue-500/5 stroke-dasharray-[4_4]" />
          <circle cx="70%" cy="40%" r="110" className="stroke-emerald-500/20 fill-emerald-500/5 stroke-dasharray-[4_4]" />
          <circle cx="45%" cy="75%" r="90" className="stroke-amber-500/20 fill-amber-500/5 stroke-dasharray-[4_4]" />
        </svg>

        {/* Map Top Control Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white">Urban Electrical Grid GIS Map</span>
              <span className="block text-[10px] text-slate-400">Mira-Bhayandar Municipal Energy Zone</span>
            </div>
          </div>

          {/* Map Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
              <Filter className="w-3 h-3 text-slate-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-hidden font-medium cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Priorities</option>
                <option value="Critical" className="bg-slate-900 text-white">Critical Only</option>
                <option value="High" className="bg-slate-900 text-white">High Only</option>
                <option value="Medium" className="bg-slate-900 text-white">Medium Only</option>
                <option value="Low" className="bg-slate-900 text-white">Low Only</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-hidden font-medium cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Statuses</option>
                <option value="REPORTED" className="bg-slate-900 text-white">Reported</option>
                <option value="VERIFIED" className="bg-slate-900 text-white">Verified</option>
                <option value="WORK IN PROGRESS" className="bg-slate-900 text-white">Work In Progress</option>
                <option value="RESOLVED" className="bg-slate-900 text-white">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map Pins / Markers */}
        <div className="relative flex-1 my-4">
          {filteredComplaints.map((item) => {
            const pos = getMapPosition(item.coordinates.lat, item.coordinates.lng);
            const isSelected = selectedComplaint?.id === item.id;
            const markerClass = getMarkerColor(item.priority, item.status);

            return (
              <div
                key={item.id}
                style={pos}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform hover:scale-125"
                onClick={() => {
                  setSelectedComplaint(item);
                  if (onSelectComplaint) onSelectComplaint(item);
                }}
              >
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-[11px] ring-4 shadow-lg transition-all ${markerClass} ${
                    isSelected ? 'ring-white scale-125 z-30' : ''
                  }`}
                  title={`${item.id}: ${item.issueType} (${item.area})`}
                >
                  <MapPin className="w-4 h-4 fill-current stroke-slate-900" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend Footer */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-sm p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Legend:</span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Critical Hazard
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> High Priority
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Medium/Low
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Resolved
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            Showing {filteredComplaints.length} active pins
          </span>
        </div>
      </div>

      {/* Side Detail Card for Selected Pin */}
      <div className="w-full lg:w-80 p-5 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
        {selectedComplaint ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {selectedComplaint.id}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                  {selectedComplaint.issueType}
                </h3>
              </div>
              <PriorityBadge priority={selectedComplaint.priority} size="sm" />
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900 block font-semibold">Location / Area:</strong>
                <span>{selectedComplaint.location}</span>
                <span className="block text-slate-400 font-medium mt-0.5">
                  {selectedComplaint.area} • {selectedComplaint.ward}
                </span>
              </div>

              <div>
                <strong className="text-slate-900 block font-semibold">Reported Description:</strong>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-slate-700 leading-relaxed text-[11px] mt-1">
                  "{selectedComplaint.description}"
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block font-semibold">Current Status:</strong>
                <div className="mt-1">
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>
              </div>

              {selectedComplaint.assignedTeam && (
                <div>
                  <strong className="text-slate-900 block font-semibold">Assigned Team:</strong>
                  <span className="text-blue-700 font-medium">
                    {selectedComplaint.assignedTeam}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                href={`/track/${selectedComplaint.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs"
              >
                <Info className="w-3.5 h-3.5" />
                <span>View Full Timeline & Tracking &rarr;</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-6 text-slate-400 text-xs">
            Click any pin on the map to view complaint details.
          </div>
        )}
      </div>
    </div>
  );
};
