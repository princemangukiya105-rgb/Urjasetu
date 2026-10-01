'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  Bell,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Zap,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { getComplaints, getNotifications } from '@/lib/storage';
import { Complaint, NotificationItem } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatCard } from '@/components/StatCard';

export default function CitizenPortalPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'complaints' | 'notifications'>('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setComplaints(getComplaints());
    setNotifications(getNotifications());
    const handleStorage = () => {
      setComplaints(getComplaints());
      setNotifications(getNotifications());
    };
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === 'REPORTED' || c.status === 'VERIFIED' || c.status === 'ASSIGNED'
  ).length;
  const inProgress = complaints.filter((c) => c.status === 'WORK IN PROGRESS').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Citizen Portal
            </span>
            <span className="text-xs text-slate-300 font-mono">Mira-Bhayandar Zone</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Prince Mangukiya
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your logged electrical infrastructure issues, submit new reports, and view official administration updates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Issue</span>
          </Link>
          <Link
            href="/track"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Track by ID</span>
          </Link>
        </div>
      </div>

      {/* Portal Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'complaints'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Complaints ({total})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Updates & Notifications ({notifications.filter((n) => !n.read).length})</span>
        </button>
      </div>

      {/* DASHBOARD TAB CONTENT */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Complaints"
              value={total}
              subtitle="Submitted by you"
              icon={<Zap className="w-5 h-5 text-blue-600" />}
              color="blue"
            />
            <StatCard
              title="Pending Desk"
              value={pending}
              subtitle="Under review"
              icon={<Clock className="w-5 h-5 text-indigo-600" />}
              color="indigo"
            />
            <StatCard
              title="In Progress"
              value={inProgress}
              subtitle="Crew active on site"
              icon={<Wrench className="w-5 h-5 text-amber-600" />}
              color="amber"
            />
            <StatCard
              title="Resolved"
              value={resolved}
              subtitle="Fixed & operational"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              color="emerald"
            />
          </div>

          {/* Recent Complaints Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Recent Complaints Log</h3>
              <button
                onClick={() => setActiveTab('complaints')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-4">Complaint ID</th>
                    <th className="py-3 px-4">Issue</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {complaints.slice(0, 6).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {item.issueType}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{item.location}</td>
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
                          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
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
        </div>
      )}

      {/* MY COMPLAINTS TAB CONTENT */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-lg text-slate-900">All Submitted Complaints</h3>
          <div className="space-y-3">
            {complaints.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600">{item.id}</span>
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{item.issueType}</h4>
                  <p className="text-xs text-slate-600">{item.location}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Reported on: {new Date(item.reportedDate).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/track/${item.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors"
                  >
                    View Timeline &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB CONTENT */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-lg text-slate-900">System Notification Feed</h3>
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => (
              <div key={item.id} className="py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    <span className="font-mono text-xs text-blue-600">{item.complaintId}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(item.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  href={`/track/${item.complaintId}`}
                  className="text-xs font-bold text-blue-600 hover:underline shrink-0"
                >
                  Track &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
