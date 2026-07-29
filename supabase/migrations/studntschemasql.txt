-- Migration: Students Directory Schema & Realtime Policies
-- Created Date: 2026-07-29

CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nisn VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Laki-laki', 'Perempuan')),
    class_name VARCHAR(100) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Cuti', 'Pindah', 'Lulus')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enablement
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated and anon users
CREATE POLICY "Allow public read access to students" 
    ON public.students FOR SELECT USING (true);

-- Allow insert/update access
CREATE POLICY "Allow authenticated insert to students" 
    ON public.students FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update to students" 
    ON public.students FOR UPDATE USING (true);

-- Enable Realtime for Students Table
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;

-- Seed Sample Data SDIT Al Ihsan
INSERT INTO public.students (nisn, full_name, gender, class_name, parent_name, parent_phone, status)
VALUES 
    ('0128912001', 'Muhammad Zaid Al-Faris', 'Laki-laki', 'Kelas 1 (Abu Bakar)', 'Ahmad Fauzi', '081299887766', 'Aktif'),
    ('0128912002', 'Aisyah Humaira', 'Perempuan', 'Kelas 1 (Abu Bakar)', 'Dedi Kurniawan', '081388776655', 'Aktif'),
    ('0128912003', 'Fatimah Az-Zahra', 'Perempuan', 'Kelas 4 (Hamzah)', 'H. Abdullah', '081577665544', 'Aktif'),
    ('0128912004', 'Umar Abdul Aziz', 'Laki-laki', 'Kelas 4 (Hamzah)', 'Budi Santoso', '081166554433', 'Aktif'),
    ('0128912005', 'Khalid Bin Walid', 'Laki-laki', 'Kelas 6 (Al-Farisi)', 'Sulaeman', '081755443322', 'Aktif')
ON CONFLICT (nisn) DO NOTHING;