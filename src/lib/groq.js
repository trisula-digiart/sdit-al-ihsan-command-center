import Groq from 'groq-sdk';

/**
 * Singleton Groq Client Instance
 * Menggunakan GROQ_API_KEY secara aman di lingkungan server-side.
 */
const globalForGroq = globalThis;

export const groq = globalForGroq.groq || new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

if (process.env.NODE_ENV !== 'production') {
  globalForGroq.groq = groq;
}

export const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

/**
 * System Prompt Utama untuk Menjaga Identitas & Karakter Islami SDIT Al Ihsan
 */
export const SYSTEM_PROMPT_BASE = `
Anda adalah Asisten AI Utama untuk Executive Command Center SDIT Al Ihsan.
Prinsip Komunikasi:
1. Islami, Santun, Profesional, Edukatif, dan Mendidik.
2. Gunakan salam Islami yang santun (Assalamu'alaikum Warahmatullahi Wabarakatuh / Wassalamu'alaikum).
3. Menggunakan Bahasa Indonesia baku, tertata, dan sesuai ejaan resmi.
4. Bertindak efektif untuk mendukung administrasi dan operasional pendidikan SDIT Al Ihsan.
`;

/**
 * Helper Pemanggilan Non-Stream Groq Completion
 * @param {Object} options
 * @returns {Promise<Object>} Response berisi content text & token usage
 */
export async function generateGroqCompletion({
  messages = [],
  model = DEFAULT_MODEL,
  temperature = 0.7,
  max_tokens = 2048,
  jsonMode = false,
}) {
  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT_BASE },
      ...messages,
    ];

    const response = await groq.chat.completions.create({
      model,
      messages: formattedMessages,
      temperature,
      max_tokens,
      response_format: jsonMode ? { type: 'json_object' } : undefined,
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  } catch (error) {
    console.error('[GROQ_API_ERROR]:', error);
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan koneksi ke Groq API Engine.',
      content: '',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }
}

/**
 * Helper untuk Real-time Streaming Chat Groq Engine
 * @param {Object} options
 */
export async function getGroqChatStream({
  messages = [],
  model = DEFAULT_MODEL,
  temperature = 0.7,
  max_tokens = 2048,
}) {
  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT_BASE },
    ...messages,
  ];

  return groq.chat.completions.create({
    model,
    messages: formattedMessages,
    temperature,
    max_tokens,
    stream: true,
  });
}