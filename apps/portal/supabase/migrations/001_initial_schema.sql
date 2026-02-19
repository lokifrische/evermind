-- Evermind Initial Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('patient', 'caregiver', 'family')) DEFAULT 'caregiver'
);

-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  primary_caregiver_id UUID REFERENCES profiles(id) NOT NULL
);

-- Memories table
CREATE TABLE memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('album', 'story')) NOT NULL,
  thumbnail_url TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ
);

-- Memory items table
CREATE TABLE memory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('photo', 'video', 'text')) NOT NULL,
  url TEXT,
  content TEXT,
  caption TEXT,
  order_index INTEGER DEFAULT 0
);

-- Family members table
CREATE TABLE family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  avatar_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  from_user_id UUID REFERENCES profiles(id) NOT NULL,
  from_name TEXT NOT NULL,
  type TEXT CHECK (type IN ('voice', 'video', 'text')) NOT NULL,
  content_url TEXT,
  content_text TEXT,
  duration_seconds INTEGER,
  is_read BOOLEAN DEFAULT FALSE
);

-- Activities table (game sessions)
CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL,
  score INTEGER,
  accuracy INTEGER,
  duration_seconds INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled events table
CREATE TABLE scheduled_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('routine', 'activity', 'memory', 'call', 'special')) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) NOT NULL
);

-- Activity log table (recent activity feed)
CREATE TABLE activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('memory', 'call', 'game', 'message')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX idx_memories_patient ON memories(patient_id);
CREATE INDEX idx_memories_created_by ON memories(created_by);
CREATE INDEX idx_family_members_patient ON family_members(patient_id);
CREATE INDEX idx_messages_patient ON messages(patient_id);
CREATE INDEX idx_activities_patient ON activities(patient_id);
CREATE INDEX idx_scheduled_events_patient ON scheduled_events(patient_id);
CREATE INDEX idx_activity_log_patient ON activity_log(patient_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Patients: Caregivers can manage their patients
CREATE POLICY "Caregivers can view their patients" ON patients FOR SELECT USING (primary_caregiver_id = auth.uid());
CREATE POLICY "Caregivers can create patients" ON patients FOR INSERT WITH CHECK (primary_caregiver_id = auth.uid());
CREATE POLICY "Caregivers can update their patients" ON patients FOR UPDATE USING (primary_caregiver_id = auth.uid());
CREATE POLICY "Caregivers can delete their patients" ON patients FOR DELETE USING (primary_caregiver_id = auth.uid());

-- Memories: Access through patient relationship
CREATE POLICY "Users can view memories for their patients" ON memories FOR SELECT 
  USING (EXISTS (SELECT 1 FROM patients WHERE patients.id = memories.patient_id AND patients.primary_caregiver_id = auth.uid()));
CREATE POLICY "Users can create memories for their patients" ON memories FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM patients WHERE patients.id = memories.patient_id AND patients.primary_caregiver_id = auth.uid()));
CREATE POLICY "Users can update memories they created" ON memories FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete memories they created" ON memories FOR DELETE USING (created_by = auth.uid());

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
