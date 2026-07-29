'use client';

import React, { useState } from 'react';
import {
  Wallet,
  GraduationCap,
  ChevronRight,
  X,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const SPP_BY_CLASS = [
  { class_name: 'Kelas 1 (Abu Bakar)', teacher: 'Ustadzah Rahma', target: 25000000, collected: 23500000, pct: 94, total_students: 50, paid_students: 47 },
  { class_name: 'Kelas 2 (Ali)', teacher: 'Ustadz Rizky', target: 25000000, collected: 22000000, pct: 88, total_students: 50, paid_students: 44 },
  { class_name: 'Kelas 3 (Thoriq)', teacher: 'Ustadz Farhan', target: 25000000, collected: 21500000, pct: 86, total_students: 50, paid_students: 43 },
  { class_name: 'Kelas 4 (Hamzah)', teacher: 'Ustadz Abdullah', target: 25000000, collected: 24000000, pct: 96, total_students: 50, paid_students: 48 },
  { class_name: 'Kelas 5 (Mu\'adz)', teacher: 'Ustadzah Khadijah', target: 25000000, collected: 21000000, pct: 84, total_students: 50, paid_students: 42 },
  { class_name: 'Kelas 6 (Al-Farisi)', teacher: 'Ustadz Hasan', target: 25000000, collected: 22500000, pct: 90, total_students: 50, paid_students: 45 },
];

export default function FinanceSPPPage() {
  const [selectedClassDetail, setSelectedClassDetail] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-700" />
            <span>Keuangan & Rekapitulasi SPP Siswa</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Monitoring pembayaran SPP bulanan terintegrasi dari masing-masing Wali Kelas SDIT Al Ihsan.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 font-black text-xs">
          Target Juli 2026: Rp 150.000.000
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-700">Total SPP Terkumpul</p>
          <p className="text-2xl font-black text-emerald-950 mt-1">Rp 134.500.000</p>
          <p className="text-[10px] font-black text-emerald-700 mt-1">89.6% dari total target bulanan</p>
        </div>
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-700">Siswa Sudah Lunas</p>
          <p className="text-2xl font-black text-teal-950 mt-1">268 Siswa</p>
          <p className="text-[10px] font-black text-teal-700 mt-1">Dari total 300 Siswa Terdaftar</p>
        </div>
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-700">Siswa Belum Lunas</p>
          <p className="text-2xl font-black text-amber-950 mt-1">32 Siswa</p>
          <p className="text-[10px] font-black text-amber-700 mt-1">Proses penagihan oleh Wali Kelas</p>
        </div>
      </div>

      {/* Tabel Rekapitulasi per Kelas (Drill Down) */}
      <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-3">
          <h2 className="text-sm font-black text-emerald-950">
            Capaian Pembayaran SPP Per Rombel Kelas (Klik Baris Untuk Detail Siswa)
          </h2>
          <span className="text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full">
            6 Kelas Terdata
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold border-collapse">
            <thead>
              <tr className="bg-emerald-100/80 text-emerald-950 font-black border-b border-emerald-200">
                <th className="p-3">Rombel Kelas</th>
                <th className="p-3">Wali Kelas</th>
                <th className="p-3">Target SPP</th>
                <th className="p-3">Dana Terkumpul</th>
                <th className="p-3">Siswa Lunas</th>
                <th className="p-3 text-center">Persentase</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {SPP_BY_CLASS.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedClassDetail(item)}
                  className="hover:bg-emerald-50/70 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-black text-slate-900">{item.class_name}</td>
                  <td className="p-3 text-slate-700">{item.teacher}</td>
                  <td className="p-3 text-slate-600">Rp {item.target.toLocaleString('id-ID')}</td>
                  <td className="p-3 text-emerald-800 font-black">Rp {item.collected.toLocaleString('id-ID')}</td>
                  <td className="p-3 text-slate-800">{item.paid_students} / {item.total_students} Murid</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-black text-[10px]">
                      {item.pct}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-black text-[10px] flex items-center gap-1 mx-auto">
                      <span>Rincian Siswa</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Drill Down Detail Siswa Kelas */}
      {selectedClassDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Rincian SPP Siswa: {selectedClassDetail.class_name}</span>
              </h3>
              <button onClick={() => setSelectedClassDetail(null)} className="text-white hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 font-bold text-xs">
              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <p className="text-slate-900">Wali Kelas: <span className="text-emerald-900 font-black">{selectedClassDetail.teacher}</span></p>
                <p className="text-emerald-950 font-black">Capaian: {selectedClassDetail.pct}% ({selectedClassDetail.paid_students}/{selectedClassDetail.total_students} Siswa Lunas)</p>
              </div>

              <p className="text-slate-600 font-bold">Status Pembayaran Sampel Siswa {selectedClassDetail.class_name}:</p>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-100 text-emerald-950 font-black">
                    <th className="p-2">Nama Siswa</th>
                    <th className="p-2">Nominal SPP</th>
                    <th className="p-2 text-center">Status Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  <tr>
                    <td className="p-2 font-black text-slate-900">Muhammad Zaid Al-Faris</td>
                    <td className="p-2">Rp 500.000</td>
                    <td className="p-2 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-black rounded-full text-[10px]">Lunas</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-slate-900">Aisyah Humaira</td>
                    <td className="p-2">Rp 500.000</td>
                    <td className="p-2 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-black rounded-full text-[10px]">Lunas</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-slate-900">Fatimah Az-Zahra</td>
                    <td className="p-2">Rp 500.000</td>
                    <td className="p-2 text-center"><span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black rounded-full text-[10px]">Belum Lunas</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}