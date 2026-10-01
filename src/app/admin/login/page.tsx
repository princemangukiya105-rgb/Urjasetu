'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { setAdminSession } from '@/lib/storage';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@urjasetu.demo');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@urjasetu.demo' && password === 'Admin@123') {
      setAdminSession(true);
      router.push('/admin');
    } else {
      setError('Invalid admin credentials. Use demo credentials shown below.');
    }
  };

  const handleQuickDemoLogin = () => {
    setAdminSession(true);
    router.push('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-2 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">UrjaSetu Administration</h1>
          <p className="text-xs text-slate-400">Urban Energy Control & Field Maintenance Desk</p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-bold">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Prototype / Demo Authentication</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
            >
              Sign In to Admin Portal
            </button>
          </form>

          {/* Quick Demo Login Preset Button */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
              <strong className="text-slate-900 block font-bold text-[11px]">
                Demo Credentials:
              </strong>
              <div className="font-mono text-[11px]">Email: admin@urjasetu.demo</div>
              <div className="font-mono text-[11px]">Password: Admin@123</div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>One-Click Demo Admin Login</span>
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 font-medium">
                &larr; Back to Public Landing Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
