/**
 * Expo Speech Recognition Service
 * 
 * Uses expo-speech-recognition for native speech-to-text.
 * Falls back gracefully if native module isn't available (Expo Go).
 * 
 * NOTE: expo-speech-recognition requires a custom dev build (EAS Build).
 * In Expo Go, this service will report as unavailable.
 */

import { ISpeechService, SpeechRecognitionResult, SpeechRecognitionOptions } from '../interfaces';

// Safely try to import the native module
let ExpoSpeechRecognitionModule: any = null;
let isModuleAvailable = false;

try {
  const module = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = module.ExpoSpeechRecognitionModule;
  // Check if the module actually has the methods we need
  isModuleAvailable = !!(
    ExpoSpeechRecognitionModule &&
    typeof ExpoSpeechRecognitionModule.start === 'function'
  );
} catch (e) {
  console.warn('[ExpoSpeechService] Native module not available (expected in Expo Go)');
  isModuleAvailable = false;
}

class ExpoSpeechService implements ISpeechService {
  private resultCallbacks: Set<(result: SpeechRecognitionResult) => void> = new Set();
  private errorCallbacks: Set<(error: Error) => void> = new Set();
  private stateCallbacks: Set<(isListening: boolean) => void> = new Set();
  private listening = false;
  private subscriptions: (() => void)[] = [];
  private initialized = false;

  constructor() {
    if (isModuleAvailable) {
      this.setupListeners();
    }
  }

  private setupListeners() {
    if (!ExpoSpeechRecognitionModule || this.initialized) return;
    
    try {
      // Subscribe to result events
      const resultSub = ExpoSpeechRecognitionModule.addListener('result', (event: any) => {
        if (event.results && event.results.length > 0) {
          const firstResult = event.results[0];
          const result: SpeechRecognitionResult = {
            transcript: firstResult.transcript,
            confidence: firstResult.confidence,
            isFinal: event.isFinal,
          };
          this.resultCallbacks.forEach(cb => cb(result));
        }
      });

      // Subscribe to error events
      const errorSub = ExpoSpeechRecognitionModule.addListener('error', (event: any) => {
        const error = new Error(event.message || event.error);
        this.errorCallbacks.forEach(cb => cb(error));
        this.setListening(false);
      });

      // Subscribe to start events
      const startSub = ExpoSpeechRecognitionModule.addListener('start', () => {
        this.setListening(true);
      });

      // Subscribe to end events
      const endSub = ExpoSpeechRecognitionModule.addListener('end', () => {
        this.setListening(false);
      });

      // Store subscriptions for cleanup
      this.subscriptions = [
        () => resultSub?.remove?.(),
        () => errorSub?.remove?.(),
        () => startSub?.remove?.(),
        () => endSub?.remove?.(),
      ];
      
      this.initialized = true;
    } catch (e) {
      console.warn('[ExpoSpeechService] Failed to setup listeners:', e);
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!isModuleAvailable) return false;
    
    try {
      return ExpoSpeechRecognitionModule.isRecognitionAvailable?.() ?? false;
    } catch {
      return false;
    }
  }

  async startListening(options?: SpeechRecognitionOptions): Promise<void> {
    if (!isModuleAvailable) {
      throw new Error('Speech recognition not available. Requires custom dev build (EAS Build).');
    }

    try {
      // Request permissions first
      const permissionResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Microphone permission denied');
      }

      // Start recognition with appropriate settings for cognitive support
      ExpoSpeechRecognitionModule.start({
        lang: options?.language || 'en-US',
        interimResults: options?.interimResults ?? true,
        continuous: options?.continuous ?? false,
        maxAlternatives: 1,
        addsPunctuation: true,
      });

    } catch (error) {
      this.setListening(false);
      const err = error instanceof Error ? error : new Error('Speech recognition failed');
      this.errorCallbacks.forEach(cb => cb(err));
      throw err;
    }
  }

  async stopListening(): Promise<void> {
    if (!isModuleAvailable) return;
    
    try {
      ExpoSpeechRecognitionModule.stop?.();
    } catch {
      // Ignore stop errors
    }
  }

  onResult(callback: (result: SpeechRecognitionResult) => void): () => void {
    this.resultCallbacks.add(callback);
    return () => {
      this.resultCallbacks.delete(callback);
    };
  }

  onError(callback: (error: Error) => void): () => void {
    this.errorCallbacks.add(callback);
    return () => {
      this.errorCallbacks.delete(callback);
    };
  }

  onStateChange(callback: (isListening: boolean) => void): () => void {
    this.stateCallbacks.add(callback);
    return () => {
      this.stateCallbacks.delete(callback);
    };
  }

  private setListening(value: boolean) {
    if (this.listening !== value) {
      this.listening = value;
      this.stateCallbacks.forEach(cb => cb(value));
    }
  }

  isListening(): boolean {
    return this.listening;
  }

  /** Clean up event subscriptions */
  destroy() {
    this.subscriptions.forEach(unsub => {
      try { unsub(); } catch {}
    });
    this.subscriptions = [];
    this.resultCallbacks.clear();
    this.errorCallbacks.clear();
    this.stateCallbacks.clear();
  }
}

// Singleton instance
export const expoSpeechService = new ExpoSpeechService();
export default expoSpeechService;
