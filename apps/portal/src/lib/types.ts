/**
 * Shared TypeScript types for Evermind Portal
 * Centralized type definitions for consistency across the application
 */

// ==================== User & Auth ====================

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'caregiver' | 'patient' | 'admin';
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  preferredName?: string;
  avatarUrl?: string;
  role: 'caregiver' | 'patient';
  careCircleId: string;
}

export interface CareCircle {
  id: string;
  name: string;
  createdAt: Date;
  patientId: string;
}

// ==================== Patient Data ====================

export interface Patient {
  id: string;
  userId: string;
  careCircleId: string;
  preferredName: string;
  dateOfBirth?: Date;
  bio?: string;
  avatarUrl?: string;
}

export interface FamilyMember {
  id: string;
  careCircleId: string;
  name: string;
  relationship: string;
  photo?: string;
  hasNewMessage: boolean;
  phone?: string;
  email?: string;
}

// ==================== Memories ====================

export type MemoryType = 'photo' | 'video' | 'story' | 'audio';

export interface Memory {
  id: string;
  careCircleId: string;
  type: MemoryType;
  title: string;
  description?: string;
  date?: string;
  year?: number;
  decade?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  audioUrl?: string;
  tags: string[];
  hasAudio: boolean;
  lifePeriod?: LifePeriod;
  createdAt: Date;
  createdBy: string;
}

export type LifePeriod = 'Childhood' | 'Early Years' | 'Middle Years' | 'Recent Years';

export interface MemoryPrompt {
  id: string;
  text: string;
  icon: string;
  category: string;
}

// ==================== Activities & Schedule ====================

export interface DailyRoutine {
  id: string;
  careCircleId: string;
  title: string;
  time: string;
  icon?: string;
  daysOfWeek: number[];
  isActive: boolean;
}

export interface ScheduledVisit {
  id: string;
  careCircleId: string;
  visitorName: string;
  scheduledAt: Date;
  notes?: string;
}

export interface Activity {
  id: string;
  careCircleId: string;
  title: string;
  description?: string;
  type: 'game' | 'music' | 'story' | 'call' | 'routine';
  icon?: string;
  completedAt?: Date;
}

// ==================== Messages ====================

export interface Message {
  id: string;
  careCircleId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  type: 'text' | 'voice' | 'photo' | 'video';
  mediaUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

// ==================== Activity Log ====================

export type ActivityType = 
  | 'memory_viewed' 
  | 'memory_created'
  | 'family_viewed' 
  | 'call_made'
  | 'message_received'
  | 'message_sent'
  | 'game_played'
  | 'routine_completed'
  | 'calm_mode_used'
  | 'talk_session';

export interface ActivityLogEntry {
  id: string;
  careCircleId: string;
  patientId: string;
  activityType: ActivityType;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ==================== Games ====================

export interface GameScore {
  id: string;
  careCircleId: string;
  patientId: string;
  gameType: string;
  score: number;
  playedAt: Date;
}

// ==================== UI Types ====================

export interface DailyHighlight {
  type: 'memory' | 'message' | 'prompt';
  title: string;
  subtitle: string;
  action: string;
  href: string;
  icon: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  color: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode | string;
  href: string;
  color?: string;
}

// ==================== Accessibility ====================

export type FontSize = 'standard' | 'large' | 'extra-large' | 'maximum';
export type ContrastMode = 'standard' | 'high';

export interface AccessibilitySettings {
  fontSize: FontSize;
  contrast: ContrastMode;
  reducedMotion: boolean;
  hapticFeedback: boolean;
  audioFeedback: boolean;
}

// ==================== API Responses ====================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==================== Time & Date Helpers ====================

export interface TimeOfDay {
  greeting: string;
  emoji: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
}

// ==================== Form Types ====================

export interface MemoryFormData {
  title: string;
  description?: string;
  type: MemoryType;
  date?: string;
  tags: string[];
  media?: File;
  audio?: Blob;
}

export interface FamilyMemberFormData {
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  photo?: File;
}

export interface RoutineFormData {
  title: string;
  time: string;
  icon?: string;
  daysOfWeek: number[];
}
