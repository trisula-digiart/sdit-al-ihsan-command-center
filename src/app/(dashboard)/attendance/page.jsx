'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  CalendarCheck2,
  Calendar,
  ChevronRight,
  X,
  UserCheck,
  Search,
  Loader2,
  Users,
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
  { class_name: 'Kelas 1 (Abu Bakar)', searchKey: 'Kelas 1', teacher: 'Ustadzah Rahma', total: 50, hadir: 48, sakit: 1, izin: 1, alfa: 0, pct: 96.0 },
  { class_name: 'Kelas 2 (Ali)', searchKey: 'Kelas 2', teacher: 'Ustadz Rizky', total: 50, hadir: 49, sakit: 1, izin: 0, alfa: 0, pct: 98.0 },
  { class_name: 'Kelas 3 (Thoriq)', searchKey: 'Kelas 3', teacher: 'Ustadz Farhan', total: 50, hadir: 47, sakit: 2, izin: 1, alfa: 0, pct: 94.0 },
  { class_name: 'Kelas 4 (Hamzah)', searchKey: 'Kelas 4', teacher: 'Ustadz Abdullah', total: 50, hadir: 50, sakit: 0, izin: 0, alfa: 0, pct: 100.0 },
  { class_name: 'Kelas 5 (Mu\'adz)', searchKey: 'Kelas 5', teacher: 'Ustadzah Khadijah', total: 50, hadir: 46, sakit: 3, izin: 1, alfa: 0, pct: 92.0 },
  { class_name: 'Kelas 6 (Al-Farisi)', searchKey: 'Kelas 6', teacher: 'Ustadz Hasan', total: 50, hadir: 48, sakit: 1, izin: 1, alfa: 0, pct: 96.0 },
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('siswa');
  const [selectedClassModal, setSelectedClassModal] = useState(null);
  const [modalStudents, setModalStudents] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  const [userSession, setUserSession] = useState({
    role: 'kepsek',
    name: 'H. Ahmad Dahlan, M.Pd',
  });

  // State untuk langsung menampilkan 50 siswa kelas binaan guru
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Fetch 50 siswa langsung dari Supabase untuk tampilan Guru (Kelas 4)
  useEffect(() => {
    if (!isTeacher) return;

    const fetchClassStudents = async () => {
      setLoadingStudents(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .ilike('class_name', '%Kelas 4%')
          .order('full_name', { ascending: true });

        if (!error && data) {
          const mapped = data.map((st) => ({
            ...st,
            attendance_status: 'Hadir',
          }));
          setTeacherStudents(mapped);
        }
      } catch (err) {
        console.error('Error fetching teacher students:', err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchClassStudents();
  }, [isTeacher]);

  // Fetch 50 Siswa dari Supabase saat Kepsek Menekan Tombol "Inspeksi" (POIN 1)
  useEffect(() => {
    if (!selectedClassModal) return;

    const fetchModalClassStudents = async () => {
      setLoadingModal(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .ilike('class_name', `%${selectedClassModal.searchKey}%`)
          .order('full_name', { ascending: true });

        if (!error && data) {
          const mapped = data.map((st, idx) => ({
            ...st,
            attendance_status: idx % 15 === 0 ? 'Sakit' : idx % 22 === 0 ? 'Izin' : 'Hadir',
          }));
          setModalStudents(mapped);
        }
      } catch (err) {
        console.error('Error fetching modal class students:', err);
      } finally {
        setLoadingModal(false);
      }
    };

    fetchModalClassStudents();
  }, [selectedClassModal]);

  const toggleStudentStatus = (id, newStatus) => {
    setTeacherStudents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, attendance_status: newStatus } : st))
    );
  };

  const toggleModalStudentStatus = (id, newStatus) => {
    setModalStudents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, attendance_status: newStatus } : st))
    );
  };

  const filteredTeacherStudents = teacherStudents.filter(
    (st) =>
      st.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nisn?.includes(searchQuery)
  );

  const filteredModalStudents = modalStudents.filter(
    (st) =>
      st.full_name?.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      st.nisn?.includes(modalSearchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-emerald-700" />
            <span>
              {isTeacher
                ? 'Data Absensi Siswa Kelas 4 (Hamzah)'
                : 'Data Absensi Guru & Siswa'}
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            {isTeacher
              ? 'Pusat pemantauan presensi harian siswa binaan Kelas 4 (Hamzah).'
              : 'Pusat pemantauan presensi harian terintegrasi dari seluruh Wali Kelas SDIT Al Ihsan.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-black text-emerald-900">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>Rabu, 29 Juli 2026</span>
        </div>
      </div>

      {/* GRAFIK & STATISTIK RINGKASAN KEHADIRAN HARI INI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-emerald-950">
                {isTeacher
                  ? 'Grafik Kehadiran Kelas 4 Hari Ini'
                  : 'Grafik Kehadiran Siswa Hari Ini'}
              </h2>
              <p className="text-[11px] font-bold text-slate-600">
                {isTeacher ? 'Total 50 Murid Terdaftar' : 'Total 300 Siswa Terdaftar'}
              </p>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
              {isTeacher ? '100.0% Hadir' : '96.0% Hadir'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-emerald-900">
                  {isTeacher ? 'Hadir (50 Siswa)' : 'Hadir (288 Siswa)'}
                </span>
                <span className="text-emerald-700">{isTeacher ? '100.0%' : '96.0%'}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: isTeacher ? '100%' : '96%' }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-amber-900">
                  {isTeacher ? 'Sakit & Izin (0 Siswa)' : 'Sakit & Izin (12 Siswa)'}
                </span>
                <span className="text-amber-700">{isTeacher ? '0.0%' : '4.0%'}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: isTeacher ? '0%' : '4%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-emerald-950">
                {isTeacher
                  ? 'Status Presensi Pengajar (Ustadz Abdullah)'
                  : 'Grafik Kehadiran Pendidik / Guru'}
              </h2>
              <p className="text-[11px] font-bold text-slate-600">
                {isTeacher ? 'Wali Kelas 4 (Hamzah)' : 'Total 49 Guru & Staf Operasional'}
              </p>
            </div>
            <span className="text-xs font-black text-teal-900 bg-teal-100 px-2.5 py-1 rounded-full border border-teal-300">
              {isTeacher ? 'Hadir 06:42 WIB' : '98.0% Hadir'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-teal-900">
                  {isTeacher ? 'Presensi Mandiri Selesai' : 'Hadir Mengajar (48 Guru)'}
                </span>
                <span className="text-teal-700">{isTeacher ? '100%' : '98.0%'}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex gap-2 border-b-2 border-emerald-200 pb-2">
        <button
          onClick={() => setActiveTab('siswa')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'siswa'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-100'
          }`}
        >
          {isTeacher ? 'Daftar Presensi 50 Siswa Kelas 4' : 'Rekapitulasi Absensi Siswa Per Kelas'}
        </button>
        {!isTeacher && (
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
        )}
      </div>

      {/* VIEW GURU: TABEL 50 SISWA LANGSUNG */}
      {activeTab === 'siswa' && isTeacher && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-emerald-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Presensi Harian Seluruh Siswa Kelas 4 (Hamzah)</span>
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Wali Kelas: Ustadz Abdullah • Total {teacherStudents.length} Murid
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama / NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th className="p-3">Jenis Kelamin</th>
                  <th className="p-3 text-center">Status Presensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 font-bold text-slate-800">
                {loadingStudents ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-emerald-800">
                      <div className="flex items-center justify-center gap-2 font-black">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        <span>Mengambil Data 50 Siswa Kelas 4 dari Database Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTeacherStudents.length > 0 ? (
                  filteredTeacherStudents.map((st, idx) => (
                    <tr key={st.id || idx} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="p-3 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-3 text-emerald-900 font-mono font-black">{st.nisn}</td>
                      <td className="p-3 font-black text-slate-900">{st.full_name}</td>
                      <td className="p-3 text-slate-600">
                        {st.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          {['Hadir', 'Sakit', 'Izin', 'Alfa'].map((status) => (
                            <button
                              key={status}
                              onClick={() => toggleStudentStatus(st.id, status)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                                st.attendance_status === status
                                  ? status === 'Hadir'
                                    ? 'bg-emerald-700 text-white shadow-sm'
                                    : status === 'Sakit'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : status === 'Izin'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-rose-600 text-white shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 font-bold">
                      Tidak ada siswa ditemukan dengan kata kunci tersebut.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW KEPSEK: REKAPITULASI 6 KELAS */}
      {activeTab === 'siswa' && !isTeacher && (
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
                        onClick={() => {
                          setModalSearchQuery('');
                          setSelectedClassModal(row);
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[11px] rounded-xl flex items-center gap-1 mx-auto shadow-sm transition-all"
                      >
                        <span>Inspeksi</span>
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

      {/* VIEW LOG PRESENSI GURU (KEPSEK) */}
      {activeTab === 'guru' && !isTeacher && (
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
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-black text-[10px]">
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

      {/* MODAL INSPEKSI KEPSEK: MENAMPILKAN SELURUH 50 SISWA DARI SUPABASE (POIN 1) */}
      {selectedClassModal && !isTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>Inspeksi Detail Absensi: {selectedClassModal.class_name}</span>
              </h3>
              <button
                onClick={() => setSelectedClassModal(null)}
                className="text-white hover:text-amber-200 p-1 rounded-lg transition-colors"
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
                      {selectedClassModal.teacher}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Total Terdata: {modalStudents.length} Siswa
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-950 font-black text-sm">
                    Kehadiran: {selectedClassModal.pct}%
                  </p>
                  <p className="text-[11px] text-emerald-800 font-extrabold">
                    {selectedClassModal.hadir} Hadir | {selectedClassModal.sakit} Sakit | {selectedClassModal.izin} Izin
                  </p>
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

              {/* Student Attendance List Table */}
              <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-100/90 text-emerald-950 font-black text-xs">
                      <th className="p-3">No</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Nama Lengkap Siswa</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3 text-center">Status Absensi</th>
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
                          <td className="p-2.5 text-slate-700">{st.gender}</td>
                          <td className="p-2.5 text-center">
                            <div className="inline-flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                              {['Hadir', 'Sakit', 'Izin', 'Alfa'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => toggleModalStudentStatus(st.id, status)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                                    st.attendance_status === status
                                      ? status === 'Hadir'
                                        ? 'bg-emerald-700 text-white'
                                        : status === 'Sakit'
                                        ? 'bg-amber-600 text-white'
                                        : status === 'Izin'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-rose-600 text-white'
                                      : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
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