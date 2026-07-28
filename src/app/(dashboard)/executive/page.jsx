'use client';

import React from 'react';
import KPICard from '@/components/shared/KPICard';
import {
  Users,
  GraduationCap,
  Wallet,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const SUMMARY_METRICS = [
  {
    title: 'Kehadiran Siswa Hari Ini',
    value: '96.4%',
    subtext: '520 / 540 Siswa Hadir',
    change: '+1.2% dari kemarin',
    isPositive: true,
    icon: GraduationCap,
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Kehadiran Guru & Staf',
    value: '98.0%',
    subtext: '48 / 49 Pendidik Hadir',
    change: 'Stabil',
    isPositive: true,
    icon: Users,
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Capaian SPP Bulan Ini',
    value: '88.5%',
    subtext: 'Rp 142.500.000 Terkumpul',
    change: '+4.5% target bulanan',
    isPositive: true,
    icon: Wallet,
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Laporan Sarpras Aktif',
    value: '4 Isu',
    subtext: '2 Dalam Penanganan',
    change: '-2 isu terselesaikan',
    isPositive: true,
    icon: Building,
    iconBg: 'bg-rose-100 text-rose-700',
  },
];

const CLASS_ATTENDANCE = [
  { class: 'Kelas 1 (Abu Bakar - Umar - Utsman)', count: '88/90', pct: 97, color: 'bg-emerald-500' },
  { class: 'Kelas 2 (Ali - Bilal - Khalid)', count: '89/90', pct: 98, color: 'bg-emerald-500' },
  { class: 'Kelas 3 (Thoriq - Zaid - Sa\'ad)', count: '86/90', pct: 95, color: 'bg-emerald-500' },
  { class: 'Kelas 4 (Hamzah - Salman - Zubair)', count: '87/90', pct: 96, color: 'bg-emerald-500' },
  { class: 'Kelas 5 (Mu\'adz - Abu Hurairah)', count: '85/90', pct: 94, color: 'bg-emerald-500' },
  { class: 'Kelas 6 (Al-Farisi - An-Nawawi)', count: '87/90', pct: 96, color: 'bg-emerald-500' },
];

const RECENT_ACTIVITIES = [
  {
    time: '07:30 WIB',
    title: 'Pemeriksaan Kehadiran Pagi Selesai',
    desc: 'Wali kelas telah menginput presensi seluruh jenjang.',
    type: 'success',
  },
  {
    time: '08:45 WIB',
    title: 'Laporan Kerusakan AC Ditambahkan',
    desc: 'Staf Sarpras menjadwalkan perbaikan untuk AC Ruang Kelas 3A.',
    type: 'warning',
  },
  {
    time: '10:15 WIB',
    title: 'Pengajuan Dokumen Surat Tugas Guru',
    desc: 'Dokumen pelatihan Kurikulum Merdeka membutuhkan tanda tangan Digital Kepala Sekolah.',
    type: 'info',
  },
];

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Executive Command Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan performa operasional, akademik, dan keuangan SDIT Al Ihsan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold text-slate-600">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>28 Juli 2026</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_METRICS.map((metric, idx) => (
          <KPICard key={idx} {...metric} />
        ))}
      </div>

      {/* Main Charts & Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Attendance Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Presensi Siswa per Paralel Kelas
              </h2>
              <p className="text-xs text-slate-500">
                Tingkat kehadiran realtime hari ini
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              Rata-rata 96.4%
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {CLASS_ATTENDANCE.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.class}</span>
                  <span className="text-slate-500 font-mono">
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-800">
              Aktivitas Terkini
            </h2>
            <p className="text-xs text-slate-500">
              Log sistem internal & operasional
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {RECENT_ACTIVITIES.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div
                  className={`p-1.5 rounded-lg mt-0.5 ${
                    act.type === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : act.type === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {act.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : act.type === 'warning' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-800">{act.title}</p>
                    <span className="text-[10px] font-mono text-slate-400">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}