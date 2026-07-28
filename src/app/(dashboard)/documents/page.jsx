'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  FileCheck,
} from 'lucide-react';

const DOCUMENT_TEMPLATES = [
  {
    id: 'surat_tugas',
    title: 'Surat Tugas Mengajar / Kedinasan',
    category: 'Kepegawaian',
    code: 'ST-SDIT/2026',
  },
  {
    id: 'surat_keterangan_siswa',
    title: 'Surat Keterangan Siswa Aktif',
    category: 'Kesiswaan',
    code: 'SK-SDIT/2026',
  },
  {
    id: 'laporan_sarpras',
    title: 'Berita Acara Pemeliharaan Sarpras',
    category: 'Operasional',
    code: 'BA-SARPRAS/2026',
  },
];

export default function DocumentGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('surat_tugas');
  
  // Dynamic Form State
  const [formData, setFormData] = useState({
    nomorSurat: '104/SDIT-AI/ST/VII/2026',
    namaPenerima: 'Ustadz Ahmad Fauzi, S.Pd',
    nipNisn: '198804122015031002',
    jabatan: 'Guru Kelas 4B / Pengajar Kurikulum',
    maksudTugas: 'Menghadiri Pelatihan Implementasi Kurikulum Merdeka Terpadu tingkat Kota/Kabupaten.',
    lokasi: 'Aula Dinas Pendidikan Wilayah 2',
    kotaTerbit: 'Jakarta',
    tanggalTerbit: '29 Juli 2026',
    penandatangan: 'H. Ahmad Dahlan, M.Pd',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Dynamic CSS Injection for Print Isolation */}
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
                size: A4 portrait;
                margin: 15mm;
              }
            }
          `,
        }}
      />

      {/* Top Bar Action (Hidden on Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Document Generator & PDF Export</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Buat dan cetak surat resmi ber-kop SDIT Al Ihsan secara instan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Controls Left Panel (Hidden on Print) */}
        <div className="print:hidden lg:col-span-5 space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              1. Pilih Template Dokumen
            </label>
            <div className="space-y-2">
              {DOCUMENT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedTemplate === tmpl.id
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{tmpl.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tmpl.category} • {tmpl.code}</p>
                  </div>
                  {selectedTemplate === tmpl.id && (
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              2. Parameter & Isi Dokumen
            </label>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-600">Nomor Surat</span>
              <input
                type="text"
                name="nomorSurat"
                value={formData.nomorSurat}
                onChange={handleInputChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-600">Nama Penerima / Pegawai</span>
              <input
                type="text"
                name="namaPenerima"
                value={formData.namaPenerima}
                onChange={handleInputChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">NIP / NISN</span>
                <input
                  type="text"
                  name="nipNisn"
                  value={formData.nipNisn}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Jabatan</span>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-600">Maksud & Keperluan Tugas</span>
              <textarea
                name="maksudTugas"
                rows="3"
                value={formData.maksudTugas}
                onChange={handleInputChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-600">Lokasi Pelaksanaan</span>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleInputChange}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Tanggal Terbit</span>
                <input
                  type="text"
                  name="tanggalTerbit"
                  value={formData.tanggalTerbit}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Penandatangan</span>
                <input
                  type="text"
                  name="penandatangan"
                  value={formData.penandatangan}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Document Preview Right Panel (A4 Paper Container) */}
        <div className="lg:col-span-7 w-full flex justify-center bg-slate-100 p-2 md:p-6 rounded-2xl border border-slate-200">
          <div className="print-area bg-white w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 shadow-xl rounded-sm text-slate-900 border border-slate-200 flex flex-col justify-between">
            <div>
              {/* Kop Surat Resmi */}
              <div className="border-b-4 border-double border-emerald-900 pb-4 mb-6 flex items-center justify-between gap-4">
                <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0">
                  AI
                </div>
                <div className="text-center flex-1">
                  <h2 className="text-base md:text-lg font-black tracking-wider text-emerald-950 uppercase">
                    YAYASAN AL IHSAN ISLAMIC CENTER
                  </h2>
                  <h3 className="text-lg md:text-xl font-black tracking-tight text-slate-900 uppercase">
                    SDIT AL IHSAN INTEGRATED SCHOOL
                  </h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Jl. Education No. 45, Kompleks Islamic Center • Telp: (021) 8892-1029 • Web: www.sditalihsan.sch.id
                  </p>
                </div>
                <div className="w-16 h-16 opacity-0 shrink-0">AI</div>
              </div>

              {/* Judul Surat */}
              <div className="text-center my-6 space-y-1">
                <h4 className="text-base font-bold underline tracking-wide uppercase text-slate-900">
                  {DOCUMENT_TEMPLATES.find((t) => t.id === selectedTemplate)?.title}
                </h4>
                <p className="text-xs font-medium text-slate-600">
                  Nomor: {formData.nomorSurat}
                </p>
              </div>

              {/* Isi Surat Body */}
              <div className="text-xs leading-relaxed space-y-4 text-slate-800 my-8">
                <p>
                  Yang bertanda tangan di bawah ini, Kepala Sekolah SDIT Al Ihsan dengan ini memberikan tugas/keterangan resmi kepada:
                </p>

                <div className="pl-6 space-y-1.5 font-medium">
                  <div className="grid grid-cols-12">
                    <span className="col-span-4 text-slate-500">Nama Lengkap</span>
                    <span className="col-span-8 font-bold text-slate-900">: {formData.namaPenerima}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4 text-slate-500">NIP / Identitas</span>
                    <span className="col-span-8">: {formData.nipNisn}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4 text-slate-500">Jabatan / Peran</span>
                    <span className="col-span-8">: {formData.jabatan}</span>
                  </div>
                </div>

                <p className="pt-2">
                  Untuk melaksanakan tugas dan kewajiban sebagaimana tercantum di bawah ini:
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <p className="font-semibold text-slate-900">{formData.maksudTugas}</p>
                  <p className="text-[11px] text-slate-600">
                    <span className="font-bold">Lokasi:</span> {formData.lokasi}
                  </p>
                </div>

                <p className="pt-2">
                  Demikian surat tugas ini diterbitkan untuk dipergunakan sebagaimana mestinya dan dilaksanakan dengan penuh rasa tanggung jawab.
                </p>
              </div>
            </div>

            {/* Tanda Tangan Footer */}
            <div className="pt-12 flex justify-end">
              <div className="text-center w-64 space-y-16">
                <div>
                  <p className="text-xs text-slate-600">
                    {formData.kotaTerbit}, {formData.tanggalTerbit}
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    Kepala Sekolah SDIT Al Ihsan
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold underline text-slate-900">
                    {formData.penandatangan}
                  </p>
                  <p className="text-[10px] text-slate-500">NIP. 19750817 200212 1 003</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}