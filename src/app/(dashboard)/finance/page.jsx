'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Wallet,
  ChevronRight,
  X,
  CreditCard,
  Search,
  Loader2,
} from 'lucide-react';

const SPP_BY_CLASS = [
  { class_name: 'Kelas 1 (Abu Bakar)', searchKey: 'Kelas 1', teacher: 'Ustadzah Rahma / Umar', target: 25000000, collected: 23500000, pct: 94, total_students: 50, paid_students: 47 },
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
  
  // State untuk menampilkan siswa kelas binaan guru
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [loadingTeacherStudents, setLoadingTeacherStudents] = useState(false);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');

  const [userSession, setUserSession] = useState({
    role: 'kepsek',
    name: 'Pengguna System',
    class_name: 'Kelas 1 (Abu Bakar)',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_session');
      if (stored) {
        try {
          setUserSession(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const isTeacher = userSession.role === 'guru';
  const assignedClassTitle = userSession.class_name || 'Kelas 1 (Abu Bakar)';

  // Fetch siswa SPP DYNAMIC dari Supabase sesuai Kelas Binaan Guru
  useEffect(() => {
    if (!isTeacher) return;

    const fetchTeacherClassStudents = async () => {
      setLoadingTeacherStudents(true);
      try {
        const classKeyword = assignedClassTitle.split(' ')[1] || assignedClassTitle;

        const { data, error } = await supabase
          .from('students')
          .select('*')
          .ilike('class_name', `%${classKeyword}%`)
          .order('full_name', { ascending: true });

        if (!error && data) {
          const mappedData = data.map((st, idx) => ({
            ...st,
            spp_status: idx % 12 === 0 ? 'Belum Lunas' : 'Lunas',
            spp_amount: 500000,
          }));
          setTeacherStudents(mappedData);
        }
      } catch (err) {
        console.error('Error fetching teacher SPP students:', err);
      } finally {
        setLoadingTeacherStudents(false);
      }
    };

    fetchTeacherClassStudents();
  }, [isTeacher, assignedClassTitle]);

  const filteredSppList = isTeacher
    ? SPP_BY_CLASS.filter((item) => item.class_name.toLowerCase().includes(assignedClassTitle.toLowerCase().split(' ')[1] || 'kelas 1'))
    : SPP_BY_CLASS;

  const totalCollected = filteredSppList.reduce((acc, curr) => acc + curr.collected, 0);
  const totalPaidStudents = filteredSppList.reduce((acc, curr) => acc + curr.paid_students, 0);
  const totalStudents = filteredSppList.reduce((acc, curr) => acc + curr.total_students, 0);
  const totalUnpaidStudents = totalStudents - totalPaidStudents;
  const targetAmount = isTeacher ? 25000000 : 150000000;
  const overallPct = ((totalCollected / targetAmount) * 100).toFixed(1);

  // Fetch seluruh siswa kelas untuk modal drill down Kepsek
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

  const filteredModalStudents = modalStudents.filter(
    (st) =>
      st.full_name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      st.nisn.includes(modalSearchQuery)
  );

  const filteredTeacherStudentsList = teacherStudents.filter(
    (st) =>
      st.full_name.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
      st.nisn.includes(teacherSearchQuery)
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-700" />
            <span>
              {isTeacher
                ? `Keuangan & SPP Siswa - ${assignedClassTitle}`
                : 'Keuangan & Rekapitulasi SPP Siswa'}
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            {isTeacher
              ? `Monitoring pembayaran SPP bulanan siswa binaan ${assignedClassTitle}.`
              : 'Monitoring pembayaran SPP bulanan terintegrasi dari masing-masing Wali Kelas SDIT Al Ihsan.'}
          </p>
        </div>
        <div className="px-3.5 py-2 bg-amber-100 border-2 border-amber-300 rounded-xl text-amber-950 font-black text-xs shadow-sm">
          Target Juli 2026: Rp {targetAmount.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-700">Total SPP Terkumpul</p>
          <p className="text-2xl font-black text-emerald-950 mt-1">
            Rp {totalCollected.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] font-black text-emerald-700 mt-1">
            {overallPct}% dari target {isTeacher ? 'kelas' : 'bulanan'}
          </p>
        </div>
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-700">Siswa Sudah Lunas</p>
          <p className="text-2xl font-black text-teal-950 mt-1">{totalPaidStudents} Siswa</p>
          <p className="text-[10px] font-black text-teal-700 mt-1">
            Dari total {totalStudents} Siswa Terdaftar
          </p>
        </div>
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-700">Siswa Belum Lunas</p>
          <p className="text-2xl font-black text-amber-950 mt-1">{totalUnpaidStudents} Siswa</p>
          <p className="text-[10px] font-black text-amber-700 mt-1">Proses penagihan oleh Wali Kelas</p>
        </div>
      </div>

      {/* JIKA GURU -> DYNAMIC TAMPILKAN SISWA KELAS BINAAN */}
      {isTeacher ? (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-emerald-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Rincian Pembayaran SPP Siswa - {assignedClassTitle}</span>
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Wali Kelas: {userSession.name} • Nominal SPP: Rp 500.000 / bulan
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau NISN..."
                value={teacherSearchQuery}
                onChange={(e) => setTeacherSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="bg-emerald-100/80 text-emerald-950 font-black border-b border-emerald-200">
                  <th className="p-3">No</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">Nama Lengkap Siswa</th>
                  <th className="p-3">Tagihan SPP</th>
                  <th className="p-3 text-center">Status Pembayaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 font-bold text-slate-800">
                {loadingTeacherStudents ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-emerald-800">
                      <div className="flex items-center justify-center gap-2 font-black">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        <span>Mengambil Data Siswa {assignedClassTitle} dari Database Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTeacherStudentsList.length > 0 ? (
                  filteredTeacherStudentsList.map((st, idx) => (
                    <tr key={st.id || idx} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="p-3 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-3 text-emerald-900 font-mono font-black">{st.nisn}</td>
                      <td className="p-3 font-black text-slate-900">{st.full_name}</td>
                      <td className="p-3 text-slate-700">Rp {st.spp_amount.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-center">
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
                      Tidak ada siswa ditemukan untuk kelas binaan ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* JIKA KEPSEK -> TAMPILKAN REKAPITULASI 6 KELAS */
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
                    <td className="p-3 text-emerald-800 font-black">
                      Rp {item.collected.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-slate-800">
                      {item.paid_students} / {item.total_students} Murid
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-black text-[10px]">
                        {item.pct}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-[11px] flex items-center gap-1 mx-auto shadow-sm transition-all cursor-pointer">
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
      )}

      {/* MODAL DRILL DOWN (KHUSUS KEPSEK) */}
      {selectedClassDetail && !isTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Rincian SPP Seluruh Siswa: {selectedClassDetail.class_name}</span>
              </h3>
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="text-white hover:text-amber-200 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 font-bold text-xs overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <p className="text-slate-900">
                    Wali Kelas:{' '}
                    <span className="text-emerald-950 font-black">
                      {selectedClassDetail.teacher}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Total Siswa Terdaftar: {modalStudents.length} Siswa
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-950 font-black text-sm">
                    Capaian: {selectedClassDetail.pct}%
                  </p>
                  <p className="text-[11px] text-emerald-800 font-extrabold">
                    {selectedClassDetail.paid_students} Siswa Lunas |{' '}
                    {selectedClassDetail.total_students - selectedClassDetail.paid_students} Belum Lunas
                  </p>
                </div>
              </div>

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
                            <span>Mengambil Data Siswa dari Database Supabase...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredModalStudents.length > 0 ? (
                      filteredModalStudents.map((st, idx) => (
                        <tr key={st.id || idx} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="p-2.5 text-slate-500 font-mono">{idx + 1}</td>
                          <td className="p-2.5 text-emerald-900 font-mono font-black">{st.nisn}</td>
                          <td className="p-2.5 font-black text-slate-900">{st.full_name}</td>
                          <td className="p-2.5 text-slate-700">
                            Rp {st.spp_amount.toLocaleString('id-ID')}
                          </td>
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