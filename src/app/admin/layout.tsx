'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getAdminSession } from '@/lib/storage';
import { Shield, Bell, Zap, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const session = getAdminSession();
    setIsAdmin(session);
    setLoading(false);

    if (!session && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-mono text-xs">
        Authenticating UrjaSetu Admin...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900">
                UrjaSetu Energy Control Center
              </h2>
              <p className="text-[11px] text-slate-500">
                Municipal Urban Electrical Infrastructure Administration Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold rounded-md">
              <Zap className="w-3 h-3 text-amber-600" />
              Prototype System Mode
            </span>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
