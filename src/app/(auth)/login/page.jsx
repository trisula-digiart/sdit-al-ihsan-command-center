'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldAlert, School } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Kepala Sekolah');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi otentikasi login dan redirect ke Executive Dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push('/executive');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white text-center relative">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
            <School className="w-8 h-8 text-emerald-200" />
          </div>
          <h1 className="text-xl font-bold tracking-wide">SDIT AL IHSAN</h1>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Integrated Command Center Portal
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Pilih Peran Access</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Kepala Sekolah">Kepala Sekolah (Full Access)</option>
              <option value="Guru / Wali Kelas">Guru / Wali Kelas (Akademik & Chat)</option>
              <option value="Staf Sarpras">Staf Sarpras (Operasional & Maintenance)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Akun</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sditalihsan.sch.id"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <span>Memproses Masuk...</span>
            ) : (
              <>
                <span>Masuk Sistem Command Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sistem Terenkripsi & Terintegrasi Supabase</span>
          </div>
        </form>
      </div>
    </div>
  );
}