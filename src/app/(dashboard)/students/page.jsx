'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import BulkImportModal from '@/components/shared/BulkImportModal';
import {
  GraduationCap,
  Users,
  UserCheck,
  Search,
  Plus,
  Printer,
  X,
  Filter,
  CheckCircle2,
  Loader2,
  Phone,
  FileSpreadsheet,
} from 'lucide-react';

const CLASSES = [
  'Semua Kelas',
  'Kelas 1 (Abu Bakar)',
  'Kelas 2 (Ali)',
  'Kelas 3 (Thoriq)',
  'Kelas 4 (Hamzah)',
  'Kelas 5 (Mu\'adz)',
  'Kelas 6 (Al-Farisi)',
];

export default function StudentsMasterPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State Tambah Siswa Baru
  const [newStudent, setNewStudent] = useState({
    nisn: '',
    full_name: '',
    gender: 'L',
    class_name: 'Kelas 1 (Abu Bakar)',
    parent_name: '',
    whatsapp_no: '',
  });

  // Fetch Entire Students Data from Supabase
  const fetchStudents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('students')
        .select('*')
        .order('full_name', { ascending: true });

      const { data, error } = await query;

      if (!error && data) {
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter Data berdasarkan Pencarian & Filter Rombel Kelas
  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nisn?.includes(searchQuery) ||
      st.parent_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClass === 'Semua Kelas' ||
      st.class_name?.toLowerCase().includes(selectedClass.toLowerCase().split(' ')[1] || selectedClass.toLowerCase());

    return matchesSearch && matchesClass;
  });

  // Hitung Metrik Ringkasan
  const totalCount = filteredStudents.length;
  const maleCount = filteredStudents.filter((st) => st.gender === 'L' || st.gender === 'Laki-laki').length;
  const femaleCount = filteredStudents.filter((st) => st.gender === 'P' || st.gender === 'Perempuan').length;

  // Insert Siswa Baru ke Database Supabase
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    // Otomatis tentukan Wali Kelas berdasarkan Rombel
    let teacherAssigned = 'Ustadzah Rahma';
    if (newStudent.class_name.includes('Kelas 2')) teacherAssigned = 'Ustadz Rizky';
    else if (newStudent.class_name.includes('Kelas 3')) teacherAssigned = 'Ustadz Farhan';
    else if (newStudent.class_name.includes('Kelas 4')) teacherAssigned = 'Ustadz Abdullah';
    else if (newStudent.class_name.includes('Kelas 5')) teacherAssigned = 'Ustadzah Khadijah';
    else if (newStudent.class_name.includes('Kelas 6')) teacherAssigned = 'Ustadz Hasan';

    const payload = {
      nisn: newStudent.nisn || `012891${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: newStudent.full_name,
      gender: newStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      class_name: newStudent.class_name,
      teacher_name: teacherAssigned,
      parent_name: newStudent.parent_name || 'Bpk/Ibu Wali',
      whatsapp_no: newStudent.whatsapp_no || '081280000000',
      status: 'Aktif',
    };

    try {
      const { data, error } = await supabase.from('students').insert([payload]).select();

      if (!error) {
        setSuccessMsg('Data Siswa Baru Berhasil Disimpan ke Supabase Database!');
        fetchStudents();
        setNewStudent({
          nisn: '',
          full_name: '',
          gender: 'L',
          class_name: 'Kelas 1 (Abu Bakar)',
          parent_name: '',
          whatsapp_no: '',
        });
        setTimeout(() => {
          setSuccessMsg('');
          setIsAddModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Error adding student:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Dynamic Print CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              header, aside, .print\\:hidden {
                display: none !important;
              }
              body, main {
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .print-area {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 auto !important;
                width: 100% !important;
              }
              @page {
                size: A4 landscape;
                margin: 10mm;
              }
            }
          `,
        }}
      />

      {/* Header Section */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-700" />
            <span>Master Data Seluruh Siswa (Kepsek View)</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Terhubung Live Database Supabase: Menampilkan seluruh data siswa terdaftar SDIT Al Ihsan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tombol Import Bulk Data CSV */}
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Import Bulk CSV</span>
          </button>

          {/* Tombol Print Data Siswa */}
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak / Export</span>
          </button>

          {/* Tombol Tambah Siswa */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Jumlah Murid */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600">Total Siswa Tampil</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">{totalCount} Siswa</p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800 font-black">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600">Siswa Laki-laki</p>
            <p className="text-2xl font-black text-teal-950 mt-1">{maleCount} Siswa</p>
          </div>
          <div className="p-3 bg-teal-100 rounded-xl text-teal-800 font-black">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600">Siswa Perempuan</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">{femaleCount} Siswa</p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800 font-black">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="print:hidden bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, atau orang tua..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Rombel Class Tabs Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-emerald-700 shrink-0 mr-1" />
            {CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-emerald-50 text-slate-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabel Master Data Siswa (Print Area Friendly) */}
      <div className="print-area bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Header Khusus Saat Dicetak */}
        <div className="hidden print:block text-center border-b-2 border-emerald-900 pb-3 mb-4">
          <h2 className="text-lg font-black uppercase text-emerald-950">
            SDIT AL IHSAN INTEGRATED SCHOOL
          </h2>
          <p className="text-xs font-bold text-slate-700">
            LAPORAN MASTER DATA SISWA TERDAFTAR • {selectedClass.toUpperCase()}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold border-collapse">
            <thead>
              <tr className="bg-emerald-100/90 text-emerald-950 font-black border-b border-emerald-200">
                <th className="p-3">NISN</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Rombel Kelas</th>
                <th className="p-3">Wali Kelas Penanggung Jawab</th>
                <th className="p-3">Orang Tua / Wali</th>
                <th className="p-3">No. WhatsApp</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 font-bold text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-emerald-800">
                    <div className="flex items-center justify-center gap-2 font-black">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                      <span>Mengambil Data Siswa dari Cloud Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id || st.nisn} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-3 text-emerald-900 font-mono font-black">{st.nisn}</td>
                    <td className="p-3 font-black text-slate-900">{st.full_name}</td>
                    <td className="p-3 text-slate-700">{st.gender}</td>
                    <td className="p-3 text-emerald-800 font-black">{st.class_name}</td>
                    <td className="p-3 text-slate-800 font-black">
                      {st.teacher_name || 'Ustadz Abdullah'}
                    </td>
                    <td className="p-3 text-slate-700">{st.parent_name || 'Bpk/Ibu Wali'}</td>
                    <td className="p-3 text-slate-600 font-mono">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600 print:hidden" />
                        <span>{st.whatsapp_no || '081280000000'}</span>
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-black text-[10px]">
                        {st.status || 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold">
                    Tidak ada data siswa ditemukan untuk filter tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BULK IMPORT DATA CSV */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={fetchStudents}
      />

      {/* MODAL TAMBAH SISWA BINAAN BARU (SIMPAN KE SUPABASE) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Siswa Binaan Baru</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white hover:text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-5 space-y-4 text-xs font-bold text-slate-800">
              {successMsg && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 font-black rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-900 mb-1">NISN Siswa</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0128912099"
                    value={newStudent.nisn}
                    onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">Jenis Kelamin</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Rayhan"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">Penempatan Rombel Kelas</label>
                <select
                  value={newStudent.class_name}
                  onChange={(e) => setNewStudent({ ...newStudent, class_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {CLASSES.filter((c) => c !== 'Semua Kelas').map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Bpk/Ibu Wali"
                    value={newStudent.parent_name}
                    onChange={(e) => setNewStudent({ ...newStudent, parent_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    placeholder="081280000000"
                    value={newStudent.whatsapp_no}
                    onChange={(e) => setNewStudent({ ...newStudent, whatsapp_no: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs shadow-md flex items-center gap-1.5"
                >
                  {saveLoading ? (
                    <span>Menyimpan ke Supabase...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Simpan Siswa</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}