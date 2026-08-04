'use client';

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Send,
  RefreshCw,
  BookOpen,
  Calendar,
  UserCheck,
  Hash,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import DocumentPreview from '../../../components/ai/DocumentPreview';

export default function DocumentGeneratorPage() {
  const [formData, setFormData] = useState({
    templateType: 'surat_undangan',
    nomorSurat: '001/SDIT-AI/PR/2026',
    perihal: 'Undangan Rapat Koordinasi Wali Murid & Evaluasi Semester',
    penerima: 'Seluruh Orang Tua / Wali Murid Kelas 1 - 6 SDIT Al Ihsan',
    tanggal: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    catatanKhusus: 'Acara dilaksanakan di Aula Utama SDIT Al Ihsan Pukul 08.00 WIB s.d Selesai.',
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectTemplate = (type) => {
    if (type === 'surat_undangan') {
      setFormData((prev) => ({
        ...prev,
        templateType: 'surat_undangan',
        perihal: 'Undangan Rapat Koordinasi Wali Murid & Evaluasi Semester',
        catatanKhusus: 'Acara dilaksanakan di Aula Utama SDIT Al Ihsan Pukul 08.00 WIB s.d Selesai.',
      }));
    } else if (type === 'imbauan_spp') {
      setFormData((prev) => ({
        ...prev,
        templateType: 'imbauan_spp',
        perihal: 'Imbauan Penyelesaian Kewajiban Administrasi SPP Bulanan',
        catatanKhusus: 'Mohon pembayaran diselesaikan sebelum tanggal 10 bulan berjalan.',
      }));
    } else if (type === 'surat_tugas') {
      setFormData((prev) => ({
        ...prev,
        templateType: 'surat_tugas',
        perihal: 'Surat Tugas Pendampingan Lomba Tahfiz & Sains Antar SDIT',
        catatanKhusus: 'Ditugaskan kepada Ustaz Ahmad Fauzi, S.Pd.I dan Ustazah Fatimah, S.S.',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg('');

    try {
      const response = await fetch('/api/ai/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal merancang draf dokumen.');
      }

      setGeneratedContent(result.data);
      setSuccessMsg('Draf surat resmi berhasil disusun oleh Groq AI!');
    } catch (err) {
      console.error('[DOCUMENT_GEN_PAGE_ERROR]:', err);
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-gray-100">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#0C1821] border border-[#005B3F]/50 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#005B3F]/30 border border-[#005B3F]/60 rounded-xl text-emerald-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              AI Smart Document Generator
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Groq 70B
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Penyusun otomatis Draf Surat Kedinasan & Dokumen Resmi SDIT Al Ihsan ber tata bahasa Islami dan baku.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Inputs vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#0C1821]/90 border border-[#005B3F]/40 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#005B3F]/30 pb-3">
            <h2 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Parameter Dokumen
            </h2>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Pilih Template Cepat:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectTemplate('surat_undangan')}
                className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                  formData.templateType === 'surat_undangan'
                    ? 'bg-[#005B3F] border-emerald-400 text-white shadow-md'
                    : 'bg-gray-800/40 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Undangan
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('imbauan_spp')}
                className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                  formData.templateType === 'imbauan_spp'
                    ? 'bg-[#005B3F] border-emerald-400 text-white shadow-md'
                    : 'bg-gray-800/40 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Imbauan SPP
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('surat_tugas')}
                className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                  formData.templateType === 'surat_tugas'
                    ? 'bg-[#005B3F] border-emerald-400 text-white shadow-md'
                    : 'bg-gray-800/40 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Surat Tugas
              </button>
            </div>
          </div>

          {/* Form Input Controls */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-400" /> Nomor Surat
              </label>
              <input
                type="text"
                name="nomorSurat"
                value={formData.nomorSurat}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Perihal / Agenda
              </label>
              <input
                type="text"
                name="perihal"
                value={formData.perihal}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Penerima / Tujuan
              </label>
              <input
                type="text"
                name="penerima"
                value={formData.penerima}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Tanggal Dokumen
              </label>
              <input
                type="text"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Catatan Khusus / Detail Rincian:
              </label>
              <textarea
                name="catatanKhusus"
                rows={3}
                value={formData.catatanKhusus}
                onChange={handleChange}
                placeholder="Tambahkan detail jam, lokasi, atau arahan penting..."
                className="w-full px-3.5 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Error / Success Notifications */}
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#005B3F] to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Merancang Draf Surat...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Buat Draf Surat Otomatis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Document Preview Component */}
        <div className="lg:col-span-7">
          <DocumentPreview
            content={generatedContent}
            title={formData.perihal}
            nomorSurat={formData.nomorSurat}
          />
        </div>
      </div>
    </div>
  );
}