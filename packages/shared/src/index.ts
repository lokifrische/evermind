// Evermind Shared Types
// These types are used by both the mobile app and caregiver portal

// ==================== USER TYPES ====================

export interface PrimaryUser {
  id: string;
  fullName: string;
  preferredName: string; // Name used in greetings ("Dorothy")
  photoUrl: string | null;
  dateOfBirth: string; // ISO date
  createdAt: string;
  
  // Life context
  lifeContext: {
    maritalStatus?: 'married' | 'widowed' | 'single' | 'divorced';
    hometown?: string;
    occupation?: string;
    interests?: string[];
  };
  
  // Accessibility settings
  accessibility: AccessibilitySettings;
  
  // Authentication
  authMethod: 'none' | 'pin' | 'biometric' | 'caregiver';
  pinHash?: string;
}

export interface Caregiver {
  id: string;
  email: string;
  fullName: string;
  relationship: string; // "daughter", "son", "spouse", "professional caregiver"
  phoneNumber?: string;
  createdAt: string;
  primaryUserId: string;
}

export interface Contributor {
  id: string;
  name: string;
  email?: string;
  relationship: string;
  photoUrl?: string;
  primaryUserId: string;
  createdAt: string;
  hasAccount: boolean; // Whether they created an optional account
}

// ==================== ACCESSIBILITY ====================

export interface AccessibilitySettings {
  fontSize: 'standard' | 'large' | 'extraLarge' | 'maximum';
  contrastMode: 'standard' | 'high';
  theme: 'light' | 'dark' | 'system';
  voiceSpeed: 'slow' | 'normal' | 'fast';
  reducedMotion: boolean;
  hapticFeedback: boolean;
  audioFeedback: boolean;
  orientationLock: boolean;
}

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'large',
  contrastMode: 'standard',
  theme: 'light',
  voiceSpeed: 'normal',
  reducedMotion: false,
  hapticFeedback: true,
  audioFeedback: true,
  orientationLock: true,
};

// Font size scale (in sp/dp)
export const FONT_SIZES = {
  standard: { base: 16, heading: 24, title: 32 },
  large: { base: 20, heading: 28, title: 36 },
  extraLarge: { base: 24, heading: 32, title: 40 },
  maximum: { base: 28, heading: 36, title: 44 },
} as const;

// ==================== MEMORIES ====================

export interface Memory {
  id: string;
  primaryUserId: string;
  type: 'photo' | 'video' | 'audio' | 'text';
  
  // Content
  mediaUrl?: string;
  thumbnailUrl?: string;
  transcription?: string;
  caption?: string;
  
  // Metadata
  title: string;
  createdAt: string;
  memoryDate?: string; // When the memory is from (e.g., "1985-06-15")
  memoryDateDisplay?: string; // How to display ("Summer 1985")
  
  // Tags
  tags: MemoryTag[];
  people: string[]; // IDs of tagged people
  places: string[];
  lifePeriod?: string;
  themes: string[];
  
  // Organization
  collectionIds: string[];
  privacyLevel: 'everyone' | 'primaryUser' | 'caregiver';
  
  // Source
  createdBy: 'primaryUser' | 'caregiver' | 'contributor';
  creatorId: string;
  promptId?: string; // If created in response to a prompt
}

export interface MemoryTag {
  type: 'person' | 'place' | 'date' | 'lifePeriod' | 'theme' | 'custom';
  value: string;
  displayValue: string;
}

export interface MemoryCollection {
  id: string;
  primaryUserId: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  memoryIds: string[];
  createdAt: string;
  createdBy: string;
}

export interface MemoryPrompt {
  id: string;
  primaryUserId: string;
  text: string;
  theme: string;
  isCustom: boolean;
  scheduledDate?: string;
  isRecurring: boolean;
  completed: boolean;
  responseMemoryId?: string;
}

// ==================== FAMILY / MESSAGES ====================

export interface FamilyMessage {
  id: string;
  primaryUserId: string;
  senderId: string;
  senderName: string;
  senderPhotoUrl?: string;
  
  type: 'video' | 'audio' | 'photo';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  duration?: number; // seconds
  
  createdAt: string;
  viewedAt?: string;
  reaction?: 'heart' | 'smile' | 'thumbsUp';
  
  // Moderation
  status: 'pending' | 'approved' | 'archived';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ScheduledMessage {
  id: string;
  primaryUserId: string;
  caregiverId: string;
  
  type: 'video' | 'audio' | 'text';
  mediaUrl?: string;
  textContent?: string;
  
  scheduledTime: string; // Time of day
  scheduledDays: number[]; // 0-6, Sunday-Saturday
  isOneTime: boolean;
  oneTimeDate?: string;
  
  isActive: boolean;
  lastDeliveredAt?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  primaryUserId: string;
  name: string;
  photoUrl: string;
  phoneNumber?: string;
  relationship: string;
  priority: number; // Order in contact grid
  autoAnswer: boolean; // Auto-answer calls from this contact
  createdAt: string;
}

// ==================== REMINDERS ====================

export interface MedicationReminder {
  id: string;
  primaryUserId: string;
  medicationName: string;
  dosage: string;
  photoUrl?: string; // Photo of pill/bottle
  
