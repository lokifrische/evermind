/**
 * Evermind Database Types
 * Auto-generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'patient' | 'caregiver' | 'family';
export type MemoryType = 'album' | 'story';
export type MoodType = 'happy' | 'calm' | 'okay' | 'sad' | 'worried' | 'upset';
export type ActivityType = 
  | 'memory_viewed'
  | 'family_viewed'
  | 'mood_checkin'
  | 'calm_mode'
  | 'routine_completed'
  | 'call_made'
  | 'help_requested';
export type MessageType = 'voice' | 'video' | 'text';

export interface Database {
  public: {
    Tables: {
      care_circles: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          care_circle_id: string | null;
          is_primary_caregiver: boolean;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          care_circle_id?: string | null;
          is_primary_caregiver?: boolean;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          care_circle_id?: string | null;
          is_primary_caregiver?: boolean;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
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
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          care_circle_id?: string | null;
          preferred_name?: string | null;
          date_of_birth?: string | null;
          diagnosis?: string | null;
          diagnosis_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          care_circle_id?: string | null;
          preferred_name?: string | null;
          date_of_birth?: string | null;
          diagnosis?: string | null;
          diagnosis_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      family_members: {
        Row: {
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
        };
        Insert: {
          id?: string;
          care_circle_id?: string | null;
          name: string;
          relationship: string;
          photo_url?: string | null;
          voice_intro_url?: string | null;
          fun_fact?: string | null;
          is_special?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          care_circle_id?: string | null;
          name?: string;
          relationship?: string;
          photo_url?: string | null;
          voice_intro_url?: string | null;
          fun_fact?: string | null;
          is_special?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      memories: {
        Row: {
          id: string;
          care_circle_id: string | null;
          title: string;
          description: string | null;
          type: MemoryType;
          thumbnail_url: string | null;
          is_favorite: boolean;
          last_viewed_at: string | null;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          care_circle_id?: string | null;
          title: string;
          description?: string | null;
          type?: MemoryType;
          thumbnail_url?: string | null;
          is_favorite?: boolean;
          last_viewed_at?: string | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          care_circle_id?: string | null;
          title?: string;
          description?: string | null;
          type?: MemoryType;
          thumbnail_url?: string | null;
          is_favorite?: boolean;
          last_viewed_at?: string | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_routines: {
        Row: {
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
        };
        Insert: {
          id?: string;
          care_circle_id?: string | null;
          time: string;
          title: string;
          icon?: string | null;
          description?: string | null;
          is_medication?: boolean;
          days_of_week?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          care_circle_id?: string | null;
          time?: string;
          title?: string;
          icon?: string | null;
          description?: string | null;
          is_medication?: boolean;
          days_of_week?: number[];
          created_at?: string;
          updated_at?: string;
        };
      };
      mood_checkins: {
        Row: {
          id: string;
          patient_id: string | null;
          mood: MoodType;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id?: string | null;
          mood: MoodType;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string | null;
          mood?: MoodType;
          notes?: string | null;
          created_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          care_circle_id: string | null;
          activity_type: ActivityType;
          description: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          care_circle_id?: string | null;
          activity_type: ActivityType;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          care_circle_id?: string | null;
          activity_type?: ActivityType;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      memory_type: MemoryType;
      mood_type: MoodType;
      activity_type: ActivityType;
      message_type: MessageType;
    };
  };
}

// Convenience type exports
export type CareCircle = Database['public']['Tables']['care_circles']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Patient = Database['public']['Tables']['patients']['Row'];
export type FamilyMember = Database['public']['Tables']['family_members']['Row'];
export type Memory = Database['public']['Tables']['memories']['Row'];
export type DailyRoutine = Database['public']['Tables']['daily_routines']['Row'];
export type MoodCheckin = Database['public']['Tables']['mood_checkins']['Row'];
export type ActivityLogEntry = Database['public']['Tables']['activity_log']['Row'];
