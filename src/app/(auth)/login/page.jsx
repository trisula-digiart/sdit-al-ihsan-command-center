'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Building, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('kepsek');
  const [email, setEmail] = useState('kepsek@sditalihsan.sch.id');
  const [password, setPassword] = useState('••••••••');
  
  const [schoolSettings, setSchoolSettings] = useState({
    school_name: 'SDIT AL IHSAN',
    logo_url: '',
  });

  // Fetch Realtime School Branding dari Supabase
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('school_name, logo_url')
          .single();

        if (!error && data) {
          setSchoolSettings({
            school_name: data.school_name || 'SDIT AL IHSAN',
            logo_url: data.logo_url || '',
          });
        }
      } catch (err) {
        console.error('Error fetching login branding:', err);
      }
    };

    fetchBranding();
  }, []);

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
    const session = {
      role: role,
      name: role === 'kepsek' ? 'H. Ahmad Dahlan, M.Pd' : 'Ustadz Abdullah',
      title: role === 'kepsek' ? 'Kepala Sekolah' : 'Guru / Wali Kelas 4',
      email: email,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', JSON.stringify(session));
    }

    if (role === 'kepsek') {
      router.push('/executive');
    } else {
      router.push('/attendance');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
        {/* Header Branding DYNAMIC DARI SUPABASE DATABASE */}
        <div className="bg-emerald-800 p-8 text-center text-white space-y-3 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            {schoolSettings.logo_url ? (
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-300 p-1 flex items-center justify-center shadow-lg mb-2 overflow-hidden">
                <img
                  src={schoolSettings.logo_url}
                  alt="Logo Sekolah"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-emerald-700/80 border-2 border-emerald-400/50 rounded-2xl flex items-center justify-center text-amber-300 font-black text-xl mb-1 shadow-inner">
                <Building className="w-7 h-7" />
              </div>
            )}

            <h1 className="text-xl font-black tracking-wide uppercase">
              {schoolSettings.school_name}
            </h1>
            <p className="text-xs font-extrabold text-emerald-200 tracking-wider">
              Integrated Command Center Portal
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4 font-bold text-xs text-slate-800">
          <div>
            <label className="block text-slate-900 font-black mb-1.5">Pilih Peran Access</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full p-3 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="guru">Guru / Wali Kelas (Akademik & Chat)</option>
              <option value="kepsek">Kepala Sekolah (Master Control Admin)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-900 font-black mb-1.5">Email Akun</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-700 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-900 font-black mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-700 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>Masuk Sistem Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sistem Terenkripsi & Terintegrasi Supabase</span>
          </div>
        </form>
      </div>
    </div>
  );
}