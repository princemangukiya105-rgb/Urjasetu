'use client';

import React, { useState } from 'react';
import { Settings, RefreshCw, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { resetDemoData } from '@/lib/storage';

export default function AdminSettingsPage() {
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all complaints and notifications to default initial demo data?')) {
      resetDemoData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Administration Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage local prototype storage persistence, demo data state, and control preferences.
        </p>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-bold text-base text-slate-900">
              Reset Demo System State
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clears any newly added user complaints, notifications, or status changes stored in browser localStorage and restores original pre-populated sample dataset (10 complaints across Mira-Bhayandar wards).
            </p>
          </div>
        </div>

        {resetDone && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demo Data reset successfully! All default complaints restored.</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-xs hover:bg-amber-500 transition-colors shadow-md shadow-amber-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data Now</span>
          </button>
        </div>
      </div>

      {/* System Context Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm">UrjaSetu Technical Specifications</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Framework</span>
            <strong className="text-white font-mono">Next.js App Router (React 19 + TypeScript)</strong>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Persistence</span>
            <strong className="text-white font-mono">Browser LocalStorage + Reactive Events</strong>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Deployment Target</span>
            <strong className="text-white font-mono">Vercel Ready / Zero External Database</strong>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Project Category</span>
            <strong className="text-white font-mono">College Idea Lab Academic Prototype</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
