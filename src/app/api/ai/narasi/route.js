import { NextResponse } from 'next/server';
import { generateGroqResponse } from '@/lib/groq';

const SYSTEM_PROMPT_NARASI_RAPOR = `
Anda adalah AI Konsultan Pendidikan & Wali Kelas SDIT Al Ihsan.
Tugas Anda adalah menyusun Narasi Rapor Perkembangan Karakter & Akademik Siswa.

Prinsip Penyusunan Narasi Rapor SDIT Al Ihsan:
1. Gunakan Bahasa Indonesia yang sangat santun, edukatif, Islami, dan memotivasi.
2. Terapkan Metode "Sandwich Feedback":
   - Paragraf 1: Apresiasi & Puji Kelebihan/Karakter Positif Siswa (Akademik/Ibadah).
   - Paragraf 2: Evaluasi & Area Pengembangan/Bimbingan yang Perlu Ditingkatkan di Rumah.
   - Paragraf 3: Doa Kebaikan, Harapan, dan Salam Penutup untuk Orang Tua.
3. Selalu sebutkan nama siswa secara hangat (misalnya "Ananda [Nama Siswa]").
4. Hindari kata-kata penghakiman yang membuat patah semangat.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      namaSiswa = 'Ananda',
      kelas = '1 Abu Bakar',
      nilaiAkademik = '',
      capaianHafalan = '',
      kedisiplinanIbadah = '',
      catatanWaliKelas = '',
    } = body;

    const userPrompt = `
Susunkan narasi rapor untuk siswa berikut:
- Nama Siswa: ${namaSiswa}
- Kelas: ${kelas}
- Capaian Akademik & Mapel: ${nilaiAkademik || 'Sangat baik dan kooperatif'}
- Capaian Hafalan Al-Qur'an (Tahfizh): ${capaianHafalan || 'Lancar sesuai target semester'}
- Sikap & Kedisiplinan Ibadah: ${kedisiplinanIbadah || 'Sangat rajin dan tertib shalat berjamaah'}
- Catatan Khusus Wali Kelas: ${catatanWaliKelas || 'Siswa santun dan memiliki kepemimpinan baik'}

Buatkan 3 paragraf narasi rapor yang padat, hangat, dan bernuansa Islami!
`;

    const aiResult = await generateGroqResponse({
      prompt: userPrompt,
      systemPrompt: SYSTEM_PROMPT_NARASI_RAPOR,
      temperature: 0.6,
      maxTokens: 1500,
    });

    if (!aiResult.success) {
      console.error('[API_NARASI_RAPOR_FAIL]:', aiResult.error);
      return NextResponse.json(
        { success: false, error: aiResult.error || 'Gagal memproses AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      narrative: aiResult.content,
      content: aiResult.content,
      usage: aiResult.usage,
    });
  } catch (error) {
    console.error('[API_NARASI_RAPOR_CRASH]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan internal pada server AI.' },
      { status: 500 }
    );
  }
}