import { NextResponse } from 'next/server';
import { generateGroqCompletion } from '@/lib/groq';
import { logAiUsage } from '@/lib/supabase/client';

const SYSTEM_PROMPT_BILLING_WA = `
Anda adalah AI Staf Keuangan & Hubungan Orang Tua SDIT Al Ihsan.
Tugas Anda adalah membuat draf pesan pengingat & penagihan SPP/Keuangan sekolah yang dikirimkan melalui WhatsApp.

Prinsip Komunikasi Penagihan:
1. Mulai dengan salam Islami hangat ("Assalamu'alaikum Warahmatullahi Wabarakatuh").
2. Gunakan nada bahasa yang sangat santun, empati, menghargai, dan persuasif (bukan menekan atau mengintimidasi).
3. Cantumkan rincian tunggakan/kewajiban dengan transparan dan jelas.
4. Sertakan opsi informasi nomor rekening resmi sekolah serta kanal konfirmasi pembayaran.
5. Akhiri dengan doa kebaikan untuk keluarga siswa dan salam penutup Islami.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      namaSiswa = 'Ananda',
      namaOrangTua = 'Bapak/Ibu',
      kelas = '1 Al-Farabi',
      bulanTunggakan = 'Bulan Agustus 2026',
      totalTagihan = 'Rp 450.000',
      rincianTagihan = 'SPP Bulanan Rp 450.000',
      noRekening = 'BSi 7123456789 a.n SDIT Al Ihsan',
      userId = null,
    } = body;

    const userPrompt = `
Susunkan draf pesan WhatsApp pengingat SPP dengan detail berikut:
- Nama Orang Tua: ${namaOrangTua}
- Nama Siswa: ${namaSiswa} (Kelas ${kelas})
- Periode/Bulan: ${bulanTunggakan}
- Total Kewajiban/Tagihan: ${totalTagihan}
- Rincian Detail: ${rincianTagihan}
- Rekening Pembayaran: ${noRekening}

Buatkan draf pesan WhatsApp yang rapi, santun, Islami, lengkap dengan emoji yang sesuai agar nyaman dibaca di ponsel!
`;

    const aiResult = await generateGroqCompletion({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_BILLING_WA },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 1200,
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
        featureType: 'billing_wa',
        promptTokens: aiResult.usage.prompt_tokens,
        completionTokens: aiResult.usage.completion_tokens,
        totalTokens: aiResult.usage.total_tokens,
      });
    }

    return NextResponse.json({
      success: true,
      messageContent: aiResult.content,
      usage: aiResult.usage,
    });
  } catch (error) {
    console.error('[API_BILLING_WA_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyusun pesan penagihan SPP WA.' },
      { status: 500 }
    );
  }
}