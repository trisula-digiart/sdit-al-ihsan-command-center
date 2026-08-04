import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[SUPABASE_WARN]: Variable NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum dikonfigurasi di .env.local'
  );
}

/**
 * Supabase Client Instance
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Helper untuk Pencatatan Audit Log Penggunaan Token AI ke database
 * @param {Object} params
 */
export async function logAiUsage({
  userId,
  featureType,
  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,
  modelUsed = 'llama-3.3-70b-versatile',
}) {
  try {
    if (!userId) return;

    const { error } = await supabase.from('ai_logs').insert([
      {
        user_id: userId,
        feature_type: featureType,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        model_used: modelUsed,
      },
    ]);

    if (error) {
      console.error('[SUPABASE_LOG_AI_USAGE_ERROR]:', error.message);
    }
  } catch (err) {
    console.error('[SUPABASE_LOG_AI_USAGE_EXCEPTION]:', err);
  }
}