/**
 * Services Context
 * 
 * Provides access to all service abstractions (TTS, Speech, AI, etc.)
 * throughout the app. Services can be swapped between mock and paid
 * providers without changing application code.
 * 
 * Usage:
 *   const { tts, speech, assistant } = useServices();
 *   await tts.speak("Hello!");
 *   await speech.startListening();
 *   const response = await assistant.chat("Hi", context);
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { ITTSService, IAssistantService, ISpeechService, IVideoService } from '../services/interfaces';
import { mockTTSService, mockAssistantService, expoSpeechService, mockVideoService } from '../services/providers';

interface ServicesContextValue {
  /** Text-to-Speech service */
  tts: ITTSService;
  
  /** Speech-to-Text service */
  speech: ISpeechService;
  
  /** AI Assistant service */
  assistant: IAssistantService;
  
  /** Video calling service */
  video: IVideoService;
  
  // Future services (uncomment when implemented):
  // storage: IStorageService;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

interface ServicesProviderProps {
  children: ReactNode;
  // Allow overriding providers for testing or production
  tts?: ITTSService;
  speech?: ISpeechService;
  assistant?: IAssistantService;
  video?: IVideoService;
}

export function ServicesProvider({
  children,
  tts = mockTTSService,
  speech = expoSpeechService,
  assistant = mockAssistantService,
  video = mockVideoService,
}: ServicesProviderProps) {
  const value = useMemo<ServicesContextValue>(() => ({
    tts,
    speech,
    assistant,
    video,
  }), [tts, speech, assistant, video]);

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

export function useSpeech(): ISpeechService {
  return useServices().speech;
}

export function useAssistant(): IAssistantService {
  return useServices().assistant;
}

export function useVideo(): IVideoService {
  return useServices().video;
}

export default ServicesContext;
