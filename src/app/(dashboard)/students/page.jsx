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
  BrainCircuit,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  FileText,
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

function GlassmorphismModal({
  isOpen,
  onClose,
  title = 'Modal Title',
  icon: Icon = null,
  children,
  maxWidth = 'max-w-3xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-opacity animate-fade-in">
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-[#0C1821] text-gray-100 rounded-2xl border border-[#005B3F]/50 shadow-2xl shadow-[#005B3F]/20 overflow-hidden backdrop-saturate-150`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#005B3F]/30 bg-gradient-to-r from-[#005B3F]/30 via-transparent to-amber-500/10">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-[#005B3F]/40 text-emerald-400 border border-[#005B3F]/60">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-base md:text-lg font-bold text-emerald-50 tracking-wide">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 border border-transparent transition-all cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function StudentsMasterPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // AI Narrative State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiFormData, setAiFormData] = useState({
    namaSiswa: '',
    kelas: '',
    nilaiAkademik: '',
    capaianHafalan: '',
    kedisiplinanIbadah: '',
    catatanWaliKelas: '',
  });
  const [generatedNarrative, setGeneratedNarrative] = useState('');
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [copiedNarrative, setCopiedNarrative] = useState(false);

  // Form State Tambah Siswa Baru
  const [newStudent, setNewStudent] = useState({
    nisn: '',
    full_name: '',
    gender: 'L',
    class_name: 'Kelas 1 (Abu Bakar)',
    parent_name: '',
    whatsapp_no: '',
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('full_name', { ascending: true });

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

  const totalCount = filteredStudents.length;
  const maleCount = filteredStudents.filter((st) => st.gender === 'L' || st.gender === 'Laki-laki').length;
  const femaleCount = filteredStudents.filter((st) => st.gender === 'P' || st.gender === 'Perempuan').length;

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

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
      const { error } = await supabase.from('students').insert([payload]);

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

  const handleOpenAiModal = (student) => {
    setAiFormData({
      namaSiswa: student.full_name || 'Ananda',
      kelas: student.class_name || '1 Abu Bakar',
      nilaiAkademik: 'Sangat baik pada mapel IPAS (90) & Matematika (88)',
      capaianHafalan: 'Juz 30 (Surah An-Naba s.d At-Takwir tuntas dengan tajwid baik)',
      kedisiplinanIbadah: 'Sangat tertib Shalat Dhuha dan Dzuhur berjamaah',
      catatanWaliKelas: 'Ananda memiliki kepemimpinan baik, santun, dan sangat kooperatif.',
    });
    setGeneratedNarrative('');
    setIsAiModalOpen(true);
  };

  const handleGenerateNarrative = async (e) => {
    e?.preventDefault();
    setIsGeneratingNarrative(true);

    try {
      const response = await fetch('/api/ai/narasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiFormData),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menyusun narasi rapor.');
      }

      setGeneratedNarrative(result.narrative || result.content || '');
    } catch (err) {
      console.error('[NARASI_RAPOR_ERROR]:', err);
      setGeneratedNarrative('Mohon maaf, terjadi kendala saat menyusun narasi rapor. Silakan coba kembali.');
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  const handleCopyNarrative = async () => {
    try {
      await navigator.clipboard.writeText(generatedNarrative);
      setCopiedNarrative(true);
      setTimeout(() => setCopiedNarrative(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
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
            <span>Master Data Siswa & AI Narasi Rapor</span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Groq Powered
            </span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Terhubung Live Database Supabase: Kelola data siswa & buat narasi perkembangan karakter otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Import Bulk CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak / Export</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Table Section */}
      <div className="print-area bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
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
                <th className="p-3">Wali Kelas</th>
                <th className="p-3">Orang Tua / Wali</th>
                <th className="p-3">No. WhatsApp</th>
                <th className="p-3 text-center print:hidden">Aksi AI</th>
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
                    <td className="p-3 text-center print:hidden">
                      <button
                        onClick={() => handleOpenAiModal(st)}
                        className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-[11px] rounded-xl shadow-sm flex items-center justify-center gap-1 mx-auto transition-all cursor-pointer"
                        title="Buat Narasi Rapor AI"
                      >
                        <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
                        <span>Narasi AI</span>
                      </button>
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

      {/* AI Narrative Modal */}
      <GlassmorphismModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title={`AI Narasi Rapor - ${aiFormData.namaSiswa}`}
        icon={BrainCircuit}
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Form Controls */}
          <form onSubmit={handleGenerateNarrative} className="lg:col-span-6 space-y-3">
            <div>
              <label className="block text-emerald-300 font-medium mb-1">Capaian Akademik & Mapel:</label>
              <textarea
                rows={2}
                value={aiFormData.nilaiAkademik}
                onChange={(e) => setAiFormData({ ...aiFormData, nilaiAkademik: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">Capaian Hafalan Al-Qur'an (Tahfiz):</label>
              <textarea
                rows={2}
                value={aiFormData.capaianHafalan}
                onChange={(e) => setAiFormData({ ...aiFormData, capaianHafalan: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">Sikap & Kedisiplinan Ibadah:</label>
              <input
                type="text"
                value={aiFormData.kedisiplinanIbadah}
                onChange={(e) => setAiFormData({ ...aiFormData, kedisiplinanIbadah: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-1">Catatan Khusus Wali Kelas:</label>
              <textarea
                rows={2}
                value={aiFormData.catatanWaliKelas}
                onChange={(e) => setAiFormData({ ...aiFormData, catatanWaliKelas: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingNarrative}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
            >
              {isGeneratingNarrative ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Merancang Narasi Rapor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Proses Narasi Rapor AI</span>
                </>
              )}
            </button>
          </form>

          {/* AI Output Preview */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-gray-900/80 border border-[#005B3F]/40 rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" /> Draf Narasi Rapor
                </span>
                {generatedNarrative && (
                  <button
                    onClick={handleCopyNarrative}
                    className="flex items-center space-x-1 px-2.5 py-1 text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-600/40 rounded-lg hover:bg-emerald-800 transition-all cursor-pointer"
                  >
                    {copiedNarrative ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNarrative ? 'Tersalin' : 'Salin Narasi'}</span>
                  </button>
                )}
              </div>

              <div className="p-3 bg-[#0C1821] border border-gray-800 rounded-xl text-gray-200 min-h-[220px] whitespace-pre-wrap leading-relaxed font-sans">
                {generatedNarrative || 'Klik "Proses Narasi Rapor AI" untuk menghasilkan evaluasi karakter siswa.'}
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center italic">
              Narasi dirancang menggunakan pola Sandwich Feedback (Apresiasi - Evaluasi - Doa).
            </p>
          </div>
        </div>
      </GlassmorphismModal>

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={fetchStudents}
      />

      {/* Add Student Modal */}
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
                className="text-white hover:text-amber-200 cursor-pointer"
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
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