'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import KPICard from '@/components/shared/KPICard';
import { useRouter } from 'next/navigation';
import {
  Users,
  GraduationCap,
  Wallet,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ChevronRight,
  X,
  CreditCard,
  UserCheck,
  Clock,
  Compass,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';

const TEACHERS_LIST_DETAIL = [
  { id: 1, name: 'Ustadz Abdullah', class: 'Kelas 4 (Hamzah)', status: 'Hadir', time: '06:45 WIB' },
  { id: 2, name: 'Ustadzah Rahma', class: 'Kelas 1 (Abu Bakar)', status: 'Hadir', time: '06:50 WIB' },
  { id: 3, name: 'Ustadz Hasan', class: 'Kelas 6 (Al-Farisi)', status: 'Hadir', time: '07:00 WIB' },
  { id: 4, name: 'Ustadz Rizky', class: 'Kelas 2 (Ali)', status: 'Hadir', time: '07:05 WIB' },
  { id: 5, name: 'Ustadz Farhan', class: 'Kelas 3 (Thoriq)', status: 'Hadir', time: '07:10 WIB' },
  { id: 6, name: 'Ustadzah Khadijah', class: 'Kelas 5 (Mu\'adz)', status: 'Izin Dinas', time: '08:00 WIB' },
];

const SPP_SUMMARY_DETAIL = [
  { grade: 'Kelas 1', target: 'Rp 25.000.000', collected: 'Rp 23.500.000', pct: '94%' },
  { grade: 'Kelas 2', target: 'Rp 25.000.000', collected: 'Rp 22.000.000', pct: '88%' },
  { grade: 'Kelas 3', target: 'Rp 25.000.000', collected: 'Rp 21.500.000', pct: '86%' },
  { grade: 'Kelas 4', target: 'Rp 25.000.000', collected: 'Rp 24.000.000', pct: '96%' },
  { grade: 'Kelas 5', target: 'Rp 25.000.000', collected: 'Rp 21.000.000', pct: '84%' },
  { grade: 'Kelas 6', target: 'Rp 25.000.000', collected: 'Rp 22.500.000', pct: '90%' },
];

// Data Jadwal Sholat (WIB)
const PRAYER_TIMES = [
  { name: 'Subuh', time: '04:42' },
  { name: 'Dzuhur', time: '12:02', isNext: true },
  { name: 'Ashar', time: '15:24' },
  { name: 'Maghrib', time: '18:01' },
  { name: 'Isya', time: '19:14' },
];

export default function ExecutiveDashboard() {
  const router = useRouter();
  const [totalStudentsCount, setTotalStudentsCount] = useState(300);
  const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);
  const [isSppModalOpen, setIsSppModalOpen] = useState(false);

  // Realtime Digital Clock
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch count live dari Supabase
  useEffect(() => {
    const fetchTotalStudents = async () => {
      const { count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) {
        setTotalStudentsCount(count);
      }
    };
    fetchTotalStudents();
  }, []);

  const SUMMARY_METRICS = [
    {
      title: 'Total Siswa Terdaftar',
      value: `${totalStudentsCount} Siswa`,
      subtext: 'Terbagi di 6 Paralel Kelas Utama',
      change: '100% Terverifikasi Supabase',
      isPositive: true,
      icon: GraduationCap,
      iconBg: 'bg-emerald-100 text-emerald-800',
      onClick: () => router.push('/students'),
    },
    {
      title: 'Kehadiran Guru & Wali Kelas',
      value: '98.0%',
      subtext: '48 / 49 Pendidik Hadir (Klik Rincian)',
      change: 'Presensi Lengkap',
      isPositive: true,
      icon: Users,
      iconBg: 'bg-teal-100 text-teal-800',
      onClick: () => setIsTeachersModalOpen(true),
    },
    {
      title: 'Capaian SPP Bulan Ini',
      value: '88.5%',
      subtext: 'Rp 142.500.000 (Klik Rincian)',
      change: '+4.5% target bulanan',
      isPositive: true,
      icon: Wallet,
      iconBg: 'bg-amber-100 text-amber-800',
      onClick: () => setIsSppModalOpen(true),
    },
    {
      title: 'Laporan Sarpras Aktif',
      value: '4 Isu',
      subtext: '2 Dalam Penanganan',
      change: '-2 isu terselesaikan',
      isPositive: true,
      icon: Building,
      iconBg: 'bg-rose-100 text-rose-800',
      onClick: () => router.push('/sarpras'),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <span>Executive Command Dashboard (Kepala Sekolah)</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Pusat monitoring agregat operasional, presensi wali kelas, dan data seluruh {totalStudentsCount} siswa SDIT Al Ihsan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-black text-emerald-900 shadow-sm">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>Rabu, 29 Juli 2026</span>
        </div>
      </div>

      {/* WIDGET ISLAMI: JAM DIGITAL REALTIME & JADWAL SHOLAT BERANIMASI */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 rounded-2xl border-2 border-amber-400 shadow-lg relative overflow-hidden">
        {/* Pattern Background Overlay */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center justify-center pr-6">
          <Compass className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Realtime Digital Clock */}
          <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-emerald-700/60 pb-4 lg:pb-0 lg:pr-6">
            <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl shadow-md">
              <Clock className="w-7 h-7 font-black animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-amber-300 tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Waktu Lokal Sekolah
              </p>
              <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                {currentTime || '14:27:52 WIB'}
              </h2>
            </div>
          </div>

          {/* Prayer Times Bar (Animasi Glowing pada Sholat Berikutnya) */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>JADWAL SHOLAT HARI INI (WILAYAH DEPOK & SEKITARNYA)</span>
              </p>
              <span className="text-[10px] font-bold text-emerald-200">Menuju Dzuhur: ~15 Menit</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {PRAYER_TIMES.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-center transition-all ${
                    item.isNext
                      ? 'bg-amber-400 text-slate-950 font-black shadow-lg scale-105 ring-2 ring-amber-300 animate-pulse'
                      : 'bg-emerald-900/80 border border-emerald-700 text-slate-100 font-bold'
                  }`}
                >
                  <p className={`text-[10px] ${item.isNext ? 'text-slate-900 font-black' : 'text-emerald-300 font-bold'}`}>
                    {item.name}
                  </p>
                  <p className="text-xs sm:text-sm font-black font-mono mt-0.5">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid Interaktif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_METRICS.map((metric, idx) => (
          <div
            key={idx}
            onClick={metric.onClick}
            className={`${
              metric.onClick ? 'cursor-pointer hover:scale-[1.02] transition-all' : ''
            }`}
          >
            <KPICard {...metric} />
          </div>
        ))}
      </div>

      {/* Main Charts & Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitoring Wali Kelas & Kelas Binaan */}
        <div className="lg:col-span-2 bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-emerald-950">
                Monitoring Presensi Wali Kelas & Kelas Binaan
              </h2>
              <p className="text-xs font-bold text-slate-600">
                Status penginputan data siswa realtime oleh masing-masing guru
              </p>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
              6/6 Kelas Terdata
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="bg-emerald-50 text-emerald-950 font-black border-b border-emerald-200">
                  <th className="p-2.5">Wali Kelas</th>
                  <th className="p-2.5">Kelas Binaan</th>
                  <th className="p-2.5">Total Murid</th>
                  <th className="p-2.5">Presensi Hari Ini</th>
                  <th className="p-2.5 text-center">Status Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                <tr className="hover:bg-emerald-50/50">
                  <td className="p-2.5 font-black text-slate-900">Ustadz Abdullah</td>
                  <td className="p-2.5 text-emerald-800 font-black">Kelas 4 (Hamzah)</td>
                  <td className="p-2.5 text-slate-700">50 Murid</td>
                  <td className="p-2.5 text-emerald-900 font-black">100%</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                      Selesai Input
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-emerald-50/50">
                  <td className="p-2.5 font-black text-slate-900">Ustadzah Rahma</td>
                  <td className="p-2.5 text-emerald-800 font-black">Kelas 1 (Abu Bakar)</td>
                  <td className="p-2.5 text-slate-700">50 Murid</td>
                  <td className="p-2.5 text-emerald-900 font-black">98.0%</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                      Selesai Input
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-emerald-50/50">
                  <td className="p-2.5 font-black text-slate-900">Ustadz Hasan</td>
                  <td className="p-2.5 text-emerald-800 font-black">Kelas 6 (Al-Farisi)</td>
                  <td className="p-2.5 text-slate-700">50 Murid</td>
                  <td className="p-2.5 text-emerald-900 font-black">96.0%</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                      Selesai Input
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b-2 border-emerald-100 pb-3">
            <h2 className="text-sm font-black text-emerald-950">
              Aktivitas Terkini Guru
            </h2>
            <p className="text-xs font-bold text-slate-600">
              Log sistem internal & operasional sekolah
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3 text-xs">
              <div className="p-1.5 rounded-lg mt-0.5 bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-center">
                  <p className="font-black text-slate-900">Input Presensi Kelas 4 Selesai</p>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">07:30 WIB</span>
                </div>
                <p className="text-slate-600 font-bold leading-relaxed">
                  Ustadz Abdullah menyelesaikan presensi 50 murid binaannya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL POPUP DETAIL: PRESENSI GURU */}
      {isTeachersModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>Rincian Kehadiran Guru & Wali Kelas Pagi Ini</span>
              </h3>
              <button onClick={() => setIsTeachersModalOpen(false)} className="text-white hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between bg-teal-50 p-3 rounded-xl border border-teal-200">
                <p className="text-xs font-black text-teal-950">Total Pendidik: 49 Guru</p>
                <button
                  onClick={() => router.push('/attendance')}
                  className="text-xs font-black text-emerald-800 underline flex items-center gap-1"
                >
                  <span>Buka Halaman Modul Absensi Lengkap</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs font-bold">
                  <thead>
                    <tr className="bg-emerald-100/80 text-emerald-950 border-b border-emerald-200">
                      <th className="p-2.5">Nama Guru</th>
                      <th className="p-2.5">Kelas / Jabatan</th>
                      <th className="p-2.5">Jam Absen</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {TEACHERS_LIST_DETAIL.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-slate-900">{item.name}</td>
                        <td className="p-2.5 text-emerald-800 font-bold">{item.class}</td>
                        <td className="p-2.5 text-slate-600 font-mono">{item.time}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              item.status === 'Hadir'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP DETAIL: REKAPITULASI SPP */}
      {isSppModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-amber-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-200" />
                <span>Rekapitulasi Capaian SPP per Jenjang Kelas</span>
              </h3>
              <button onClick={() => setIsSppModalOpen(false)} className="text-white hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200">
                <p className="text-xs font-black text-amber-950">Target Bulanan: Rp 160.000.000</p>
                <button
                  onClick={() => router.push('/finance')}
                  className="text-xs font-black text-amber-900 underline flex items-center gap-1"
                >
                  <span>Buka Halaman Keuangan SPP Lengkap</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs font-bold">
                  <thead>
                    <tr className="bg-amber-100/80 text-amber-950 border-b border-amber-200">
                      <th className="p-2.5">Jenjang Kelas</th>
                      <th className="p-2.5">Target SPP</th>
                      <th className="p-2.5">Terkumpul</th>
                      <th className="p-2.5 text-center">Persentase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {SPP_SUMMARY_DETAIL.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-black text-slate-900">{item.grade}</td>
                        <td className="p-2.5 text-slate-600">{item.target}</td>
                        <td className="p-2.5 text-emerald-800 font-black">{item.collected}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                            {item.pct}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}