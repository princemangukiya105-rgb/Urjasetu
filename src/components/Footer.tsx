import React from 'react';
import Link from 'next/link';
import { Zap, ShieldAlert, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Urja<span className="text-blue-400">Setu</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Smart Urban Energy Issue Reporting & Coordination Platform. Enabling citizens to report public electrical hazards while ensuring complete transparency from verification to resolution.
            </p>

            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs text-slate-300">
              <Award className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Prototype developed for academic / Idea Lab demonstration.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Complaint
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-white transition-colors">
                  Public Transparency Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Governance & Access
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 mb-4">
              <li>
                <Link href="/citizen" className="hover:text-white transition-colors">
                  Citizen Portal Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Admin Portal Login
                </Link>
              </li>
              <li>
                <span className="text-slate-500 font-mono">Demo Admin: admin@urjasetu.demo</span>
              </li>
            </ul>

            <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-lg text-[11px] text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Safety Note: Never touch loose wires or open feeder pillars. Maintain 10m distance.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} UrjaSetu Prototype. Academic Idea Lab Demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="bg-slate-800 px-2 py-1 rounded-sm text-[10px] text-slate-400 font-mono">
              Vercel Ready • LocalStorage Driven
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
