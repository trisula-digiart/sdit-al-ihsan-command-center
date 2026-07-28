'use client';

/* STREAMING_CHUNK:Importing React hooks and Lucide icons for Executive Dashboard... */
import React, { useState } from 'react';
import {
GraduationCap,
UserCheck,
AlertTriangle,
FileCheck,
CheckCircle2,
Clock,
ChevronRight,
Users,
Sparkles,
ArrowUpRight
} from 'lucide-react';

/* STREAMING_CHUNK:Defining Mock Data for Executive KPI and Presensi... */
const INITIAL_STATS = {
totalStudents: 540,
presentStudents: 522,
totalTeachers: 38,
presentTeachers: 36,
sarprasIssues: 3,
pendingApprovals: 5,
};

const CLASS_ATTENDANCE = [
{ class: 'Kelas 1 (Abu Bakar - Umar - Utsman)', count: '88/90', pct: 97, color: 'bg-emerald-500' },
{ class: 'Kelas 2 (Ali - Bilal - Khalid)', count: '89/90', pct: 98, color: 'bg-emerald-500' },
{ class: 'Kelas 3 (Thoriq - Zaid - Sa'ad)', count: '86/90', pct: 95, color: 'bg-emerald-500' },
{ class: 'Kelas 4 (Hamzah - Salman - Zubair)', count: '87/90', pct: 96, color: 'bg-emerald-500' },
{ class: 'Kelas 5 (Mu'adz - Abu Hurairah)', count: '85/90', pct: 94, color: 'bg-emerald-500' },
{ class: 'Kelas 6 (Al-Farisi - An-Nawawi)', count: '87/90', pct: 96, color: 'bg-emerald-500' },
];

/* STREAMING_CHUNK:Rendering Executive Master Dashboard Component... */
export default function ExecutiveDashboardPage() {
const [stats] = useState(INITIAL_STATS);

return (


  {/* Top Banner Greetings */}
  <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <span className="bg-emerald-500/30 text-emerald-100 text-xs px-3 py-1 rounded-full font-medium border border-emerald-400/30">
        Command Center Active
      </span>
      <h1 className="text-2xl font-bold mt-2">Ahlan wa Sahlan, Pak Kepala Sekolah</h1>
      <p className="text-xs text-emerald-100/90 mt-1">
        Ringkasan ketersediaan operasional, kehadiran, dan pemeliharaan SDIT Al Ihsan hari ini.
      </p>
    </div>
    <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-right shrink-0">
      <p className="text-[10px] text-emerald-200 font-medium">Tanggal Operasional</p>
      <p className="text-sm font-bold text-white">Selasa, 28 Juli 2026</p>
    </div>
  </div>

  {/* Executive KPI Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    
    {/* Card 1: Presensi Siswa */}
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kehadiran Murid</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {stats.presentStudents} <span className="text-xs font-normal text-slate-500">/ {stats.totalStudents}</span>
          </h3>
        </div>
        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
          <GraduationCap size={22} />
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs text-emerald-600 font-semibold gap-1">
        <CheckCircle2 size={14} /> 96.6% Presensi Terverifikasi
      </div>
    </div>

    {/* Card 2: Presensi SDM Guru */}
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kehadiran Guru/SDM</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {stats.presentTeachers} <span className="text-xs font-normal text-slate-500">/ {stats.totalTeachers}</span>
          </h3>
        </div>
        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
          <UserCheck size={22} />
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs text-emerald-600 font-semibold gap-1">
        <CheckCircle2 size={14} /> 2 Guru Izin Dinas
      </div>
    </div>

    {/* Card 3: Isu Sarpras */}
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Isu Sarpras</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.sarprasIssues} Log Aktif</h3>
        </div>
        <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
          <AlertTriangle size={22} />
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs text-amber-600 font-semibold gap-1">
        <Clock size={14} /> Membutuhkan Tindakan
      </div>
    </div>

    {/* Card 4: Dokumen Approval */}
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dokumen Menunggu</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">{stats.pendingApprovals} Berkas</h3>
        </div>
        <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
          <FileCheck size={22} />
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs text-indigo-600 font-semibold gap-1">
        <ChevronRight size={14} /> Tanda Tangan Kepsek
      </div>
    </div>

  </div>

  {/* Class Attendance Breakdowns & Quick Monitoring */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    {/* Attendance Summary Panel */}
    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Users size={18} className="text-emerald-600" />
          Status Presensi Per Tingkat Kelas (SDIT Al Ihsan)
        </h3>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
          Update Realtime
        </span>
      </div>

      <div className="space-y-3.5 pt-1">
        {CLASS_ATTENDANCE.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">{item.class}</span>
              <span className="text-slate-600">{item.count} ({item.pct}%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-500`}
                style={{ width: `${item.pct}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Quick Operational Noticeboard */}
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-600" />
          Instruksi & Noticeboard Kepsek
        </h3>

        <div className="space-y-3 mt-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-2 shadow-xs">
            <div className="flex justify-between items-center">
              <p className="font-bold text-emerald-900">📌 Agenda Tarhib Ramadhan</p>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded font-medium">Penting</span>
            </div>
            <p className="leading-relaxed text-emerald-800">
              Seluruh Wali Kelas diharapkan merekap daftar hadir halaqah Qur'an dan infaq pekanan sebelum pukul 15.00 WIB.
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold border-t border-emerald-200/80 pt-1.5">
              Diterbitkan oleh: H. Sulaiman, M.Pd.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5 bg-slate-50/80">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              🛠️ Pemeliharaan Sarpras Priority
            </p>
            <p className="text-slate-600 leading-relaxed">
              Perbaikan pendingin udara Ruang Guru Lt.2 diprioritaskan rampung sebelum pelaksanaan rapat pleno jam 13.00.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition">
          Lihat Seluruh Aktivitas Sekolah <ArrowUpRight size={14} />
        </button>
      </div>
    </div>

  </div>

</div>


);
}