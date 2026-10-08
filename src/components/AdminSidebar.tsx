'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Users,
  BarChart3,
  Activity,
  Settings,
  LogOut,
  Zap,
  Shield,
  Home,
  RefreshCw,
} from 'lucide-react';
import { setAdminSession, resetDemoData } from '../lib/storage';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setAdminSession(false);
    router.push('/admin/login');
  };

  const handleResetData = () => {
    if (confirm('Clear local system storage and reset application state?')) {
      resetDemoData();
      alert('System data has been successfully reset!');
    }
  };

  const menuItems = [
    { href: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/complaints', label: 'Complaints Management', icon: <FileText className="w-4 h-4 text-xs font-semibold" /> },
    { href: '/admin/map', label: 'GIS Map View', icon: <MapPin className="w-4 h-4" /> },
    { href: '/admin/teams', label: 'Maintenance Teams', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/admin/activity', label: 'System Activity Log', icon: <Activity className="w-4 h-4" /> },
    { href: '/admin/settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0 sticky top-0 h-screen">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">UrjaSetu</span>
            <span className="block text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
              Administration
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Management Controls
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Public System Links
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60"
        >
          <Home className="w-4 h-4" />
          <span>View Public Website</span>
        </Link>

        <button
          onClick={handleResetData}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-amber-400 hover:bg-amber-950/40 transition-colors text-left"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Clear System Storage</span>
        </button>
      </nav>

      {/* Admin Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-900/60 text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-700/50 shrink-0">
              AD
            </div>
            <div className="truncate">
              <span className="block text-xs font-semibold text-white truncate">
                Urban Energy Admin
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                admin@urjasetu.com
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
