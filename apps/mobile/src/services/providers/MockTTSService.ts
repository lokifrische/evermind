/**
 * Mock TTS Service
 * 
 * Uses expo-speech for free, native text-to-speech.
 * Can be swapped for ElevenLabs or other paid providers later.
 */

import * as Speech from 'expo-speech';
import { ITTSService, TTSOptions } from '../interfaces';

class MockTTSService implements ITTSService {
  private speaking = false;
  private stateCallbacks: Set<(isSpeaking: boolean) => void> = new Set();

  async isAvailable(): Promise<boolean> {
    // expo-speech is always available on iOS/Android
    return true;
  }

  async speak(text: string, options?: TTSOptions): Promise<void> {
    // Stop any current speech first
    await this.stop();

    this.setSpeaking(true);

    return new Promise((resolve, reject) => {
      Speech.speak(text, {
        language: options?.language || 'en-US',
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 1.0,
        voice: options?.voice,
        onStart: () => {
          this.setSpeaking(true);
        },
        onDone: () => {
          this.setSpeaking(false);
          resolve();
        },
        onStopped: () => {
          this.setSpeaking(false);
          resolve();
        },
        onError: (error) => {
          this.setSpeaking(false);
          reject(new Error(error.message || 'Speech error'));
        },
      });
    });
  }

  async stop(): Promise<void> {
    await Speech.stop();
    this.setSpeaking(false);
  }

  async pause(): Promise<void> {
    await Speech.pause();
    this.setSpeaking(false);
  }

  async resume(): Promise<void> {
    await Speech.resume();
    this.setSpeaking(true);
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.map(v => ({
      id: v.identifier,
      name: v.name,
      language: v.language,
    }));
  }

  onStateChange(callback: (isSpeaking: boolean) => void): () => void {
    this.stateCallbacks.add(callback);
    return () => {
      this.stateCallbacks.delete(callback);
    };
  }

  private setSpeaking(value: boolean) {
    this.speaking = value;
    this.stateCallbacks.forEach(cb => cb(value));
  }
}

// Singleton instance
export const mockTTSService = new MockTTSService();
export default mockTTSService;
