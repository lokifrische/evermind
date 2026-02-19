-- =============================================
-- DEMO MODE ACCESS POLICIES
-- Allow public access to demo care circle data
-- Run this AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- =============================================
-- FAMILY MEMBERS - Allow public read/write for demo
-- =============================================

DROP POLICY IF EXISTS "Public can view demo family members" ON family_members;
CREATE POLICY "Public can view demo family members" ON family_members
  FOR SELECT USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can insert demo family members" ON family_members;
CREATE POLICY "Public can insert demo family members" ON family_members
  FOR INSERT WITH CHECK (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can update demo family members" ON family_members;
CREATE POLICY "Public can update demo family members" ON family_members
  FOR UPDATE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can delete demo family members" ON family_members;
CREATE POLICY "Public can delete demo family members" ON family_members
  FOR DELETE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- MEMORIES - Allow public read/write for demo
-- =============================================

DROP POLICY IF EXISTS "Public can view demo memories" ON memories;
CREATE POLICY "Public can view demo memories" ON memories
  FOR SELECT USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can insert demo memories" ON memories;
CREATE POLICY "Public can insert demo memories" ON memories
  FOR INSERT WITH CHECK (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can update demo memories" ON memories;
CREATE POLICY "Public can update demo memories" ON memories
  FOR UPDATE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can delete demo memories" ON memories;
CREATE POLICY "Public can delete demo memories" ON memories
  FOR DELETE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- DAILY ROUTINES - Allow public read/write for demo
-- =============================================

DROP POLICY IF EXISTS "Public can view demo routines" ON daily_routines;
CREATE POLICY "Public can view demo routines" ON daily_routines
  FOR SELECT USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can insert demo routines" ON daily_routines;
CREATE POLICY "Public can insert demo routines" ON daily_routines
  FOR INSERT WITH CHECK (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can update demo routines" ON daily_routines;
CREATE POLICY "Public can update demo routines" ON daily_routines
  FOR UPDATE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can delete demo routines" ON daily_routines;
CREATE POLICY "Public can delete demo routines" ON daily_routines
  FOR DELETE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- ACTIVITY LOG - Allow public read/write for demo
-- =============================================

DROP POLICY IF EXISTS "Public can view demo activity" ON activity_log;
CREATE POLICY "Public can view demo activity" ON activity_log
  FOR SELECT USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can insert demo activity" ON activity_log;
CREATE POLICY "Public can insert demo activity" ON activity_log
  FOR INSERT WITH CHECK (care_circle_id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- SCHEDULED VISITS - Allow public read/write for demo
-- =============================================

DROP POLICY IF EXISTS "Public can view demo visits" ON scheduled_visits;
CREATE POLICY "Public can view demo visits" ON scheduled_visits
  FOR SELECT USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can insert demo visits" ON scheduled_visits;
CREATE POLICY "Public can insert demo visits" ON scheduled_visits
  FOR INSERT WITH CHECK (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can update demo visits" ON scheduled_visits;
CREATE POLICY "Public can update demo visits" ON scheduled_visits
  FOR UPDATE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

DROP POLICY IF EXISTS "Public can delete demo visits" ON scheduled_visits;
CREATE POLICY "Public can delete demo visits" ON scheduled_visits
  FOR DELETE USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- PATIENTS - Allow public read for demo
-- =============================================

DROP POLICY IF EXISTS "Public can view demo patients" ON patients;
CREATE POLICY "Public can view demo patients" ON patients
  FOR SELECT USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- MESSAGES - Allow public read for demo
-- =============================================

DROP POLICY IF EXISTS "Public can view demo messages" ON messages;
CREATE POLICY "Public can view demo messages" ON messages
  FOR SELECT USING (care_circle_id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- CARE CIRCLES - Allow public read for demo circle
-- =============================================

DROP POLICY IF EXISTS "Public can view demo care circle" ON care_circles;
CREATE POLICY "Public can view demo care circle" ON care_circles
  FOR SELECT USING (id = '11111111-1111-1111-1111-111111111111');

-- =============================================
-- ADD DEMO PATIENT (if not exists)
-- =============================================

INSERT INTO patients (id, care_circle_id, preferred_name, diagnosis, notes)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Margaret',
  'Early-stage Alzheimer''s',
  'Demo patient for testing'
)
ON CONFLICT (id) DO NOTHING;

-- Success!
SELECT 'Demo access policies created successfully! 🎉' as status;
