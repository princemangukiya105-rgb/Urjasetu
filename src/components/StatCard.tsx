import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'slate';
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  badgeText,
}) => {
  const colorStyles = {
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600',
      border: 'border-slate-200/80 hover:border-blue-300',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600',
      border: 'border-slate-200/80 hover:border-emerald-300',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600',
      border: 'border-slate-200/80 hover:border-amber-300',
    },
    red: {
      bgIcon: 'bg-red-50 text-red-600',
      border: 'border-slate-200/80 hover:border-red-300',
    },
    indigo: {
      bgIcon: 'bg-indigo-50 text-indigo-600',
      border: 'border-slate-200/80 hover:border-indigo-300',
    },
    slate: {
      bgIcon: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200/80 hover:border-slate-300',
    },
  }[color];

  return (
    <div
      className={`bg-white rounded-2xl border ${colorStyles.border} p-5 shadow-2xs transition-all duration-200 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colorStyles.bgIcon}`}>{icon}</div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </span>
          {badgeText && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {badgeText}
            </span>
          )}
        </div>

        {(subtitle || trend) && (
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            {subtitle && <span>{subtitle}</span>}
            {trend && <span className="text-emerald-600 font-semibold">{trend}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
