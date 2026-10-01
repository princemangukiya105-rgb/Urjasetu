import React from 'react';
import { Priority } from '../types';
import { AlertOctagon, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getStyle = () => {
    switch (priority) {
      case 'Low':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <ArrowDown className="w-3 h-3 text-slate-500" />,
        };
      case 'Medium':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <ArrowUp className="w-3 h-3 text-blue-500" />,
        };
      case 'High':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'Critical':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-red-600" />,
        };
    }
  };

  const config = getStyle();
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border ${config.bg} ${sizeClasses}`}>
      {config.icon}
      <span>{priority}</span>
    </span>
  );
};
