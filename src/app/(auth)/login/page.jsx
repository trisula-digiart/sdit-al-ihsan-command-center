'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('guru'); // 'kepsek' atau 'guru'
  const [email, setEmail] = useState('guru@sditalihsan.sch.id');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (selectedRole === 'kepsek') {
      setEmail('kepsek@sditalihsan.sch.id');
    } else {
      setEmail('guru@sditalihsan.sch.id');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simpan session simulasi ke localStorage
    const userSession = {
      role: role,
      name: role === 'kepsek' ? 'H. Ahmad Dahlan, M.Pd' : 'Ustadz Abdullah',
      title: role === 'kepsek' ? 'Kepala Sekolah' : 'Wali Kelas 4 (Hamzah)',
      email: email,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', JSON.stringify(userSession));
    }

    setTimeout(() => {
      setLoading(false);
      // ROLE-BASED REDIRECT STRICT LOGIC
      if (role === 'kepsek') {
        router.push('/executive');
      } else {
        router.push('/students'); // Guru langsung diarahkan ke Data Siswa Kelas Binaan
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 antialiased font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-emerald-800 p-8 text-center text-white relative">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Building2 className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="text-xl font-black tracking-wide">SDIT AL IHSAN</h1>
          <p className="text-xs font-bold text-emerald-200 mt-1">
            Integrated Command Center Portal
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              Pilih Peran Access
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={handleRoleChange}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              >
                <option value="guru">Guru / Wali Kelas (Akademik & Chat)</option>
                <option value="kepsek">Kepala Sekolah (Master View & Executive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              Email Akun
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? (
              <span>Memproses Hak Akses...</span>
            ) : (
              <>
                <span>Masuk Sistem Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-[11px] font-extrabold text-emerald-800 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Terenkripsi & Terintegrasi Supabase</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}