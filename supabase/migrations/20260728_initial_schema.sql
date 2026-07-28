-- STREAMING_CHUNK:Creating User Roles Enum...
-- ==========================================================
-- SDIT AL IHSAN COMMAND CENTER - DATABASE MIGRATION SCRIPT
-- ==========================================================

-- 1. ENUM DEFINITION FOR ROLE-BASED ACCESS CONTROL
CREATE TYPE user_role AS ENUM ('kepsek', 'guru', 'sarpras');

-- STREAMING_CHUNK:Creating Profiles Table...
-- 2. PROFILES TABLE LINKED TO AUTH USERS
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'guru',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STREAMING_CHUNK:Creating Attendance Logs Table...
-- 3. ATTENDANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS attendance_logs (
    id BIGSERIAL PRIMARY KEY,
    student_name TEXT NOT NULL,
    grade_class TEXT NOT NULL,
    status TEXT CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpha')),
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STREAMING_CHUNK:Creating Sarpras Assets Table...
-- 4. SARPRAS ASSETS & MAINTENANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS sarpras_assets (
    id TEXT PRIMARY KEY,
    asset_name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT CHECK (status IN ('Baik', 'Dalam Perawatan', 'Perlu Perbaikan')),
    reported_by UUID REFERENCES profiles(id),
    last_check DATE DEFAULT CURRENT_DATE
);

-- STREAMING_CHUNK:Creating Realtime Chat Table...
-- 5. CHAT MESSAGES TABLE (SUPABASE REALTIME)
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    channel_id TEXT NOT NULL DEFAULT 'general',
    sender_id UUID REFERENCES profiles(id),
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STREAMING_CHUNK:Enabling Realtime Subscriptions...
-- ENABLE REALTIME ON CHAT MESSAGES
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- STREAMING_CHUNK:Defining Row Level Security Policies...
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sarpras_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- POLICIES: KEPSEK HAS FULL CONTROL
CREATE POLICY "Kepsek full access on sarpras" ON sarpras_assets
    FOR ALL USING (auth.jwt() ->> 'role' = 'kepsek');

CREATE POLICY "Authenticated users view chat" ON chat_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users send chat" ON chat_messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');