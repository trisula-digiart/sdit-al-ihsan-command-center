'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Building2, BookOpen, Wrench } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('kepsek@sditalihsan.sch.id');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('Kepala Sekolah');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickRoleSelect = (selectedRole, defaultEmail) => {
    setRole(selectedRole);
    setEmail(defaultEmail);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simpan role ke localStorage untuk simulasi state global
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_email', email);
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push('/executive');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100/50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-emerald-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/30 rounded-full blur-xl pointer-events-none" />
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 backdrop-blur-sm">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-wide">SDIT AL IHSAN</h1>
          <p className="text-xs text-emerald-100 mt-1 font-medium">Integrated Command Center</p>
        </div>

        {/* Quick Role Selector */}
        <div className="p-6">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pilih Akses Role (Demo Simulator)
          </label>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect('Kepala Sekolah', 'kepsek@sditalihsan.sch.id')}
              className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium flex flex-col items-center justify-center text-center gap-1.5 ${
                role === 'Kepala Sekolah'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-emerald-300 text-slate-600'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${role === 'Kepala Sekolah' ? 'text-emerald-600' : 'text-slate-400'}`} />
              Kepsek
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('Guru / Wali Kelas', 'guru@sditalihsan.sch.id')}
              className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium flex flex-col items-center justify-center text-center gap-1.5 ${
                role === 'Guru / Wali Kelas'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-emerald-300 text-slate-600'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${role === 'Guru / Wali Kelas' ? 'text-emerald-600' : 'text-slate-400'}`} />
              Guru
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleSelect('Staf Admin / Sarpras', 'sarpras@sditalihsan.sch.id')}
              className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium flex flex-col items-center justify-center text-center gap-1.5 ${
                role === 'Staf Admin / Sarpras'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-emerald-300 text-slate-600'
              }`}
            >
              <Wrench className={`w-4 h-4 ${role === 'Staf Admin / Sarpras' ? 'text-emerald-600' : 'text-slate-400'}`} />
              Sarpras
            </button>
          </div>

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Pengguna</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="masukkan email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center cursor-pointer gap-2">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5" />
                Ingat Saya
              </label>
              <a href="#" className="text-emerald-600 hover:underline font-medium">Lupa Password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses Masuk...</span>
              ) : (
                <>
                  <span>Masuk ke Command Center</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Sistem Informasi Terpadu SDIT Al Ihsan &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}