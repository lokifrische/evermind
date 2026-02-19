export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "patient" | "caregiver" | "family";
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "patient" | "caregiver" | "family";
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "patient" | "caregiver" | "family";
        };
      };
      patients: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          nickname: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          primary_caregiver_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          nickname?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          primary_caregiver_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          primary_caregiver_id?: string;
        };
      };
      memories: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          patient_id: string;
          title: string;
          description: string | null;
          type: "album" | "story";
          thumbnail_url: string | null;
          created_by: string;
          view_count: number;
          last_viewed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          patient_id: string;
          title: string;
          description?: string | null;
          type: "album" | "story";
          thumbnail_url?: string | null;
          created_by: string;
          view_count?: number;
          last_viewed_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          patient_id?: string;
          title?: string;
          description?: string | null;
          type?: "album" | "story";
          thumbnail_url?: string | null;
          created_by?: string;
          view_count?: number;
          last_viewed_at?: string | null;
        };
      };
      memory_items: {
        Row: {
          id: string;
          created_at: string;
          memory_id: string;
          type: "photo" | "video" | "text";
          url: string | null;
          content: string | null;
          caption: string | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          memory_id: string;
          type: "photo" | "video" | "text";
          url?: string | null;
          content?: string | null;
          caption?: string | null;
          order_index?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          memory_id?: string;
          type?: "photo" | "video" | "text";
          url?: string | null;
          content?: string | null;
          caption?: string | null;
          order_index?: number;
        };
      };
      family_members: {
        Row: {
          id: string;
          created_at: string;
          patient_id: string;
          user_id: string | null;
          name: string;
          relationship: string;
          avatar_url: string | null;
          is_primary: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          patient_id: string;
          user_id?: string | null;
          name: string;
          relationship: string;
          avatar_url?: string | null;
          is_primary?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          patient_id?: string;
          user_id?: string | null;
          name?: string;
          relationship?: string;
          avatar_url?: string | null;
          is_primary?: boolean;
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          patient_id: string;
          from_user_id: string;
          from_name: string;
          type: "voice" | "video" | "text";
          content_url: string | null;
          content_text: string | null;
          duration_seconds: number | null;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          patient_id: string;
          from_user_id: string;
          from_name: string;
          type: "voice" | "video" | "text";
          content_url?: string | null;
          content_text?: string | null;
          duration_seconds?: number | null;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          patient_id?: string;
          from_user_id?: string;
          from_name?: string;
          type?: "voice" | "video" | "text";
          content_url?: string | null;
          content_text?: string | null;
          duration_seconds?: number | null;
          is_read?: boolean;
        };
      };
      activities: {
        Row: {
          id: string;
          created_at: string;
          patient_id: string;
          game_type: string;
          score: number | null;
          accuracy: number | null;
          duration_seconds: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          patient_id: string;
          game_type: string;
          score?: number | null;
          accuracy?: number | null;
          duration_seconds: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          patient_id?: string;
          game_type?: string;
          score?: number | null;
          accuracy?: number | null;
          duration_seconds?: number;
          completed_at?: string;
        };
      };
      scheduled_events: {
        Row: {
          id: string;
          created_at: string;
          patient_id: string;
          title: string;
          description: string | null;
          type: "routine" | "activity" | "memory" | "call" | "special";
          scheduled_at: string;
          completed_at: string | null;
          created_by: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          patient_id: string;
          title: string;
          description?: string | null;
          type: "routine" | "activity" | "memory" | "call" | "special";
          scheduled_at: string;
          completed_at?: string | null;
          created_by: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          patient_id?: string;
          title?: string;
          description?: string | null;
          type?: "routine" | "activity" | "memory" | "call" | "special";
          scheduled_at?: string;
          completed_at?: string | null;
          created_by?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          created_at: string;
          patient_id: string;
          type: "memory" | "call" | "game" | "message";
          title: string;
          description: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          patient_id: string;
          type: "memory" | "call" | "game" | "message";
          title: string;
          description?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          patient_id?: string;
          type?: "memory" | "call" | "game" | "message";
          title?: string;
          description?: string | null;
          metadata?: Json | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Convenient type aliases
export type Profile = Tables<"profiles">;
export type Patient = Tables<"patients">;
export type Memory = Tables<"memories">;
export type MemoryItem = Tables<"memory_items">;
export type FamilyMember = Tables<"family_members">;
export type Message = Tables<"messages">;
export type Activity = Tables<"activities">;
export type ScheduledEvent = Tables<"scheduled_events">;
export type ActivityLogEntry = Tables<"activity_log">;
