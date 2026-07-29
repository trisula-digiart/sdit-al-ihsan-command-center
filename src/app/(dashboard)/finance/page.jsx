'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Wallet,
  GraduationCap,
  ChevronRight,
  X,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Search,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const SPP_BY_CLASS = [
  { class_name: 'Kelas 1 (Abu Bakar)', searchKey: 'Kelas 1', teacher: 'Ustadzah Rahma', target: 25000000, collected: 23500000, pct: 94, total_students: 50, paid_students: 47 },
  { class_name: 'Kelas 2 (Ali)', searchKey: 'Kelas 2', teacher: 'Ustadz Rizky', target: 25000000, collected: 22000000, pct: 88, total_students: 50, paid_students: 44 },
  { class_name: 'Kelas 3 (Thoriq)', searchKey: 'Kelas 3', teacher: 'Ustadz Farhan', target: 25000000, collected: 21500000, pct: 86, total_students: 50, paid_students: 43 },
  { class_name: 'Kelas 4 (Hamzah)', searchKey: 'Kelas 4', teacher: 'Ustadz Abdullah', target: 25000000, collected: 24000000, pct: 96, total_students: 50, paid_students: 48 },
  { class_name: 'Kelas 5 (Mu\'adz)', searchKey: 'Kelas 5', teacher: 'Ustadzah Khadijah', target: 25000000, collected: 21000000, pct: 84, total_students: 50, paid_students: 42 },
  { class_name: 'Kelas 6 (Al-Farisi)', searchKey: 'Kelas 6', teacher: 'Ustadz Hasan', target: 25000000, collected: 22500000, pct: 90, total_students: 50, paid_students: 45 },
];

export default function FinanceSPPPage() {
  const [selectedClassDetail, setSelectedClassDetail] = useState(null);
  const [modalStudents, setModalStudents] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // Fetch seluruh siswa kelas tersebut saat modal dibuka
  useEffect(() => {
    if (!selectedClassDetail) return;

    const fetchClassStudents = async () => {
      setLoadingModal(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .ilike('class_name', `%${selectedClassDetail.searchKey}%`)
          .order('full_name', { ascending: true });

        if (!error && data) {
          // Buat simulasi status lunas dinamis berdasarkan urutan data
          const mappedData = data.map((st, idx) => ({
            ...st,
            spp_status: idx % 10 === 0 || idx % 12 === 0 ? 'Belum Lunas' : 'Lunas',
            spp_amount: 500000,
          }));
          setModalStudents(mappedData);
        }
      } catch (err) {
        console.error('Error fetching modal students:', err);
      } finally {
        setLoadingModal(false);
      }
    };

    fetchClassStudents();
  }, [selectedClassDetail]);

  const filteredModalStudents = modalStudents.filter((st) =>
    st.full_name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    st.nisn.includes(modalSearchQuery)
  );

  return (
    <div className="space-y-6 w-full">
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
        <div className="px-3.5 py-2 bg-amber-100 border-2 border-amber-300 rounded-xl text-amber-950 font-black text-xs shadow-sm">
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

      {/* Tabel Rekapitulasi per Kelas */}
      <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-3">
          <h2 className="text-sm font-black text-emerald-950">
            Capaian Pembayaran SPP Per Rombel Kelas (Klik Tombol Untuk Detail Seluruh Siswa)
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
                  onClick={() => {
                    setModalSearchQuery('');
                    setSelectedClassDetail(item);
                  }}
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
                    <button className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-[11px] flex items-center gap-1 mx-auto shadow-sm transition-all">
                      <span>Rincian Siswa ({item.total_students})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DRILL DOWN: MENAMPILKAN SELURUH 50 SISWA DARI SUPABASE */}
      {selectedClassDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Rincian SPP Seluruh Siswa: {selectedClassDetail.class_name}</span>
              </h3>
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="text-white hover:text-amber-200 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 space-y-4 font-bold text-xs overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <p className="text-slate-900">Wali Kelas: <span className="text-emerald-950 font-black">{selectedClassDetail.teacher}</span></p>
                  <p className="text-[11px] text-slate-600">Total Siswa Terdaftar: {modalStudents.length} Siswa</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-950 font-black text-sm">Capaian: {selectedClassDetail.pct}%</p>
                  <p className="text-[11px] text-emerald-800 font-extrabold">{selectedClassDetail.paid_students} Siswa Lunas | {selectedClassDetail.total_students - selectedClassDetail.paid_students} Belum Lunas</p>
                </div>
              </div>

              {/* Search filter in modal */}
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama atau NISN siswa di kelas ini..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Student SPP List Table */}
              <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-100/90 text-emerald-950 font-black text-xs">
                      <th className="p-3">No</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Nama Lengkap Siswa</th>
                      <th className="p-3">Nominal SPP</th>
                      <th className="p-3 text-center">Status Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100 font-bold text-slate-800">
                    {loadingModal ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-emerald-800">
                          <div className="flex items-center justify-center gap-2 font-black">
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                            <span>Mengambil Data 50 Siswa dari Database Supabase...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredModalStudents.length > 0 ? (
                      filteredModalStudents.map((st, idx) => (
                        <tr key={st.id || idx} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="p-2.5 text-slate-500 font-mono">{idx + 1}</td>
                          <td className="p-2.5 text-emerald-900 font-mono font-black">{st.nisn}</td>
                          <td className="p-2.5 font-black text-slate-900">{st.full_name}</td>
                          <td className="p-2.5 text-slate-700">Rp {st.spp_amount.toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full font-black text-[10px] ${
                                st.spp_status === 'Lunas'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {st.spp_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 font-bold">
                          Tidak ada siswa ditemukan dengan kata kunci pencarian tersebut.
                        </td>
                      </tr>
                    )}
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