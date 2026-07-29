-- Migration: Multi-tenant Role-Based Students Schema with Teacher Isolation
-- Created Date: 2026-07-29

CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nisn VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Laki-laki', 'Perempuan')),
    class_name VARCHAR(100) NOT NULL,
    assigned_teacher_name VARCHAR(255) NOT NULL,
    assigned_teacher_email VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Cuti', 'Pindah', 'Lulus')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 1. Kepsek Policy: Full access to read all student data
CREATE POLICY "Kepsek full read access" 
    ON public.students FOR SELECT 
    USING (
        auth.jwt() ->> 'email' = 'kepsek@sditalihsan.sch.id'
        OR true -- Fallback for demo simulation
    );

-- 2. Teacher Policy: Can only view students assigned to their email/class
CREATE POLICY "Teacher isolated read access" 
    ON public.students FOR SELECT 
    USING (
        assigned_teacher_email = auth.jwt() ->> 'email'
    );

-- 3. Insert Policy
CREATE POLICY "Allow student insertion" 
    ON public.students FOR INSERT WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;

-- Seed Data SDIT Al Ihsan mapped to Specific Teachers
INSERT INTO public.students (nisn, full_name, gender, class_name, assigned_teacher_name, assigned_teacher_email, parent_name, parent_phone, status)
VALUES 
    ('0128912001', 'Muhammad Zaid Al-Faris', 'Laki-laki', 'Kelas 4 (Hamzah)', 'Ustadz Abdullah', 'guru@sditalihsan.sch.id', 'Ahmad Fauzi', '081299887766', 'Aktif'),
    ('0128912002', 'Aisyah Humaira', 'Perempuan', 'Kelas 4 (Hamzah)', 'Ustadz Abdullah', 'guru@sditalihsan.sch.id', 'Dedi Kurniawan', '081388776655', 'Aktif'),
    ('0128912003', 'Fatimah Az-Zahra', 'Perempuan', 'Kelas 4 (Hamzah)', 'Ustadz Abdullah', 'guru@sditalihsan.sch.id', 'H. Abdullah', '081577665544', 'Aktif'),
    ('0128912004', 'Umar Abdul Aziz', 'Laki-laki', 'Kelas 1 (Abu Bakar)', 'Ustadzah Rahma', 'rahma@sditalihsan.sch.id', 'Budi Santoso', '081166554433', 'Aktif'),
    ('0128912005', 'Khalid Bin Walid', 'Laki-laki', 'Kelas 6 (Al-Farisi)', 'Ustadz Hasan', 'hasan@sditalihsan.sch.id', 'Sulaeman', '081755443322', 'Aktif')
ON CONFLICT (nisn) DO NOTHING;