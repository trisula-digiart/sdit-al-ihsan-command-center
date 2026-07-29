'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  FileCheck,
  Upload,
  X,
  Plus,
  Building,
  Edit3,
  CheckCircle2,
} from 'lucide-react';

const INITIAL_TEMPLATES = [
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
  const [templatesList, setTemplatesList] = useState(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState('surat_tugas');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Dynamic School Info State (Realtime Sync dari /settings)
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: 'SDIT AL IHSAN INTEGRATED SCHOOL',
    principal_name: 'H. Ahmad Dahlan, M.Pd',
    address: 'Jl. Education No. 45, Kompleks Islamic Center',
    phone: '(021) 8892-1029',
    email: 'info@sditalihsan.sch.id',
  });

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
  });

  // State untuk Dynamic Paragraph Editing pada Live Preview (Poin 5)
  const [previewParagraph1, setPreviewParagraph1] = useState(
    'Yang bertanda tangan di bawah ini, Kepala Sekolah SDIT Al Ihsan dengan ini memberikan tugas/keterangan resmi kepada:'
  );
  const [previewParagraph2, setPreviewParagraph2] = useState(
    'Untuk melaksanakan tugas dan kewajiban sebagaimana tercantum di bawah ini:'
  );
  const [previewParagraph3, setPreviewParagraph3] = useState(
    'Demikian surat tugas ini diterbitkan untuk dipergunakan sebagaimana mestinya dan dilaksanakan dengan penuh rasa tanggung jawab.'
  );

  // State Modal Upload Template Baru
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    category: 'Kesiswaan',
    code: 'CUSTOM-SDIT/2026',
  });

  // Load School Info Sync dari Settings (Poin 4)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSchool = localStorage.getItem('school_info');
      if (storedSchool) {
        try {
          const parsed = JSON.parse(storedSchool);
          if (parsed && parsed.school_name) {
            setSchoolInfo(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.title) return;

    const created = {
      id: `custom_${Date.now()}`,
      title: newTemplate.title,
      category: newTemplate.category,
      code: newTemplate.code,
    };

    setTemplatesList([...templatesList, created]);
    setSelectedTemplate(created.id);
    setNewTemplate({ title: '', category: 'Kesiswaan', code: 'CUSTOM-SDIT/2026' });
    setIsUploadModalOpen(false);
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

      {/* Top Bar Action */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <span>Document Generator & PDF Export</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Buat dan cetak surat resmi ber-kop {schoolInfo.school_name} secara instan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tombol Upload Template Baru (Poin 3) */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Template Baru</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Controls Left Panel */}
        <div className="print:hidden lg:col-span-5 space-y-5 bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black text-emerald-950">
                1. Pilih Template Dokumen
              </label>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                {templatesList.length} Template
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {templatesList.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left text-xs transition-all flex items-center justify-between ${
                    selectedTemplate === tmpl.id
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-black shadow-sm'
                      : 'border-slate-200 hover:border-emerald-300 text-slate-700 font-bold'
                  }`}
                >
                  <div>
                    <p className="font-black">{tmpl.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{tmpl.category} • {tmpl.code}</p>
                  </div>
                  {selectedTemplate === tmpl.id && (
                    <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-emerald-100 pt-4 space-y-3">
            <label className="block text-xs font-black text-emerald-950">
              2. Parameter & Isi Dokumen
            </label>

            <div className="space-y-1">
              <span className="text-[11px] font-black text-slate-800">Nomor Surat</span>
              <input
                type="text"
                name="nomorSurat"
                value={formData.nomorSurat}
                onChange={handleInputChange}
                className="w-full p-2.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black text-slate-800">Nama Penerima / Pegawai</span>
              <input
                type="text"
                name="namaPenerima"
                value={formData.namaPenerima}
                onChange={handleInputChange}
                className="w-full p-2.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-black text-slate-800">NIP / NISN</span>
                <input
                  type="text"
                  name="nipNisn"
                  value={formData.nipNisn}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black text-slate-800">Jabatan</span>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black text-slate-800">Maksud & Keperluan Tugas</span>
              <textarea
                name="maksudTugas"
                rows="2"
                value={formData.maksudTugas}
                onChange={handleInputChange}
                className="w-full p-2.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-black text-slate-800">Kota Terbit</span>
                <input
                  type="text"
                  name="kotaTerbit"
                  value={formData.kotaTerbit}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black text-slate-800">Tanggal Terbit</span>
                <input
                  type="text"
                  name="tanggalTerbit"
                  value={formData.tanggalTerbit}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border-2 border-emerald-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Editable Document Preview Right Panel (Poin 4 & 5) */}
        <div className="lg:col-span-7 w-full flex flex-col items-center bg-slate-100 p-2 md:p-6 rounded-2xl border-2 border-emerald-200 space-y-3">
          <div className="print:hidden w-full bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl text-emerald-950 text-xs font-black flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-emerald-700" />
              <span>Preview Kertas A4 (Dapat Diketik / Diedit Langsung Teks Paragrafnya)</span>
            </span>
            <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-md">Live Sync Kop Sekolah</span>
          </div>

          <div className="print-area bg-white w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 shadow-xl rounded-sm text-slate-900 border border-slate-200 flex flex-col justify-between">
            <div>
              {/* Kop Surat Resmi - SYNC DENGAN SETTINGS (Poin 4) */}
              <div className="border-b-4 border-double border-emerald-950 pb-4 mb-6 flex items-center justify-between gap-4">
                <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center text-amber-300 font-black text-xl shrink-0 shadow-sm">
                  AI
                </div>
                <div className="text-center flex-1">
                  <h2 className="text-base md:text-lg font-black tracking-wider text-emerald-950 uppercase">
                    YAYASAN AL IHSAN ISLAMIC CENTER
                  </h2>
                  <h3 className="text-lg md:text-xl font-black tracking-tight text-slate-900 uppercase">
                    {schoolInfo.school_name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-600 mt-0.5">
                    {schoolInfo.address} • Telp: {schoolInfo.phone} • Email: {schoolInfo.email}
                  </p>
                </div>
                <div className="w-16 h-16 opacity-0 shrink-0">AI</div>
              </div>

              {/* Judul Surat */}
              <div className="text-center my-6 space-y-1">
                <h4 className="text-base font-black underline tracking-wide uppercase text-slate-900">
                  {templatesList.find((t) => t.id === selectedTemplate)?.title}
                </h4>
                <p className="text-xs font-bold text-slate-700">
                  Nomor: {formData.nomorSurat}
                </p>
              </div>

              {/* Isi Surat Body EDITABLE (Poin 5) */}
              <div className="text-xs leading-relaxed space-y-4 text-slate-900 my-8">
                {/* Paragraf 1 Editable */}
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setPreviewParagraph1(e.target.innerText)}
                  className="outline-none hover:bg-amber-50 p-1 rounded transition-colors border border-transparent hover:border-amber-300 font-bold"
                >
                  {previewParagraph1}
                </p>

                <div className="pl-6 space-y-1.5 font-bold">
                  <div className="grid grid-cols-12">
                    <span className="col-span-4 text-slate-600">Nama Lengkap</span>
                    <span className="col-span-8 font-black text-slate-950">: {formData.namaPenerima}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4 text-slate-600">NIP / Identitas</span>
                    <span className="col-span-8">: {formData.nipNisn}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-4 text-slate-600">Jabatan / Peran</span>
                    <span className="col-span-8">: {formData.jabatan}</span>
                  </div>
                </div>

                {/* Paragraf 2 Editable */}
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setPreviewParagraph2(e.target.innerText)}
                  className="pt-2 outline-none hover:bg-amber-50 p-1 rounded transition-colors border border-transparent hover:border-amber-300 font-bold"
                >
                  {previewParagraph2}
                </p>

                <div className="p-4 bg-slate-50 border-2 border-emerald-200 rounded-xl space-y-2 font-bold">
                  <p className="font-black text-slate-900">{formData.maksudTugas}</p>
                  <p className="text-[11px] text-slate-700">
                    <span className="font-black">Lokasi Pelaksanaan:</span> {formData.lokasi}
                  </p>
                </div>

                {/* Paragraf 3 Editable */}
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setPreviewParagraph3(e.target.innerText)}
                  className="pt-2 outline-none hover:bg-amber-50 p-1 rounded transition-colors border border-transparent hover:border-amber-300 font-bold"
                >
                  {previewParagraph3}
                </p>
              </div>
            </div>

            {/* Tanda Tangan Footer - SYNC KEPALA SEKOLAH (Poin 4) */}
            <div className="pt-12 flex justify-end">
              <div className="text-center w-64 space-y-16 font-bold">
                <div>
                  <p className="text-xs text-slate-700">
                    {formData.kotaTerbit}, {formData.tanggalTerbit}
                  </p>
                  <p className="text-xs font-black text-slate-950 mt-1">
                    Kepala Sekolah {schoolInfo.school_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black underline text-slate-950">
                    {schoolInfo.principal_name}
                  </p>
                  <p className="text-[10px] text-slate-600">NIP. 19750817 200212 1 003</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL POPUP UPLOAD TEMPLATE DADAKAN (Poin 3) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-300" />
                <span>Upload Template Master Dokumen Baru</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white hover:text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTemplate} className="p-5 space-y-4 text-xs font-bold text-slate-800">
              <div>
                <label className="block font-black text-slate-900 mb-1">
                  Judul Template Dokumen Dadakan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surat Edaran Libur Semester"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Kategori</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Keuangan">Keuangan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-900 mb-1">Kode Surat</label>
                  <input
                    type="text"
                    value={newTemplate.code}
                    onChange={(e) => setNewTemplate({ ...newTemplate, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-emerald-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}