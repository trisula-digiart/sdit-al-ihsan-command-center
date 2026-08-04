import { NextResponse } from 'next/server';
import { generateGroqCompletion } from '@/lib/groq';
import { logAiUsage } from '@/lib/supabaseClient';

const SYSTEM_PROMPT_SURAT = `
Anda adalah AI Sekretaris Utama SDIT Al Ihsan.
Tugas Anda adalah menyusun Draf Surat Resmi / Dokumen Kedinasan Sekolah.

Prinsip Penulisan Surat SDIT Al Ihsan:
1. Gunakan Bahasa Indonesia yang sangat baku, sopan, dan beradab.
2. Sertakan Salam Pembuka Islami ("Assalamu'alaikum Warahmatullahi Wabarakatuh") dan Salam Penutup ("Wassalamu'alaikum Warahmatullahi Wabarakatuh").
3. Format tata letak dokumen harus rapi dengan bagian:
   - Nomor Surat, Hal, Lampiran (jika ada)
   - Tanggal Hijriah & Masehi
   - Tujuan / Penerima Surat
   - Isi Utama Surat (jelas, padat, lugas)
   - Doa & Harapan
   - Tanda Tangan / Penutup (Kepala Sekolah / Panitia SDIT Al Ihsan)
4. Format output dalam bentuk Markdown yang rapi agar siap dicetak atau diekspor ke PDF.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      templateType = 'surat_undangan',
      nomorSurat = '001/SDIT-AI/PR/2026',
      perihal = 'Undangan Rapat Wali Murid',
      penerima = 'Orang Tua / Wali Murid Kelas 1-6',
      tanggal = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      catatanKhusus = '',
      userId = null,
    } = body;

    const userPrompt = `
Buatkan draf surat resmi dengan rincian berikut:
- Jenis Template: ${templateType}
- Nomor Surat: ${nomorSurat}
- Perihal: ${perihal}
- Penerima: ${penerima}
- Tanggal Pelaksanaan/Pengeluaran: ${tanggal}
- Catatan Tambahan/Instruksi Khusus: ${catatanKhusus || 'Tidak ada'}

Pastikan bahasa sangat santun, Islami, dan profesional khas SDIT Al Ihsan.
`;

    const aiResult = await generateGroqCompletion({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_SURAT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4, // Lower temperature for formal structured document output
      max_tokens: 2048,
    });

    if (!aiResult.success) {
      return NextResponse.json(
        { success: false, error: aiResult.error },
        { status: 500 }
      );
    }

    if (userId) {
      await logAiUsage({
        userId,
        featureType: 'document_generator',
        promptTokens: aiResult.usage.prompt_tokens,
        completionTokens: aiResult.usage.completion_tokens,
        totalTokens: aiResult.usage.total_tokens,
      });
    }

    return NextResponse.json({
      success: true,
      data: aiResult.content,
      usage: aiResult.usage,
    });
  } catch (error) {
    console.error('[API_DOCUMENT_GEN_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal pada server AI.' },
      { status: 500 }
    );
  }
}