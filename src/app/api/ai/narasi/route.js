import { NextResponse } from 'next/server';
import { generateGroqCompletion } from '@/lib/groq';
import { logAiUsage } from '@/lib/supabase/client';

const SYSTEM_PROMPT_NARASI = `
Anda adalah AI Pakar Pedagogi & Psikologi Anak SDIT Al Ihsan.
Tugas Anda adalah menyusun Narasi Perkembangan Karakter & Akademik Siswa untuk Rapor.

Prinsip Penulisan Narasi Rapor:
1. Gunakan pola Sandwich Feedback: Apresiasi Potensi/Kelebihan -> Area Pengembangan/Catatan Perbaikan -> Doa & Motivasi Islami.
2. Bahasa harus konstruktif, positif, solutif, komunikatif bagi Orang Tua, dan berlandaskan akhlakul karimah.
3. Sertakan evaluasi hafalan Al-Qur'an (Tahfiz), ibadah harian, serta interaksi sosial di sekolah.
4. Hindari bahasa yang menghakimi atau terkesan merendahkan anak.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      namaSiswa = 'Ananda',
      kelas = '1 Al-Farabi',
      semester = 'Ganjil',
      nilaiAkademik = 'Sangat Baik pada mapel IPA dan Matematika',
      capaianHafalan = 'Juz 30 (Surah An-Naba s.d At-Takwir tuntas dengan tajwid baik)',
      kedisiplinanIbadah = 'Rajin shalat dhuha dan dzuhur berjamaah',
      catatanWaliKelas = 'Ananda aktif, namun kadang perlu dibimbing fokus saat jam pengerjaan tugas mandiri',
      userId = null,
    } = body;

    const userPrompt = `
Susunkan Narasi Perkembangan Siswa untuk Rapor SDIT Al Ihsan dengan data berikut:
- Nama Siswa: ${namaSiswa}
- Kelas: ${kelas} (${semester})
- Capaian Akademik: ${nilaiAkademik}
- Capaian Hafalan Al-Qur'an / Tahfiz: ${capaianHafalan}
- Kedisiplinan & Sikap Ibadah: ${kedisiplinanIbadah}
- Catatan Khusus Wali Kelas: ${catatanWaliKelas}

Buatkan 2 Paragraf Narasi Rapor yang hangat, edukatif, dan memotivasi orang tua serta siswa!
`;

    const aiResult = await generateGroqCompletion({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_NARASI },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 1500,
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
        featureType: 'narasi_rapor',
        promptTokens: aiResult.usage.prompt_tokens,
        completionTokens: aiResult.usage.completion_tokens,
        totalTokens: aiResult.usage.total_tokens,
      });
    }

    return NextResponse.json({
      success: true,
      narrative: aiResult.content,
      usage: aiResult.usage,
    });
  } catch (error) {
    console.error('[API_NARASI_RAPOR_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat narasi rapor siswa.' },
      { status: 500 }
    );
  }
}