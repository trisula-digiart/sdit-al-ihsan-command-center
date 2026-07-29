-- Migration: Create Students Table + Bulk Seed 300 Students
-- Created Date: 2026-07-29

-- 1. PEMBUATAN TABEL STUDENTS (Jika Belum Ada)
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

-- 2. ENABLING ROW LEVEL SECURITY (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Policy untuk Kepsek & Demo Access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to students') THEN
        CREATE POLICY "Allow public read access to students" ON public.students FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated insert to students') THEN
        CREATE POLICY "Allow authenticated insert to students" ON public.students FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Enable Realtime Subscription
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;

-- 3. BULK SEED 300 SISWA OTOMATIS
DO $$
DECLARE
    i INT;
    v_nisn VARCHAR(20);
    v_full_name VARCHAR(255);
    v_gender VARCHAR(10);
    v_class_name VARCHAR(100);
    v_teacher_name VARCHAR(255);
    v_teacher_email VARCHAR(255);
    v_parent_name VARCHAR(255);
    v_parent_phone VARCHAR(50);
    
    first_names_male TEXT[] := ARRAY['Muhammad', 'Ahmad', 'Umar', 'Ali', 'Zaid', 'Khalid', 'Hamzah', 'Bilal', 'Salman', 'Ibrahim', 'Yusuf', 'Hasan', 'Husain', 'Faris', 'Rayhan'];
    first_names_female TEXT[] := ARRAY['Aisyah', 'Fatimah', 'Zahra', 'Khadijah', 'Maryam', 'Nabila', 'Salma', 'Safiyyah', 'Ruqayyah', 'Hafsah', 'Nayla', 'Yasmin', 'Zulfa', 'Azizah', 'Rania'];
    last_names TEXT[] := ARRAY['Al-Faris', 'Pratama', 'Hidayat', 'Santoso', 'Kurniawan', 'Ramadhan', 'Fauzi', 'Hakim', 'Putra', 'Maulana', 'Sulaeman', 'Abdullah', 'Rizky', 'Syahputra', 'Nugraha'];
BEGIN
    FOR i IN 1..300 LOOP
        v_nisn := '0128912' || LPAD(i::text, 3, '0');
        
        IF i % 2 = 0 THEN
            v_gender := 'Laki-laki';
            v_full_name := first_names_male[1 + (i % array_length(first_names_male, 1))] || ' ' || last_names[1 + ((i * 3) % array_length(last_names, 1))];
        ELSE
            v_gender := 'Perempuan';
            v_full_name := first_names_female[1 + (i % array_length(first_names_female, 1))] || ' ' || last_names[1 + ((i * 7) % array_length(last_names, 1))];
        END IF;

        CASE (i % 6)
            WHEN 0 THEN
                v_class_name := 'Kelas 1 (Abu Bakar)';
                v_teacher_name := 'Ustadzah Rahma';
                v_teacher_email := 'rahma@sditalihsan.sch.id';
            WHEN 1 THEN
                v_class_name := 'Kelas 2 (Ali)';
                v_teacher_name := 'Ustadz Rizky';
                v_teacher_email := 'rizky@sditalihsan.sch.id';
            WHEN 2 THEN
                v_class_name := 'Kelas 3 (Thoriq)';
                v_teacher_name := 'Ustadz Farhan';
                v_teacher_email := 'farhan@sditalihsan.sch.id';
            WHEN 3 THEN
                v_class_name := 'Kelas 4 (Hamzah)';
                v_teacher_name := 'Ustadz Abdullah';
                v_teacher_email := 'guru@sditalihsan.sch.id';
            WHEN 4 THEN
                v_class_name := 'Kelas 5 (Mu''adz)';
                v_teacher_name := 'Ustadzah Khadijah';
                v_teacher_email := 'khadijah@sditalihsan.sch.id';
            ELSE
                v_class_name := 'Kelas 6 (Al-Farisi)';
                v_teacher_name := 'Ustadz Hasan';
                v_teacher_email := 'hasan@sditalihsan.sch.id';
        END CASE;

        v_parent_name := 'Bpk/Ibu ' || last_names[1 + ((i * 2) % array_length(last_names, 1))];
        v_parent_phone := '0812' || LPAD((80000000 + i)::text, 8, '0');

        INSERT INTO public.students (
            nisn,
            full_name,
            gender,
            class_name,
            assigned_teacher_name,
            assigned_teacher_email,
            parent_name,
            parent_phone,
            status
        ) VALUES (
            v_nisn,
            v_full_name,
            v_gender,
            v_class_name,
            v_teacher_name,
            v_teacher_email,
            v_parent_name,
            v_parent_phone,
            'Aktif'
        ) ON CONFLICT (nisn) DO NOTHING;

    END LOOP;
END $$;