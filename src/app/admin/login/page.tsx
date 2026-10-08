'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { setAdminSession } from '@/lib/storage';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@urjasetu.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email === 'admin@urjasetu.com' || email === 'admin@urjasetu.demo') &&
      password === 'Admin@123'
    ) {
      setAdminSession(true);
      router.push('/admin');
    } else {
      setError('Invalid administrator email or password.');
    }
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
                  placeholder="admin@urjasetu.com"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
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

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 font-medium">
              &larr; Back to Public Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
