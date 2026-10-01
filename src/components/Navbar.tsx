'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X, Shield, PlusCircle, Search, Eye, LayoutDashboard } from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';
import { getAdminSession } from '../lib/storage';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(getAdminSession());
    const handleStorage = () => setIsAdmin(getAdminSession());
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, []);

  // Hide main public navbar if inside full admin portal (except admin login)
  const isFullAdminSection = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isFullAdminSection) {
    return null; // Admin has dedicated sidebar layout
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/report', label: 'Report Issue', icon: <PlusCircle className="w-4 h-4" /> },
    { href: '/track', label: 'Track Complaint', icon: <Search className="w-4 h-4" /> },
    { href: '/transparency', label: 'Transparency', icon: <Eye className="w-4 h-4" /> },
    { href: '/citizen', label: 'Citizen Portal', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  Urja<span className="text-blue-600">Setu</span>
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Idea Lab
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block -mt-1 font-medium">
                Urban Energy Infrastructure Platform
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationPopover />

            {isAdmin ? (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationPopover />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href={isAdmin ? '/admin' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
