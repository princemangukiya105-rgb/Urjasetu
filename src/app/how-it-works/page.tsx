'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, FilePlus, ShieldCheck, Wrench, Clock, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { SafetyBanner } from '@/components/SafetyBanner';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Observe',
      icon: <Eye className="w-6 h-6 text-blue-600" />,
      desc: 'Citizen notices an electrical infrastructure problem such as non-working streetlights, flickering fixtures, or damaged poles in their neighborhood.',
      details: [
        'Identify hazard location',
        'Ensure personal distance from dangerous equipment',
        'Note landmark or nearest pole ID',
      ],
    },
    {
      num: '02',
      title: 'Report',
      icon: <FilePlus className="w-6 h-6 text-indigo-600" />,
      desc: 'Citizen submits the issue through UrjaSetu multi-step report form with area, street details, description, and optional photo upload.',
      details: [
        'Instant unique Complaint ID (e.g. URJ-2026-00124)',
        'Automatic priority suggestion',
        'Local data persistence',
      ],
    },
    {
      num: '03',
      title: 'Coordinate',
      icon: <ShieldCheck className="w-6 h-6 text-sky-600" />,
      desc: 'Urban Energy Administration desk reviews incoming complaints, verifies reported details, and assigns the issue to a specialized field maintenance team.',
      details: [
        'Status updated to VERIFIED & ASSIGNED',
        'Automatic field team notification',
        'Priority adjustments for critical hazards',
      ],
    },
    {
      num: '04',
      title: 'Resolve',
      icon: <Wrench className="w-6 h-6 text-amber-600" />,
      desc: 'Assigned electrical maintenance team arrives on site, conducts repairs, replaces defective components, and updates work status.',
      details: [
        'Real-time field progress notes',
        'Status updated to WORK IN PROGRESS & RESOLVED',
        'Operational quality checks',
      ],
    },
    {
      num: '05',
      title: 'Transparent Tracking',
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      desc: 'Citizens and administrators can track the complete audit trail from submission to resolution on a transparent vertical timeline.',
      details: [
        'Open public tracking by ID',
        'Complete timestamped event history',
        'Privacy-preserving public transparency portal',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Academic Concept & Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How UrjaSetu Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Demonstrating a streamlined, transparent urban resource coordination model for public electrical infrastructure.
        </p>
      </div>

      {/* Safety Notice */}
      <SafetyBanner />

      {/* 5-Step Vertical Flow */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-2xs flex flex-col md:flex-row items-start gap-6 hover:shadow-md transition-shadow relative"
          >
            {/* Step Number badge */}
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
              {step.num}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-xl">{step.icon}</div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-700">
                {step.details.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Zap className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold">Ready to Report an Issue?</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Help your municipality observe and resolve public electrical hazards faster with complete transparency.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
          >
            <span>Report an Issue Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/track"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm hover:bg-slate-700"
          >
            <span>Track Existing Complaint</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
