'use client';

import React, { useState } from 'react';
import {
  CalendarCheck2,
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  X,
  Filter,
} from 'lucide-react';

const TEACHER_ATTENDANCE_LOG = [
  { id: 1, name: 'Ustadz Abdullah', role: 'Wali Kelas 4', time: '06:42 WIB', status: 'Hadir Tepat Waktu' },
  { id: 2, name: 'Ustadzah Rahma', role: 'Wali Kelas 1', time: '06:48 WIB', status: 'Hadir Tepat Waktu' },
  { id: 3, name: 'Ustadz Hasan', role: 'Wali Kelas 6', time: '06:55 WIB', status: 'Hadir Tepat Waktu' },
  { id: 4, name: 'Ustadz Rizky', role: 'Wali Kelas 2', time: '07:02 WIB', status: 'Hadir Tepat Waktu' },
  { id: 5, name: 'Ustadz Farhan', role: 'Wali Kelas 3', time: '07:10 WIB', status: 'Hadir Tepat Waktu' },
  { id: 6, name: 'Ustadzah Khadijah', role: 'Wali Kelas 5', time: '-', status: 'Izin Dinas' },
];

const STUDENT_ATTENDANCE_SUMMARY = [
  { class_name: 'Kelas 1 (Abu Bakar)', teacher: 'Ustadzah Rahma', total: 50, hadir: 48, sakit: 1, izin: 1, alfa: 0, pct: 96.0 },
  { class_name: 'Kelas 2 (Ali)', teacher: 'Ustadz Rizky', total: 50, hadir: 49, sakit: 1, izin: 0, alfa: 0, pct: 98.0 },
  { class_name: 'Kelas 3 (Thoriq)', teacher: 'Ustadz Farhan', total: 50, hadir: 47, sakit: 2, izin: 1, alfa: 0, pct: 94.0 },
  { class_name: 'Kelas 4 (Hamzah)', teacher: 'Ustadz Abdullah', total: 50, hadir: 50, sakit: 0, izin: 0, alfa: 0, pct: 100.0 },
  { class_name: 'Kelas 5 (Mu\'adz)', teacher: 'Ustadzah Khadijah', total: 50, hadir: 46, sakit: 3, izin: 1, alfa: 0, pct: 92.0 },
  { class_name: 'Kelas 6 (Al-Farisi)', teacher: 'Ustadz Hasan', total: 50, hadir: 48, sakit: 1, izin: 1, alfa: 0, pct: 96.0 },
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('siswa'); // 'siswa' atau 'guru'
  const [selectedClassModal, setSelectedClassModal] = useState(null);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-emerald-700" />
            <span>Data Absensi Guru & Siswa</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Pusat pemantauan presensi harian terintegrasi dari seluruh Wali Kelas SDIT Al Ihsan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-black text-emerald-900">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>Rabu, 29 Juli 2026</span>
        </div>
      </div>

      {/* GRAFIK & STATISTIK RINGKASAN KEHADIRAN HARI INI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafik Ringkasan Kehadiran Siswa */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-emerald-950">Grafik Kehadiran Siswa Hari Ini</h2>
              <p className="text-[11px] font-bold text-slate-600">Total 300 Siswa Terdaftar</p>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
              96.0% Hadir
            </span>
          </div>

          <div className="space-y-3">
            {/* Visual Bar Graph */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-emerald-900">Hadir (288 Siswa)</span>
                <span className="text-emerald-700">96.0%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-amber-900">Sakit & Izin (12 Siswa)</span>
                <span className="text-amber-700">4.0%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '4%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-rose-900">Tanpa Keterangan / Alfa (0 Siswa)</span>
                <span className="text-rose-700">0.0%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Grafik Ringkasan Kehadiran Guru */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-emerald-950">Grafik Kehadiran Pendidik / Guru</h2>
              <p className="text-[11px] font-bold text-slate-600">Total 49 Guru & Staf Operasional</p>
            </div>
            <span className="text-xs font-black text-teal-900 bg-teal-100 px-2.5 py-1 rounded-full border border-teal-300">
              98.0% Hadir
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-teal-900">Hadir Mengajar (48 Guru)</span>
                <span className="text-teal-700">98.0%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-amber-900">Izin Dinas / Pelatihan (1 Guru)</span>
                <span className="text-amber-700">2.0%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '2%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB SWITCHER: ABSENSI SISWA VS ABSENSI GURU */}
      <div className="flex gap-2 border-b-2 border-emerald-200 pb-2">
        <button
          onClick={() => setActiveTab('siswa')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'siswa'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-100'
          }`}
        >
          Rekapitulasi Absensi Siswa Per Kelas
        </button>
        <button
          onClick={() => setActiveTab('guru')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'guru'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-100'
          }`}
        >
          Log Presensi Guru Hari Ini
        </button>
      </div>

      {/* VIEW 1: REKAPITULASI SISWA PER KELAS */}
      {activeTab === 'siswa' && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-emerald-950">
              Laporan Presensi Inputan Wali Kelas (29 Juli 2026)
            </h3>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
              6/6 Kelas Selesai Input
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="bg-emerald-100/80 text-emerald-950 font-black border-b border-emerald-200">
                  <th className="p-3">Rombel Kelas</th>
                  <th className="p-3">Wali Kelas</th>
                  <th className="p-3 text-center">Total Murid</th>
                  <th className="p-3 text-center text-emerald-800">Hadir</th>
                  <th className="p-3 text-center text-amber-800">Sakit</th>
                  <th className="p-3 text-center text-blue-800">Izin</th>
                  <th className="p-3 text-center text-rose-800">Alfa</th>
                  <th className="p-3 text-center">Persentase</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {STUDENT_ATTENDANCE_SUMMARY.map((row, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/70 transition-colors">
                    <td className="p-3 font-black text-slate-900">{row.class_name}</td>
                    <td className="p-3 text-slate-700">{row.teacher}</td>
                    <td className="p-3 text-center text-slate-900">{row.total}</td>
                    <td className="p-3 text-center font-black text-emerald-800">{row.hadir}</td>
                    <td className="p-3 text-center font-black text-amber-700">{row.sakit}</td>
                    <td className="p-3 text-center font-black text-blue-700">{row.izin}</td>
                    <td className="p-3 text-center font-black text-rose-700">{row.alfa}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-black text-[10px]">
                        {row.pct}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedClassModal(row)}
                        className="px-3 py-1 bg-emerald-700 text-white font-black text-[10px] rounded-lg flex items-center gap-1 mx-auto"
                      >
                        <span>Inspeksi</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: LOG PRESENSI GURU */}
      {activeTab === 'guru' && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-emerald-950">
              Daftar Presensi Kehadiran Guru & Tenaga Pendidik
            </h3>
            <span className="text-xs font-black text-teal-900 bg-teal-100 border border-teal-300 px-2.5 py-1 rounded-full">
              48 Hadir | 1 Izin Dinas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="bg-teal-100/80 text-teal-950 font-black border-b border-teal-200">
                  <th className="p-3">Nama Guru / Pendidik</th>
                  <th className="p-3">Jabatan / Kelas Binaan</th>
                  <th className="p-3">Jam Masuk Absen</th>
                  <th className="p-3 text-center">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-100">
                {TEACHER_ATTENDANCE_LOG.map((guru) => (
                  <tr key={guru.id} className="hover:bg-teal-50/50">
                    <td className="p-3 font-black text-slate-900">{guru.name}</td>
                    <td className="p-3 text-slate-700">{guru.role}</td>
                    <td className="p-3 text-slate-600 font-mono">{guru.time}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-black text-[10px] ${
                          guru.status.includes('Hadir')
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {guru.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL INSPEKSI PRESENSI SISWA PER KELAS */}
      {selectedClassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>Detail Presensi: {selectedClassModal.class_name}</span>
              </h3>
              <button onClick={() => setSelectedClassModal(null)} className="text-white hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 font-bold text-xs">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between items-center">
                <p className="text-slate-900">Wali Kelas: <span className="text-emerald-900 font-black">{selectedClassModal.teacher}</span></p>
                <p className="text-emerald-950 font-black">Kehadiran: {selectedClassModal.pct}%</p>
              </div>

              <p className="text-slate-700">Sampel Murid yang Tidak Hadir Hari Ini:</p>
              
              {selectedClassModal.sakit + selectedClassModal.izin > 0 ? (
                <div className="space-y-2">
                  {selectedClassModal.sakit > 0 && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-900">
                      <span>Muhammad Faris (Sakit - Surat Dokter Terlampir)</span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-950 rounded-full text-[10px] font-black">Sakit</span>
                    </div>
                  )}
                  {selectedClassModal.izin > 0 && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900">
                      <span>Aisyah Azzahra (Izin - Acara Keluarga)</span>
                      <span className="px-2 py-0.5 bg-blue-200 text-blue-950 rounded-full text-[10px] font-black">Izin</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl text-center font-black border border-emerald-300">
                  Masyallah! Seluruh 50 Murid Hadir 100% Hari Ini.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}