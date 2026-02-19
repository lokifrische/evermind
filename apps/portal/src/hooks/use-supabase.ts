"use client";

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import type { FamilyMember, Memory, DailyRoutine, MoodType } from '@/lib/supabase';

// Demo care circle ID - used when no auth is present
const DEMO_CARE_CIRCLE_ID = '11111111-1111-1111-1111-111111111111';

/**
 * Hook to fetch family members
 */
export function useFamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFamilyMembers() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .eq('care_circle_id', DEMO_CARE_CIRCLE_ID)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setFamilyMembers(data || []);
      } catch (e) {
        setError(e as Error);
        // Fall back to mock data if database isn't set up yet
        setFamilyMembers(getMockFamilyMembers());
      } finally {
        setLoading(false);
      }
    }

    fetchFamilyMembers();
  }, []);

  return { familyMembers, loading, error };
}

/**
 * Hook to fetch memories
 */
export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMemories() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .eq('care_circle_id', DEMO_CARE_CIRCLE_ID)
          .order('last_viewed_at', { ascending: false, nullsFirst: false });

        if (error) throw error;
        setMemories(data || []);
      } catch (e) {
        setError(e as Error);
        setMemories(getMockMemories());
      } finally {
        setLoading(false);
      }
    }

    fetchMemories();
  }, []);

  return { memories, loading, error };
}

/**
 * Hook to fetch daily routines
 */
export function useDailyRoutines() {
  const [routines, setRoutines] = useState<DailyRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRoutines() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('daily_routines')
          .select('*')
          .eq('care_circle_id', DEMO_CARE_CIRCLE_ID)
          .order('time', { ascending: true });

        if (error) throw error;
        setRoutines(data || []);
      } catch (e) {
        setError(e as Error);
        setRoutines(getMockRoutines());
      } finally {
        setLoading(false);
      }
    }

    fetchRoutines();
  }, []);

  return { routines, loading, error };
}

/**
 * Hook to submit a mood check-in
 */
export function useMoodCheckin() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitMood = async (mood: MoodType, notes?: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      // Use type assertion since table might not exist yet
      const { error } = await supabase
        .from('mood_checkins' as any)
        .insert({
          mood,
          notes,
          // In production, this would be linked to actual patient
        } as any);

      if (error) throw error;

      // Also log the activity
      await supabase.from('activity_log' as any).insert({
        care_circle_id: DEMO_CARE_CIRCLE_ID,
        activity_type: 'mood_checkin',
        description: `Patient checked in feeling ${mood}`,
        metadata: { mood, notes },
      } as any);

      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitMood, submitting, error };
}

/**
 * Hook to log an activity
 */
export function useActivityLog() {
  const logActivity = async (
    activityType: string,
    description: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      const supabase = getSupabaseClient();
      await supabase.from('activity_log' as any).insert({
        care_circle_id: DEMO_CARE_CIRCLE_ID,
        activity_type: activityType,
        description,
        metadata,
      } as any);
    } catch (e) {
      console.error('Failed to log activity:', e);
    }
  };

  return { logActivity };
}

// ===== MOCK DATA FALLBACKS =====

function getMockFamilyMembers(): FamilyMember[] {
  return [
    {
      id: '1',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      name: 'Sarah',
      relationship: 'Your Daughter',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop',
      fun_fact: 'She loves gardening and visits every Tuesday',
      voice_intro_url: null,
      is_special: false,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      name: 'David',
      relationship: 'Your Son',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
      fun_fact: "He's a teacher and calls every Sunday",
      voice_intro_url: null,
      is_special: false,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      name: 'Robert',
      relationship: 'Your Husband',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop',
      fun_fact: 'You married in 1965. He loves jazz music.',
      voice_intro_url: null,
      is_special: true,
      display_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      name: 'Emma',
      relationship: 'Your Granddaughter',
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop',
      fun_fact: "She's 16 and loves to paint",
      voice_intro_url: null,
      is_special: false,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      name: 'Tommy',
      relationship: 'Your Grandson',
      photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=600&fit=crop',
      fun_fact: "He's 8 and plays soccer",
      voice_intro_url: null,
      is_special: false,
      display_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getMockMemories(): Memory[] {
  return [
    {
      id: '1',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      title: 'Christmas 2024',
      description: 'The whole family together for the holidays',
      type: 'album',
      thumbnail_url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=300&fit=crop',
      is_favorite: false,
      last_viewed_at: null,
      view_count: 24,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      title: 'Wedding Anniversary',
      description: 'Celebrating 60 years of love',
      type: 'story',
      thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      is_favorite: true,
      last_viewed_at: null,
      view_count: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getMockRoutines(): DailyRoutine[] {
  return [
    {
      id: '1',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      time: '08:00',
      title: 'Breakfast',
      icon: '☕',
      description: 'Morning meal',
      is_medication: false,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      time: '09:00',
      title: 'Morning Medication',
      icon: '💊',
      description: 'Take with food',
      is_medication: true,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      time: '10:30',
      title: 'Memory Activity',
      icon: '🧩',
      description: 'Puzzles or memory games',
      is_medication: false,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      time: '12:00',
      title: 'Lunch',
      icon: '🍽️',
      description: 'Midday meal',
      is_medication: false,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      care_circle_id: DEMO_CARE_CIRCLE_ID,
      time: '15:00',
      title: 'Video Call',
      icon: '📞',
      description: 'Family call time',
      is_medication: false,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
