/**
 * Supabase Service
 * 
 * Provides database access for the mobile app
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase credentials from environment
// Priority: expo-constants extra > process.env > hardcoded fallback for demo
const supabaseUrl = 
  Constants.expoConfig?.extra?.supabaseUrl || 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  'https://gfxvlwkvfqyeecnzilrz.supabase.co';

const supabaseAnonKey = 
  Constants.expoConfig?.extra?.supabaseAnonKey || 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeHZsd2t2ZnF5ZWVjbnppbHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzE2OTksImV4cCI6MjA4NzA0NzY5OX0.BQtr7QUsQfzkI9SbygYgqAUkU3cBBvkLYaA_9y8-08I';

// Log for debugging (remove in production)
console.log('[Supabase] Initializing with URL:', supabaseUrl ? 'Set' : 'MISSING');

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Don't persist in Expo Go
    autoRefreshToken: true,
  },
});

// Database types (matching schema.sql)
export interface CareCircle {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'patient' | 'caregiver' | 'family';
  care_circle_id: string | null;
  is_primary_caregiver: boolean;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  profile_id: string | null;
  care_circle_id: string | null;
  preferred_name: string | null;
  date_of_birth: string | null;
  diagnosis: string | null;
  diagnosis_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  care_circle_id: string | null;
  name: string;
  relationship: string;
  photo_url: string | null;
  voice_intro_url: string | null;
  fun_fact: string | null;
  is_special: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  care_circle_id: string | null;
  title: string;
  description: string | null;
  type: 'album' | 'story';
  thumbnail_url: string | null;
  is_favorite: boolean;
  last_viewed_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface MemoryItem {
  id: string;
  memory_id: string | null;
  media_url: string;
  caption: string | null;
  audio_url: string | null;
  display_order: number;
  created_at: string;
}

export interface DailyRoutine {
  id: string;
  care_circle_id: string | null;
  time: string;
  title: string;
  icon: string | null;
  description: string | null;
  is_medication: boolean;
  days_of_week: number[];
  created_at: string;
  updated_at: string;
}

export interface MoodCheckin {
  id: string;
  patient_id: string | null;
  mood: 'happy' | 'calm' | 'okay' | 'sad' | 'worried' | 'upset';
  notes: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  care_circle_id: string | null;
  from_member_id: string | null;
  type: 'voice' | 'video' | 'text';
  media_url: string | null;
  transcript: string | null;
  is_listened: boolean;
  listened_at: string | null;
  created_at: string;
}

// Data fetching functions
export async function getFamilyMembers(careCircleId: string): Promise<FamilyMember[]> {
  console.log('[Supabase] Fetching family members for care circle:', careCircleId);
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('care_circle_id', careCircleId)
    .order('display_order');
  
  if (error) {
    console.error('[Supabase] Error fetching family members:', error.message);
    return [];
  }
  console.log('[Supabase] Got', data?.length || 0, 'family members');
  return data || [];
}

export async function getMemories(careCircleId: string): Promise<Memory[]> {
  console.log('[Supabase] Fetching memories for care circle:', careCircleId);
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('care_circle_id', careCircleId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[Supabase] Error fetching memories:', error.message);
    return [];
  }
  console.log('[Supabase] Got', data?.length || 0, 'memories');
  return data || [];
}

export async function getMemoryItems(memoryId: string): Promise<MemoryItem[]> {
  const { data, error } = await supabase
    .from('memory_items')
    .select('*')
    .eq('memory_id', memoryId)
    .order('display_order');
  
  if (error) {
    console.error('Error fetching memory items:', error);
    return [];
  }
  return data || [];
}

export async function getDailyRoutines(careCircleId: string): Promise<DailyRoutine[]> {
  const { data, error } = await supabase
    .from('daily_routines')
    .select('*')
    .eq('care_circle_id', careCircleId)
    .order('time');
  
  if (error) {
    console.error('Error fetching routines:', error);
    return [];
  }
  return data || [];
}

export async function getMessages(careCircleId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('care_circle_id', careCircleId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data || [];
}

export async function logMoodCheckin(
  patientId: string,
  mood: MoodCheckin['mood'],
  notes?: string
): Promise<MoodCheckin | null> {
  const { data, error } = await supabase
    .from('mood_checkins')
    .insert({ patient_id: patientId, mood, notes })
    .select()
    .single();
  
  if (error) {
    console.error('Error logging mood check-in:', error);
    return null;
  }
  return data;
}

export async function logActivity(
  careCircleId: string,
  activityType: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('activity_log')
    .insert({
      care_circle_id: careCircleId,
      activity_type: activityType,
      description,
      metadata,
    });
  
  if (error) {
    console.error('Error logging activity:', error);
  }
}

export async function getPatient(careCircleId: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('care_circle_id', careCircleId)
    .single();
  
  if (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
  return data;
}

export async function getCareCircle(careCircleId: string): Promise<CareCircle | null> {
  const { data, error } = await supabase
    .from('care_circles')
    .select('*')
    .eq('id', careCircleId)
    .single();
  
  if (error) {
    console.error('Error fetching care circle:', error);
    return null;
  }
  return data;
}

export default supabase;
