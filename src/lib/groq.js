import Groq from 'groq-sdk';

/**
 * Helper untuk mendapatkan instance Groq SDK secara lazy (on-demand).
 * Mencegah error crash saat 'next build' jika GROQ_API_KEY belum terisi di build environment.
 */
export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn(
      '[Groq API Warning]: GROQ_API_KEY is missing or empty in environment variables.'
    );
  }

  return new Groq({
    apiKey: apiKey || 'dummy_key_for_build_phase',
  });
}

/**
 * System Prompt Standar SDIT Al Ihsan
 */
export const SDIT_SYSTEM_PROMPT = `
Anda adalah Asisten AI Resmi SDIT Al Ihsan Command Center.
Gunakan bahasa Indonesia yang santun, islami, profesional, dan beradab.
Selalu awali atau akhiri pesan dengan salam yang sesuai jika relevan (seperti 'Assalamu'alaikum Warahmatullahi Wabarakatuh').
Utamakan nilai-nilai pendidikan Islam terpadu, empati, serta kejelasan informasi.
`;

/**
 * Helper untuk pemanggilan non-streaming Groq AI
 */
export async function generateGroqResponse({
  prompt,
  messages,
  systemPrompt = SDIT_SYSTEM_PROMPT,
  temperature = 0.7,
  maxTokens = 2048,
}) {
  try {
    const groq = getGroqClient();

    const formattedMessages = messages || [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt || '' },
    ];

    const response = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.3-70b-versatile',
      temperature,
      max_tokens: maxTokens,
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  } catch (error) {
    console.error('[Groq API Error]:', error);
    return {
      success: false,
      error: error.message || 'Gagal memproses permintaan AI.',
    };
  }
}

/**
 * Alias untuk backward compatibility
 */
export const generateGroqCompletion = generateGroqResponse;

/**
 * Helper untuk pemanggilan streaming Groq AI (Chat Hub)
 */
export async function generateGroqStream({
  messages,
  systemPrompt = SDIT_SYSTEM_PROMPT,
  temperature = 0.7,
  maxTokens = 2048,
}) {
  const groq = getGroqClient();

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  return await groq.chat.completions.create({
    messages: formattedMessages,
    model: 'llama-3.3-70b-versatile',
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });
}

/**
 * Alias untuk backward compatibility
 */
export const getGroqChatStream = generateGroqStream;