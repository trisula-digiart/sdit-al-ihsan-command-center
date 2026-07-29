'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  Building,
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
    <div className="min-h-screen w-full flex bg-slate-900 text-slate-100 font-sans">
      {/* KANVAS KIRI: Visual Banner Islami Enterprise Grid (Hidden di Screen HP Kecil) */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-emerald-950 overflow-hidden flex-col justify-between p-12 border-r-2 border-emerald-800/40">
        {/* Background Overlay Image Islami Modern */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-105 transition-transform duration-10000 hover:scale-100"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1542816417-0983cbe82752?q=80&w=2070&auto=format&fit=crop")',
          }}
        />

        {/* Decorative Radial Pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-900/40 z-10" />

        {/* Brand Header Top */}
        <div className="relative z-20 flex items-center gap-3">
          {schoolSettings.logo_url ? (
            <div className="w-12 h-12 rounded-2xl bg-white/95 border-2 border-emerald-400/50 p-1 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
              <img
                src={schoolSettings.logo_url}
                alt="Logo Sekolah"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 border-2 border-emerald-400/50 flex items-center justify-center font-black text-amber-300 text-xl shadow-lg shrink-0">
              AI
            </div>
          )}

          <div>
            <h2 className="font-black text-base tracking-wider text-white uppercase">
              {schoolSettings.school_name}
            </h2>
            <p className="text-[11px] font-extrabold text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Integrated Command Center System</span>
            </p>
          </div>
        </div>

        {/* Hero Text Quotes Section */}
        <div className="relative z-20 space-y-4 max-w-xl my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/50 text-amber-300 text-xs font-black shadow-md backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pendidikan Islami Terpadu & Modern</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
            Mewujudkan Generasi Rabbani Berakhlak Mulia & Unggul Berbasis Digital.
          </h1>

          <p className="text-xs font-bold text-emerald-200/90 leading-relaxed">
            Sistem tata kelola komprehensif untuk pemantauan akademik harian, presensi otomatis, transparansi SPP, dan pengelolaan dokumen resmi sekolah.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-emerald-900/60 border border-emerald-700/50 rounded-2xl backdrop-blur-sm">
              <p className="text-lg font-black text-white">100% Cloud</p>
              <p className="text-[10px] font-bold text-emerald-300">Persistensi Database Supabase</p>
            </div>
            <div className="p-3.5 bg-emerald-900/60 border border-emerald-700/50 rounded-2xl backdrop-blur-sm">
              <p className="text-lg font-black text-white">RBAC System</p>
              <p className="text-[10px] font-bold text-emerald-300">Akses Terisolasi Per Role</p>
            </div>
          </div>
        </div>

        {/* Footer Info Left */}
        <div className="relative z-20 text-[11px] font-bold text-emerald-400 flex items-center justify-between border-t border-emerald-800/60 pt-4">
          <span>&copy; 2026 {schoolSettings.school_name}</span>
          <span className="flex items-center gap-1 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Commercial System</span>
          </span>
        </div>
      </div>

      {/* KANVAS KANAN: Form Login Card Enterprise */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-12 bg-slate-900 relative">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 text-slate-900 space-y-6 relative z-10">
          
          {/* Header Portal Form */}
          <div className="space-y-2 border-b-2 border-emerald-100 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Portal Akses Utama
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-emerald-950 tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs font-bold text-slate-600">
              Silakan pilih peran dan masukkan kredensial akun Anda.
            </p>
          </div>

          {/* Form Utama */}
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
      </div>
    </div>
  );
}