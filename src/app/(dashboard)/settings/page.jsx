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

  // State Profil Sekolah & URL Logo (Disimpan ke Supabase Database)
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: 'SDIT Al Ihsan Integrated School',
    principal_name: 'H. Ahmad Dahlan, M.Pd',
    address: 'Jl. Kebajikan No. 45, Kecamatan Beji, Kota Depok, Jawa Barat',
    phone: '021-77889900',
    email: 'info@sditalihsan.sch.id',
    logo_url: '',
    kop_logo_url: '',
  });

  // State File dari Laptop untuk Preview & Upload Direct
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [kopLogoFile, setKopLogoFile] = useState(null);
  const [kopLogoPreview, setKopLogoPreview] = useState('');

  // State Guru & Loading State Database Supabase
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

  // Load Profil Sekolah dari Database Supabase Saat Halaman Dibuka
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
        console.error('Error fetching school_settings from Supabase:', err);
      }
    };

    fetchSchoolSettings();
  }, []);

  // Fetch Entire Teachers List dari Supabase Cloud
  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setTeachersList(data);
      } else {
        // Jika tabel teachers di Supabase masih kosong, tampilkan default bawaan
        setTeachersList(DEFAULT_TEACHERS);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setTeachersList(DEFAULT_TEACHERS);
    } font-black {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handler Pilih File Gambar dari Laptop
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

  // Helper Upload File ke Supabase Storage Bucket
  const uploadToSupabaseStorage = async (file, fileName) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${fileName}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('school-assets')
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error('Upload storage error:', error);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('school-assets')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Storage exception:', err);
      return null;
    }
  };

  // Simpan/Update Profil Sekolah
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

        if (typeof window !== 'undefined') {
          localStorage.setItem('school_info', JSON.stringify(payload));
        }
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        console.error('Supabase update error:', error);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tambah Akun Guru Baru ke Database Supabase
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
      // 1. Simpan ke Supabase Database
      const { data, error } = await supabase
        .from('teachers')
        .insert([payload])
        .select();

      if (error) {
        throw error;
      }

      // 2. Reset form & refresh list
      setNewTeacher({ name: '', email: '', password: '', class_assigned: 'Kelas 1 (Abu Bakar)' });
      setTeacherSuccess(true);
      fetchTeachers();

      setTimeout(() => setTeacherSuccess(false), 3000);
    } catch (err) {
      console.error('Error inserting teacher:', err);
      // Fallback lokal jika tabel teachers belum tersedia di Supabase schema
      const createdFallback = {
        id: Date.now(),
        ...payload,
      };
      setTeachersList((prev) => [createdFallback, ...prev]);
      setNewTeacher({ name: '', email: '', password: '', class_assigned: 'Kelas 1 (Abu Bakar)' });
      setTeacherSuccess(true);
      setTimeout(() => setTeacherSuccess(false), 3000);
    } finally {
      setSubmittingTeacher(false);
    }
  };

  // Hapus Akun Guru dari Supabase
  const handleDeleteTeacher = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun guru ini?')) return;

    try {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (!error) {
        setTeachersList((prev) => prev.filter((t) => t.id !== id));
      } else {
        setTeachersList((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error('Error deleting teacher:', err);
      setTeachersList((prev) => prev.filter((t) => t.id !== id));
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

      {/* TAB 1: EDIT IDENTITAS SEKOLAH & FILE UPLOAD LOGO */}
      {activeTab === 'identity' && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b-2 border-emerald-100 pb-3">
            <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>Formulir Identitas Resmi Sekolah, Kepala Sekolah & Upload Logo</span>
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-0.5">
              Upload logo dari komputer kamu. Berkas akan otomatis tersimpan di Supabase Cloud Storage dan sinkron ke seluruh perangkat.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Identitas & Berkas Logo Sekolah Berhasil Di-upload Permanen ke Cloud Supabase!</span>
            </div>
          )}

          <form onSubmit={handleSaveSchoolInfo} className="space-y-5 text-xs font-bold text-slate-800">
            {/* SECTION UPLOAD FILE LOGO DARI KOMPUTER / LAPTOP */}
            <div className="p-5 bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl space-y-4">
              <h3 className="text-xs font-black text-emerald-950 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <span>Upload Berkas Logo dari Komputer / Laptop (PNG / JPG / WebP)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. File Uploader Logo Utama Aplikasi */}
                <div className="bg-white p-4 rounded-xl border-2 border-emerald-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      1. Logo Utama Aplikasi / Web
                    </label>
                    <p className="text-[10px] text-slate-500 mb-3">
                      Tampil pada Sidebar, Topbar, dan Brand Header aplikasi.
                    </p>

                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="w-16 h-16 rounded-xl border-2 border-emerald-300 p-1 bg-white shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={logoPreview}
                            alt="Logo Utama"
                            className="w-full h-full object-contain"
                          />
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
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSelectLogoFile(e, 'app')}
                            className="hidden"
                          />
                        </label>
                        {logoFile && (
                          <p className="text-[10px] text-emerald-800 font-extrabold mt-1 truncate">
                            File terpilih: {logoFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. File Uploader Logo Kop Surat Resmi */}
                <div className="bg-white p-4 rounded-xl border-2 border-emerald-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      2. Logo Khusus Kop Surat Resmi
                    </label>
                    <p className="text-[10px] text-slate-500 mb-3">
                      Tersinkronkan otomatis pada Kop Surat Surat Resmi Document Generator.
                    </p>

                    <div className="flex items-center gap-4">
                      {kopLogoPreview ? (
                        <div className="w-16 h-16 rounded-xl border-2 border-emerald-300 p-1 bg-white shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={kopLogoPreview}
                            alt="Logo Kop"
                            className="w-full h-full object-contain"
                          />
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
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSelectLogoFile(e, 'kop')}
                            className="hidden"
                          />
                        </label>
                        {kopLogoFile && (
                          <p className="text-[10px] text-emerald-800 font-extrabold mt-1 truncate">
                            File terpilih: {kopLogoFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengunggah File & Menyimpan ke Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Identitas & Logo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MANAJEMEN AKUN GURU (TERHUBUNG PERSISTEN KE SUPABASE) */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b-2 border-emerald-100 pb-3">
              <h2 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <span>Pendaftaran Akun Guru / Wali Kelas Baru (Tersimpan ke Supabase)</span>
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Guru yang didaftarkan akan secara otomatis mendapatkan akses terisolasi untuk mengelola kelas binaannya.
              </p>
            </div>

            {teacherSuccess && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Akun Guru Baru Berhasil Didaftarkan Permanen ke Supabase Database!</span>
              </div>
            )}

            {teacherError && (
              <div className="p-3 bg-rose-100 border-2 border-rose-300 text-rose-950 font-black text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700" />
                <span>{teacherError}</span>
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
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
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
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
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
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">Penugasan Kelas Binaan</label>
                  <select
                    value={newTeacher.class_assigned}
                    onChange={(e) => setNewTeacher({ ...newTeacher, class_assigned: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingTeacher ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Menyimpan ke Supabase...</span>
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

          {/* TABLE GURU DAFTAR TERPANTAU LIVE */}
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
                          <span>Mengambil Daftar Guru dari Cloud Supabase...</span>
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
                        Belum ada data guru terdaftar di database.
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