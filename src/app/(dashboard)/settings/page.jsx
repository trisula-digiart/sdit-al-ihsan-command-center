'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building,
  UserPlus,
  Users,
  Save,
  CheckCircle2,
  Mail,
  User,
  Phone,
  MapPin,
} from 'lucide-react';

const INITIAL_TEACHERS = [
  { id: 1, name: 'Ustadz Abdullah', email: 'guru@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 4 (Hamzah)', status: 'Aktif' },
  { id: 2, name: 'Ustadzah Rahma', email: 'rahma@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 1 (Abu Bakar)', status: 'Aktif' },
  { id: 3, name: 'Ustadz Rizky', email: 'rizky@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 2 (Ali)', status: 'Aktif' },
  { id: 4, name: 'Ustadz Farhan', email: 'farhan@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 3 (Thoriq)', status: 'Aktif' },
  { id: 5, name: 'Ustadzah Khadijah', email: 'khadijah@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 5 (Mu\'adz)', status: 'Aktif' },
  { id: 6, name: 'Ustadz Hasan', email: 'hasan@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 6 (Al-Farisi)', status: 'Aktif' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' atau 'teachers'

  // State Profil Sekolah
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: 'SDIT Al Ihsan Integrated School',
    principal_name: 'H. Ahmad Dahlan, M.Pd',
    address: 'Jl. Kebajikan No. 45, Kecamatan Beji, Kota Depok, Jawa Barat',
    phone: '021-77889900',
    email: 'info@sditalihsan.sch.id',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // State Tambah Guru
  const [teachersList, setTeachersList] = useState(INITIAL_TEACHERS);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: '',
    class_assigned: 'Kelas 1 (Abu Bakar)',
  });
  const [teacherSuccess, setTeacherSuccess] = useState(false);

  const handleSaveSchoolInfo = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email) return;

    const created = {
      id: Date.now(),
      name: newTeacher.name,
      email: newTeacher.email,
      role: 'Wali Kelas',
      class_assigned: newTeacher.class_assigned,
      status: 'Aktif',
    };

    setTeachersList([created, ...teachersList]);
    setNewTeacher({ name: '', email: '', password: '', class_assigned: 'Kelas 1 (Abu Bakar)' });
    setTeacherSuccess(true);
    setTimeout(() => setTeacherSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-700" />
            <span>Pengaturan Sistem & Manajemen Akses</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Kelola identitas resmi sekolah dan pendaftaran akun akses Guru / Wali Kelas.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-black text-xs">
          Hak Akses: Kepala Sekolah (Master Admin)
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex gap-2 border-b-2 border-emerald-200 pb-2">
        <button
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'identity'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Identitas Profil Sekolah</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'teachers'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Manajemen & Tambah Akun Guru ({teachersList.length})</span>
        </button>
      </div>

      {/* TAB 1: EDIT IDENTITAS SEKOLAH & KEPALA SEKOLAH */}
      {activeTab === 'identity' && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b-2 border-emerald-100 pb-3">
            <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>Formulir Identitas Resmi Sekolah & Kepala Sekolah</span>
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-0.5">
              Data ini akan ditampilkan pada kop surat, laporan executive, dan sertifikat resmi.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Data profil sekolah berhasil diperbarui di sistem!</span>
            </div>
          )}

          <form onSubmit={handleSaveSchoolInfo} className="space-y-4 text-xs font-bold text-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-slate-900 mb-1">Nama Resmi Sekolah</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolInfo.school_name}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, school_name: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">Nama Lengkap Kepala Sekolah</label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolInfo.principal_name}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, principal_name: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1">Alamat Lengkap Sekolah</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={schoolInfo.address}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-slate-900 mb-1">No. Telepon / WhatsApp Kantor</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={schoolInfo.phone}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">Email Resmi Sekolah</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={schoolInfo.email}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Identitas</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MENAMBAH AKUN GURU & MANAGEMENT */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          {/* Form Tambah Guru Baru */}
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b-2 border-emerald-100 pb-3">
              <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <span>Pendaftaran Akun Guru / Wali Kelas Baru</span>
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Guru yang didaftarkan akan secara otomatis mendapatkan akses terisolasi untuk mengelola kelas binaannya.
              </p>
            </div>

            {teacherSuccess && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Akun Guru Baru Berhasil Didaftarkan ke Sistem!</span>
              </div>
            )}

            <form onSubmit={handleAddTeacher} className="space-y-4 text-xs font-bold text-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Nama Lengkap Guru & Gelar</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ustadz Ahmad Fauzi, S.Pd"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">Email Login Guru</label>
                  <input
                    type="email"
                    placeholder="fauzi@sditalihsan.sch.id"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Password Akses</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newTeacher.password}
                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">Penugasan Kelas Binaan</label>
                  <select
                    value={newTeacher.class_assigned}
                    onChange={(e) => setNewTeacher({ ...newTeacher, class_assigned: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
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

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Akun Guru</span>
                </button>
              </div>
            </form>
          </div>

          {/* Tabel Daftar Guru Terdaftar */}
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-3">
              <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Daftar Guru & Wali Kelas Terdaftar ({teachersList.length})</span>
              </h3>
              <span className="text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full">
                Terisolasi per Rombel
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold border-collapse">
                <thead>
                  <tr className="bg-emerald-100/80 text-emerald-950 font-black border-b border-emerald-200">
                    <th className="p-3">Nama Guru</th>
                    <th className="p-3">Email Login</th>
                    <th className="p-3">Peran Akses</th>
                    <th className="p-3">Rombel Kelas Binaan</th>
                    <th className="p-3 text-center">Status Akses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {teachersList.map((guru) => (
                    <tr key={guru.id} className="hover:bg-emerald-50/50">
                      <td className="p-3 font-black text-slate-900">{guru.name}</td>
                      <td className="p-3 text-slate-700 font-mono">{guru.email}</td>
                      <td className="p-3 text-emerald-800 font-black">{guru.role}</td>
                      <td className="p-3 text-slate-900 font-black">{guru.class_assigned}</td>
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
        </div>
      )}
    </div>
  );
}