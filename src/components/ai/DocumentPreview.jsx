'use client';

import React, { useState } from 'react';
import { Printer, Copy, Check, FileText } from 'lucide-react';

export default function DocumentPreview({
  content = '',
  title = 'Pratinjau Dokumen Resmi SDIT Al Ihsan',
  nomorSurat = '001/SDIT-AI/PR/2026',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Gagal menyalin teks:', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${nomorSurat}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.6; }
            .kop-header { text-align: center; border-bottom: 3px double #005B3F; padding-bottom: 12px; margin-bottom: 24px; }
            .kop-header h2 { margin: 0; font-size: 22px; color: #005B3F; text-transform: uppercase; }
            .kop-header p { margin: 2px 0; font-size: 13px; color: #444; }
            .content { font-size: 14px; white-space: pre-wrap; word-wrap: break-word; }
            @page { size: A4; margin: 20mm; }
          </style>
        </head>
        <body>
          <div class="kop-header">
            <h2>YAYASAN AL IHSAN - SDIT AL IHSAN</h2>
            <p>Jl. Pendidikan No. 1, SDIT Al Ihsan Command Center</p>
            <p>Email: sekretariat@sditalihsan.sch.id | Telp: (021) 88997766</p>
          </div>
          <div class="content">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0C1821] border border-[#005B3F]/40 rounded-xl">
        <div className="flex items-center space-x-2 text-emerald-400 text-sm font-medium">
          <FileText className="w-4 h-4" />
          <span>{nomorSurat}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-800/50 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {}
      <div className="p-8 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 min-h-[400px] font-serif leading-relaxed text-sm">
        {/* Header Kop Surat SDIT Al Ihsan */}
        <div className="text-center border-b-2 border-[#005B3F] pb-4 mb-6">
          <h2 className="text-xl font-bold tracking-wide text-[#005B3F] uppercase">
            SDIT AL IHSAN
          </h2>
          <p className="text-xs text-gray-600 font-sans">
            Membentuk Generasi Rabbani, Berakhlak Mulia, dan Berprestasi
          </p>
          <p className="text-[11px] text-gray-500 font-sans">
            Jl. Utama Al Ihsan No. 123 | Telp: (021) 77889900 | Website: sditalihsan.sch.id
          </p>
        </div>

        {/* Dynamic Markdown/Text Content */}
        <div className="whitespace-pre-wrap font-serif text-gray-800 space-y-2">
          {content || 'Memuat draf dokumen...'}
        </div>
      </div>
    </div>
  );
}