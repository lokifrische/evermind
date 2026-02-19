-- =============================================
-- EVERMIND DATABASE SCHEMA
-- Memory preservation app for cognitive decline
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CARE CIRCLES
-- A care circle is a group centered around one patient
-- =============================================
CREATE TABLE care_circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROFILES
-- Extended user profiles (linked to auth.users)
-- =============================================
CREATE TYPE user_role AS ENUM ('patient', 'caregiver', 'family');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'family',
  care_circle_id UUID REFERENCES care_circles(id),
  is_primary_caregiver BOOLEAN DEFAULT FALSE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PATIENTS
-- Additional info specific to the person with cognitive decline
-- =============================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  care_circle_id UUID REFERENCES care_circles(id) ON DELETE CASCADE,
  preferred_name TEXT,
  date_of_birth DATE,
  diagnosis TEXT,
  diagnosis_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FAMILY MEMBERS
-- People in the patient's life (for recognition)
-- =============================================
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_circle_id UUID REFERENCES care_circles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  photo_url TEXT,
  voice_intro_url TEXT,
  fun_fact TEXT,
  is_special BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MEMORIES
-- Photo albums and stories
-- =============================================
CREATE TYPE memory_type AS ENUM ('album', 'story');

CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_circle_id UUID REFERENCES care_circles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type memory_type NOT NULL DEFAULT 'album',
  thumbnail_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  last_viewed_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MEMORY ITEMS
-- Individual photos/pages within a memory
-- =============================================
CREATE TABLE memory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  caption TEXT,
  audio_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DAILY ROUTINES
-- Scheduled activities for the patient
-- =============================================
CREATE TABLE daily_routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_circle_id UUID REFERENCES care_circles(id) ON DELETE CASCADE,
  time TIME NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  is_medication BOOLEAN DEFAULT FALSE,
  days_of_week INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROUTINE COMPLETIONS
-- Track which routines were completed
-- =============================================
CREATE TABLE routine_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  routine_id UUID REFERENCES daily_routines(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_by UUID REFERENCES profiles(id),
  notes TEXT
);

-- =============================================
-- MOOD CHECK-INS
-- Patient wellness tracking
-- =============================================
CREATE TYPE mood_type AS ENUM ('happy', 'calm', 'okay', 'sad', 'worried', 'upset');

CREATE TABLE mood_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  mood mood_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LIFE EVENTS
-- Patient's life story timeline
-- =============================================
CREATE TABLE life_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  year INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SCHEDULED VISITS
-- Upcoming visits to prepare the patient
-- =============================================
CREATE TABLE scheduled_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_circle_id UUID REFERENCES care_circles(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  relationship TEXT,
  photo_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOG
-- Track patient engagement for caregivers
-- =============================================
CREATE TYPE activity_type AS ENUM (
  'memory_viewed', 
  'family_viewed', 
  'mood_checkin', 
  'calm_mode', 
  'routine_completed',
  'call_made',
  'help_requested'
);

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_circle_id UUID REFERENCES care_circles(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MESSAGES
-- Voice/video messages from family
-- =============================================
CREATE TYPE message_type AS ENUM ('voice', 'video', 'text');

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_circle_id UUID REFERENCES care_circles(id) ON DELETE CASCADE,
  from_member_id UUID REFERENCES family_members(id),
  type message_type NOT NULL,
  media_url TEXT,
  transcript TEXT,
  is_listened BOOLEAN DEFAULT FALSE,
  listened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE care_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- Users can access data in their care circle
-- =============================================

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Care circle members can see each other
CREATE POLICY "Care circle members can view each other" ON profiles
  FOR SELECT USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Family members visible to care circle
CREATE POLICY "Care circle can view family members" ON family_members
  FOR SELECT USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can manage family members" ON family_members
  FOR ALL USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles 
      WHERE id = auth.uid() AND role = 'caregiver'
    )
  );

-- Memories visible to care circle
CREATE POLICY "Care circle can view memories" ON memories
  FOR SELECT USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can manage memories" ON memories
  FOR ALL USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles 
      WHERE id = auth.uid() AND role = 'caregiver'
    )
  );

