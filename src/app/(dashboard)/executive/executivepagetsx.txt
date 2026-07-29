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
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

const SUMMARY_METRICS = [
  {
    title: 'Total Siswa Terdaftar',
    value: '540 Siswa',
    subtext: 'Terbagi di 18 Paralel Kelas',
    change: '100% Terverifikasi',
    isPositive: true,
    icon: GraduationCap,
    iconBg: 'bg-emerald-100 text-emerald-800',
  },
  {
    title: 'Kehadiran Guru & Wali Kelas',
    value: '98.0%',
    subtext: '48 / 49 Pendidik Hadir',
    change: 'Presensi Lengkap',
    isPositive: true,
    icon: Users,
    iconBg: 'bg-teal-100 text-teal-800',
  },
  {
    title: 'Capaian SPP Bulan Ini',
    value: '88.5%',
    subtext: 'Rp 142.500.000 Terkumpul',
    change: '+4.5% target bulanan',
    isPositive: true,
    icon: Wallet,
    iconBg: 'bg-amber-100 text-amber-800',
  },
  {
    title: 'Laporan Sarpras Aktif',
    value: '4 Isu',
    subtext: '2 Dalam Penanganan',
    change: '-2 isu terselesaikan',
    isPositive: true,
    icon: Building,
    iconBg: 'bg-rose-100 text-rose-800',
  },
];

const TEACHERS_MONITORING = [
  { name: 'Ustadz Abdullah', class: 'Kelas 4 (Hamzah)', students: 30, attendance: '100%', status: 'Selesai Input' },
  { name: 'Ustadzah Rahma', class: 'Kelas 1 (Abu Bakar)', students: 30, attendance: '96.6%', status: 'Selesai Input' },
  { name: 'Ustadz Hasan', class: 'Kelas 6 (Al-Farisi)', students: 30, attendance: '93.3%', status: 'Selesai Input' },
  { name: 'Ustadz Rizky', class: 'Kelas 2 (Ali)', students: 30, attendance: '96.6%', status: 'Proses Input' },
];

const RECENT_ACTIVITIES = [
  {
    time: '07:30 WIB',
    title: 'Input Presensi Kelas 4 (Hamzah) Selesai',
    desc: 'Ustadz Abdullah menyelesaikan presensi 30 murid binaannya.',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <span>Executive Command Dashboard (Kepala Sekolah)</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Pusat monitoring agregat operasional, presensi wali kelas, dan data seluruh siswa SDIT Al Ihsan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-black text-emerald-900">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>29 Juli 2026</span>
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
              4/4 Kelas Terdata
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
                {TEACHERS_MONITORING.map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/50">
                    <td className="p-2.5 font-black text-slate-900">{item.name}</td>
                    <td className="p-2.5 text-emerald-800 font-black">{item.class}</td>
                    <td className="p-2.5 text-slate-700">{item.students} Murid</td>
                    <td className="p-2.5 text-emerald-900 font-black">{item.attendance}</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            {RECENT_ACTIVITIES.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div
                  className={`p-1.5 rounded-lg mt-0.5 ${
                    act.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : act.type === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
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
                    <p className="font-black text-slate-900">{act.title}</p>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}