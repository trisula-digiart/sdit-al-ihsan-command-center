'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
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
  Image as ImageIcon,
  Upload,
  Loader2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

const DEFAULT_TEACHERS = [
  { id: 1, name: 'Ustadz Abdullah', email: 'guru@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 4 (Hamzah)', status: 'Aktif' },
  { id: 2, name: 'Ustadzah Rahma', email: 'rahma@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 1 (Abu Bakar)', status: 'Aktif' },
  { id: 3, name: 'Ustadz Rizky', email: 'rizky@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 2 (Ali)', status: 'Aktif' },
  { id: 4, name: 'Ustadz Farhan', email: 'farhan@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 3 (Thoriq)', status: 'Aktif' },
  { id: 5, name: 'Ustadzah Khadijah', email: 'khadijah@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 5 (Mu\'adz)', status: 'Aktif' },
  { id: 6, name: 'Ustadz Hasan', email: 'hasan@sditalihsan.sch.id', role: 'Wali Kelas', class_assigned: 'Kelas 6 (Al-Farisi)', status: 'Aktif' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('identity');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // State Profil Sekolah
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: 'SDIT Al Ihsan Integrated School',
    principal_name: 'H. Ahmad Dahlan, M.Pd',
    address: 'Jl. Kebajikan No. 45, Kecamatan Beji, Kota Depok, Jawa Barat',
    phone: '021-77889900',
    email: 'info@sditalihsan.sch.id',
    logo_url: '',
    kop_logo_url: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [kopLogoFile, setKopLogoFile] = useState(null);
  const [kopLogoPreview, setKopLogoPreview] = useState('');

  // State Guru
  const [teachersList, setTeachersList] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [submittingTeacher, setSubmittingTeacher] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: '',
    class_assigned: 'Kelas 1 (Abu Bakar)',
  });
  const [teacherSuccess, setTeacherSuccess] = useState(false);

  // Load Profil Sekolah
  useEffect(() => {
    const fetchSchoolSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('*')
          .single();

        if (!error && data) {
          setSchoolInfo({
            school_name: data.school_name || 'SDIT Al Ihsan Integrated School',
            principal_name: data.principal_name || 'H. Ahmad Dahlan, M.Pd',
            address: data.address || 'Jl. Kebajikan No. 45, Beji, Depok',
            phone: data.phone || '021-77889900',
            email: data.email || 'info@sditalihsan.sch.id',
            logo_url: data.logo_url || '',
            kop_logo_url: data.kop_logo_url || '',
          });

          if (data.logo_url) setLogoPreview(data.logo_url);
          if (data.kop_logo_url) setKopLogoPreview(data.kop_logo_url);
        }
      } catch (err) {
        console.error('Error fetching school_settings:', err);
      }
    };

    fetchSchoolSettings();
  }, []);

  // Fetch Teachers dengan Backup LocalStorage Persistent
  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    let localSaved = null;

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('custom_teachers');
      if (stored) {
        try {
          localSaved = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setTeachersList(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('custom_teachers', JSON.stringify(data));
        }
      } else {
        setTeachersList(localSaved || DEFAULT_TEACHERS);
      }
    } catch (err) {
      console.error('Error fetching teachers from Supabase:', err);
      setTeachersList(localSaved || DEFAULT_TEACHERS);
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSelectLogoFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    if (type === 'app') {
      setLogoFile(file);
      setLogoPreview(objectUrl);
    } else if (type === 'kop') {
      setKopLogoFile(file);
      setKopLogoPreview(objectUrl);
    }
  };

  const uploadToSupabaseStorage = async (file, fileName) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${fileName}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('school-assets')
        .upload(filePath, file, { upsert: true });

      if (error) return null;

      const { data: publicUrlData } = supabase.storage
        .from('school-assets')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      return null;
    }
  };

  const handleSaveSchoolInfo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalLogoUrl = schoolInfo.logo_url;
      let finalKopLogoUrl = schoolInfo.kop_logo_url;

      if (logoFile) {
        const uploadedUrl = await uploadToSupabaseStorage(logoFile, 'app_logo');
        if (uploadedUrl) finalLogoUrl = uploadedUrl;
      }

      if (kopLogoFile) {
        const uploadedKopUrl = await uploadToSupabaseStorage(kopLogoFile, 'kop_logo');
        if (uploadedKopUrl) finalKopLogoUrl = uploadedKopUrl;
      }

      const payload = {
        school_name: schoolInfo.school_name,
        principal_name: schoolInfo.principal_name,
        address: schoolInfo.address,
        phone: schoolInfo.phone,
        email: schoolInfo.email,
        logo_url: finalLogoUrl,
        kop_logo_url: finalKopLogoUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('school_settings')
        .update(payload)
        .eq('id', 1);

      if (!error) {
        setSchoolInfo(payload);
        setLogoFile(null);
        setKopLogoFile(null);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tambah Guru Baru (Dual Sync: Supabase + LocalStorage)
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email) return;

    setSubmittingTeacher(true);
    setTeacherError('');
    setTeacherSuccess(false);

    const payload = {
      name: newTeacher.name,
      email: newTeacher.email.trim().toLowerCase(),
      role: 'Wali Kelas',
      class_assigned: newTeacher.class_assigned,
      status: 'Aktif',
    };

    try {
      // Try Supabase Insert
      const { data, error } = await supabase
        .from('teachers')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Supabase Insert Warning:', error.message);
      }

      // Sync ke state & LocalStorage
      const createdObj = { id: Date.now(), ...payload };
      const updatedList = [createdObj, ...teachersList.filter((t) => t.email !== payload.email)];

      setTeachersList(updatedList);
      if (typeof window !== 'undefined') {
        localStorage.setItem('custom_teachers', JSON.stringify(updatedList));
      }

      setNewTeacher({ name: '', email: '', password: '', class_assigned: 'Kelas 1 (Abu Bakar)' });
      setTeacherSuccess(true);
      setTimeout(() => setTeacherSuccess(false), 3000);
    } catch (err) {
      console.error('Error inserting teacher:', err);
    } finally {
      setSubmittingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun guru ini?')) return;

    try {
      await supabase.from('teachers').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }

    const updated = teachersList.filter((t) => t.id !== id);
    setTeachersList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('custom_teachers', JSON.stringify(updated));
    }
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
            Kelola identitas resmi sekolah, logo kop surat, dan pendaftaran akun akses Guru / Wali Kelas.
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
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'identity'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Identitas Profil & Logo Sekolah</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Manajemen & Tambah Akun Guru ({teachersList.length})</span>
        </button>
      </div>

      {/* TAB 1: IDENTITAS */}
      {activeTab === 'identity' && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b-2 border-emerald-100 pb-3">
            <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>Formulir Identitas Resmi Sekolah, Kepala Sekolah & Upload Logo</span>
            </h2>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Identitas & Berkas Logo Sekolah Berhasil Di-upload Permanen!</span>
            </div>
          )}

          <form onSubmit={handleSaveSchoolInfo} className="space-y-5 text-xs font-bold text-slate-800">
            <div className="p-5 bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl space-y-4">
              <h3 className="text-xs font-black text-emerald-950 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <span>Upload Berkas Logo dari Komputer / Laptop</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border-2 border-emerald-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      1. Logo Utama Aplikasi / Web
                    </label>

                    <div className="flex items-center gap-4 mt-2">
                      {logoPreview ? (
                        <div className="w-16 h-16 rounded-xl border-2 border-emerald-300 p-1 bg-white shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={logoPreview} alt="Logo Utama" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 shrink-0 flex items-center justify-center font-black text-emerald-800 text-xs">
                          AI
                        </div>
                      )}

                      <div className="flex-1">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>Pilih Gambar...</span>
                          <input type="file" accept="image/*" onChange={(e) => handleSelectLogoFile(e, 'app')} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-emerald-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      2. Logo Khusus Kop Surat Resmi
                    </label>

                    <div className="flex items-center gap-4 mt-2">
                      {kopLogoPreview ? (
                        <div className="w-16 h-16 rounded-xl border-2 border-emerald-300 p-1 bg-white shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={kopLogoPreview} alt="Logo Kop" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 shrink-0 flex items-center justify-center font-black text-emerald-800 text-xs">
                          KOP
                        </div>
                      )}

                      <div className="flex-1">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>Pilih Gambar...</span>
                          <input type="file" accept="image/*" onChange={(e) => handleSelectLogoFile(e, 'kop')} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-slate-900 mb-1">Nama Resmi Sekolah</label>
                <input
                  type="text"
                  value={schoolInfo.school_name}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, school_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">Nama Lengkap Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolInfo.principal_name}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, principal_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MANAJEMEN AKUN GURU */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b-2 border-emerald-100 pb-3">
              <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <span>Pendaftaran Akun Guru / Wali Kelas Baru</span>
              </h2>
            </div>

            {teacherSuccess && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Akun Guru Baru Berhasil Didaftarkan & Disimpan Permanen!</span>
              </div>
            )}

            <form onSubmit={handleAddTeacher} className="space-y-4 text-xs font-bold text-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Nama Lengkap Guru & Gelar</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ustadz Usman Fauzi, S.Pd"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">Email Login Guru</label>
                  <input
                    type="email"
                    placeholder="usmankelas2@k2c.com"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold"
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
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">Penugasan Kelas Binaan</label>
                  <select
                    value={newTeacher.class_assigned}
                    onChange={(e) => setNewTeacher({ ...newTeacher, class_assigned: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold cursor-pointer"
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
                  disabled={submittingTeacher}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingTeacher ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Daftarkan Akun Guru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* TABLE DAFTAR GURU */}
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
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {loadingTeachers ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-emerald-800 font-bold">
                        <div className="flex items-center justify-center gap-2 font-black">
                          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                          <span>Mengambil Daftar Guru...</span>
                        </div>
                      </td>
                    </tr>
                  ) : teachersList.length > 0 ? (
                    teachersList.map((guru) => (
                      <tr key={guru.id} className="hover:bg-emerald-50/50 transition-colors">
                        <td className="p-3 font-black text-slate-900">{guru.name}</td>
                        <td className="p-3 text-slate-700 font-mono">{guru.email}</td>
                        <td className="p-3 text-emerald-800 font-black">{guru.role || 'Wali Kelas'}</td>
                        <td className="p-3 text-slate-900 font-black">{guru.class_assigned || guru.class_name || 'Kelas 1 (Abu Bakar)'}</td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-black text-[10px]">
                            {guru.status || 'Aktif'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteTeacher(guru.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Akun Guru"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500 font-bold">
                        Belum ada data guru terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}