-- Memory items follow parent memory
CREATE POLICY "Care circle can view memory items" ON memory_items
  FOR SELECT USING (
    memory_id IN (
      SELECT id FROM memories WHERE care_circle_id IN (
        SELECT care_circle_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Daily routines visible to care circle
CREATE POLICY "Care circle can view routines" ON daily_routines
  FOR SELECT USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can manage routines" ON daily_routines
  FOR ALL USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles 
      WHERE id = auth.uid() AND role = 'caregiver'
    )
  );

-- Mood check-ins
CREATE POLICY "Care circle can view mood checkins" ON mood_checkins
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE care_circle_id IN (
        SELECT care_circle_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Anyone in care circle can create mood checkins" ON mood_checkins
  FOR INSERT WITH CHECK (
    patient_id IN (
      SELECT id FROM patients WHERE care_circle_id IN (
        SELECT care_circle_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Activity log
CREATE POLICY "Care circle can view activity log" ON activity_log
  FOR SELECT USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Care circle can insert activity log" ON activity_log
  FOR INSERT WITH CHECK (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Messages
CREATE POLICY "Care circle can view messages" ON messages
  FOR SELECT USING (
    care_circle_id IN (
      SELECT care_circle_id FROM profiles WHERE id = auth.uid()
    )
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_care_circles_updated_at
  BEFORE UPDATE ON care_circles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_daily_routines_updated_at
  BEFORE UPDATE ON daily_routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_life_events_updated_at
  BEFORE UPDATE ON life_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- SEED DATA (Demo)
-- =============================================

-- Create a demo care circle
INSERT INTO care_circles (id, name) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Margaret''s Care Team');

-- Create demo family members
INSERT INTO family_members (care_circle_id, name, relationship, photo_url, fun_fact, voice_intro_url, is_special, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah', 'Your Daughter', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop', 'She loves gardening and visits every Tuesday', NULL, FALSE, 1),
  ('11111111-1111-1111-1111-111111111111', 'David', 'Your Son', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop', 'He''s a teacher and calls every Sunday', NULL, FALSE, 2),
  ('11111111-1111-1111-1111-111111111111', 'Robert', 'Your Husband', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop', 'You married in 1965. He loves jazz music.', NULL, TRUE, 0),
  ('11111111-1111-1111-1111-111111111111', 'Emma', 'Your Granddaughter', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop', 'She''s 16 and loves to paint', NULL, FALSE, 3),
  ('11111111-1111-1111-1111-111111111111', 'Tommy', 'Your Grandson', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=600&fit=crop', 'He''s 8 and plays soccer', NULL, FALSE, 4),
  ('11111111-1111-1111-1111-111111111111', 'Lucy', 'Your Sister', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop', 'She lives in Florida and calls on Fridays', NULL, FALSE, 5);

-- Create demo memories
INSERT INTO memories (care_circle_id, title, description, type, thumbnail_url, view_count) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Christmas 2024', 'The whole family together for the holidays', 'album', 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=300&fit=crop', 24),
  ('11111111-1111-1111-1111-111111111111', 'Wedding Anniversary', 'Celebrating 60 years of love', 'story', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', 12),
  ('11111111-1111-1111-1111-111111111111', 'Grandkids Visit', 'Emma and Tommy came to stay', 'album', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop', 18),
  ('11111111-1111-1111-1111-111111111111', 'Family Vacation 2023', 'Trip to the beach', 'album', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', 45),
  ('11111111-1111-1111-1111-111111111111', 'Our First Home', 'The house on Maple Street', 'story', 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop', 8);

-- Create demo daily routines
INSERT INTO daily_routines (care_circle_id, time, title, icon, is_medication, description) VALUES
  ('11111111-1111-1111-1111-111111111111', '08:00', 'Breakfast', '☕', FALSE, 'Morning meal'),
  ('11111111-1111-1111-1111-111111111111', '09:00', 'Morning Medication', '💊', TRUE, 'Take with food'),
  ('11111111-1111-1111-1111-111111111111', '10:30', 'Memory Activity', '🧩', FALSE, 'Puzzles or memory games'),
  ('11111111-1111-1111-1111-111111111111', '12:00', 'Lunch', '🍽️', FALSE, 'Midday meal'),
  ('11111111-1111-1111-1111-111111111111', '15:00', 'Video Call', '📞', FALSE, 'Family call time'),
  ('11111111-1111-1111-1111-111111111111', '18:00', 'Dinner', '🍝', FALSE, 'Evening meal'),
  ('11111111-1111-1111-1111-111111111111', '20:00', 'Evening Medication', '💊', TRUE, 'Before bed');

-- Success message
SELECT 'Evermind schema created successfully! 🧠' as status;
