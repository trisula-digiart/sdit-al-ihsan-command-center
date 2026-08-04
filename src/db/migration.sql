-- SDIT Al Ihsan AI Command Center - Database Migration
-- Target Engine: Supabase PostgreSQL

-- 1. Tabel Audit Trail dan Tracking Penggunaan AI Token
CREATE TABLE IF NOT EXISTS public.ai_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL, -- 'document_generator', 'chat_hub', 'narasi_rapor', 'billing_wa'
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    model_used VARCHAR(100) DEFAULT 'llama-3.3-70b-versatile',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Master Template Dasar Surat & Dokumen Resmi
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL UNIQUE, -- 'surat_undangan', 'imbauan_spp', 'surat_tugas'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses (RLS Policies) untuk ai_logs
CREATE POLICY "Allow authenticated users to read own ai_logs"
    ON public.ai_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert ai_logs"
    ON public.ai_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Kebijakan Akses (RLS Policies) untuk document_templates
CREATE POLICY "Allow authenticated users to read document_templates"
    ON public.document_templates FOR SELECT
    TO authenticated
    USING (true);

-- Indeks Performa Query
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_feature_type ON public.ai_logs(feature_type);
CREATE INDEX IF NOT EXISTS idx_document_templates_type ON public.document_templates(template_type);

-- Seed Data awal untuk Template Surat Resmi Sekolah
INSERT INTO public.document_templates (title, template_type, content)
VALUES 
(
    'Surat Undangan Resmi SDIT Al Ihsan', 
    'surat_undangan', 
    'Dengan mengharap rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu Wali Murid untuk menghadiri agenda rapat koordinasi operasional sekolah.'
),
(
    'Pemberitahuan Imbauan SPP', 
    'imbauan_spp', 
    'Assalamu’alaikum Warahmatullahi Wabarakatuh. Semoga Bapak/Ibu senantiasa berada dalam lindungan Allah SWT. Kami menyampaikan pengingat terkait pembayaran kewajiban SPP bulan ini.'
),
(
    'Surat Tugas Pengajar / Staf', 
    'surat_tugas', 
    'Berdasarkan keputusan Kepala Sekolah SDIT Al Ihsan, dengan ini menugaskan ustaz/ustazah untuk menjalankan tugas kedinasan dan pengembangan akademik.'
)
ON CONFLICT (template_type) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();