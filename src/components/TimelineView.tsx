import React from 'react';
import { ComplaintStatus, TimelineItem } from '../types';
import { Check, Clock, User, Wrench, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface TimelineViewProps {
  timeline: TimelineItem[];
  currentStatus: ComplaintStatus;
}

const ALL_STATUSES: { status: ComplaintStatus; label: string; desc: string }[] = [
  { status: 'REPORTED', label: 'Report Submitted', desc: 'Citizen submitted public energy issue with location & optional details.' },
  { status: 'VERIFIED', label: 'Complaint Verified', desc: 'Urban Energy Administration desk verified the reported infrastructure issue.' },
  { status: 'ASSIGNED', label: 'Team Assigned', desc: 'Assigned to specialized electrical field maintenance crew.' },
  { status: 'WORK IN PROGRESS', label: 'Work In Progress', desc: 'Field crew dispatched to location and active repairs under way.' },
  { status: 'RESOLVED', label: 'Issue Resolved', desc: 'Electrical fixture repaired, tested, and marked operational.' },
];

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline, currentStatus }) => {
  // Sort timeline chronologically
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Map timeline items by status for quick lookup
  const timelineByStatus = new Map<ComplaintStatus, TimelineItem>();
  sortedTimeline.forEach((item) => {
    timelineByStatus.set(item.status, item);
  });

  // Determine current step index in the standard workflow
  const getStatusIndex = (st: ComplaintStatus) => {
    switch (st) {
      case 'REPORTED': return 0;
      case 'VERIFIED': return 1;
      case 'ASSIGNED': return 2;
      case 'WORK IN PROGRESS': return 3;
      case 'RESOLVED': return 4;
      case 'REOPENED': return 3; // treat reopened as work in progress step
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(currentStatus);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return {
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };
    } catch {
      return { date: isoString, time: '' };
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Transparent Resolution Timeline</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audit trail of administrative verification, assignment, and repairs.
          </p>
        </div>
        <StatusBadge status={currentStatus} size="lg" />
      </div>

      <div className="relative pl-3 md:pl-6 space-y-8">
        {ALL_STATUSES.map((step, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && currentStatus === 'RESOLVED');
          const isCurrent = idx === currentIndex && currentStatus !== 'RESOLVED';
          const isPending = idx > currentIndex;

          const existingEvent = timelineByStatus.get(step.status);
          const formatted = existingEvent ? formatDate(existingEvent.timestamp) : null;

          return (
            <div key={step.status} className="relative flex gap-4 md:gap-6 group">
              {/* Connector line */}
              {idx < ALL_STATUSES.length - 1 && (
                <div
                  className={`absolute left-[15px] md:left-[23px] top-[36px] bottom-[-32px] w-[2px] transition-colors ${
                    idx < currentIndex
                      ? 'bg-emerald-500'
                      : idx === currentIndex
                      ? 'bg-gradient-to-b from-blue-500 to-slate-200'
                      : 'bg-slate-200 border-l border-dashed border-slate-300'
                  }`}
                />
              )}

              {/* Status Marker Icon */}
              <div className="relative z-10 shrink-0">
                {isCompleted ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 ring-4 ring-emerald-50">
                    <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 ring-4 ring-blue-100 animate-pulse">
                    <Wrench className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 text-slate-400 border-2 border-slate-200 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                )}
              </div>

              {/* Event Content Card */}
              <div
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/30 border-emerald-100'
                    : 'bg-slate-50/50 border-slate-100 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-semibold text-sm md:text-base ${
                        isCurrent
                          ? 'text-blue-950 font-bold'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                        Current Status
                      </span>
                    )}
                  </div>

                  {formatted && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {formatted.date} • {formatted.time}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {existingEvent ? existingEvent.message : step.desc}
                </p>

                {existingEvent && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <User className="w-3 h-3 text-slate-400" />
                      Updated by: <strong className="text-slate-700">{existingEvent.actor}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-mono">
                      Ref #{existingEvent.id.slice(-6)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional custom timeline progress notes if present */}
      {sortedTimeline.filter((item) => item.type === 'update').length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Field Inspection Notes & Progress Updates
          </h4>
          <div className="space-y-3">
            {sortedTimeline
              .filter((item) => item.type === 'update')
              .map((note) => {
                const f = formatDate(note.timestamp);
                return (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{note.actor}: </span>
                      <span className="text-slate-600">{note.message}</span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 font-mono">
                      {f.date} {f.time}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
