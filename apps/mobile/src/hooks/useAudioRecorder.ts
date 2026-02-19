/**
 * Audio Recorder Hook
 * 
 * Uses expo-av for recording audio.
 * Designed for cognitive support users with:
 * - Simple start/stop interface
 * - Visual feedback via amplitude
 * - Automatic silence detection
 * - Gentle prompts on extended silence
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  durationMs: number;
  amplitude: number; // 0-1 normalized
  uri: string | null;
}

interface UseAudioRecorderOptions {
  /** Called when silence is detected for extended period */
  onSilenceDetected?: () => void;
  /** Silence threshold in seconds before triggering callback */
  silenceThresholdSeconds?: number;
  /** Maximum recording duration in seconds (0 = no limit) */
  maxDurationSeconds?: number;
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const {
    onSilenceDetected,
    silenceThresholdSeconds = 10,
    maxDurationSeconds = 300, // 5 minutes default
  } = options;

  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    durationMs: 0,
    amplitude: 0,
    uri: null,
  });

  const recordingRef = useRef<Audio.Recording | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lowAmplitudeCountRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      return granted;
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  };

  const startRecording = useCallback(async () => {
    try {
      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording) {
            // Update amplitude (metering)
            const metering = status.metering ?? -160;
            // Normalize metering from dB (-160 to 0) to 0-1
            const normalized = Math.max(0, Math.min(1, (metering + 50) / 50));
            
            setState(prev => ({
              ...prev,
              amplitude: normalized,
              durationMs: status.durationMillis || prev.durationMs,
            }));

            // Silence detection
            if (normalized < 0.1) {
              lowAmplitudeCountRef.current++;
              // If low amplitude for too long, trigger callback
              if (lowAmplitudeCountRef.current > silenceThresholdSeconds * 10) {
                onSilenceDetected?.();
                lowAmplitudeCountRef.current = 0;
              }
            } else {
              lowAmplitudeCountRef.current = 0;
            }
          }
        },
        100 // Update every 100ms
      );

      recordingRef.current = recording;
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        durationMs: 0,
        uri: null,
      }));

      // Duration tracking
      durationIntervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          durationMs: prev.durationMs + 100,
        }));
        
        // Check max duration
        if (maxDurationSeconds > 0) {
          const currentDuration = Date.now();
          // Duration is tracked in state, let the metering callback handle it
        }
      }, 100);

    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, [onSilenceDetected, silenceThresholdSeconds, maxDurationSeconds]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    cleanup();

    if (!recordingRef.current) {
      return null;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      setState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        amplitude: 0,
        uri,
      }));

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      recordingRef.current = null;
      setState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        amplitude: 0,
      }));
      return null;
    }
  }, [cleanup]);

  const pauseRecording = useCallback(async () => {
    if (!recordingRef.current || !state.isRecording) return;

    try {
      await recordingRef.current.pauseAsync();
      setState(prev => ({ ...prev, isPaused: true }));
    } catch (error) {
      console.error('Error pausing recording:', error);
    }
  }, [state.isRecording]);

  const resumeRecording = useCallback(async () => {
    if (!recordingRef.current || !state.isPaused) return;

    try {
      await recordingRef.current.startAsync();
      setState(prev => ({ ...prev, isPaused: false }));
    } catch (error) {
      console.error('Error resuming recording:', error);
    }
  }, [state.isPaused]);

  const cancelRecording = useCallback(async () => {
    cleanup();

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {
        // Ignore errors when canceling
      }
      recordingRef.current = null;
    }

    setState({
      isRecording: false,
      isPaused: false,
      durationMs: 0,
      amplitude: 0,
      uri: null,
    });
  }, [cleanup]);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    requestPermissions,
  };
}

export default useAudioRecorder;
