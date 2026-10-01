import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface SafetyBannerProps {
  compact?: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg shadow-2xs flex items-start gap-3 text-amber-900 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-amber-950">Safety Caution:</strong>
          Do not touch or approach damaged electrical equipment. Maintain a safe distance and report the issue immediately.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-600 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-amber-950 text-sm md:text-base">
              Electrical Infrastructure Safety Warning
            </h4>
            <span className="bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Important
            </span>
          </div>
          <p className="text-xs md:text-sm text-amber-800/90 mt-1 leading-relaxed">
            Do not touch or approach damaged electrical equipment, sagging wires, or submerged streetlights. Maintain a safe distance of at least 10 meters and submit details below.
          </p>
        </div>
      </div>
      <div className="shrink-0 text-xs font-medium text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300">
        Emergency Hotline: 1912 / 112
      </div>
    </div>
  );
};
