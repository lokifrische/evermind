/**
 * Mock Video Service
 * 
 * Simulates video calling for UI development and testing.
 * Can be swapped for real WebRTC implementation later.
 * 
 * Real implementation will need:
 * - react-native-webrtc (requires EAS Build)
 * - Signaling server (Supabase Realtime or custom)
 * - STUN/TURN servers (free Google STUN available)
 */

import {
  IVideoService,
  CallState,
  VideoCallOptions,
  Participant,
} from '../interfaces';

class MockVideoService implements IVideoService {
  private state: CallState = 'idle';
  private participants: Participant[] = [];
  private stateCallbacks: Set<(state: CallState) => void> = new Set();
  private incomingCallbacks: Set<(callerId: string, callerName: string) => void> = new Set();
  private participantCallbacks: Set<(participants: Participant[]) => void> = new Set();
  private callTimeout: ReturnType<typeof setTimeout> | null = null;

  async initialize(): Promise<void> {
    // In real implementation: request camera/mic permissions, setup WebRTC
    console.log('[MockVideoService] Initialized');
  }

  async destroy(): Promise<void> {
    if (this.callTimeout) {
      clearTimeout(this.callTimeout);
      this.callTimeout = null;
    }
    this.setState('idle');
    this.participants = [];
    console.log('[MockVideoService] Destroyed');
  }

  async call(contactId: string, options?: VideoCallOptions): Promise<void> {
    console.log(`[MockVideoService] Calling contact: ${contactId}`, options);
    
    // Simulate calling state
    this.setState('calling');
    
    // Add local participant
    this.participants = [
      {
        id: 'local',
        name: 'You',
        isLocal: true,
        isMuted: false,
        isVideoOff: !(options?.video ?? true),
      },
    ];
    this.notifyParticipantsChange();

    // Simulate connection after delay
    this.callTimeout = setTimeout(() => {
      this.setState('connected');
      
      // Add remote participant (simulated)
      this.participants.push({
        id: contactId,
        name: 'Family Member', // Would come from real data
        isLocal: false,
        isMuted: false,
        isVideoOff: false,
      });
      this.notifyParticipantsChange();
    }, 2000);
  }

  async answer(options?: VideoCallOptions): Promise<void> {
    console.log('[MockVideoService] Answering call', options);
    
    this.setState('connected');
    
    // Add local participant
    this.participants = [
      {
        id: 'local',
        name: 'You',
        isLocal: true,
        isMuted: false,
        isVideoOff: !(options?.video ?? true),
      },
      {
        id: 'caller',
        name: 'Caller',
        isLocal: false,
        isMuted: false,
        isVideoOff: false,
      },
    ];
    this.notifyParticipantsChange();
  }

  async endCall(): Promise<void> {
    console.log('[MockVideoService] Ending call');
    
    if (this.callTimeout) {
      clearTimeout(this.callTimeout);
      this.callTimeout = null;
    }
    
    this.setState('ended');
    
    // Reset after brief delay
    setTimeout(() => {
      this.setState('idle');
      this.participants = [];
      this.notifyParticipantsChange();
    }, 1000);
  }

  async toggleMute(): Promise<boolean> {
    const localParticipant = this.participants.find(p => p.isLocal);
    if (localParticipant) {
      localParticipant.isMuted = !localParticipant.isMuted;
      this.notifyParticipantsChange();
      return localParticipant.isMuted;
    }
    return false;
  }

  async toggleVideo(): Promise<boolean> {
    const localParticipant = this.participants.find(p => p.isLocal);
    if (localParticipant) {
      localParticipant.isVideoOff = !localParticipant.isVideoOff;
      this.notifyParticipantsChange();
      return localParticipant.isVideoOff;
    }
    return false;
  }

  getState(): CallState {
    return this.state;
  }

  getParticipants(): Participant[] {
    return [...this.participants];
  }

  onStateChange(callback: (state: CallState) => void): () => void {
    this.stateCallbacks.add(callback);
    return () => {
      this.stateCallbacks.delete(callback);
    };
  }

  onIncomingCall(callback: (callerId: string, callerName: string) => void): () => void {
    this.incomingCallbacks.add(callback);
    return () => {
      this.incomingCallbacks.delete(callback);
    };
  }

  onParticipantsChange(callback: (participants: Participant[]) => void): () => void {
    this.participantCallbacks.add(callback);
    return () => {
      this.participantCallbacks.delete(callback);
    };
  }

  // Internal methods
  private setState(newState: CallState) {
    this.state = newState;
    this.stateCallbacks.forEach(cb => cb(newState));
  }

  private notifyParticipantsChange() {
    this.participantCallbacks.forEach(cb => cb([...this.participants]));
  }

  /** Simulate an incoming call (for testing) */
  simulateIncomingCall(callerId: string, callerName: string) {
    this.setState('ringing');
    this.incomingCallbacks.forEach(cb => cb(callerId, callerName));
  }
}

// Singleton instance
export const mockVideoService = new MockVideoService();
export default mockVideoService;
