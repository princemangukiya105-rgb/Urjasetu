'use client';

import React, { useState, useEffect } from 'react';
import { Users, Phone, MapPin, CheckCircle2, Wrench, Shield, AlertCircle } from 'lucide-react';
import { getMaintenanceTeams, getComplaints } from '@/lib/storage';
import { MaintenanceTeam, Complaint } from '@/types';
import { StatCard } from '@/components/StatCard';

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    setTeams(getMaintenanceTeams());
    setComplaints(getComplaints());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Maintenance Teams & Field Roster
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor active electrical crews, operational availability, and ward assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Teams"
          value={teams.length}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Available Crews"
          value={teams.filter((t) => t.availability === 'Available').length}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          color="emerald"
        />
        <StatCard
          title="On Active Shift"
          value={teams.filter((t) => t.availability === 'Busy' || t.availability === 'On Shift').length}
          icon={<Wrench className="w-5 h-5 text-amber-600" />}
          color="amber"
        />
        <StatCard
          title="Hazard Response Unit"
          value="1 Unit"
          subtitle="Citywide 24/7"
          icon={<Shield className="w-5 h-5 text-red-600" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => {
          const assignedCount = complaints.filter((c) => c.assignedTeam === team.name).length;
          return (
            <div
              key={team.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{team.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">Lead: {team.lead}</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    team.availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : team.availability === 'Busy'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {team.availability}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Zone: <strong>{team.area}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dispatch Line: <strong className="font-mono">{team.phone}</strong></span>
                </div>

                <div>
                  <strong className="block text-slate-800 mb-1">Roster Members:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {team.members.map((m, i) => (
                      <span key={i} className="bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Workload:</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {assignedCount} Assigned Complaints
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
