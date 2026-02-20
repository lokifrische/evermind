/**
 * Data Context
 * 
 * Provides app-wide data from Supabase:
 * - Patient profile (the primary user)
 * - Family members
 * - Memories
 * - Routines
 * - Messages
 * 
 * All data is scoped to a care circle.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  supabase,
  Patient,
  CareCircle,
  FamilyMember,
  Memory,
  DailyRoutine,
  Message,
  getPatient,
  getCareCircle,
  getFamilyMembers,
  getMemories,
  getDailyRoutines,
  getMessages,
} from '../services/supabase';

// Demo care circle ID from seed data
const DEMO_CARE_CIRCLE_ID = process.env.EXPO_PUBLIC_DEMO_CARE_CIRCLE_ID || '11111111-1111-1111-1111-111111111111';

interface UserData {
  id: string;
  name: string;
  preferredName: string;
  photoUrl: string;
  careCircleId: string;
  careCircleName: string;
  dateOfBirth: string | null;
}

interface DataContextValue {
  // User
  user: UserData;
  
  // Data
  familyMembers: FamilyMember[];
  memories: Memory[];
  routines: DailyRoutine[];
  messages: Message[];
  
  // Loading states
  isLoading: boolean;
  isUserLoaded: boolean;
  
  // Actions
  refreshData: () => Promise<void>;
  refreshMemories: () => Promise<void>;
  refreshFamilyMembers: () => Promise<void>;
  refreshMessages: () => Promise<void>;
}

// Default user (fallback when Supabase data not available)
const defaultUser: UserData = {
  id: 'default',
  name: 'Margaret',
  preferredName: 'Mom',
  photoUrl: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&h=200&fit=crop',
  careCircleId: DEMO_CARE_CIRCLE_ID,
  careCircleName: "Margaret's Care Team",
  dateOfBirth: null,
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [routines, setRoutines] = useState<DailyRoutine[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch patient and care circle data
  const loadUserData = useCallback(async () => {
    try {
      const [patient, careCircle] = await Promise.all([
        getPatient(DEMO_CARE_CIRCLE_ID),
        getCareCircle(DEMO_CARE_CIRCLE_ID),
      ]);
      
      if (patient) {
        // Get patient's photo from family_members if they're listed there,
        // or use a default
        const patientPhoto = 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&h=200&fit=crop';
        
        setUser({
          id: patient.id,
          name: patient.preferred_name || 'User',
          preferredName: patient.preferred_name || 'User',
          photoUrl: patientPhoto,
          careCircleId: patient.care_circle_id || DEMO_CARE_CIRCLE_ID,
          careCircleName: careCircle?.name || "My Care Team",
          dateOfBirth: patient.date_of_birth,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsUserLoaded(true);
    }
  }, []);

  const refreshFamilyMembers = useCallback(async () => {
    console.log('[DataContext] Fetching family members for:', user.careCircleId);
    const data = await getFamilyMembers(user.careCircleId);
    console.log('[DataContext] Got', data.length, 'family members');
    setFamilyMembers(data);
  }, [user.careCircleId]);

  const refreshMemories = useCallback(async () => {
    console.log('[DataContext] Fetching memories for:', user.careCircleId);
    const data = await getMemories(user.careCircleId);
    console.log('[DataContext] Got', data.length, 'memories');
    setMemories(data);
  }, [user.careCircleId]);

  const refreshRoutines = useCallback(async () => {
    const data = await getDailyRoutines(user.careCircleId);
    setRoutines(data);
  }, [user.careCircleId]);

  const refreshMessages = useCallback(async () => {
    const data = await getMessages(user.careCircleId);
    setMessages(data);
  }, [user.careCircleId]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refreshFamilyMembers(),
        refreshMemories(),
        refreshRoutines(),
        refreshMessages(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [refreshFamilyMembers, refreshMemories, refreshRoutines, refreshMessages]);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Load other data after user is loaded
  useEffect(() => {
    if (isUserLoaded) {
      refreshData();
    }
  }, [isUserLoaded, refreshData]);

  const value: DataContextValue = {
    user,
    familyMembers,
    memories,
    routines,
    messages,
    isLoading,
    isUserLoaded,
    refreshData,
    refreshMemories,
    refreshFamilyMembers,
    refreshMessages,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

export default DataContext;
