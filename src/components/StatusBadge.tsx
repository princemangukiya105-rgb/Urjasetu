import React from 'react';
import { ComplaintStatus } from '../types';
import { AlertCircle, CheckCircle2, RefreshCw, ShieldCheck, UserCheck, Wrench } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'REPORTED':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          dot: 'bg-slate-500',
        };
      case 'VERIFIED':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          dot: 'bg-indigo-500',
        };
      case 'ASSIGNED':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
          icon: <UserCheck className="w-3.5 h-3.5" />,
          dot: 'bg-sky-500',
        };
      case 'WORK IN PROGRESS':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
          icon: <Wrench className="w-3.5 h-3.5 animate-spin-slow" />,
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          dot: 'bg-emerald-500',
        };
      case 'REOPENED':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
          icon: <RefreshCw className="w-3.5 h-3.5" />,
          dot: 'bg-rose-500',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeStyle();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs font-medium tracking-wide transition-all ${config.bg} ${sizeClasses}`}
    >
      {showIcon && config.icon}
      <span>{status}</span>
    </span>
  );
};
