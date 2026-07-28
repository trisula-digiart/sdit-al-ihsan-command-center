'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Users,
  UserCheck,
  Phone,
  Filter,
  X,
  FileSpreadsheet,
} from 'lucide-react';

const INITIAL_STUDENTS = [
  {
    id: '1',
    nisn: '0128912001',
    full_name: 'Muhammad Zaid Al-Faris',
    gender: 'Laki-laki',
    class_name: 'Kelas 1 (Abu Bakar)',
    parent_name: 'Ahmad Fauzi',
    parent_phone: '081299887766',
    status: 'Aktif',
  },
  {
    id: '2',
    nisn: '0128912002',
    full_name: 'Aisyah Humaira',
    gender: 'Perempuan',
    class_name: 'Kelas 1 (Abu Bakar)',
    parent_name: 'Dedi Kurniawan',
    parent_phone: '081388776655',
    status: 'Aktif',
  },
  {
    id: '3',
    nisn: '0128912003',
    full_name: 'Fatimah Az-Zahra',
    gender: 'Perempuan',
    class_name: 'Kelas 4 (Hamzah)',
    parent_name: 'H. Abdullah',
    parent_phone: '081577665544',
    status: 'Aktif',
  },
  {
    id: '4',
    nisn: '0128912004',
    full_name: 'Umar Abdul Aziz',
    gender: 'Laki-laki',
    class_name: 'Kelas 4 (Hamzah)',
    parent_name: 'Budi Santoso',
    parent_phone: '081166554433',
    status: 'Aktif',
  },
  {
    id: '5',
    nisn: '0128912005',
    full_name: 'Khalid Bin Walid',
    gender: 'Laki-laki',
    class_name: 'Kelas 6 (Al-Farisi)',
    parent_name: 'Sulaeman',
    parent_phone: '081755443322',
    status: 'Aktif',
  },
];

export default function StudentsDirectoryPage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    nisn: '',
    full_name: '',
    gender: 'Laki-laki',
    class_name: 'Kelas 1 (Abu Bakar)',
    parent_name: '',
    parent_phone: '',
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.full_name || !newStudent.nisn) return;

    const created = {
      id: String(Date.now()),
      ...newStudent,
      status: 'Aktif',
    };

    setStudents((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewStudent({
      nisn: '',
      full_name: '',
      gender: 'Laki-laki',
      class_name: 'Kelas 1 (Abu Bakar)',
      parent_name: '',
      parent_phone: '',
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.parent_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'Semua' ? true : s.class_name.includes(selectedClass);
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-700" />
            <span>Direktori & Master Data Siswa</span>
          </h1>
          <p className="text-xs text-slate-700 font-bold mt-1">
            Database terintegrasi seluruh siswa SDIT Al Ihsan untuk Kepala Sekolah, Wali Kelas & Staf.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Siswa */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-700">Total Siswa Aktif</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">540 Siswa</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-700">Siswa Laki-laki</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">280 Siswa</p>
          </div>
          <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
        <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-700">Siswa Perempuan</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">260 Siswa</p>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-3 font-bold" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NISN, atau wali murid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-bold placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 bg-slate-50 border-2 border-emerald-200 text-xs font-extrabold text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="Semua">Semua Jenjang Kelas</option>
            <option value="Kelas 1">Kelas 1</option>
            <option value="Kelas 2">Kelas 2</option>
            <option value="Kelas 3">Kelas 3</option>
            <option value="Kelas 4">Kelas 4</option>
            <option value="Kelas 5">Kelas 5</option>
            <option value="Kelas 6">Kelas 6</option>
          </select>
        </div>
      </div>

      {/* Student Data Table */}
      <div className="bg-white border-2 border-emerald-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-100/80 border-b-2 border-emerald-200 text-emerald-950 font-black">
                <th className="p-3.5">NISN</th>
                <th className="p-3.5">Nama Lengkap Siswa</th>
                <th className="p-3.5">Gender</th>
                <th className="p-3.5">Rombel Kelas</th>
                <th className="p-3.5">Nama Orang Tua / Wali</th>
                <th className="p-3.5">No. Telepon / WhatsApp</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 font-bold text-slate-800">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-emerald-50/60 transition-colors">
                    <td className="p-3.5 text-emerald-900 font-black">{student.nisn}</td>
                    <td className="p-3.5 font-black text-slate-900">{student.full_name}</td>
                    <td className="p-3.5 text-slate-700">{student.gender}</td>
                    <td className="p-3.5 text-emerald-800 font-extrabold">{student.class_name}</td>
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
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-bold">
                    Tidak ada data siswa yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Modal Tambah Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Tambah Siswa Baru SDIT Al Ihsan</span>
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
                  placeholder="Contoh: 0128912006"
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
                  <select
                    value={newStudent.class_name}
                    onChange={(e) => setNewStudent({ ...newStudent, class_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Kelas 1 (Abu Bakar)">Kelas 1 (Abu Bakar)</option>
                    <option value="Kelas 2 (Ali)">Kelas 2 (Ali)</option>
                    <option value="Kelas 3 (Thoriq)">Kelas 3 (Thoriq)</option>
                    <option value="Kelas 4 (Hamzah)">Kelas 4 (Hamzah)</option>
                    <option value="Kelas 5 (Mu'adz)">Kelas 5 (Mu'adz)</option>
                    <option value="Kelas 6 (Al-Farisi)">Kelas 6 (Al-Farisi)</option>
                  </select>
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
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md"
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