  times: string[]; // Array of times like ["08:00", "20:00"]
  daysOfWeek: number[]; // 0-6, empty = every day
  
  // Escalation
  escalationDelayMinutes: number;
  escalateToIds: string[]; // Caregiver IDs
  escalationMethod: 'push' | 'sms' | 'email' | 'all';
  
  isActive: boolean;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  reminderId: string;
  scheduledTime: string;
  status: 'taken' | 'snoozed' | 'missed' | 'escalated';
  respondedAt?: string;
  escalatedAt?: string;
}

export interface Appointment {
  id: string;
  primaryUserId: string;
  title: string;
  dateTime: string;
  location?: string;
  notes?: string;
  transportInfo?: string; // "Maria will pick you up at 1:30"
  
  remindersBefore: number[]; // Minutes before (e.g., [120, 30])
  createdAt: string;
}

// ==================== MOOD & CHECK-INS ====================

export interface MoodCheckIn {
  id: string;
  primaryUserId: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = very sad, 5 = very happy
  createdAt: string;
  note?: string;
}

export interface ActivityLog {
  id: string;
  primaryUserId: string;
  date: string; // ISO date (day)
  
  appOpens: number;
  memoriesViewed: number;
  memoriesRecorded: number;
  messagesViewed: number;
  gamesPlayed: number;
  gameMinutes: number;
  assistantConversations: number;
  remindersAcknowledged: number;
  remindersMissed: number;
}

// ==================== GAMES ====================

export type GameType = 
  | 'memoryMatch'
  | 'wordAssociation'
  | 'storyCompletion'
  | 'pictureNaming'
  | 'nameThatTune'
  | 'soundMatching'
  | 'simpleJigsaw'
  | 'sorting'
  | 'spotTheDifference';

export interface GameSession {
  id: string;
  primaryUserId: string;
  gameType: GameType;
  difficultyLevel: 'easy' | 'medium' | 'challenging' | 'hard';
  
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  
  // We don't store "score" - just completion and engagement
  completed: boolean;
  itemsCompleted?: number;
  totalItems?: number;
}

export interface GameSettings {
  primaryUserId: string;
  
  enabledGames: GameType[];
  preferredDifficulty: Record<GameType, 'easy' | 'medium' | 'challenging' | 'hard'>;
  
  dailyTimeLimitMinutes?: number;
  sessionBreakReminderMinutes: number;
  familyPlayModeEnabled: boolean;
}

// ==================== AI ASSISTANT ====================

export interface AssistantConversation {
  id: string;
  primaryUserId: string;
  startedAt: string;
  endedAt?: string;
  
  messages: AssistantMessage[];
  
  // Flags for caregiver review
  flaggedForReview: boolean;
  flagReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  
  // If assistant performed an action
  action?: {
    type: 'navigate' | 'play' | 'call' | 'remind' | 'escalate';
    target?: string;
    success: boolean;
  };
}

// ==================== MORNING BRIEFING ====================

export interface MorningBriefingConfig {
  primaryUserId: string;
  enabled: boolean;
  time: string; // "08:00"
  
  showDate: boolean;
  showWeather: boolean;
  showSchedule: boolean;
  showFeaturedMemory: boolean;
  showPrompt: boolean;
}

export interface MorningBriefing {
  date: string;
  greeting: string;
  weather?: {
    description: string;
    temperature: number;
    unit: 'F' | 'C';
  };
  schedule: Appointment[];
  featuredMemory?: Memory;
  prompt?: MemoryPrompt;
  newMessages: number;
}

// ==================== NOTIFICATIONS ====================

export interface CaregiverNotificationSettings {
  caregiverId: string;
  
  // Channels
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  
  // What to notify
  medicationMissed: boolean;
  appointmentReminder: boolean;
  lowEngagement: boolean;
  lowEngagementThresholdHours: number;
  negativeMoodTrend: boolean;
  distressDetected: boolean;
  newContentFromUser: boolean;
  newContentFromContributors: boolean;
}

// ==================== EXPORT/LEGACY ====================

export interface ExportRequest {
  id: string;
  primaryUserId: string;
  caregiverId: string;
  type: 'memoryBook' | 'fullExport';
  
  // For memory book
  memoryBookConfig?: {
    collectionId?: string;
    memoryIds?: string[];
    layout: 'onePerPage' | 'grid';
    includeTranscriptions: boolean;
    coverTitle: string;
    coverPhotoUrl?: string;
  };
  
  status: 'pending' | 'processing' | 'complete' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

// ==================== UTILITY TYPES ====================

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getGreeting(name: string, timeOfDay: TimeOfDay): string {
  const greetings = {
    morning: `Good morning, ${name}`,
    afternoon: `Good afternoon, ${name}`,
    evening: `Good evening, ${name}`,
    night: `Hello, ${name}`,
  };
  return greetings[timeOfDay];
}

export function formatDateNatural(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();
  
  return `${dayName}, ${monthName} ${dayNum}, ${year}`;
}
