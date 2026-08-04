import { NextResponse } from 'next/server';
import { generateGroqResponse } from '@/lib/groq';
import { logAiUsage } from '@/lib/supabaseClient';

const SYSTEM_PROMPT_SURAT = `
Anda adalah AI Sekretaris Utama SDIT Al Ihsan.
Tugas Anda adalah menyusun Draf Surat Resmi / Dokumen Kedinasan Sekolah.

Prinsip Penulisan Surat SDIT Al Ihsan:
1. Gunakan Bahasa Indonesia yang sangat baku, sopan, dan beradab.
2. Sertakan Salam Pembuka Islami ("Assalamu'alaikum Warahmatullahi Wabarakatuh") dan Salam Penutup ("Wassalamu'alaikum Warahmatullahi Wabarakatuh").
3. Format tata letak dokumen harus rapi dengan bagian:
   - Nomor Surat, Hal, Lampiran (jika ada)
   - Tanggal Masehi
   - Tujuan / Penerima Surat
   - Isi Utama Surat (jelas, padat, lugas)
   - Doa & Harapan
   - Tanda Tangan / Penutup (Kepala Sekolah / Panitia SDIT Al Ihsan)
4. Berikan output langsung berupa naskah paragraf yang siap dimasukkan ke preview surat.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      jenisSurat = 'Surat Resmi',
      templateType,
      nomorSurat = '104/SDIT-AI/ST/VII/2026',
      perihal,
      penerima = 'Penerima Surat',
      nipNisn = '',
      jabatan = '',
      lokasi = '',
      catatanKhusus = '',
      userId = null,
    } = body;

    const activeJenisSurat = jenisSurat || templateType || 'Surat Resmi';
    const activePerihal = perihal || body.maksudTugas || 'Keperluan Kedinasan';

    const userPrompt = `
Buatkan draf surat resmi dengan rincian berikut:
- Jenis Surat: ${activeJenisSurat}
- Nomor Surat: ${nomorSurat}
- Perihal / Maksud: ${activePerihal}
- Penerima: ${penerima} (NIP/NISN: ${nipNisn || '-'}, Jabatan: ${jabatan || '-'})
- Lokasi Pelaksanaan: ${lokasi || '-'}
- Catatan Tambahan/Instruksi Khusus: ${catatanKhusus || 'Tidak ada'}

Pastikan bahasa sangat santun, Islami, dan profesional khas SDIT Al Ihsan.
`;

    const aiResult = await generateGroqResponse({
      prompt: userPrompt,
      systemPrompt: SYSTEM_PROMPT_SURAT,
      temperature: 0.4,
      maxTokens: 2048,
    });

    if (!aiResult.success) {
      console.error('[API_DOCUMENT_GEN_FAIL]:', aiResult.error);
      return NextResponse.json(
        { success: false, error: aiResult.error || 'Gagal memproses AI' },
        { status: 500 }
      );
    }

    if (userId) {
      try {
        await logAiUsage({
          userId,
          featureType: 'document_generator',
          promptTokens: aiResult.usage?.prompt_tokens || 0,
          completionTokens: aiResult.usage?.completion_tokens || 0,
          totalTokens: aiResult.usage?.total_tokens || 0,
        });
      } catch (logErr) {
        console.warn('[SUPABASE_LOG_BYPASSED]:', logErr);
      }
    }

    return NextResponse.json({
      success: true,
      content: aiResult.content,
      data: aiResult.content,
      usage: aiResult.usage,
    });
  } catch (error) {
    console.error('[API_DOCUMENT_GEN_CRASH]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan internal pada server AI.' },
      { status: 500 }
    );
  }
}