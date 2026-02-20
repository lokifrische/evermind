/**
 * Activity Logging Service
 * 
 * Tracks patient engagement for caregiver dashboard.
 * Logs activities like viewing memories, playing games, etc.
 */

import { supabase } from './supabase';

const DEMO_CARE_CIRCLE_ID = process.env.EXPO_PUBLIC_DEMO_CARE_CIRCLE_ID || '11111111-1111-1111-1111-111111111111';

export type ActivityType = 
  | 'memory_viewed'
  | 'family_viewed'
  | 'mood_checkin'
  | 'calm_mode'
  | 'routine_completed'
  | 'call_made'
  | 'help_requested';

interface LogActivityParams {
  activityType: ActivityType;
  description?: string;
  metadata?: Record<string, unknown>;
  careCircleId?: string;
}

/**
 * Log an activity to the database
 */
export async function logActivity({
  activityType,
  description,
  metadata,
  careCircleId = DEMO_CARE_CIRCLE_ID,
}: LogActivityParams): Promise<boolean> {
  try {
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
      return false;
    }

    return true;
  } catch (err) {
    console.error('Activity logging failed:', err);
    return false;
  }
}

/**
 * Log when patient views a memory
 */
export function logMemoryViewed(memoryId: string, memoryTitle: string) {
  return logActivity({
    activityType: 'memory_viewed',
    description: `Viewed memory: ${memoryTitle}`,
    metadata: { memoryId, memoryTitle },
  });
}

/**
 * Log when patient views a family member
 */
export function logFamilyViewed(memberId: string, memberName: string) {
  return logActivity({
    activityType: 'family_viewed',
    description: `Viewed ${memberName}'s profile`,
    metadata: { memberId, memberName },
  });
}

/**
 * Log when patient does a mood check-in
 */
export function logMoodCheckin(mood: string) {
  return logActivity({
    activityType: 'mood_checkin',
    description: `Checked in with mood: ${mood}`,
    metadata: { mood },
  });
}

/**
 * Log when patient uses calm mode
 */
export function logCalmModeUsed(scene?: string, durationMs?: number) {
  return logActivity({
    activityType: 'calm_mode',
    description: 'Used calm mode for relaxation',
    metadata: { scene, durationMs },
  });
}

/**
 * Log when patient completes a routine
 */
export function logRoutineCompleted(routineId: string, routineTitle: string) {
  return logActivity({
    activityType: 'routine_completed',
    description: `Completed routine: ${routineTitle}`,
    metadata: { routineId, routineTitle },
  });
}

/**
 * Log when patient makes a call
 */
export function logCallMade(memberName: string, callType: 'video' | 'voice') {
  return logActivity({
    activityType: 'call_made',
    description: `Made a ${callType} call to ${memberName}`,
    metadata: { memberName, callType },
  });
}

/**
 * Log when patient requests help
 */
export function logHelpRequested(context?: string) {
  return logActivity({
    activityType: 'help_requested',
    description: 'Requested help',
    metadata: { context },
  });
}

/**
 * Log game activity (uses memory_viewed since we can't add new enum values)
 * The metadata will identify it as a game
 */
export function logGamePlayed(gameId: string, gameName: string, score?: number) {
  return logActivity({
    activityType: 'memory_viewed', // Using this as proxy since enum is fixed
    description: `Played game: ${gameName}`,
    metadata: { 
      isGame: true,
      gameId, 
      gameName, 
      score,
    },
  });
}

export default {
  logActivity,
  logMemoryViewed,
  logFamilyViewed,
  logMoodCheckin,
  logCalmModeUsed,
  logRoutineCompleted,
  logCallMade,
  logHelpRequested,
  logGamePlayed,
};
