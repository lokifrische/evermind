/**
 * Services Context
 * 
 * Provides access to all service abstractions (TTS, Speech, AI, etc.)
 * throughout the app. Services can be swapped between mock and paid
 * providers without changing application code.
 * 
 * Usage:
 *   const { tts, assistant } = useServices();
 *   await tts.speak("Hello!");
 *   const response = await assistant.chat("Hi", context);
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { ITTSService, IAssistantService } from '../services/interfaces';
import { mockTTSService, mockAssistantService } from '../services/providers';

interface ServicesContextValue {
  /** Text-to-Speech service */
  tts: ITTSService;
  
  /** AI Assistant service */
  assistant: IAssistantService;
  
  // Future services (uncomment when implemented):
  // speech: ISpeechService;
  // video: IVideoService;
  // storage: IStorageService;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

interface ServicesProviderProps {
  children: ReactNode;
  // Allow overriding providers for testing or production
  tts?: ITTSService;
  assistant?: IAssistantService;
}

export function ServicesProvider({
  children,
  tts = mockTTSService,
  assistant = mockAssistantService,
}: ServicesProviderProps) {
  const value = useMemo<ServicesContextValue>(() => ({
    tts,
    assistant,
  }), [tts, assistant]);

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices(): ServicesContextValue {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
}

// Convenience hooks for individual services
export function useTTS(): ITTSService {
  return useServices().tts;
}

export function useAssistant(): IAssistantService {
  return useServices().assistant;
}

export default ServicesContext;
