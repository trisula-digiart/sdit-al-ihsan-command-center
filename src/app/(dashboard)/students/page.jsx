'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  GraduationCap,
  Search,
  Plus,
  Users,
  UserCheck,
  Phone,
  Filter,
  X,
  ShieldCheck,
  Lock,
  User,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function StudentsDirectoryPage() {
  const [currentUserRole, setCurrentUserRole] = useState('Kepsek'); // Default Kepsek View
  const teacherEmail = 'guru@sditalihsan.sch.id'; // Simulasi email Ustadz Abdullah

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    nisn: '',
    full_name: '',
    gender: 'Laki-laki',
    class_name: 'Kelas 4 (Hamzah)',
    parent_name: '',
    parent_phone: '',
  });

  // Fetch Live Data dari Supabase
  const fetchStudentsFromSupabase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
      } else if (data) {
        setStudents(data);
      }
    } catch (err) {
      console.error('Supabase client error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsFromSupabase();

    // Setup Supabase Realtime Subscription
    const channel = supabase
      .channel('realtime_students_directory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchStudentsFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter Data berdasarkan Role Isolation
  const visibleStudents = students.filter((student) => {
    if (currentUserRole === 'Guru') {
      if (student.assigned_teacher_email !== teacherEmail) return false;
    }

    const matchesSearch =
      (student.full_name && student.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.nisn && student.nisn.includes(searchQuery)) ||
      (student.parent_name && student.parent_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass =
      selectedClassFilter === 'Semua' ? true : student.class_name.includes(selectedClassFilter);

    return matchesSearch && matchesClass;
  });

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.full_name || !newStudent.nisn) return;

    const payload = {
      ...newStudent,
      assigned_teacher_name: currentUserRole === 'Guru' ? 'Ustadz Abdullah' : 'Kepala Sekolah (Admin)',
      assigned_teacher_email: currentUserRole === 'Guru' ? teacherEmail : 'kepsek@sditalihsan.sch.id',
      status: 'Aktif',
    };

    const { error } = await supabase.from('students').insert([payload]);

    if (!error) {
      setIsModalOpen(false);
      setNewStudent({
        nisn: '',
        full_name: '',
        gender: 'Laki-laki',
        class_name: 'Kelas 4 (Hamzah)',
        parent_name: '',
        parent_phone: '',
      });
      fetchStudentsFromSupabase();
    } else {
      alert('Gagal menambah siswa: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Switcher Simulator Banner */}
      <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 border-2 border-amber-400">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-xl text-slate-900">
            <ShieldCheck className="w-5 h-5 font-black" />
          </div>
          <div>
            <p className="text-xs font-black tracking-wide text-amber-300 uppercase">
              Simulasi Mode Role Access Control (RBAC)
            </p>
            <p className="text-xs font-bold text-slate-100">
              {currentUserRole === 'Kepsek'
                ? 'Mode Kepala Sekolah: Mengakses Master Data Seluruh 300+ Siswa dari Database Supabase'
                : 'Mode Guru/Wali Kelas (Ustadz Abdullah): Terisolasi khusus Kelas 4 (Hamzah)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStudentsFromSupabase}
            className="p-2 bg-emerald-800 hover:bg-emerald-700 text-amber-300 rounded-xl transition-all mr-2"
            title="Refresh Data Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-[11px] font-black text-slate-200">Ganti Role:</span>
          <button
            onClick={() => setCurrentUserRole('Guru')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              currentUserRole === 'Guru'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
            }`}
          >
            Guru / Wali Kelas
          </button>
          <button
            onClick={() => setCurrentUserRole('Kepsek')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              currentUserRole === 'Kepsek'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
            }`}
          >
            Kepala Sekolah
          </button>
        </div>
      </div>

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-700" />
            <span>
              {currentUserRole === 'Kepsek'
                ? 'Master Data Seluruh Siswa (Kepsek View)'
                : 'Data Siswa Binaan Kelas 4 (Ustadz Abdullah)'}
            </span>
          </h1>
          <p className="text-xs text-slate-700 font-bold mt-1">
            {currentUserRole === 'Kepsek'
              ? 'Terhubung Live Supabase Database: Menampilkan seluruh siswa terdaftar SDIT Al Ihsan.'
              : 'Privasi Terjamin: Anda hanya dapat melihat & mengelola data siswa di kelas yang Anda ampu.'}
          </p>
        </div>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa Binaan</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-700">
              {currentUserRole === 'Kepsek' ? 'Total Seluruh Siswa Sekolah' : 'Jumlah Murid Binaan Anda'}
            </p>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              {loading ? '...' : `${visibleStudents.length} Siswa`}
            </p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-700">Siswa Laki-laki</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              {loading ? '...' : `${visibleStudents.filter((s) => s.gender === 'Laki-laki').length} Siswa`}
            </p>
          </div>
          <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-700">Siswa Perempuan</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              {loading ? '...' : `${visibleStudents.filter((s) => s.gender === 'Perempuan').length} Siswa`}
            </p>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-3 font-bold" />
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, atau orang tua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold placeholder-slate-500"
          />
        </div>

        {currentUserRole === 'Kepsek' ? (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="p-2 bg-slate-50 border-2 border-emerald-200 text-xs font-extrabold text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Semua">Semua Kelas Wali Kelas</option>
              <option value="Kelas 1">Kelas 1 (Ustadzah Rahma)</option>
              <option value="Kelas 2">Kelas 2 (Ustadz Rizky)</option>
              <option value="Kelas 3">Kelas 3 (Ustadz Farhan)</option>
              <option value="Kelas 4">Kelas 4 (Ustadz Abdullah)</option>
              <option value="Kelas 5">Kelas 5 (Ustadzah Khadijah)</option>
              <option value="Kelas 6">Kelas 6 (Ustadz Hasan)</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 font-black text-xs">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Filter Terunci: Kelas 4 (Hamzah)</span>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white border-2 border-emerald-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-100/80 border-b-2 border-emerald-200 text-emerald-950 font-black">
                <th className="p-3.5">NISN</th>
                <th className="p-3.5">Nama Siswa</th>
                <th className="p-3.5">Gender</th>
                <th className="p-3.5">Rombel Kelas</th>
                {currentUserRole === 'Kepsek' && <th className="p-3.5">Wali Kelas Penanggung Jawab</th>}
                <th className="p-3.5">Orang Tua / Wali</th>
                <th className="p-3.5">No. WhatsApp</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 font-bold text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={currentUserRole === 'Kepsek' ? 8 : 7} className="p-12 text-center text-emerald-800 font-black">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                      <span>Memuat Data 300+ Siswa dari Database Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : visibleStudents.length > 0 ? (
                visibleStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-emerald-50/60 transition-colors">
                    <td className="p-3.5 text-emerald-900 font-black">{student.nisn}</td>
                    <td className="p-3.5 font-black text-slate-900">{student.full_name}</td>
                    <td className="p-3.5 text-slate-700">{student.gender}</td>
                    <td className="p-3.5 text-emerald-800 font-extrabold">{student.class_name}</td>
                    {currentUserRole === 'Kepsek' && (
                      <td className="p-3.5 text-indigo-900 font-black flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{student.assigned_teacher_name}</span>
                      </td>
                    )}
                    <td className="p-3.5 text-slate-700">{student.parent_name}</td>
                    <td className="p-3.5 text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{student.parent_phone}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px] rounded-full">
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={currentUserRole === 'Kepsek' ? 8 : 7} className="p-8 text-center text-slate-500 font-bold">
                    Tidak ada siswa ditemukan di database Supabase.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Tambah Siswa Binaan Baru</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-3 font-bold text-slate-800">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">NISN Siswa</label>
                <input
                  type="text"
                  value={newStudent.nisn}
                  onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                  placeholder="Contoh: 0128912301"
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  placeholder="Nama sesuai akta"
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">Jenis Kelamin</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">Kelas Rombel</label>
                  <input
                    type="text"
                    value={newStudent.class_name}
                    disabled={currentUserRole === 'Guru'}
                    onChange={(e) => setNewStudent({ ...newStudent, class_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-100 border-2 border-emerald-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  value={newStudent.parent_name}
                  onChange={(e) => setNewStudent({ ...newStudent, parent_name: e.target.value })}
                  placeholder="Nama Ayah / Ibu"
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">No. WhatsApp Orang Tua</label>
                <input
                  type="text"
                  value={newStudent.parent_phone}
                  onChange={(e) => setNewStudent({ ...newStudent, parent_phone: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}