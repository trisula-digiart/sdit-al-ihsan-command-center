'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FileSpreadsheet,
  Upload,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';

export default function BulkImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);

  if (!isOpen) return null;

  // Function Download Template CSV (Rapi per-kolom di Excel Indonesia & Global via UTF-8 BOM)
  const handleDownloadTemplate = () => {
    // Header sep: menginstruksikan Excel secara otomatis menggunakan koma sebagai delimiter
    const csvRows = [
      'sep=,',
      'nisn,full_name,gender,class_name,parent_name,whatsapp_no',
      '0128912001,Ahmad Fadhil,Laki-laki,Kelas 1 (Abu Bakar),Bpk Supardi,081280000001',
      '0128912002,Siti Maryam,Perempuan,Kelas 2 (Ali),Bpk Ruslan,081280000002',
      '0128912003,Muhammad Omar,Laki-laki,Kelas 4 (Hamzah),Bpk Hendra,081280000003',
    ];

    // Menggunakan UTF-8 BOM (\uFEFF) agar MS Excel langsung memecah data ke kolom A, B, C, D, E, F
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Template_Import_Siswa_SDIT_Al_Ihsan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper Auto-Assign Wali Kelas berdasarkan Rombel
  const getTeacherByClass = (className) => {
    if (!className) return 'Ustadz Abdullah';
    const c = className.toLowerCase();
    if (c.includes('kelas 1')) return 'Ustadzah Rahma';
    if (c.includes('kelas 2')) return 'Ustadz Rizky';
    if (c.includes('kelas 3')) return 'Ustadz Farhan';
    if (c.includes('kelas 4')) return 'Ustadz Abdullah';
    if (c.includes('kelas 5')) return 'Ustadzah Khadijah';
    if (c.includes('kelas 6')) return 'Ustadz Hasan';
    return 'Ustadz Abdullah';
  };

  // Dual-Delimiter Parser (Support koma ',' dan titik-koma ';')
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrorMsg('');
    setSuccessMsg('');
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setErrorMsg('Format file harus ber-ekstensi .csv! Silakan unduh template jika ragu.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);

      if (lines.length < 2) {
        setErrorMsg('File CSV kosong atau tidak memiliki data baris.');
        return;
      }

      // Deteksi jika ada baris "sep=" dari template
      let startRowIndex = 0;
      if (lines[0].toLowerCase().startsWith('sep=')) {
        startRowIndex = 1;
      }

      const headerLine = lines[startRowIndex];
      // Deteksi pemisah: koma atau titik koma
      const delimiter = headerLine.includes(';') ? ';' : ',';

      const headers = headerLine
        .split(delimiter)
        .map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

      const studentList = [];

      for (let i = startRowIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ''));
        if (values.length >= 2) {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });

          if (rowData.full_name) {
            studentList.push({
              nisn: rowData.nisn || `012891${Math.floor(1000 + Math.random() * 9000)}`,
              full_name: rowData.full_name,
              gender: rowData.gender || 'Laki-laki',
              class_name: rowData.class_name || 'Kelas 1 (Abu Bakar)',
              teacher_name: getTeacherByClass(rowData.class_name),
              parent_name: rowData.parent_name || 'Bpk/Ibu Wali',
              whatsapp_no: rowData.whatsapp_no || '081280000000',
              status: 'Aktif',
            });
          }
        }
      }

      if (studentList.length === 0) {
        setErrorMsg('Tidak dapat membaca data siswa dari file. Pastikan header sesuai template.');
      } else {
        setParsedPreview(studentList);
      }
    };

    reader.readAsText(selectedFile, 'UTF-8');
  };

  // Batch Ingestion ke Supabase Database
  const handleUploadToSupabase = async () => {
    if (parsedPreview.length === 0) {
      setErrorMsg('Pilih file CSV yang memiliki data siswa valid.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Upsert ke Supabase
      const { data, error } = await supabase
        .from('students')
        .upsert(parsedPreview, { onConflict: 'nisn' })
        .select();

      if (error) {
        throw error;
      }

      setSuccessMsg(`Berhasil meng-import ${parsedPreview.length} data siswa ke Supabase!`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setFile(null);
        setParsedPreview([]);
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      console.error('Error importing students:', err);
      setErrorMsg(`Gagal import ke Supabase: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-300" />
            <h3 className="text-sm font-black uppercase tracking-wide">
              Import Bulk Data Siswa (CSV / Excel)
            </h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-amber-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs font-bold text-slate-800">
          {/* Box Instruksi & Template */}
          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-black text-emerald-950">Gunakan Format Template Resmi SDIT Al Ihsan</p>
              <p className="text-[11px] text-slate-600">
                Unduh file `.csv` sampel di bawah, buka di Excel (akan otomatis terbagi per-kolom A-F), isi data, lalu upload kembali.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh Template CSV</span>
            </button>
          </div>

          {/* Area File Input Dropzone */}
          <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 bg-slate-50 text-center hover:bg-emerald-50/50 transition-all relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-800 font-black">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-black text-slate-900 text-sm">
                {file ? file.name : 'Klik atau tarik file CSV ke sini'}
              </p>
              <p className="text-[10px] text-slate-500">
                {file
                  ? `Ukuran file: ${(file.size / 1024).toFixed(1)} KB`
                  : 'Mendukung format file CSV (Support Komat & Titik Koma Excel)'}
              </p>
            </div>
          </div>

          {/* Messages Alert */}
          {errorMsg && (
            <div className="p-3 bg-rose-100 border border-rose-300 text-rose-950 font-black rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 font-black rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Preview Data Siswa */}
          {parsedPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-emerald-950 font-black">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  Pratinjau Data SIAP Import
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px]">
                  {parsedPreview.length} Siswa Terdeteksi
                </span>
              </div>

              <div className="max-h-40 overflow-y-auto border-2 border-emerald-200 rounded-xl">
                <table className="w-full text-left text-[11px] font-bold">
                  <thead className="bg-emerald-100 text-emerald-950 sticky top-0">
                    <tr>
                      <th className="p-2">NISN</th>
                      <th className="p-2">Nama Siswa</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">Rombel Kelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {parsedPreview.slice(0, 5).map((st, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-mono">{st.nisn}</td>
                        <td className="p-2 font-black">{st.full_name}</td>
                        <td className="p-2">{st.gender}</td>
                        <td className="p-2">{st.class_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedPreview.length > 5 && (
                  <p className="p-2 text-center text-[10px] font-bold text-slate-500 bg-slate-50">
                    ... dan {parsedPreview.length - 5} baris siswa lainnya.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleUploadToSupabase}
              disabled={uploading || parsedPreview.length === 0}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Mengunggah ke Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>Eksekusi Import ({parsedPreview.length} Data)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}