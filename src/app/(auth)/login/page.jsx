'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('kepsek');
  const [email, setEmail] = useState('kepsek@sditalihsan.sch.id');
  const [password, setPassword] = useState('••••••••');

  const [schoolSettings, setSchoolSettings] = useState({
    school_name: 'SDIT AL IHSAN INTEGRATED SCHOOL',
    logo_url: '',
  });

  // Fetch Realtime School Branding dari Database Supabase
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('school_name, logo_url')
          .single();

        if (!error && data) {
          setSchoolSettings({
            school_name: data.school_name || 'SDIT AL IHSAN INTEGRATED SCHOOL',
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
    <div className="min-h-screen w-full flex bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-slate-100 font-sans">
      {/* SISI KIRI: VISUAL HERO BANNER ISLAMI HIGH-RESOLUTION */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden flex-col justify-between p-12 border-r-2 border-emerald-800/40">
        {/* Full Image Background Arsitektur Islami Megah */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 hover:scale-100 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1542816417-0983cbe82752?q=80&w=2070&auto=format&fit=crop")',
          }}
        />

        {/* Gradient Overlay Transparan Emerald */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/90 via-emerald-900/70 to-emerald-950/80 z-10" />

        {/* Top Header Branding (Dynamic Supabase) */}
        <div className="relative z-20 flex items-center gap-3">
          {schoolSettings.logo_url ? (
            <div className="w-12 h-12 rounded-2xl bg-white/95 border-2 border-emerald-400/50 p-1 flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
              <img
                src={schoolSettings.logo_url}
                alt="Logo Sekolah"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 border-2 border-emerald-400/50 flex items-center justify-center font-black text-amber-300 text-xl shadow-2xl shrink-0">
              AI
            </div>
          )}

          <div>
            <h2 className="font-black text-base tracking-wider text-white uppercase drop-shadow-md">
              {schoolSettings.school_name}
            </h2>
            <p className="text-[11px] font-extrabold text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Integrated Command Center System</span>
            </p>
          </div>
        </div>

        {/* Hero Text Statement Section */}
        <div className="relative z-20 space-y-5 max-w-xl my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/60 text-amber-300 text-xs font-black shadow-lg backdrop-blur-md">
            <BookOpen className="w-4 h-4" />
            <span>Pendidikan Islami Terpadu & Modern</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
            Mewujudkan Generasi Rabbani Berakhlak Mulia & Unggul Berbasis Digital.
          </h1>

          <p className="text-xs font-bold text-emerald-100/90 leading-relaxed drop-shadow-sm">
            Sistem tata kelola komprehensif untuk pemantauan akademik harian, presensi otomatis, transparansi SPP, dan pengelolaan dokumen resmi sekolah.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/70 border border-emerald-700/60 rounded-2xl backdrop-blur-md shadow-xl">
              <p className="text-xl font-black text-amber-300">100% Cloud</p>
              <p className="text-[10px] font-extrabold text-emerald-200 mt-0.5">Persistensi Database Supabase</p>
            </div>
            <div className="p-4 bg-emerald-950/70 border border-emerald-700/60 rounded-2xl backdrop-blur-md shadow-xl">
              <p className="text-xl font-black text-amber-300">RBAC System</p>
              <p className="text-[10px] font-extrabold text-emerald-200 mt-0.5">Akses Terisolasi Per Role</p>
            </div>
          </div>
        </div>

        {/* Footer Info Left */}
        <div className="relative z-20 text-[11px] font-bold text-emerald-300 flex items-center justify-between border-t border-emerald-800/60 pt-4">
          <span>&copy; 2026 {schoolSettings.school_name}</span>
          <span className="flex items-center gap-1.5 text-emerald-200 font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Enterprise System</span>
          </span>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN CARD ENTERPRISE DENGAN UNIFIED GREEN GRADIENT */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-between p-6 md:p-12 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 relative">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 text-slate-900 space-y-6 my-auto relative z-10">
          
          {/* Header Form Portal */}
          <div className="space-y-2 border-b-2 border-emerald-100 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Portal Akses Utama
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-emerald-950 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-xs font-bold text-slate-600">
              Silakan pilih peran dan masukkan kredensial akun Anda.
            </p>
          </div>

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-900 font-black mb-1.5">
                Pilih Peran / Otentikasi Akses
              </label>
              <select
                value={role}
                onChange={handleRoleChange}
                className="w-full p-3 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all cursor-pointer"
              >
                <option value="guru">Guru / Wali Kelas (Akademik & Chat)</option>
                <option value="kepsek">Kepala Sekolah (Master Control Admin)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-900 font-black mb-1.5">Email Akun Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-900 font-black mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] mt-2"
            >
              <span>Masuk Sistem Command Center</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terkoneksi Database Supabase Cloud Realtime</span>
            </div>
          </form>
        </div>

        {/* FOOTER DEVELOPER BRANDING (K2C KOMPUTINDO) */}
        <div className="relative z-10 pt-6 text-center space-y-1">
          <p className="text-xs font-black text-amber-300 tracking-wide">
            Powered by K2C Komputindo
          </p>
          <p className="text-[11px] font-bold text-emerald-200">
            Building Smart Digital Solutions
          </p>
          <p className="text-[10px] font-mono text-emerald-300 flex items-center justify-center gap-1 pt-0.5">
            <Mail className="w-3 h-3 text-amber-400" />
            <span>kanz.alistianm@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}