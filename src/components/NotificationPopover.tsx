import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Info, ShieldAlert, Wrench, X } from 'lucide-react';
import { NotificationItem } from '../types';
import { getNotifications, markAllNotificationsRead } from '../lib/storage';
import Link from 'next/link';

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadNotifs = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifs();
    const handleStorage = () => loadNotifs();
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAll = () => {
    markAllNotificationsRead();
    loadNotifs();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'resolution':
        return <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'assignment':
        return <Wrench className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'status_update':
        return <Info className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No recent notifications.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                    !item.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {item.complaintId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {item.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <Link
                        href={`/track/${item.complaintId}`}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        Track Complaint &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
