'use client';

import React, { useState } from 'react';
import { FileText, Printer, CheckCircle2, Sparkles } from 'lucide-react';

export default function DocumentGeneratorPage() {
  const [docType, setDocType] = useState('surat_keterangan');
  const [docFormData, setDocFormData] = useState({
    nomorSurat: '421.2/089/SDIT-AI/VII/2026',
    namaSiswa: 'Muhammad Hafiz',
    nisn: '0129837492',
    kelas: '4 Umar bin Khattab',
    keperluan: 'Mengikuti Musabaqah Hifzhil Qur\'an Tingkat Kota',
    namaGuru: 'Ustadz Ahmad Fauzi, S.Pd.',
    jabatanGuru: 'Guru Tahfizh & Wali Kelas 4',
    tanggal: '28 Juli 2026'
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Info Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-emerald-600" size={20} />
            Generator Surat & Dokumen Resmi Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Buat otomatis naskah surat resmi ber-Kop SDIT Al Ihsan dan cetak secara presisi.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs py-2.5 px-4 transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Printer size={16} /> Cetak / Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Interactive Form Controls */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600" />
            Parameter Template Surat
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Pilih Jenis Template Surat:</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="surat_keterangan">Surat Keterangan Aktif Siswa</option>
              <option value="surat_tugas">Surat Tugas Guru / Tenaga Pendidik</option>
              <option value="undangan_ortu">Surat Undangan Wali Murid</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nomor Surat Resmi</label>
              <input
                type="text"
                value={docFormData.nomorSurat}
                onChange={(e) => setDocFormData({ ...docFormData, nomorSurat: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {docType === 'surat_keterangan' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nama Siswa</label>
                  <input
                    type="text"
                    value={docFormData.namaSiswa}
                    onChange={(e) => setDocFormData({ ...docFormData, namaSiswa: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">NISN</label>
                    <input
                      type="text"
                      value={docFormData.nisn}
                      onChange={(e) => setDocFormData({ ...docFormData, nisn: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Kelas</label>
                    <input
                      type="text"
                      value={docFormData.kelas}
                      onChange={(e) => setDocFormData({ ...docFormData, kelas: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Keperluan Surat</label>
                  <textarea
                    rows={2}
                    value={docFormData.keperluan}
                    onChange={(e) => setDocFormData({ ...docFormData, keperluan: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {docType === 'surat_tugas' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nama Guru / Staf Diberi Tugas</label>
                  <input
                    type="text"
                    value={docFormData.namaGuru}
                    onChange={(e) => setDocFormData({ ...docFormData, namaGuru: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    value={docFormData.jabatanGuru}
                    onChange={(e) => setDocFormData({ ...docFormData, jabatanGuru: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Deskripsi Tugas & Lokasi</label>
                  <textarea
                    rows={2}
                    value={docFormData.keperluan}
                    onChange={(e) => setDocFormData({ ...docFormData, keperluan: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tanggal Surat</label>
              <input
                type="text"
                value={docFormData.tanggal}
                onChange={(e) => setDocFormData({ ...docFormData, tanggal: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Document Print Preview */}
        <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-md min-h-[550px] text-slate-800 flex flex-col justify-between print:m-0 print:shadow-none">
          
          <div>
            {/* Kop Surat Header */}
            <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
              <h2 className="text-lg font-bold text-emerald-900 tracking-wide uppercase">YAYASAN AL IHSAN ISLAMIC CENTER</h2>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-wider">SDIT AL IHSAN INTEGRATED</h1>
              <p className="text-[10px] text-slate-600 mt-1">Jl. Pendidikan Islamic No. 45, Kota Hijau • Telp: (021) 7890-1234 • Web: sdit-alihsan.sch.id</p>
            </div>

            {/* Document Title */}
            <div className="text-center mb-6">
              <h3 className="font-bold underline text-xs uppercase text-slate-900 tracking-wide">
                {docType === 'surat_keterangan' && 'SURAT KETERANGAN AKTIF SISWA'}
                {docType === 'surat_tugas' && 'SURAT TUGAS DINAS / SEKOLAH'}
                {docType === 'undangan_ortu' && 'SURAT UNDANGAN WALI MURID'}
              </h3>
              <p className="text-[11px] text-slate-600">Nomor: {docFormData.nomorSurat}</p>
            </div>

            {/* Body Content */}
            <div className="text-xs space-y-4 leading-relaxed text-slate-700">
              <p>Yang bertanda tangan di bawah ini Kepala Sekolah Dasar Islam Terpadu (SDIT) Al Ihsan menerangkan bahwa:</p>
              
              {docType === 'surat_keterangan' && (
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 font-sans">
                  <p><span className="w-32 inline-block font-semibold text-slate-900">Nama Siswa</span>: {docFormData.namaSiswa}</p>
                  <p><span className="w-32 inline-block font-semibold text-slate-900">NISN</span>: {docFormData.nisn}</p>
                  <p><span className="w-32 inline-block font-semibold text-slate-900">Kelas</span>: {docFormData.kelas}</p>
                </div>
              )}

              {docType === 'surat_tugas' && (
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 font-sans">
                  <p><span className="w-32 inline-block font-semibold text-slate-900">Nama Guru/Staf</span>: {docFormData.namaGuru}</p>
                  <p><span className="w-32 inline-block font-semibold text-slate-900">Jabatan</span>: {docFormData.jabatanGuru}</p>
                </div>
              )}

              <p>
                {docType === 'surat_keterangan' && `Adalah benar siswa aktif di SDIT Al Ihsan pada Tahun Ajaran 2026/2027. Surat keterangan ini diterbitkan guna keperluan: ${docFormData.keperluan}.`}
                {docType === 'surat_tugas' && `Diberikan tugas resmi untuk melaksanakan kegiatan: ${docFormData.keperluan}.`}
              </p>

              <p>Demikian surat ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="pt-8 flex justify-end text-xs">
            <div className="text-center w-56">
              <p>Kota Hijau, {docFormData.tanggal}</p>
              <p className="font-semibold text-slate-800 mt-1">Kepala Sekolah SDIT Al Ihsan</p>
              <div className="h-16 flex items-center justify-center my-1 text-emerald-800 font-bold italic border-b border-slate-300 text-[10px]">
                [ Tanda Tangan & Cap Digital ]
              </div>
              <p className="font-bold text-slate-900">H. Sulaiman, M.Pd.</p>
              <p className="text-[10px] text-slate-500">NIP. 19820412 200801 1 003</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}