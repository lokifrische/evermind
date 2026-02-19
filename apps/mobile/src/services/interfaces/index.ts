/**
 * Service Interfaces
 * 
 * These interfaces define contracts that all providers must implement.
 * This allows swapping between mock/free and paid providers without
 * changing application code.
 * 
 * Provider swap example:
 *   Current: MockSpeechService (native RN voice)
 *   Future:  DeepgramSpeechService or WhisperSpeechService
 */

// =============================================================================
// Speech-to-Text Service
// =============================================================================

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionOptions {
  language?: string; // Default: 'en-US'
  continuous?: boolean; // Keep listening after silence
  interimResults?: boolean; // Send partial results
}

export interface ISpeechService {
  /** Check if speech recognition is available on this device */
  isAvailable(): Promise<boolean>;
  
  /** Start listening for speech */
  startListening(options?: SpeechRecognitionOptions): Promise<void>;
  
  /** Stop listening */
  stopListening(): Promise<void>;
  
  /** Subscribe to transcription results */
  onResult(callback: (result: SpeechRecognitionResult) => void): () => void;
  
  /** Subscribe to errors */
  onError(callback: (error: Error) => void): () => void;
  
  /** Subscribe to listening state changes */
  onStateChange(callback: (isListening: boolean) => void): () => void;
}

// =============================================================================
// Text-to-Speech Service
// =============================================================================

export interface TTSOptions {
  voice?: string; // Voice ID or name
  rate?: number; // 0.5 to 2.0
  pitch?: number; // 0.5 to 2.0
  language?: string;
}

export interface ITTSService {
  /** Check if TTS is available */
  isAvailable(): Promise<boolean>;
  
  /** Speak text aloud */
  speak(text: string, options?: TTSOptions): Promise<void>;
  
  /** Stop speaking */
  stop(): Promise<void>;
  
  /** Pause speaking */
  pause(): Promise<void>;
  
  /** Resume speaking */
  resume(): Promise<void>;
  
  /** Check if currently speaking */
  isSpeaking(): boolean;
  
  /** Get available voices */
  getVoices(): Promise<Array<{ id: string; name: string; language: string }>>;
  
  /** Subscribe to speaking state changes */
  onStateChange(callback: (isSpeaking: boolean) => void): () => void;
}

// =============================================================================
// AI Assistant Service
// =============================================================================

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface AssistantResponse {
  message: string;
  suggestions?: string[]; // Quick reply suggestions
  action?: {
    type: string;
    payload: Record<string, any>;
  };
}

export interface AssistantContext {
  patientName: string;
  currentMood?: string;
  recentActivity?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface IAssistantService {
  /** Send a message and get a response */
  chat(
    message: string, 
    context: AssistantContext,
    history?: AssistantMessage[]
  ): Promise<AssistantResponse>;
  
  /** Get grounding/calming response */
  getGroundingResponse(context: AssistantContext): Promise<AssistantResponse>;
  
  /** Get conversation starters based on context */
  getSuggestions(context: AssistantContext): Promise<string[]>;
}

// =============================================================================
// Video Calling Service
// =============================================================================

export type CallState = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'error';

export interface VideoCallOptions {
  audio?: boolean;
  video?: boolean;
  autoAnswer?: boolean;
  autoAnswerDelayMs?: number;
}

export interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  stream?: MediaStream;
}

export interface IVideoService {
  /** Initialize the video service */
  initialize(): Promise<void>;
  
  /** Clean up resources */
  destroy(): Promise<void>;
  
  /** Start a call to a contact */
  call(contactId: string, options?: VideoCallOptions): Promise<void>;
  
  /** Answer an incoming call */
  answer(options?: VideoCallOptions): Promise<void>;
  
  /** End the current call */
  endCall(): Promise<void>;
  
  /** Toggle local audio */
  toggleMute(): Promise<boolean>;
  
  /** Toggle local video */
  toggleVideo(): Promise<boolean>;
  
  /** Get current call state */
  getState(): CallState;
  
  /** Get participants in current call */
  getParticipants(): Participant[];
  
  /** Subscribe to call state changes */
  onStateChange(callback: (state: CallState) => void): () => void;
  
  /** Subscribe to incoming calls */
  onIncomingCall(callback: (callerId: string, callerName: string) => void): () => void;
  
  /** Subscribe to participant changes */
  onParticipantsChange(callback: (participants: Participant[]) => void): () => void;
}

// =============================================================================
// Storage Service (for photos, audio, video)
// =============================================================================

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percent: number;
}

export interface IStorageService {
  /** Upload a file and return its URL */
  upload(
    path: string,
    file: Blob | ArrayBuffer,
    contentType: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string>;
  
  /** Get a download URL for a file */
  getUrl(path: string): Promise<string>;
  
  /** Delete a file */
  delete(path: string): Promise<void>;
  
  /** List files in a path */
  list(path: string): Promise<string[]>;
}

// =============================================================================
// Provider Registry
// =============================================================================

export interface ServiceProviders {
  speech: ISpeechService;
  tts: ITTSService;
  assistant: IAssistantService;
  video: IVideoService;
  storage: IStorageService;
}
