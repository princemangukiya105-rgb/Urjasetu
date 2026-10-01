'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  Clock,
  Shield,
  Zap,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import {
  getComplaints,
  updateComplaintStatus,
  assignTeamToComplaint,
  updateComplaintPriority,
  addProgressUpdateToComplaint,
  getMaintenanceTeams,
} from '@/lib/storage';
import { Complaint, ComplaintStatus, MaintenanceTeam, Priority } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { TimelineView } from '@/components/TimelineView';

export default function AdminComplaintsPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');

  // Modal Action Form States
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('REPORTED');
  const [assignedTeam, setAssignedTeam] = useState<string>('');
  const [newPriority, setNewPriority] = useState<Priority>('High');
  const [progressMsg, setProgressMsg] = useState('');
  const [customStatusMsg, setCustomStatusMsg] = useState('');

  const teams = getMaintenanceTeams();

  const loadData = () => {
    const list = getComplaints();
    setComplaints(list);

    if (selectedComplaint) {
      const updated = list.find((c) => c.id === selectedComplaint.id);
      if (updated) setSelectedComplaint(updated);
    } else if (highlightId) {
      const found = list.find((c) => c.id.toLowerCase() === highlightId.toLowerCase());
      if (found) setSelectedComplaint(found);
    }
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, [highlightId]);

  const handleOpenDetail = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status);
    setAssignedTeam(c.assignedTeam || '');
    setNewPriority(c.priority);
    setProgressMsg('');
    setCustomStatusMsg('');
  };

  const handleStatusChange = () => {
    if (!selectedComplaint) return;
    const updated = updateComplaintStatus(
      selectedComplaint.id,
      newStatus,
      'Urban Energy Admin',
      customStatusMsg || undefined
    );
    if (updated) {
      setSelectedComplaint(updated);
      setCustomStatusMsg('');
      alert(`Status updated to ${newStatus}`);
    }
  };

  const handleTeamAssign = () => {
    if (!selectedComplaint || !assignedTeam) return;
    const updated = assignTeamToComplaint(selectedComplaint.id, assignedTeam, 'Urban Energy Admin');
    if (updated) {
      setSelectedComplaint(updated);
      alert(`Assigned to ${assignedTeam}`);
    }
  };

  const handlePriorityChange = () => {
    if (!selectedComplaint) return;
    const updated = updateComplaintPriority(selectedComplaint.id, newPriority, 'Urban Energy Admin');
    if (updated) {
      setSelectedComplaint(updated);
      alert(`Priority updated to ${newPriority}`);
    }
  };

  const handleAddProgressNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !progressMsg.trim()) return;
    const updated = addProgressUpdateToComplaint(
      selectedComplaint.id,
      progressMsg.trim(),
      'Urban Energy Admin Desk'
    );
    if (updated) {
      setSelectedComplaint(updated);
      setProgressMsg('');
    }
  };

  const areas = Array.from(new Set(complaints.map((c) => c.area)));

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (areaFilter !== 'ALL' && c.area !== areaFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchArea = c.area.toLowerCase().includes(q);
      const matchIssue = c.issueType.toLowerCase().includes(q);
      const matchLoc = c.location.toLowerCase().includes(q);
      if (!matchId && !matchArea && !matchIssue && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Complaints Management Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming urban energy reports, assign maintenance personnel, and update progress.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search complaint ID, issue, or location..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="VERIFIED">Verified</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="WORK IN PROGRESS">Work In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REOPENED">Reopened</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
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

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Issue Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Reported Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No complaints match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.issueType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{item.location}</div>
                      <span className="text-slate-400 text-[10px]">{item.area}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {new Date(item.reportedDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.assignedTeam || (
                        <span className="text-amber-600 text-[10px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Action</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLAINT DETAIL & ACTION MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl space-y-6 p-6 md:p-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-base text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {selectedComplaint.id}
                </span>
                <PriorityBadge priority={selectedComplaint.priority} />
                <StatusBadge status={selectedComplaint.status} />
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Complaint Info & Photos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <strong className="text-slate-400 uppercase tracking-wider block text-[10px]">
                  Issue Category
                </strong>
                <span className="font-bold text-slate-900 text-sm">{selectedComplaint.issueType}</span>
                <p className="text-slate-600 mt-1">"{selectedComplaint.description}"</p>
              </div>

              <div>
                <strong className="text-slate-400 uppercase tracking-wider block text-[10px]">
                  Location & Area
                </strong>
                <span className="font-semibold text-slate-900">{selectedComplaint.location}</span>
                <span className="block text-slate-500">{selectedComplaint.area} • {selectedComplaint.ward}</span>
              </div>

              <div>
                <strong className="text-slate-400 uppercase tracking-wider block text-[10px]">
                  Citizen Info
                </strong>
                <span className="font-semibold text-slate-900">{selectedComplaint.reportedBy.name}</span>
                <span className="block text-slate-500">{selectedComplaint.reportedBy.phone}</span>
              </div>
            </div>

            {selectedComplaint.image && (
              <div className="p-3 bg-slate-100 rounded-xl">
                <strong className="text-xs font-bold text-slate-700 block mb-2">Citizen Uploaded Photo:</strong>
                <img
                  src={selectedComplaint.image}
                  alt="Complaint photo"
                  className="max-h-48 rounded-lg border border-slate-300 object-cover"
                />
              </div>
            )}

            {/* ADMIN ACTIONS SECTION */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-extrabold text-blue-950 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Administrative Actions & Field Dispatch</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Change Status */}
                <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800">
                    Update Workflow Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="REPORTED">REPORTED</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="WORK IN PROGRESS">WORK IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="REOPENED">REOPENED</option>
                  </select>

                  <input
                    type="text"
                    value={customStatusMsg}
                    onChange={(e) => setCustomStatusMsg(e.target.value)}
                    placeholder="Optional timeline note..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />

                  <button
                    onClick={handleStatusChange}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-500"
                  >
                    Update Status
                  </button>
                </div>

                {/* 2. Assign Maintenance Team */}
                <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800">
                    Assign Maintenance Team
                  </label>
                  <select
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="">Select Team</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.availability})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleTeamAssign}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-500 mt-[26px]"
                  >
                    Assign Field Crew
                  </button>
                </div>

                {/* 3. Change Priority */}
                <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800">
                    Change Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>

                  <button
                    onClick={handlePriorityChange}
                    className="w-full py-2 bg-slate-800 text-white rounded-lg font-bold text-xs hover:bg-slate-700 mt-[26px]"
                  >
                    Update Priority
                  </button>
                </div>
              </div>

              {/* Add Custom Field Progress Note */}
              <form onSubmit={handleAddProgressNote} className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Add Field Inspection Note / Progress Update</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={progressMsg}
                    onChange={(e) => setProgressMsg(e.target.value)}
                    placeholder="e.g. Field crew on site replacing 100W LED module..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-500 shrink-0"
                  >
                    Add Update
                  </button>
                </div>
              </form>
            </div>

            {/* Complete Vertical Timeline Preview */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Live Audit Timeline Preview
              </h4>
              <TimelineView
                timeline={selectedComplaint.timeline}
                currentStatus={selectedComplaint.status}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
