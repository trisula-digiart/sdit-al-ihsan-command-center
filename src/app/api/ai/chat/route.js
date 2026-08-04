import { getGroqChatStream } from '@/lib/groq';

const SYSTEM_PROMPT_CHAT = `
Anda adalah Asisten AI Kurikulum & Akademik SDIT Al Ihsan.
Tugas utama Anda:
1. Membantu Guru menyusun Modul Ajar, RPP, dan Alur Tujuan Pembelajaran (ATP) Kurikulum Merdeka berlandaskan nilai-nilai Islami.
2. Membantu menyusun Bank Soal (Pilihan Ganda, Isian, Essay) yang mendidik dan berbobot (HOTS/LOTS).
3. Membantu membuat pengumuman kelas atau narasi edukasi Islami.
4. Memberikan tanggapan yang terstruktur menggunakan format Markdown (headers, bullet points, bolding, code blocks jika ada).
5. Selalu komunikatif, ramah, Islami, dan menyemangati para pendidik.
`;

export async function POST(request) {
  try {
    const { messages = [] } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Pesan tidak boleh kosong.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT_CHAT },
      ...messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
    ];

    const stream = await getGroqChatStream({
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error('[STREAMING_READ_ERROR]:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error('[API_CHAT_STREAM_ERROR]:', error);
    return new Response(
      JSON.stringify({ error: 'Gagal terhubung ke engine Groq Chat Stream.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}